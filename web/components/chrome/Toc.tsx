"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/content";

/**
 * On-this-page rail with scroll spy.
 *
 * The list itself is server-rendered from the Markdown source (see
 * extractToc), so the links are in the HTML; only the "which one is active"
 * highlight needs the client.
 */
export function Toc({ entries, title }: { entries: TocEntry[]; title: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!entries.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) setActive(record.target.id);
        }
      },
      { rootMargin: "-12% 0px -76% 0px", threshold: 0 },
    );

    const seen: Element[] = [];
    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (el) {
        observer.observe(el);
        seen.push(el);
      }
    }
    return () => {
      for (const el of seen) observer.unobserve(el);
      observer.disconnect();
    };
  }, [entries]);

  // Fewer than two headings is a rail not worth the column.
  if (entries.length < 2) return null;

  return (
    <nav className="toc" aria-label={title}>
      <div className="toc-title">{title}</div>
      <ul>
        {entries.map((entry) => (
          <li className={`lvl-${entry.level}`} key={entry.id}>
            <a href={`#${entry.id}`} className={active === entry.id ? "is-active" : undefined}>
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
