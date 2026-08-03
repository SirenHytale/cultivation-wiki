/* Inline SVG icons. Kept as components so they render on the server and cost
   no client bytes — the static site inlined the same three as strings. */

export function SearchIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.6-3.6" />
    </svg>
  );
}

export function MenuIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

/** Taiji — the Yin/Yang theme toggle. */
export function TaijiIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      <path d="M50 2a48 48 0 100 96 48 48 0 000-96zm0 8a40 40 0 010 80 20 20 0 010-40 20 20 0 000-40z" />
      <circle cx="50" cy="30" r="6" />
      <circle cx="50" cy="70" r="6" fill="none" stroke="currentColor" strokeWidth="5" />
    </svg>
  );
}
