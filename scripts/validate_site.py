#!/usr/bin/env python3
"""Validate the static site's crawl, metadata, structured-data, and link contracts."""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass, field
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ORIGIN = "https://wexprolabs.com"
LOCAL_HOST = "wexprolabs.com"
SKIP_SCHEMES = ("mailto:", "tel:", "data:", "javascript:")


def normalized(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip().casefold()


def route_for_file(path: Path) -> str:
    relative = path.relative_to(PUBLIC)
    if relative.name == "index.html":
        parent = relative.parent.as_posix()
        return "/" if parent == "." else f"/{parent}/"
    return f"/{relative.as_posix()}"


def local_target(raw_url: str, base_route: str) -> Path | None:
    raw_url = raw_url.strip()
    if not raw_url or raw_url.startswith("#") or raw_url.lower().startswith(SKIP_SCHEMES):
        return None
    absolute = urlsplit(urljoin(f"{ORIGIN}{base_route}", raw_url))
    if absolute.scheme not in ("http", "https") or absolute.hostname != LOCAL_HOST:
        return None
    path = unquote(absolute.path)
    target = PUBLIC / path.lstrip("/")
    if path.endswith("/"):
        target /= "index.html"
    return target


@dataclass
class Page:
    path: Path
    route: str
    title: str = ""
    description: str = ""
    robots: str = ""
    canonicals: list[str] = field(default_factory=list)
    h1_count: int = 0
    links: list[str] = field(default_factory=list)
    json_ld: list[object] = field(default_factory=list)
    visible_text: str = ""

    @property
    def indexable(self) -> bool:
        return "noindex" not in self.robots.casefold()


class PageParser(HTMLParser):
    def __init__(self, page: Page) -> None:
        super().__init__(convert_charrefs=True)
        self.page = page
        self._title = False
        self._json_script = False
        self._json_parts: list[str] = []
        self._hidden_depth = 0
        self._visible_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.casefold(): value or "" for key, value in attrs}
        tag = tag.casefold()
        if tag == "title":
            self._title = True
        if tag == "h1":
            self.page.h1_count += 1
        if tag == "meta":
            name = values.get("name", "").casefold()
            if name == "description":
                self.page.description = values.get("content", "").strip()
            elif name == "robots":
                self.page.robots = values.get("content", "").strip()
        if tag == "link":
            rel = set(values.get("rel", "").casefold().split())
            if "canonical" in rel:
                self.page.canonicals.append(values.get("href", "").strip())
        for attribute in ("href", "src"):
            if values.get(attribute):
                self.page.links.append(values[attribute])
        if tag == "script" and values.get("type", "").casefold() == "application/ld+json":
            self._json_script = True
            self._json_parts = []
        if tag in {"script", "style", "template", "svg", "noscript"}:
            self._hidden_depth += 1

    def handle_endtag(self, tag: str) -> None:
        tag = tag.casefold()
        if tag == "title":
            self._title = False
        if tag == "script" and self._json_script:
            source = "".join(self._json_parts).strip()
            try:
                self.page.json_ld.append(json.loads(source))
            except json.JSONDecodeError as error:
                raise ValueError(f"{self.page.path}: invalid JSON-LD: {error}") from error
            self._json_script = False
            self._json_parts = []
        if tag in {"script", "style", "template", "svg", "noscript"} and self._hidden_depth:
            self._hidden_depth -= 1

    def handle_data(self, data: str) -> None:
        if self._title:
            self.page.title += data
        if self._json_script:
            self._json_parts.append(data)
        elif self._hidden_depth == 0 and data.strip():
            self._visible_parts.append(data)

    def close(self) -> None:
        super().close()
        self.page.title = re.sub(r"\s+", " ", self.page.title).strip()
        self.page.visible_text = re.sub(r"\s+", " ", " ".join(self._visible_parts)).strip()


