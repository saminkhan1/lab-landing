#!/usr/bin/env python3
"""Smoke-test the production SEO, content, and first-party analytics paths."""

from __future__ import annotations

import argparse
import json
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener, urlopen
from xml.etree import ElementTree


BASE = "https://wexprolabs.com"
BOT_AGENTS = {
    "Googlebot": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Bingbot": "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "OAI-SearchBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
    "ChatGPT-User": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
    "Claude-SearchBot": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; Claude-SearchBot/1.0; +https://anthropic.com/claudebot",
    "Claude-User": "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; Claude-User/1.0; +https://anthropic.com",
}
CHECKS = {
    "/": ["Wexpro Labs"],
    "/workflow-automation/": ["AI workflow automation services", "/workflow-automation/without-apis/", "/workflow-automation/pilot-measurement/"],
    "/workflow-automation/without-apis/": ["Workflow automation without APIs", "workflow automation pilot scorecard"],
    "/workflow-automation/pilot-measurement/": ["Workflow automation pilot metrics and scorecard", "Download the scorecard"],
    "/about/": ["About Wexpro Labs", "Public claims should be narrower than the proof"],
    "/privacy/": ["Wexpro Labs privacy notice", "first-party funnel events"],
    "/context-compression/": ["Context Compression"],
    "/robots.txt": ["OAI-SearchBot", "Claude-SearchBot", "Sitemap: https://wexprolabs.com/sitemap.xml"],
    "/sitemap.xml": ["/workflow-automation/pilot-measurement/", "/about/", "/privacy/"],
    "/llms.txt": ["AI workflow automation services", "Workflow automation pilot scorecard"],
    "/downloads/workflow-automation-pilot-scorecard.csv": ["verified_no_touch_completions", "cost_per_verified_completion"],
}


def get(path: str, user_agent: str = "Wexpro-Deployment-Smoke/1.0") -> tuple[int, str, str]:
    request = Request(f"{BASE}{path}", headers={"User-Agent": user_agent, "Cache-Control": "no-cache"})
    with urlopen(request, timeout=15) as response:
        return response.status, response.geturl(), response.read().decode("utf-8")


def wait_for_release() -> None:
    expected = CHECKS["/workflow-automation/"][0]
    for attempt in range(10):
        try:
            status, _, body = get("/workflow-automation/")
            if status == 200 and expected in body:
                return
        except (HTTPError, URLError, TimeoutError):
            pass
        if attempt < 9:
            time.sleep(3)
    raise RuntimeError("production did not expose the expected workflow release within 30 seconds")


def post_smoke_event() -> None:
    body = json.dumps({
        "event": "deployment_smoke",
        "page_path": "/deployment-smoke",
        "session_id": "github-deployment-smoke",
        "attribution": {"utm_source": "github", "utm_medium": "deployment"},
    }).encode("utf-8")
    request = Request(
        f"{BASE}/api/events",
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Origin": BASE,
            "User-Agent": "Wexpro-Deployment-Smoke/1.0",
        },
    )
    with urlopen(request, timeout=15) as response:
        if response.status != 204:
            raise RuntimeError(f"analytics smoke returned HTTP {response.status}, expected 204")


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def require_redirect(source: str, expected: str, allowed_codes: set[int]) -> None:
    request = Request(source, headers={"User-Agent": "Wexpro-Deployment-Smoke/1.0"})
    try:
        build_opener(NoRedirect).open(request, timeout=15)
    except HTTPError as error:
        location = error.headers.get("Location", "")
        resolved = urljoin(source, location)
        if error.code not in allowed_codes or resolved != expected:
            raise RuntimeError(f"{source} returned {error.code} with resolved Location {resolved!r}") from error
        return
    raise RuntimeError(f"{source} did not return a redirect")


def check_canonical_redirects(check_www: bool) -> None:
    suffix = "?utm_source=deployment-smoke"
    canonical = f"{BASE}/workflow-automation/{suffix}"
    require_redirect(f"http://wexprolabs.com/workflow-automation/{suffix}", canonical, {301, 308})
    require_redirect(f"{BASE}/workflow-automation{suffix}", canonical, {301, 308})
    require_redirect(f"{BASE}/workflow-automation/index.html{suffix}", canonical, {301, 308})
    if check_www:
        require_redirect(f"http://www.wexprolabs.com/workflow-automation/{suffix}", canonical, {301, 308})
        require_redirect(f"https://www.wexprolabs.com/workflow-automation/{suffix}", canonical, {301, 308})


def check_sitemap_pages() -> None:
    _, _, body = get("/sitemap.xml")
    root = ElementTree.fromstring(body)
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [(node.text or "").strip() for node in root.findall("sm:url/sm:loc", namespace)]
    expected = {f"{BASE}{path}" for path in CHECKS if path.endswith("/")}
    if set(urls) != expected or len(urls) != len(expected):
        raise RuntimeError(f"production sitemap URLs differ from the release contract: {urls}")
    for url in urls:
        parsed = urlsplit(url)
        if parsed.scheme != "https" or parsed.netloc != "wexprolabs.com" or parsed.query or parsed.fragment:
            raise RuntimeError(f"sitemap contains a noncanonical URL: {url}")
        status, final_url, page_body = get(parsed.path)
        if status != 200 or final_url != url:
            raise RuntimeError(f"sitemap URL {url} returned {status} and resolved to {final_url}")
        if "noindex" in page_body.casefold():
            raise RuntimeError(f"sitemap URL {url} contains a noindex directive")


def check_bot_agents() -> None:
    marker = CHECKS["/workflow-automation/"][0]
    for name, user_agent in BOT_AGENTS.items():
        status, final_url, body = get("/workflow-automation/", user_agent=user_agent)
        if status != 200 or final_url != f"{BASE}/workflow-automation/" or marker not in body:
            raise RuntimeError(f"{name} edge check returned {status}, resolved to {final_url}, or missed the release marker")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check-www", action="store_true", help="also require the path- and query-preserving www-to-apex redirect")
    args = parser.parse_args()

    wait_for_release()
    for path, markers in CHECKS.items():
        status, final_url, body = get(path)
        if status != 200:
            raise RuntimeError(f"{path} returned HTTP {status}")
        if final_url != f"{BASE}{path}":
            raise RuntimeError(f"{path} unexpectedly resolved to {final_url}")
        for marker in markers:
            if marker not in body:
                raise RuntimeError(f"{path} is missing marker {marker!r}")
    check_sitemap_pages()
    check_bot_agents()
    post_smoke_event()
    check_canonical_redirects(args.check_www)
    print(
        f"Production smoke passed for {len(CHECKS)} public resources, every sitemap URL, "
        f"{len(BOT_AGENTS)} named crawler user-agent profiles, canonical redirects, and the analytics endpoint."
    )


if __name__ == "__main__":
    main()
