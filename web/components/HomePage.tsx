import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getDoc } from "@/lib/content";
import type { Lang } from "@/lib/nav";
import { mdxComponents } from "@/components/mdx";
import { HeroMotes } from "@/components/HeroMotes";
import { heroEn, heroZh } from "@/lib/home/hero";

const HERO: Record<Lang, string> = { en: heroEn, zh: heroZh };

/**
 * The home page.
 *
 * Structurally unlike every other page and deliberately so: a full-bleed hero
 * above a single-column `.layout.is-wide` with **no sidebar and no TOC**, and
 * a `.home-body` main. Rendering it through the standard doc template — which
 * is what the first pass of this migration did — turns the landing page into
 * an ordinary wiki article.
 *
 * The hero markup is injected rather than written as JSX; see lib/home/hero.ts
 * for why. It is a build-time constant, so the hero is server-rendered.
 */
export function HomePage({ lang }: { lang: Lang }) {
  const doc = getDoc(lang, "");
  if (!doc) notFound();

  return (
    <>
      <section className="hero" dangerouslySetInnerHTML={{ __html: HERO[lang] }} />
      <HeroMotes />

      <div className="layout is-wide">
        <main className="content home-body" id="main">
          <MDXRemote
            source={doc.body}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />
        </main>
      </div>
    </>
  );
}
