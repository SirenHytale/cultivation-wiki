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
    default: `${SITE.zhTitle} — ${SITE.zhTagline}`,
    template: `%s — 修真百科`,
  },
  description: "修真 —— Hytale 的仙侠修炼模组。境界、灵气、宗门、功法与大道。",
  openGraph: {
    siteName: "Cultivation Wiki",
    type: "website",
    locale: "zh_CN",
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

/** Chinese root layout. A separate root layout is what lets <html lang> be
    zh-CN in the server-rendered HTML rather than patched in after hydration. */
export default function ChineseLayout({ children }: { children: React.ReactNode }) {
  const ui = t("zh");
  return (
    <html lang="zh-CN" data-theme="dark" className={cinzel.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <FontLoader />
      </head>
      <body>
        <DrawerProvider>
          <a className="skip-link" href="#main">
            {ui.skipToContent}
          </a>
          <Header lang="zh" />
          {/* See the English layout: the .layout grid is per-page so the home
              page can be full-bleed and sidebar-less. */}
          {children}
          <Footer lang="zh" />
        </DrawerProvider>
      </body>
    </html>
  );
}
