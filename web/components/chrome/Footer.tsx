import Link from "next/link";
import { EXTERNAL, SECTIONS, SITE, hrefFor, labelFor, type Lang } from "@/lib/nav";
import { t } from "@/lib/i18n";

/** Build-time constant: the copyright year must not differ between the
    prerendered HTML and the client, which `new Date()` at render would risk. */
const YEAR = new Date().getFullYear();

export function Footer({ lang }: { lang: Lang }) {
  const ui = t(lang);

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {SECTIONS.slice(0, 3).map((section) => (
          <div className="footer-col" key={section.title}>
            <h5>{lang === "zh" && section.zh ? section.zh : section.title.toUpperCase()}</h5>
            <ul>
              {section.items.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link href={hrefFor(item, lang)}>{labelFor(item, lang)}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer-col">
          <h5>{ui.elsewhere}</h5>
          <ul>
            {EXTERNAL.map((link) => (
              <li key={link.href}>
                <a href={link.href} rel="noopener" target="_blank">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-seal">
          <div className="big han">道法自然</div>
          <div>
            Cultivation {SITE.version} &middot; {ui.aHytaleMod}
          </div>
          <div>
            &copy; {YEAR} {SITE.owner} {ui.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}
