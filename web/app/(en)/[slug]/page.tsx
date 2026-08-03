import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { listSlugs } from "@/lib/content";
import { docMetadata } from "@/lib/metadata";

/* Every English page is prerendered at build time and served from the CDN as
   static HTML. `dynamicParams: false` makes anything not in the list a 404
   rather than an on-demand render, which is correct for a fixed corpus. */
export const dynamicParams = false;

export function generateStaticParams() {
  // "" is the home page and has its own route; "zh" is the Chinese tree's
  // static prefix and must never be captured here.
  return listSlugs("en")
    .filter((slug) => slug !== "" && slug !== "zh")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return docMetadata("en", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DocPage lang="en" slug={slug} />;
}
