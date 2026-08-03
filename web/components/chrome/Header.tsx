import Image from "next/image";
import Link from "next/link";
import { PRIMARY, SITE, hrefFor, labelFor, type Lang } from "@/lib/nav";
import { t } from "@/lib/i18n";
import { MenuButton } from "./Drawer";
import { LangToggle } from "./LangToggle";
import { NavLink } from "./NavLink";
import { SearchTrigger } from "./Search";
import { ThemeToggle } from "./ThemeToggle";
import logo from "@/public/assets/img/logo.png";

/**
 * Site header. Rendered on the server — on the old site this markup was built
 * by site.js after load, so a cold visitor and every crawler saw an empty div.
 */
export function Header({ lang }: { lang: Lang }) {
  const ui = t(lang);
  const home = lang === "zh" ? "/zh/" : "/";

  return (
    <header className="site-header">
      <MenuButton label={ui.openNav} />

      <Link className="brand" href={home}>
        <Image src={logo} alt="" width={34} height={34} priority />
        <span className="brand-text">
          <span className="brand-name">{lang === "zh" ? SITE.zhTitle : SITE.title}</span>
          <span className="brand-sub han">{SITE.han}</span>
        </span>
      </Link>

      <nav className="nav-main" aria-label="Primary">
        {PRIMARY.map((item) => (
          <NavLink
            key={item.href}
            href={hrefFor(item, lang)}
            className="nav-link"
            activeClassName="is-active"
          >
            {labelFor(item, lang)}
          </NavLink>
        ))}
      </nav>

      <div className="header-tools">
        <SearchTrigger lang={lang} />
        <LangToggle lang={lang} />
        <ThemeToggle label={ui.themeToggle} />
      </div>
    </header>
  );
}
