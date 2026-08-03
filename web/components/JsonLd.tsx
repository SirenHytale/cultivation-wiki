import { SECTIONS, SITE, type Lang } from "@/lib/nav";

/* Structured data.
 *
 * Lighthouse's SEO category already scores 100 without this — it checks
 * crawlability and tags, not semantics. Schema.org markup is what lets Google
 * understand that these pages are documentation belonging to one site, and
 * gives it breadcrumb trails to show in results.
 *
 * Everything below is derived from data the page already has. Nothing is
 * invented: no ratings, no authorship, no dates that are not real. */

/** Serialize safely — a literal "</script>" in any field would end the block. */
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function langTag(lang: Lang): string {
  return lang === "zh" ? "zh-Hans" : "en";
}

function siteNode(lang: Lang) {
  return {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: lang === "zh" ? `${SITE.zhTitle} — ${SITE.zhTagline}` : `${SITE.title} Wiki`,
    url: `${SITE.url}/`,
    inLanguage: langTag(lang),
  };
}

/** Home page: identify the site itself. */
export function SiteJsonLd({ lang }: { lang: Lang }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serialize({ "@context": "https://schema.org", ...siteNode(lang) }),
      }}
    />
  );
}

/**
 * Documentation page: what it is, and where it sits.
 *
 * TechArticle rather than Article — these are reference pages for a piece of
 * software, which is exactly what that type is for.
 */
export function DocJsonLd({
  lang,
  slug,
  title,
  description,
  group,
}: {
  lang: Lang;
  slug: string;
  title: string;
  description?: string;
  group?: string;
}) {
  const path = slug === "" ? "" : `${slug}/`;
  const url = lang === "zh" ? `${SITE.url}/zh/${path}` : `${SITE.url}/${path}`;
  const home = lang === "zh" ? `${SITE.url}/zh/` : `${SITE.url}/`;

  const crumbs: { name: string; item: string }[] = [
    { name: lang === "zh" ? "首页" : "Home", item: home },
  ];
  if (group) {
    // Sidebar groups are not pages, so the crumb carries no item URL of its
    // own; it exists to place the page in the site's structure.
    const section = SECTIONS.find((s) => s.title === group);
    crumbs.push({
      name: lang === "zh" && section?.zh ? section.zh : group,
      item: home,
    });
  }
  crumbs.push({ name: title, item: url });

  const graph = [
    siteNode(lang),
    {
      "@type": "TechArticle",
      "@id": `${url}#article`,
      headline: title,
      name: title,
      ...(description ? { description } : {}),
      url,
      inLanguage: langTag(lang),
      isPartOf: { "@id": `${SITE.url}/#website` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.item,
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serialize({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
