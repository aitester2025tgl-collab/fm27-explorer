#!/usr/bin/env python3
"""Build FM27 Explorer into a single self-contained HTML file.

The app ships as one `index.html` so it can be opened straight from disk (file://)
or served from any static host. The sources live in `src/` and are stitched
together here:

    src/index.html            page skeleton with include markers
    src/css/styles.css        styles
    src/js/boot.js            storage (IndexedDB) + save import (Pyodide + fmsave)
    src/js/app.js             players / clubs views, player card, sorting
    src/js/tactic.js          tactic view: formations, roles, fit scores, scouting
    src/py/convert.py         Python that runs in the browser and turns a save into app data

Usage:
    python tools/build.py                 # writes FM27-Explorer.html (the ready-to-use app, committed)
    python tools/build.py --out site/     # writes site/index.html (used for GitHub Pages)
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
MARKER = re.compile(r"(?:/\*@include ([\w./-]+)\*/|#@include ([\w./-]+))")


def version() -> str:
    return (ROOT / "VERSION").read_text(encoding="utf-8").strip()


def render(template_path: Path, depth: int = 0) -> str:
    if depth > 3:
        raise RuntimeError("Include nesting too deep")
    text = template_path.read_text(encoding="utf-8")

    def include(match: re.Match[str]) -> str:
        rel = match.group(1) or match.group(2)
        part = SRC / rel
        if not part.is_file():
            raise FileNotFoundError(f"{template_path.name}: include not found: {rel}")
        body = render(part, depth + 1)
        if rel.endswith(".py") and "</script" in body.lower():
            raise ValueError(f"{rel} must not contain '</script'")
        return body.rstrip("\n")

    return MARKER.sub(include, text)


APP_FILE = ROOT / "FM27-Explorer.html"


def render_app() -> str:
    html = render(SRC / "index.html").replace("{{VERSION}}", version())
    leftovers = MARKER.findall(html)
    if leftovers or "{{VERSION}}" in html:
        raise RuntimeError(f"Unresolved markers: {leftovers}")
    return html


def build(out_dir: Path | None = None) -> Path:
    html = render_app()
    out = APP_FILE if out_dir is None else Path(out_dir) / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8", newline="\n")
    return out


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--out", default=None, help="write <folder>/index.html instead of FM27-Explorer.html")
    args = parser.parse_args(argv)
    out = build(Path(args.out) if args.out else None)
    print(f"Built {out} ({out.stat().st_size / 1024:.0f} KB, v{version()})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
