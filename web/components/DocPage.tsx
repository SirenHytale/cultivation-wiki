import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getDoc } from "@/lib/content";
import { GROUP_HAN, t } from "@/lib/i18n";
import { SECTIONS, type Lang } from "@/lib/nav";
import { mdxComponents } from "@/components/mdx";
import { DocJsonLd } from "@/components/JsonLd";
import { PageNav } from "@/components/chrome/PageNav";
import { Sidebar } from "@/components/chrome/Sidebar";
import { Toc } from "@/components/chrome/Toc";

/** Explicit "{#anchor}" ids in headings, honoured by remarkHeadingIds below. */
const RE_EXPLICIT_ID = /\s*\{#([A-Za-z0-9_-]+)\}\s*$/;

/**
 * Support `## Heading \{#anchor\}`.
 *
 * The Chinese and English pages deliberately share pinned anchors — a
 * slugified Chinese heading is unguessable from the English page, so a
 * cross-language deep link could not otherwise be written.
 *
 * The braces arrive escaped in the MDX source because a bare `{` is lexed as
 * a JSX expression and would fail the parse outright. By the time this runs
 * the escapes are gone and the mdast just holds the literal text, which may be
 * split across several text nodes — so the tail is matched across the joined
 * value rather than on the last node alone. rehype-slug fills in every heading
 * this does not pin.
 */
function remarkHeadingIds() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const visit = (node: any) => {
      if (node.type === "heading" && Array.isArray(node.children)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const texts = node.children.filter((c: any) => c.type === "text");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const joined = texts.map((c: any) => c.value).join("");
        const match = RE_EXPLICIT_ID.exec(joined);
        if (match) {
          // Trim the matched suffix off the tail, walking backwards so a
          // marker split across nodes is still removed cleanly.
          let remaining = joined.length - match.index;
          for (let i = texts.length - 1; i >= 0 && remaining > 0; i -= 1) {
            const value: string = texts[i].value;
            const cut = Math.min(value.length, remaining);
            texts[i].value = value.slice(0, value.length - cut);
            remaining -= cut;
          }
          node.data = node.data ?? {};
          node.data.hProperties = { ...(node.data.hProperties ?? {}), id: match[1] };
        }
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    };
    visit(tree);
  };
}

/** Chinese label for a sidebar group, for the Chinese page eyebrow. */
function groupLabel(group: string | undefined, lang: Lang): string {
  if (!group) return "";
  if (lang !== "zh") return group;
  return SECTIONS.find((s) => s.title === group)?.zh ?? group;
}

export async function DocPage({ lang, slug }: { lang: Lang; slug: string }) {
  const doc = getDoc(lang, slug);
  if (!doc) notFound();

  const ui = t(lang);
  const { frontmatter } = doc;
  const group = groupLabel(frontmatter.group, lang);
  const han = frontmatter.group ? (GROUP_HAN[frontmatter.group] ?? "") : "";

  return (
    <div className="layout">
      <DocJsonLd
        lang={lang}
        slug={slug}
        title={frontmatter.title}
        description={frontmatter.description}
        group={frontmatter.group}
      />
      <Sidebar lang={lang} />
      <main className="content" id="main">
        {group && (
          <div className="page-eyebrow">
            <span>{group}</span>
            <span className="sep">/</span>
            <span>{frontmatter.title}</span>
            {han && (
              <>
                <span className="sep">·</span>
                <span className="han-dim">{han}</span>
              </>
            )}
          </div>
        )}

        <MDXRemote
          source={doc.body}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkHeadingIds],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />

        <PageNav slug={slug} lang={lang} />
      </main>

      <Toc entries={doc.toc} title={ui.onThisPage} />
    </div>
  );
}
