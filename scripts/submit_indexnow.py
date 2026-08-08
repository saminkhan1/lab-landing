#!/usr/bin/env python3
"""Submit newly added or modified canonical HTML URLs to IndexNow."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import time
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
HOST = "wexprolabs.com"


class CanonicalParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.canonical = ""
        self.noindex = False

    def handle_starttag(self, tag, attrs) -> None:
        values = {key.casefold(): value or "" for key, value in attrs}
        if tag.casefold() == "link" and "canonical" in values.get("rel", "").casefold().split():
            self.canonical = values.get("href", "")
        if tag.casefold() == "meta" and values.get("name", "").casefold() == "robots":
            self.noindex = "noindex" in values.get("content", "").casefold()


def canonical_for(path: Path) -> str | None:
    if not path.exists() or path.suffix != ".html":
        return None
    parser = CanonicalParser()
    parser.feed(path.read_text(encoding="utf-8"))
    if parser.noindex or not parser.canonical.startswith(f"https://{HOST}/"):
        return None
    return parser.canonical


def changed_urls(revision_range: str | None, submit_all: bool) -> list[str]:
    candidates: list[Path]
    unusable_range = (
        not revision_range
        or ".." not in revision_range
        or revision_range.split("..", 1)[0].strip("0") == ""
    )
    if submit_all or unusable_range:
        candidates = list(PUBLIC.rglob("*.html"))
    else:
        result = subprocess.run(
            ["git", "diff", "--name-only", revision_range, "--", "public"],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            print(f"Revision range {revision_range!r} is unavailable; submitting all indexable canonicals.")
            candidates = list(PUBLIC.rglob("*.html"))
        else:
            candidates = []
            for raw_path in result.stdout.splitlines():
                path = ROOT / raw_path
                if path.name == "llms.txt":
                    path = path.with_name("index.html")
                if path.suffix == ".html":
                    candidates.append(path)
    return sorted({url for path in candidates if (url := canonical_for(path))})


def indexnow_key() -> tuple[str, str]:
    for path in PUBLIC.glob("*.txt"):
        if re.fullmatch(r"[0-9a-f]{32}", path.stem):
            key = path.read_text(encoding="utf-8").strip()
            if key == path.stem:
                return key, f"https://{HOST}/{path.name}"
    raise RuntimeError("IndexNow key file not found")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--revision-range", help="git revision range used to find changed public HTML")
    parser.add_argument("--all", action="store_true", help="submit every indexable canonical")
    args = parser.parse_args()

    urls = changed_urls(args.revision_range, args.all)
    if not urls:
        print("No changed indexable HTML URLs to submit to IndexNow.")
        return

    key, key_location = indexnow_key()
    payload = json.dumps({"host": HOST, "key": key, "keyLocation": key_location, "urlList": urls}).encode("utf-8")
    request = Request(
        "https://api.indexnow.org/IndexNow",
        data=payload,
        method="POST",
        headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": "Wexpro-IndexNow/1.0"},
    )
    last_error: Exception | None = None
    for attempt in range(4):
        try:
            with urlopen(request, timeout=20) as response:
                if response.status not in {200, 202}:
                    raise RuntimeError(f"IndexNow returned HTTP {response.status}")
            break
        except (HTTPError, URLError, TimeoutError) as error:
            last_error = error
            retryable = not isinstance(error, HTTPError) or error.code == 429 or error.code >= 500
            if not retryable or attempt == 3:
                raise RuntimeError(f"IndexNow submission failed after {attempt + 1} attempt(s): {error}") from error
            time.sleep(2 ** attempt)
    else:
        raise RuntimeError(f"IndexNow submission failed: {last_error}")
    print(f"Submitted {len(urls)} changed canonical URL(s) to IndexNow.")


if __name__ == "__main__":
    main()
