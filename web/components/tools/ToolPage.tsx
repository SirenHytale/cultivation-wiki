import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/nav";
import { PageNav } from "@/components/chrome/PageNav";
import { Sidebar } from "@/components/chrome/Sidebar";
import { Toc } from "@/components/chrome/Toc";
import type { TocEntry } from "@/lib/content";
import { calculatorEn, calculatorZh, plannerEn, plannerZh } from "@/lib/tools/shells";
import { ToolInit } from "./ToolInit";

const SHELLS = {
  planner: { en: plannerEn, zh: plannerZh },
  calculator: { en: calculatorEn, zh: calculatorZh },
} as const;

/**
 * Build the on-this-page rail from the shell's own headings, and give those
 * headings the ids it links to.
 *
 * Both halves live in one function so the id counter is entirely local to a
 * single synchronous call — a counter closed over at component scope would be
 * a side effect during render.
 */
function withHeadingIds(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const seen = new Map<string, number>();

  const out = html.replace(
    /<h([23])([^>]*)>(.*?)<\/h\1>/gs,
    (full, level: string, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      if (!text) return full;

      // Mirror github-slugger closely enough for anchors within one page.
      let id = text
        .toLowerCase()
        .replace(/[^\w一-鿿]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const n = seen.get(id) ?? 0;
      seen.set(id, n + 1);
      if (n) id = `${id}-${n}`;

      toc.push({ id, text, level: Number(level) });
      if (/\bid=/.test(attrs)) return full;
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: out, toc };
}

/**
 * The planner and calculator.
 *
 * Their markup is injected rather than written as JSX — see the note in
 * lib/tools/shells.ts. It is still a build-time constant rendered on the
 * server, so the page arrives fully formed; only the behaviour is client-side.
 */
export function ToolPage({
  tool,
  lang,
  slug,
}: {
  tool: "planner" | "calculator";
  lang: Lang;
  slug: string;
}) {
  const ui = t(lang);
  const { html, toc } = withHeadingIds(SHELLS[tool][lang]);

  return (
    <div className="layout">
      <Sidebar lang={lang} />
      <main className="content" id="main">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <PageNav slug={slug} lang={lang} />
      </main>
      <Toc entries={toc} title={ui.onThisPage} />
      <ToolInit tool={tool} lang={lang} />
    </div>
  );
}
