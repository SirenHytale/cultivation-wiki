import { SECTIONS, hasTranslation, hrefFor, labelFor, type Lang } from "@/lib/nav";
import { t } from "@/lib/i18n";
import { SidebarFrame } from "./Drawer";
import { NavLink } from "./NavLink";

/**
 * The section rail. Fully server-rendered.
 *
 * On the Chinese site a page with no translation still appears — so the
 * structure reads complete — but links to English and says so with an "EN"
 * marker, rather than pointing at a zh/ URL that would 404.
 */
export function Sidebar({ lang }: { lang: Lang }) {
  const ui = t(lang);

  return (
    <SidebarFrame ariaLabel={lang === "zh" ? "百科分类" : "Wiki sections"}>
      {SECTIONS.map((section) => (
        <div className="side-group" key={section.title}>
          <h4 className="side-title">
            {lang === "zh" && section.zh ? section.zh : section.title}
            <span className="han-dim">{section.han}</span>
          </h4>
          <ul className="side-list">
            {section.items.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={hrefFor(item, lang)}
                  activeClassName="is-current"
                  markCurrent
                >
                  {labelFor(item, lang)}
                  {!hasTranslation(item, lang) && (
                    <span className="soon" title={ui.untranslatedTitle}>
                      {ui.untranslated}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </SidebarFrame>
  );
}
