"use client";

import { usePathname } from "next/navigation";
import { SECTIONS, type Lang } from "@/lib/nav";
import { t } from "@/lib/i18n";

/** Slugs that have a Chinese page, per data/nav.js. */
function hasZhPage(slug: string): boolean {
  const href = slug === "" ? "./" : `${slug}/`;
  return SECTIONS.some((s) => s.items.some((i) => i.href === href && i.zhPage));
}

/**
 * Link to the same page in the other language.
 *
 * Falls back to that language's home page when this page has no counterpart —
 * sending a reader to a zh/ URL that does not exist would 404. Renders during
 * SSR, so the href is correct in the initial HTML.
 */
export function LangToggle({ lang }: { lang: Lang }) {
  const ui = t(lang);
  const pathname = usePathname() || "/";

  let href: string;
  if (lang === "zh") {
    href = pathname.replace(/^\/zh(\/|$)/, "/") || "/";
  } else {
    const slug = pathname.replace(/^\//, "").replace(/\/$/, "");
    href = slug && hasZhPage(slug) ? `/zh/${slug}/` : "/zh/";
  }

  // The accessible name has to contain the visible text ("中文"), or voice
  // control users cannot activate the control by reading it aloud — the
  // label-content-name-mismatch rule. Keeping the explanation after it means
  // screen reader users still hear what the link does.
  return (
    <a
      className="icon-btn lang-toggle"
      href={href}
      title={ui.langSwitch}
      aria-label={`${ui.langName} — ${ui.langSwitch}`}
      hrefLang={lang === "zh" ? "en" : "zh-Hans"}
    >
      {ui.langName}
    </a>
  );
}
