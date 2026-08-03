/* ---------------------------------------------------------------------------
   Content layer.

   Pages live as MDX under content/<lang>/<slug>.mdx. Everything here runs on
   the server only — the filesystem reads happen at build time for statically
   generated routes, so none of this reaches the client.
--------------------------------------------------------------------------- */

import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { cache } from "react";
import type { Lang } from "./nav";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

export interface DocFrontmatter {
  title: string;
  description?: string;
  /** English sidebar group name; drives the eyebrow and its glyph. */
  group?: string;
  /** Heading levels the TOC indexes. Defaults to "h2,h3". */
  toc?: string;
  /** Set on pages carrying at least one mermaid diagram. */
  mermaid?: boolean;
}

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

export interface Doc {
  slug: string;
  lang: Lang;
  frontmatter: DocFrontmatter;
  body: string;
  toc: TocEntry[];
}

function dirFor(lang: Lang): string {
  return path.join(CONTENT_ROOT, lang);
}

/** Every slug that has an MDX file for this language. "" is the home page. */
export const listSlugs = cache((lang: Lang): string[] => {
  const dir = dirFor(lang);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .map((s) => (s === "index" ? "" : s))
    .sort();
});

export function docExists(lang: Lang, slug: string): boolean {
  return fs.existsSync(filePath(lang, slug));
}

function filePath(lang: Lang, slug: string): string {
  return path.join(dirFor(lang), `${slug === "" ? "index" : slug}.mdx`);
}

/**
 * Strip fenced code blocks before scanning for headings.
 *
 * Without this a `# comment` line inside a shell or Java sample becomes a
 * phantom TOC entry — and the old Python audit tool hit exactly this bug when
 * it paired inline backticks without stripping fences first.
 */
function stripFences(md: string): string {
  return md.replace(/^```[\s\S]*?^```/gm, "");
}

const RE_HEADING = /^(#{1,6})\s+(.*?)\s*$/gm;
/* Matches the pinned-anchor marker in the RAW MDX, where the braces are
   backslash-escaped so MDX does not lex them as a JSX expression. */
const RE_EXPLICIT_ID = /\s*\\?\{#([A-Za-z0-9_-]+)\\?\}\s*$/;

/** Remove inline Markdown/JSX markup so a TOC label reads as plain text. */
function plainText(raw: string): string {
  return raw
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/**
 * Build the on-this-page rail from the Markdown source.
 *
 * Ids must match what rehype-slug assigns at render time, so this uses the
 * same github-slugger — including its de-duplication counter, which is why one
 * slugger instance walks the whole document in order.
 */
export function extractToc(md: string, levels: string = "h2,h3"): TocEntry[] {
  const wanted = new Set(
    levels
      .split(",")
      .map((s) => Number(s.trim().replace(/^h/i, "")))
      .filter((n) => Number.isFinite(n)),
  );
  const slugger = new GithubSlugger();
  const out: TocEntry[] = [];
  const src = stripFences(md);

  for (const m of src.matchAll(RE_HEADING)) {
    const level = m[1].length;
    let raw = m[2];
    // An explicit "{#anchor}" pins the id so the English and Chinese pages can
    // share one anchor — a slugified Chinese heading is unguessable otherwise.
    const explicit = RE_EXPLICIT_ID.exec(raw);
    let id: string;
    if (explicit) {
      id = explicit[1];
      raw = raw.slice(0, explicit.index);
      slugger.slug(id); // keep the counter in step with the render pass
    } else {
      id = slugger.slug(plainText(raw));
    }
    if (level === 1 || !wanted.has(level)) continue;
    out.push({ id, text: plainText(raw), level });
  }
  return out;
}

/** Load one page. Returns null when the language has no such file. */
export const getDoc = cache((lang: Lang, slug: string): Doc | null => {
  const file = filePath(lang, slug);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as DocFrontmatter;

  return {
    slug,
    lang,
    frontmatter,
    body: content,
    toc: extractToc(content, frontmatter.toc ?? "h2,h3"),
  };
});

/** Plain prose for the search index — no frontmatter, markup or diagrams. */
export function searchableText(md: string): string {
  return md
    .replace(/^```[\s\S]*?^```/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\\?\{#[A-Za-z0-9_-]+\\?\}/g, " ")
    .replace(/[*_>#|]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
