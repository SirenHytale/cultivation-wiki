import Link from "next/link";
import { hrefFor, labelFor, neighbours, type Lang } from "@/lib/nav";
import { t } from "@/lib/i18n";

/** Previous / next, taken from the flattened sidebar order. */
export function PageNav({ slug, lang }: { slug: string; lang: Lang }) {
  const { prev, next } = neighbours(slug);
  if (!prev && !next) return null;
  const ui = t(lang);

  return (
    <nav className="page-nav" aria-label={lang === "zh" ? "翻页导航" : "Page navigation"}>
      {prev && (
        <Link className="prev" href={hrefFor(prev, lang)}>
          <span className="dir">{ui.prev}</span>
          <span className="ttl">{labelFor(prev, lang)}</span>
        </Link>
      )}
      {next && (
        <Link className="next" href={hrefFor(next, lang)}>
          <span className="dir">{ui.next}</span>
          <span className="ttl">{labelFor(next, lang)}</span>
        </Link>
      )}
    </nav>
  );
}
