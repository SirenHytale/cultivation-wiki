import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { listSlugs } from "@/lib/content";
import { docMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return listSlugs("zh")
    .filter((slug) => slug !== "")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return docMetadata("zh", slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DocPage lang="zh" slug={slug} />;
}
