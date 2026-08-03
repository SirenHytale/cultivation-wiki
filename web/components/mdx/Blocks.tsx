/* Theme components.

   On the static site these shapes were produced by tools/enhance.py, a regex
   pass that promoted plain converted HTML into cards, panels and callouts
   after the fact. As MDX components they are written where they are used
   instead of matched by prose substring — so a reworded heading can no longer
   silently strip a page of its styling.

   Class names are unchanged, so assets/css/xianxia.css styles them as-is. */

import Link from "next/link";

/**
 * The ink divider.
 *
 * Inlined rather than loaded through <img>. The artwork paints with
 * `currentColor` and the stylesheet sets `.divider-ink { color: var(--gold-400) }`
 * — but an SVG inside an <img> is an isolated document that cannot see the
 * parent's color, so `currentColor` fell back to black and the divider was
 * effectively invisible against the dark theme. Inline, the intended gold
 * actually applies, and it costs a request rather than adding one.
 */
export function Divider() {
  return (
    <svg
      className="divider-ink"
      viewBox="0 0 340 24"
      width={340}
      height={24}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 12 C 60 6, 110 6, 152 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M188 11 C 230 6, 280 6, 334 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path d="M170 4 L177 12 L170 20 L163 12 Z" fill="currentColor" opacity="0.9" />
      <circle cx="170" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function Note({
  kind,
  title,
  children,
}: {
  kind?: "tip" | "warn";
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`note${kind ? ` ${kind}` : ""}`}>
      {title && <span className="note-title">{title}</span>}
      {children}
    </div>
  );
}

export function CardGrid({ cols = 3, children }: { cols?: 2 | 3; children: React.ReactNode }) {
  return <div className={`grid cols-${cols}`}>{children}</div>;
}

export function Card({
  title,
  han,
  children,
}: {
  title?: string;
  /** Decorative glyph in the card corner. */
  han?: string;
  children: React.ReactNode;
}) {
  // h3, not h4: cards follow an h2 section heading, so an h4 skips a level and
  // fails heading-order. The stylesheet already treats `.card h3` and
  // `.card h4` identically, so nothing moves visually — and it now matches the
  // h3 that CardLink has always used.
  return (
    <div className="card">
      {han && <span className="card-han">{han}</span>}
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

/**
 * A card that is also a link — the home page's navigation tiles.
 *
 * Has to render a real <a class="card">: the stylesheet hangs a lift-and-glow
 * hover on that exact selector, so a div wrapped in a link would look inert.
 */
export function CardLink({
  href,
  title,
  han,
  children,
}: {
  href: string;
  title?: string;
  han?: string;
  children: React.ReactNode;
}) {
  const external = /^https?:/i.test(href);
  const inner = (
    <>
      {han && <span className="card-han">{han}</span>}
      {title && <h3>{title}</h3>}
      {children}
    </>
  );

  if (external) {
    return (
      <a className="card" href={href} rel="noopener noreferrer" target="_blank">
        {inner}
      </a>
    );
  }
  return (
    <Link className="card" href={href}>
      {inner}
    </Link>
  );
}

/**
 * The realm ladder on the home and Realms pages.
 *
 * Each row carries its own accent through the `--realm` custom property, which
 * the stylesheet uses for the medal ring and the row's left edge — so the
 * colour has to survive as an inline style, not a class.
 */
export function RealmTrack({ children }: { children: React.ReactNode }) {
  return <div className="realm-track">{children}</div>;
}

export function Realm({
  color,
  medal,
  name,
  sub,
  tier,
}: {
  color: string;
  medal: string;
  name: string;
  sub: string;
  tier: string;
}) {
  return (
    <div className="realm-row" style={{ "--realm": color } as React.CSSProperties}>
      <div className="realm-medal">{medal}</div>
      <div>
        <div className="realm-name">{name}</div>
        <div className="realm-sub">{sub}</div>
      </div>
      <div className="realm-tier">{tier}</div>
    </div>
  );
}

/** A call-to-action link styled as a button. */
export function ButtonLink({
  href,
  ghost,
  children,
}: {
  href: string;
  ghost?: boolean;
  children: React.ReactNode;
}) {
  const className = `btn${ghost ? " ghost" : ""}`;
  if (/^https?:/i.test(href)) {
    return (
      <a className={className} href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

/** Centres a short row of controls — the source used an inline text-align. */
export function Center({ children }: { children: React.ReactNode }) {
  return <p style={{ textAlign: "center", marginTop: "2em" }}>{children}</p>;
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="panel">
      <div className="panel-head">{title}</div>
      {children}
    </div>
  );
}

/** Wide content must scroll inside its own box, never the page body. */
export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="table-wrap">{children}</div>;
}

export function Chip({ children }: { children: React.ReactNode }) {
  return <span className="chip">{children}</span>;
}

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="tag">{children}</span>;
}
