/* ---------------------------------------------------------------------------
   Server-side search.

   The static site shipped a 750 KB `window.SEARCH_INDEX = [...]` script to
   every visitor and scored it in the browser. Here the index is built once per
   server process from the MDX sources and never leaves the server — the client
   downloads a handful of results instead of the whole corpus.

   Records mirror the old shape (one per h2 section) so relevance behaves the
   same way readers are used to.
--------------------------------------------------------------------------- */

import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { CONTENT_ROOT, searchableText } from "./content";
import { SECTIONS, type Lang } from "./nav";

export interface SearchRecord {
  /** Served URL, including any #anchor. */
  u: string;
  /** Heading, or the page title for the lede section. */
  t: string;
  /** Breadcrumb: "Group › Page". */
  s: string;
  /** Page title when this record is a section of it. */
  h: string;
  /** Prose. */
  x: string;
  l: Lang;
}

export interface SearchHit extends SearchRecord {
  score: number;
  snippet: string;
}

/* As in content.ts: the raw MDX carries the marker with escaped braces. */
const RE_EXPLICIT_ID = /\s*\\?\{#([A-Za-z0-9_-]+)\\?\}\s*$/;

function groupFor(slug: string, lang: Lang): string {
  const href = slug === "" ? "./" : `${slug}/`;
  const section = SECTIONS.find((s) => s.items.some((i) => i.href === href));
  if (!section) return lang === "zh" ? "百科" : "Wiki";
  return lang === "zh" && section.zh ? section.zh : section.title;
}

function buildForLang(lang: Lang): SearchRecord[] {
  const dir = path.join(CONTENT_ROOT, lang);
  if (!fs.existsSync(dir)) return [];

  const records: SearchRecord[] = [];

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx$/, "").replace(/^index$/, "");
    const title = (data.title as string) ?? slug;
    const base = lang === "zh" ? `/zh/${slug ? `${slug}/` : ""}` : `/${slug ? `${slug}/` : ""}`;
    const group = groupFor(slug, lang);

    // Split at each h2, exactly as the old Python indexer did.
    const slugger = new GithubSlugger();
    const parts = content.split(/^##\s+/m);
    const lede = searchableText(parts[0] ?? "");

    if (lede.length >= 40) {
      records.push({ u: base, t: title, s: group, h: "", x: lede.slice(0, 1400), l: lang });
    }

    for (const part of parts.slice(1)) {
      const newline = part.indexOf("\n");
      let headingRaw = (newline < 0 ? part : part.slice(0, newline)).trim();
      const body = newline < 0 ? "" : part.slice(newline + 1);

      const explicit = RE_EXPLICIT_ID.exec(headingRaw);
      let id: string;
      if (explicit) {
        id = explicit[1];
        headingRaw = headingRaw.slice(0, explicit.index).trim();
        slugger.slug(id);
      } else {
        id = slugger.slug(headingRaw.replace(/[`*_[\]]/g, ""));
      }

      const heading = headingRaw.replace(/[`*_]/g, "").trim();
      const text = searchableText(body);
      if (!heading && text.length < 40) continue;

      records.push({
        u: `${base}#${id}`,
        t: heading || title,
        s: `${group} › ${title}`,
        h: title,
        x: text.slice(0, 1400),
        l: lang,
      });
    }
  }

  return records;
}

/* One index per process, built on first use and reused for the life of the
   lambda. Content is immutable at runtime, so there is nothing to invalidate. */
let cached: Record<Lang, SearchRecord[]> | null = null;

export function getIndex(lang: Lang): SearchRecord[] {
  if (!cached) cached = { en: buildForLang("en"), zh: buildForLang("zh") };
  return cached[lang] ?? [];
}

/** Scoring, ported verbatim from site.js so result order stays familiar. */
function score(entry: SearchRecord, terms: string[]): number {
  const title = entry.t.toLowerCase();
  const head = (entry.h || "").toLowerCase();
  const body = (entry.x || "").toLowerCase();
  let total = 0;

  for (const term of terms) {
    let s = 0;
    if (title.startsWith(term)) s += 120;
    else if (title.includes(term)) s += 70;
    if (head.includes(term)) s += 45;
    const n = body.split(term).length - 1;
    if (n) s += Math.min(30, 8 + n * 3);
    if (!s) return 0; // every term must appear somewhere
    total += s;
  }
  return total;
}

function makeSnippet(text: string, terms: string[]): string {
  const low = text.toLowerCase();
  let at = -1;
  for (const term of terms) {
    at = low.indexOf(term);
    if (at >= 0) break;
  }
  if (at < 0) at = 0;
  const start = Math.max(0, at - 70);
  return (start ? "…" : "") + text.slice(start, start + 190) + "…";
}

export function runSearch(query: string, lang: Lang, limit = 24): SearchHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return getIndex(lang)
    .map((entry) => ({ entry, s: score(entry, terms) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ entry, s }) => ({ ...entry, score: s, snippet: makeSnippet(entry.x, terms) }));
}
