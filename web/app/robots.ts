import type { MetadataRoute } from "next";
import { SITE } from "@/lib/nav";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The search endpoint is unbounded query space; there is nothing there
      // for a crawler to index and every hit costs a function invocation.
      disallow: "/wiki-search/",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
