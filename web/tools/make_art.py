#!/usr/bin/env python3
"""Generate the site's decorative SVGs (bagua seal, ink divider, favicon).

Run from web/:  npm run art
Re-run only if you want to tweak the geometry; the SVGs are committed.

Note that divider-ink.svg is *also* inlined by hand in components/mdx/Divider.tsx
— an SVG loaded through <img> is an isolated document and cannot see the page's
`currentColor`, so the component carries the artwork rather than a reference to
it. Regenerating the file here does not update the component.
"""
from __future__ import annotations

import math
import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "assets" / "img"

GOLD = "#C9A227"
GOLD_BRIGHT = "#F6D77B"
CRIMSON = "#7C241B"
INK = "#1D0D07"

# Eight trigrams, Earlier-Heaven (Fu Xi) order, clockwise from the top.
# Each entry is (name, lines) where lines run outer -> inner and
# 1 = unbroken (yang), 0 = broken (yin).
TRIGRAMS = [
    ("qian", (1, 1, 1)),  # heaven  乾
    ("xun",  (1, 1, 0)),  # wind    巽
    ("kan",  (0, 1, 0)),  # water   坎
    ("gen",  (1, 0, 0)),  # mountain 艮
    ("kun",  (0, 0, 0)),  # earth   坤
    ("zhen", (0, 0, 1)),  # thunder 震
    ("li",   (1, 0, 1)),  # fire    離
    ("dui",  (0, 1, 1)),  # lake    兌
]


def taiji(cx: float, cy: float, r: float) -> str:
    """Classic yin-yang: one filled S-half plus the two eyes."""
    half = r / 2
    eye = r / 5.6
    dark = (
        f'<path d="M {cx},{cy - r} '
        f'A {r},{r} 0 0,1 {cx},{cy + r} '
        f'A {half},{half} 0 0,1 {cx},{cy} '
        f'A {half},{half} 0 0,0 {cx},{cy - r} Z" fill="{CRIMSON}"/>'
    )
    return (
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{GOLD_BRIGHT}" opacity="0.92"/>'
        + dark
        + f'<circle cx="{cx}" cy="{cy - half}" r="{eye}" fill="{CRIMSON}"/>'
        + f'<circle cx="{cx}" cy="{cy + half}" r="{eye}" fill="{GOLD_BRIGHT}"/>'
        + f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{GOLD}" stroke-width="1.6"/>'
    )


def trigram_bars(lines, bar_w=30.0, bar_h=4.6, gap=4.4) -> str:
    """Three stacked bars centred on (0,0); broken bars split with a gap."""
    out = []
    span = bar_h + gap
    for i, solid in enumerate(lines):
        y = (i - 1) * span - bar_h / 2
        if solid:
            out.append(f'<rect x="{-bar_w/2:.2f}" y="{y:.2f}" width="{bar_w}" height="{bar_h}" rx="1"/>')
        else:
            seg = (bar_w - 8.0) / 2
            out.append(f'<rect x="{-bar_w/2:.2f}" y="{y:.2f}" width="{seg:.2f}" height="{bar_h}" rx="1"/>')
            out.append(f'<rect x="{bar_w/2 - seg:.2f}" y="{y:.2f}" width="{seg:.2f}" height="{bar_h}" rx="1"/>')
    return "".join(out)


def build_seal() -> str:
    cx = cy = 100.0
    ring_r = 72.0
    parts = [
        f'<circle cx="{cx}" cy="{cy}" r="96" fill="none" stroke="{GOLD}" stroke-width="1.4" opacity="0.75"/>',
        f'<circle cx="{cx}" cy="{cy}" r="90" fill="none" stroke="{GOLD}" stroke-width="0.8" opacity="0.45"/>',
        f'<circle cx="{cx}" cy="{cy}" r="55" fill="none" stroke="{GOLD}" stroke-width="0.8" opacity="0.45"/>',
    ]

    # Eight trigrams, each rotated so its bars sit perpendicular to the radius.
    parts.append(f'<g fill="{GOLD_BRIGHT}" opacity="0.9">')
    for i, (name, lines) in enumerate(TRIGRAMS):
        deg = -90 + i * 45
        rad = math.radians(deg)
        x = cx + ring_r * math.cos(rad)
        y = cy + ring_r * math.sin(rad)
        parts.append(
            f'<g class="trigram-{name}" transform="translate({x:.2f},{y:.2f}) rotate({deg + 90})">'
            + trigram_bars(lines)
            + "</g>"
        )
    parts.append("</g>")
    parts.append(taiji(cx, cy, 40))

    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" '
        'role="img" aria-label="Bagua seal with a taiji centre">'
        + "".join(parts)
        + "</svg>"
    )


def build_divider() -> str:
    """A tapered ink stroke with a small lozenge at the centre."""
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 24" '
        'fill="none" aria-hidden="true">'
        f'<path d="M6 12 C 60 6, 110 6, 152 11" stroke="currentColor" stroke-width="1.5" '
        'stroke-linecap="round" opacity="0.85"/>'
        f'<path d="M188 11 C 230 6, 280 6, 334 12" stroke="currentColor" stroke-width="1.5" '
        'stroke-linecap="round" opacity="0.85"/>'
        '<path d="M170 4 L177 12 L170 20 L163 12 Z" fill="currentColor" opacity="0.9"/>'
        '<circle cx="170" cy="12" r="1.6" fill="currentColor"/>'
        "</svg>"
    )


def build_favicon() -> str:
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        f'<rect width="64" height="64" rx="10" fill="{INK}"/>'
        f'<rect x="2.5" y="2.5" width="59" height="59" rx="8" fill="none" '
        f'stroke="{GOLD}" stroke-width="2"/>'
        + taiji(32, 32, 20)
        + "</svg>"
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, svg in (
        ("seal.svg", build_seal()),
        ("divider-ink.svg", build_divider()),
        ("favicon.svg", build_favicon()),
    ):
        (OUT / name).write_text(svg, encoding="utf-8")
        print(f"wrote {OUT / name}  ({len(svg)} bytes)")


if __name__ == "__main__":
    main()
