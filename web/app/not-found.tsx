import type { Metadata } from "next";
import Link from "next/link";
import { Cinzel } from "next/font/google";
import "@/styles/xianxia.css";
import "@/styles/next-overrides.css";
import { ThemeScript } from "@/components/chrome/ThemeScript";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lost on the Mountain — Cultivation Wiki",
  robots: { index: false, follow: true },
};

/**
 * Global 404.
 *
 * With two root layouts there is no shared one for this to nest in, so it
 * renders its own document — the same shape the static site's 404.html had.
 */
export default function NotFound() {
  return (
    <html lang="en" data-theme="dark" className={cinzel.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <div className="lost">
          <div>
            <p className="code">迷途</p>
            <h1>Lost on the Mountain</h1>
            <p>
              That page does not exist — or has not been written yet. Try the search, or start
              again from the foot of the path.
            </p>
            <div className="hero-actions">
              <Link className="btn" href="/">
                Return Home
              </Link>
              <Link className="btn ghost" href="/getting-started/">
                Getting Started
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
