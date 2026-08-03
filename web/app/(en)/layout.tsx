import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "@/styles/xianxia.css";
import "@/styles/next-overrides.css";
import { DrawerProvider } from "@/components/chrome/Drawer";
import { Footer } from "@/components/chrome/Footer";
import { FontLoader } from "@/components/chrome/FontLoader";
import { Header } from "@/components/chrome/Header";
import { ThemeScript } from "@/components/chrome/ThemeScript";
import { SITE } from "@/lib/nav";
import { t } from "@/lib/i18n";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.title} — ${SITE.tagline}`,
    template: `%s — Cultivation Wiki`,
  },
  description:
    "Cultivation — a Xianxia progression mod for Hytale. Realms, Qi, sects, techniques and the Dao.",
  openGraph: {
    siteName: "Cultivation Wiki",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/img/social-card.png",
        width: 1200,
        height: 630,
        alt: "Cultivation — a Xianxia progression mod for Hytale",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

/**
 * English root layout. Pages under this tree serve at the site root (/dao/),
 * exactly as they did on the static site — no /en prefix was introduced, so
 * every existing URL and inbound link still resolves.
 */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  const ui = t("en");
  return (
    <html lang="en" data-theme="dark" className={cinzel.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <FontLoader />
      </head>
      <body>
        <DrawerProvider>
          <a className="skip-link" href="#main">
            {ui.skipToContent}
          </a>
          <Header lang="en" />
          {/* The .layout grid belongs to the page, not here: the home page
              uses .layout.is-wide with no sidebar and puts a full-bleed hero
              above it, which a shared wrapper could not express. */}
          {children}
          <Footer lang="en" />
        </DrawerProvider>
      </body>
    </html>
  );
}