def walk_json(value: object):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk_json(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk_json(child)


def validate() -> list[str]:
    errors: list[str] = []
    pages: list[Page] = []
    defined_ids: set[str] = set()
    referenced_ids: set[str] = set()

    for path in sorted(PUBLIC.rglob("*.html")):
        page = Page(path=path, route=route_for_file(path))
        parser = PageParser(page)
        try:
            parser.feed(path.read_text(encoding="utf-8"))
            parser.close()
        except (ValueError, UnicodeDecodeError) as error:
            errors.append(str(error))
            continue
        pages.append(page)

        if not page.title:
            errors.append(f"{path}: missing title")
        if page.h1_count != 1:
            errors.append(f"{path}: expected exactly one h1, found {page.h1_count}")
        if page.indexable:
            if not page.description:
                errors.append(f"{path}: indexable page is missing a meta description")
            if len(page.canonicals) != 1:
                errors.append(f"{path}: indexable page must have exactly one canonical")
            else:
                expected = f"{ORIGIN}{page.route}"
                if page.canonicals[0] != expected:
                    errors.append(f"{path}: canonical {page.canonicals[0]!r} should be {expected!r}")

        for raw_url in page.links:
            target = local_target(raw_url, page.route)
            if target is not None and not target.exists():
                errors.append(f"{path}: broken local reference {raw_url!r} -> {target.relative_to(ROOT)}")

        visible = normalized(page.visible_text)
        meta_description = normalized(page.description)
        for block in page.json_ld:
            for node in walk_json(block):
                node_id = node.get("@id")
                if isinstance(node_id, str) and node_id.startswith(ORIGIN):
                    if "@type" in node:
                        defined_ids.add(node_id)
                    else:
                        referenced_ids.add(node_id)
                node_type = node.get("@type")
                if node_type in {"WebPage", "AboutPage", "Article"} and isinstance(node.get("description"), str):
                    description = normalized(node["description"])
                    if description != meta_description and description not in visible:
                        errors.append(f"{path}: {node_type} description is not aligned with the meta description or visible copy")
                if node_type == "FAQPage":
                    for item in node.get("mainEntity", []):
                        question = normalized(item.get("name", "")) if isinstance(item, dict) else ""
                        answer_node = item.get("acceptedAnswer", {}) if isinstance(item, dict) else {}
                        answer = normalized(answer_node.get("text", "")) if isinstance(answer_node, dict) else ""
                        if not question or question not in visible:
                            errors.append(f"{path}: FAQPage question is missing from visible copy: {question!r}")
                        if not answer or answer not in visible:
                            errors.append(f"{path}: FAQPage answer is missing from visible copy for {question!r}")

    canonical_pages: dict[str, Page] = {}
    for page in pages:
        if page.indexable and len(page.canonicals) == 1:
            canonical = page.canonicals[0]
            if canonical in canonical_pages:
                errors.append(f"duplicate canonical {canonical}: {canonical_pages[canonical].path} and {page.path}")
            canonical_pages[canonical] = page

    sitemap_path = PUBLIC / "sitemap.xml"
    try:
        sitemap_root = ElementTree.fromstring(sitemap_path.read_text(encoding="utf-8"))
        namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        sitemap_urls: dict[str, str] = {}
        for entry in sitemap_root.findall("sm:url", namespace):
            loc = (entry.findtext("sm:loc", default="", namespaces=namespace) or "").strip()
            lastmod = (entry.findtext("sm:lastmod", default="", namespaces=namespace) or "").strip()
            if not loc:
                errors.append("sitemap.xml: URL entry is missing loc")
                continue
            if loc in sitemap_urls:
                errors.append(f"sitemap.xml: duplicate loc {loc}")
            sitemap_urls[loc] = lastmod
            try:
                modified = date.fromisoformat(lastmod)
                if modified > date.today():
                    errors.append(f"sitemap.xml: future lastmod for {loc}: {lastmod}")
            except ValueError:
                errors.append(f"sitemap.xml: invalid lastmod for {loc}: {lastmod!r}")
            target = local_target(loc, "/")
            if target is None or not target.exists():
                errors.append(f"sitemap.xml: loc does not resolve locally: {loc}")
        expected = set(canonical_pages)
        actual = set(sitemap_urls)
        for missing in sorted(expected - actual):
            errors.append(f"sitemap.xml: missing indexable canonical {missing}")
        for extra in sorted(actual - expected):
            errors.append(f"sitemap.xml: contains non-indexable or unknown canonical {extra}")
    except (ElementTree.ParseError, UnicodeDecodeError) as error:
        errors.append(f"sitemap.xml: invalid XML: {error}")

    robots = (PUBLIC / "robots.txt").read_text(encoding="utf-8")
    if "Sitemap: https://wexprolabs.com/sitemap.xml" not in robots:
        errors.append("robots.txt: canonical sitemap declaration is missing")
    for agent in ("OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User"):
        if f"User-agent: {agent}\nAllow: /" not in robots:
            errors.append(f"robots.txt: explicit allow contract is missing for {agent}")

    for llms_path in sorted(PUBLIC.rglob("llms.txt")):
        text = llms_path.read_text(encoding="utf-8")
        if not text.lstrip().startswith("# "):
            errors.append(f"{llms_path}: expected a level-one title")
        for raw_url in re.findall(r"https://wexprolabs\.com[^\s)>]+", text):
            target = local_target(raw_url.rstrip(".,;"), "/")
            if target is not None and not target.exists():
                errors.append(f"{llms_path}: broken local URL {raw_url}")

    unresolved = sorted(reference for reference in referenced_ids if reference not in defined_ids)
    for reference in unresolved:
        errors.append(f"JSON-LD graph: unresolved local @id reference {reference}")

    try:
        routes = json.loads((PUBLIC / "_routes.json").read_text(encoding="utf-8"))
        if "/api/*" not in routes.get("include", []):
            errors.append("_routes.json: /api/* must be included for first-party measurement")
    except (json.JSONDecodeError, UnicodeDecodeError) as error:
        errors.append(f"_routes.json: invalid JSON: {error}")

    if not errors:
        print(
            f"Validated {len(pages)} HTML files, {sum(len(page.json_ld) for page in pages)} JSON-LD blocks, "
            f"{len(canonical_pages)} indexable canonicals, sitemap parity, local links, llms.txt URLs, and entity references."
        )
    return errors


if __name__ == "__main__":
    failures = validate()
    if failures:
        print("Site validation failed:", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        raise SystemExit(1)
