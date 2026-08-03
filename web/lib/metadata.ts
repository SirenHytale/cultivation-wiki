import "server-only";

import type { Metadata } from "next";
import { getDoc } from "./content";
import { SECTIONS, SITE, type Lang } from "./nav";

/** True when a slug also exists in Chinese — drives the hreflang alternates. */
function hasZh(slug: string): boolean {
  const href = slug === "" ? "./" : `${slug}/`;
  return SECTIONS.some((s) => s.items.some((i) => i.href === href && i.zhPage));
}

/**
 * Per-page metadata: canonical, hreflang alternates and social cards.
 *
 * The static site stamped this block into every page with tools/stamp_meta.py
 * because social crawlers do not run JavaScript. Next's metadata API renders
 * it server-side, so the generator is no longer needed.
 */
export function docMetadata(lang: Lang, slug: string): Metadata {
  const doc = getDoc(lang, slug);
  if (!doc) return {};

  const { title, description } = doc.frontmatter;
  const path = slug === "" ? "" : `${slug}/`;
  const canonical = lang === "zh" ? `/zh/${path}` : `/${path}`;
  const languages: Record<string, string> = { en: `/${path}` };
  if (hasZh(slug)) languages["zh-Hans"] = `/zh/${path}`;
  languages["x-default"] = `/${path}`;

  const suffix = lang === "zh" ? "修真百科" : "Cultivation Wiki";
  const fullTitle = `${title} — ${suffix}`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: "Cultivation Wiki",
      locale: lang === "zh" ? "zh_CN" : "en_US",
      type: "article",
      images: [
        {
          url: `${SITE.url}/assets/img/social-card.png`,
          width: 1200,
          height: 630,
          alt: "Cultivation — a Xianxia progression mod for Hytale",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${SITE.url}/assets/img/social-card.png`],
    },
  };
}
