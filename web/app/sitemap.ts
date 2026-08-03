import type { MetadataRoute } from "next";
import { listSlugs } from "@/lib/content";
import { SITE } from "@/lib/nav";

/**
 * Sitemap with hreflang alternates.
 *
 * The static site had none — search engines discovered pages by crawling the
 * sidebar, which only existed after JavaScript ran. Every URL is listed here
 * with its counterpart in the other language.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const en = listSlugs("en");
  const zh = new Set(listSlugs("zh"));
  const tools = ["planner", "calculator"];

  const entries: MetadataRoute.Sitemap = [];

  for (const slug of [...en, ...tools]) {
    const path = slug === "" ? "" : `${slug}/`;
    const hasZh = zh.has(slug) || tools.includes(slug);
    entries.push({
      url: `${SITE.url}/${path}`,
      changeFrequency: "weekly",
      priority: slug === "" ? 1 : 0.7,
      alternates: hasZh
        ? { languages: { en: `${SITE.url}/${path}`, "zh-Hans": `${SITE.url}/zh/${path}` } }
        : undefined,
    });
  }

  for (const slug of [...zh, ...tools]) {
    const path = slug === "" ? "" : `${slug}/`;
    entries.push({
      url: `${SITE.url}/zh/${path}`,
      changeFrequency: "weekly",
      priority: slug === "" ? 0.9 : 0.6,
    });
  }

  return entries;
}
