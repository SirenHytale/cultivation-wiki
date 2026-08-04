# Cultivation Wiki — Next.js

The xianxia.dev wiki, on Next.js 16 (App Router, React 19) with real
server-side rendering. This directory **is** the site — nothing outside it is
served.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Node 20.9+ is required (Next 16). This project was built against Node 24.18.1.

## Why the URLs look the way they do

Every URL is unchanged from the static site: English pages serve at the root
(`/dao/`) and Chinese mirrors them under `/zh/` (`/zh/dao/`). No `/en` prefix
was introduced, so existing links, bookmarks and search results still resolve.

That is why there are **two root layouts** rather than one `[lang]` segment:

```
app/(en)/layout.tsx      <html lang="en">      → /, /dao/, /planner/
app/(zh)/layout.tsx      <html lang="zh-CN">   → /zh/, /zh/dao/, /zh/planner/
```

A single root layout could not vary `<html lang>` per language without opting
every page out of static generation. Next resolves the static `zh` segment
ahead of the English `[slug]`, so the two trees do not collide.

## Content

Pages are MDX under `content/en/` and `content/zh/`, one file per slug
(`index.mdx` is the home page). **This is the only copy** — the Markdown and
generated HTML they were converted from were deleted with the static site.

Frontmatter:

| Key | Meaning |
| --- | --- |
| `title` | Page title; also the `<title>` and breadcrumb |
| `description` | Meta description and social card text |
| `group` | English sidebar group name — drives the eyebrow and its glyph |
| `toc` | Heading levels for the rail; defaults to `h2,h3` |
| `mermaid` | Set when the page carries a diagram |

Theme components come from `components/mdx/` and are used directly in the MDX:
`<Note>`, `<Card>`, `<CardGrid>`, `<Panel>`, `<Divider />`, `<Chip>`, `<Tag>`.
They replaced a regex pass over the generated HTML that matched prose
substrings, and silently dropped a page's styling whenever upstream wording
changed. Anything a page needs beyond these should become a new component here
rather than raw markup in the MDX.

Pinned heading anchors are written `## Heading \{#anchor\}`. **The braces must
stay escaped** — MDX lexes a bare `{` as a JSX expression and fails the parse
before any plugin runs. `remarkHeadingIds` in `components/DocPage.tsx` strips
the marker and pins the id, which is how the English and Chinese pages share
one anchor.

## Adding or changing a page

1. Edit or add `content/<lang>/<slug>.mdx`.
2. Add an entry in `lib/nav.ts` (with `zhPage: true` once a Chinese version
   exists), or the page renders but is unreachable.
3. If you touched a diagram, re-run the prerender (below).

Nothing else needs regenerating — the search index, sitemap, breadcrumbs and
prev/next all derive from the MDX and `lib/nav.ts` at build time.

## Diagrams

`npm run diagrams` renders every ```mermaid fence to SVG in both themes and
writes `lib/data/diagrams.json`. CSS shows one variant and hides the other, so
switching Yin/Yang is instant and no diagram renderer ever reaches the browser.

It needs a local browser (headless Edge), so it is **not** part of `next build`
— Vercel builds stay browser-free. Run it locally and commit the JSON. A
diagram with no prerendered entry falls back to the client renderer, so a stale
run degrades rather than breaks.

## The interactive tools

`/planner/` and `/calculator/` run the site's original vanilla-JS logic
verbatim (`lib/tools/`), rewrapped from IIFEs into ES modules with an exported
`init(lang)`. **`lib/tools/planner.js` and `calculator.js` are now the source of
truth** — the pre-Next copies they were ported from are gone, so edit them here.
Both were verified to produce numerically identical output to the old site
(6,534 Qi/h, 445,439 total, 68.3 h, 22.8 days, 28 rows), so treat a numeric
change as a regression until proven otherwise.

The planner's data comes from the mod's own `SkillTreeRegistry` via
`npm run skilltree`; the calculator hardcodes the real Qi curve.

Their markup is injected from `lib/tools/shells.ts` rather than written as JSX
— the `id` and `data-*` attributes are a contract with that logic, and
hand-transcribing ~15 KB of form inputs would risk a silent typo. It is still a
build-time constant rendered on the server.

## Local generators (`tools/`)

None run during `next build` — they need Python or a browser, and Vercel builds
stay free of both. Run them locally and commit the output; a stale run degrades
rather than breaks.

| Command | Writes |
| --- | --- |
| `npm run diagrams` | `lib/data/diagrams.json` |
| `npm run skilltree` | `lib/data/skilltree.json` |
| `npm run card` | `public/assets/img/social-card.png` |
| `npm run art` | `public/assets/img/{seal,divider-ink,favicon}.svg` |

`npm run art` does **not** update `components/mdx/Divider.tsx`, which carries
the divider artwork inline on purpose: an SVG loaded through `<img>` is an
isolated document and cannot see the page's `currentColor`, so referencing the
file would paint every divider black.

## Things that must not break

- **`/api/get/**.json` is a live endpoint.** Deployed Cultivation, JadeSlip,
  SoulRings and SacredBodies clients poll it for update and compat checks. The
  files live in `public/api/get/` and get explicit cache headers in
  `next.config.ts`. Do not put a route handler under `/api` — that prefix
  belongs to these.
- `/api/get/index.html` is a **fully standalone page** (its own `<html>`, own
  inline CSS, none of the site chrome) documenting the Read API, served by an
  *exact-source* rewrite in `next.config.ts`. A prefix rewrite there would
  swallow the JSON endpoints beneath it.
- The site's own search endpoint is therefore at **`/wiki-search/`**, not
  `/api/search`. Fetch it *with* the trailing slash; `trailingSlash: true`
  means the bare path 308-redirects.
- `styles/xianxia.css` is the theme inherited from the site's static era. Keep
  framework-specific changes in `styles/next-overrides.css` so the token block
  at its top stays readable as one palette.

## Deploying

Vercel project `SirenHytale/xianxia.dev` with **Root Directory** set to `web`;
push to `main` deploys. After any deploy, spot-check
`/api/get/version/cultivation.json` — mods depend on it.

Canonical URLs point at `https://xianxia.dev`.
