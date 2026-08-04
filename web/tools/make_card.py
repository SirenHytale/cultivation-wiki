#!/usr/bin/env python3
"""Render tools/card.html to public/assets/img/social-card.png (1200x630).

og:image must be a raster format — Facebook, Discord, X and Slack will not
render an SVG card — so the card is authored as HTML and screenshotted with
headless Edge/Chrome, which is the only image toolchain on this machine.

    npm run card

Headless subtracts window chrome from the requested window size, so this
measures the result and retries with a corrected size until it lands exactly
on 1200x630.
"""
from __future__ import annotations

import pathlib
import struct
import subprocess
import sys

WEB = pathlib.Path(__file__).resolve().parent.parent
CARD = WEB / "tools" / "card.html"
OUT = WEB / "public" / "assets" / "img" / "social-card.png"
TARGET = (1200, 630)

BROWSERS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
]


def find_browser() -> str:
    for b in BROWSERS:
        if pathlib.Path(b).exists():
            return b
    sys.exit("no Edge or Chrome found — install one, or add its path to BROWSERS")


def png_size(path: pathlib.Path) -> tuple[int, int]:
    data = path.read_bytes()[:33]
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not a PNG")
    w, h = struct.unpack(">II", data[16:24])
    return w, h


def shoot(browser: str, win: tuple[int, int]) -> None:
    subprocess.run(
        [browser, "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
         "--virtual-time-budget=9000",
         f"--window-size={win[0]},{win[1]}",
         f"--screenshot={OUT}",
         CARD.as_uri()],
        check=False, capture_output=True,
    )


def main() -> None:
    browser = find_browser()
    OUT.parent.mkdir(parents=True, exist_ok=True)

    win = TARGET
    for attempt in range(4):
        shoot(browser, win)
        if not OUT.exists():
            sys.exit("browser produced no screenshot")
        got = png_size(OUT)
        print(f"  attempt {attempt + 1}: requested {win}, got {got[0]}x{got[1]}")
        if got == TARGET:
            print(f"\nwrote {OUT.relative_to(WEB)}  ({OUT.stat().st_size:,} bytes)")
            return
        # Compensate for the chrome the browser subtracted.
        win = (win[0] + (TARGET[0] - got[0]), win[1] + (TARGET[1] - got[1]))

    print(f"\nwrote {OUT.relative_to(WEB)} at {png_size(OUT)} — not exactly {TARGET}, "
          "but og:image tolerates it", file=sys.stderr)


if __name__ == "__main__":
    main()
