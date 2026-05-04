#!/usr/bin/env python3
"""
At deploy time, embed public Supabase credentials into docs/book.html so the
static GitHub Pages booking form can call Supabase directly (anon key + RPC).

Repository or environment secrets (GitHub Actions). Either Pages-specific names
or the same names as the Next.js app:

  PAGES_SUPABASE_URL  or  NEXT_PUBLIC_SUPABASE_URL
  PAGES_SUPABASE_ANON_KEY  or  NEXT_PUBLIC_SUPABASE_ANON_KEY
  PAGES_RESTAURANT_ID  or  NEXT_PUBLIC_DEMO_RESTAURANT_ID (optional; else demo UUID)

Local runs without env vars leave the __HORECA_BOOT__ placeholder; book.html
falls back to the built-in static demo.

On GitHub Actions, missing URL/key prints a workflow warning and skips inject
(so the site still deploys as static demo until secrets are added).
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

MARKER = "__HORECA_BOOT__"
DEFAULT_RESTAURANT = "00000000-0000-0000-0000-00000000d0a1"


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    book = root / "docs" / "book.html"
    if not book.is_file():
        print("inject-book-supabase: docs/book.html not found", file=sys.stderr)
        return 1

    text = book.read_text(encoding="utf-8")
    if MARKER not in text:
        print("inject-book-supabase: marker not found in book.html", file=sys.stderr)
        return 1

    url = (
        os.environ.get("PAGES_SUPABASE_URL", "").strip()
        or os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").strip()
    )
    key = (
        os.environ.get("PAGES_SUPABASE_ANON_KEY", "").strip()
        or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "").strip()
    )
    rid = (
        os.environ.get("PAGES_RESTAURANT_ID", "").strip()
        or os.environ.get("NEXT_PUBLIC_DEMO_RESTAURANT_ID", "").strip()
        or DEFAULT_RESTAURANT
    )

    on_ci = os.environ.get("GITHUB_ACTIONS") == "true"
    if not url or not key:
        if on_ci:
            # Do not fail the Pages workflow: deploy static demo until secrets exist.
            print(
                "::warning::Supabase URL/anon key are empty — book.html stays static. "
                "Add repository or `github-pages` environment secrets: "
                "PAGES_SUPABASE_URL + PAGES_SUPABASE_ANON_KEY, "
                "or NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.",
                flush=True,
            )
            return 0
        print("inject-book-supabase: no URL/key in env; keeping placeholder (static demo)")
        return 0

    payload = json.dumps(
        {"url": url, "anonKey": key, "restaurantId": rid},
        separators=(",", ":"),
    )
    book.write_text(text.replace(MARKER, payload, 1), encoding="utf-8")
    print("inject-book-supabase: embedded boot config into docs/book.html")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
