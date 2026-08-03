"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/nav";
import { SearchIcon } from "./Icons";

interface Hit {
  u: string;
  t: string;
  s: string;
  snippet: string;
}

/** Split a snippet on the query terms so matches can be <mark>ed without
    trusting server-sent HTML. */
function highlight(text: string, terms: string[]): React.ReactNode {
  if (!terms.length) return text;
  const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  const lowered = new Set(terms.map((term) => term.toLowerCase()));
  return parts.map((part, i) =>
    lowered.has(part.toLowerCase()) ? <mark key={i}>{part}</mark> : part,
  );
}

export function SearchTrigger({ lang }: { lang: Lang }) {
  const ui = t(lang);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        aria-label={ui.searchAria}
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
        <span className="label">{ui.search}</span>
        <span className="kbd kbd-hint">Ctrl K</span>
      </button>
      {open && <SearchModal lang={lang} onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const ui = t(lang);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Debounced query. The abort controller keeps a slow response for an old
  // query from overwriting the results of a newer one.
  useEffect(() => {
    // Clearing the box empties the results in the change handler below, so
    // there is nothing to reset here — just no search to run.
    if (!query.trim()) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      // Trailing slash is deliberate: next.config sets trailingSlash, so the
      // bare path 308-redirects and every keystroke would pay a second round
      // trip before the search even ran.
      fetch(`/wiki-search/?q=${encodeURIComponent(query)}&lang=${lang}`, {
        signal: controller.signal,
      })
        .then((r) => (r.ok ? r.json() : { hits: [] }))
        .then((data: { hits: Hit[] }) => {
          setHits(data.hits ?? []);
          setSelected(0);
        })
        .catch(() => {
          /* aborted or offline */
        })
        .finally(() => setLoading(false));
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, lang]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => (hits.length ? (s + 1) % hits.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => (hits.length ? (s - 1 + hits.length) % hits.length : 0));
    } else if (e.key === "Enter" && hits[selected]) {
      e.preventDefault();
      go(hits[selected].u);
    }
  };

  return (
    <div
      className="search-overlay is-open"
      role="dialog"
      aria-modal="true"
      aria-label={ui.searchAria}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
    >
      <div className="search-box">
        <div className="search-field">
          <SearchIcon />
          <input
            ref={inputRef}
            type="search"
            value={query}
            // `loading` is raised here rather than in the effect: flipping it
            // synchronously inside an effect triggers a cascading render, and
            // typing is the event that actually starts a search.
            onChange={(e) => {
              const next = e.target.value;
              setQuery(next);
              const searching = next.trim().length > 0;
              setLoading(searching);
              if (!searching) setHits([]);
            }}
            placeholder={ui.searchPlaceholder}
            autoComplete="off"
            spellCheck={false}
            aria-label={ui.searchAria}
          />
        </div>

        <div className="search-results" role="listbox">
          {!query.trim() ? (
            <div className="search-empty">
              <span className="han">尋</span>
              {ui.searchEmpty}
            </div>
          ) : hits.length ? (
            hits.map((hit, i) => (
              <a
                key={hit.u}
                className={`search-hit${i === selected ? " is-sel" : ""}`}
                href={hit.u}
                role="option"
                aria-selected={i === selected}
                onMouseEnter={() => setSelected(i)}
                onClick={(e) => {
                  e.preventDefault();
                  go(hit.u);
                }}
              >
                <div className="hit-crumb">{hit.s}</div>
                <div className="hit-title">{hit.t}</div>
                {hit.snippet && (
                  <div className="hit-snip">{highlight(hit.snippet, terms)}</div>
                )}
              </a>
            ))
          ) : loading ? (
            <div className="search-empty">
              <span className="han">尋</span>
              {ui.searching}
            </div>
          ) : (
            <div className="search-empty">
              <span className="han">無</span>
              {ui.noResults} <strong>{query}</strong>
            </div>
          )}
        </div>

        <div className="search-foot">
          <span>
            <span className="kbd">↑</span>
            <span className="kbd">↓</span> {ui.navigate}
          </span>
          <span>
            <span className="kbd">↵</span> {ui.openHit}
          </span>
          <span>
            <span className="kbd">Esc</span> {ui.closeHit}
          </span>
        </div>
      </div>
    </div>
  );
}
