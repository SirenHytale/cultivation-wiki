/* ---------------------------------------------------------------------------
   Site navigation — single source of truth for the top bar AND the sidebar,
   in both languages. Ported from the static site's data/nav.js.

   URLs are preserved exactly from the old site: English pages serve at the
   root (/dao/) and Chinese mirrors them under /zh/ (/zh/dao/). Hrefs here stay
   language-neutral and `hrefFor` adds the prefix, exactly as site.js did.

   Per item:
     zh      Chinese label — always present, so the zh sidebar reads Chinese
             even for pages whose body is still English.
     zhPage  true ONLY when a translated page exists at zh/<slug>/. Items
             without it link to the English page and are marked "EN".
--------------------------------------------------------------------------- */

export type Lang = "en" | "zh";

export interface NavItem {
  title: string;
  zh: string;
  /** Language-neutral slug with a trailing slash; "./" is the home page. */
  href: string;
  zhPage?: boolean;
}

export interface NavSection {
  title: string;
  zh: string;
  han: string;
  items: NavItem[];
}

export interface ExternalLink {
  title: string;
  href: string;
}

export const SITE = {
  title: "Cultivation",
  tagline: "Hytale Mod Wiki",
  han: "修仙",
  version: "v0.7.0",
  owner: "Siren",
  zhTitle: "修真",
  zhTagline: "Hytale 模组百科",
  url: "https://xianxia.dev",
} as const;

export const PRIMARY: NavItem[] = [
  { title: "Home", zh: "首页", href: "./", zhPage: true },
  { title: "Getting Started", zh: "入门", href: "getting-started/", zhPage: true },
  { title: "Realms", zh: "境界", href: "realms/", zhPage: true },
  { title: "Commands", zh: "指令", href: "commands/", zhPage: true },
  { title: "Planner", zh: "加点模拟", href: "planner/", zhPage: true },
  { title: "FAQ", zh: "常见问题", href: "faq/", zhPage: true },
  { title: "API", zh: "接口", href: "api/", zhPage: true },
];

export const EXTERNAL: ExternalLink[] = [
  { title: "CurseForge", href: "https://www.curseforge.com/hytale/mods/cultivation/" },
  { title: "Download", href: "https://www.curseforge.com/hytale/mods/cultivation/download" },
  { title: "HStats", href: "https://hstats.dev/mods/828f65ac-8c45-4510-893b-cc90cd9734aa" },
  { title: "API on GitHub", href: "https://github.com/SirenHytale/Cultivation-API" },
];

export const SECTIONS: NavSection[] = [
  {
    title: "Start Here",
    zh: "由此开始",
    han: "起",
    items: [
      { title: "Home", zh: "首页", href: "./", zhPage: true },
      { title: "Getting Started", zh: "入门指南", href: "getting-started/", zhPage: true },
      { title: "The Codex", zh: "典籍", href: "codex/", zhPage: true },
      { title: "Profiles", zh: "修炼存档", href: "profiles/", zhPage: true },
      { title: "Commands", zh: "指令", href: "commands/", zhPage: true },
      { title: "Permissions", zh: "权限", href: "permissions/", zhPage: true },
      { title: "FAQ & Troubleshooting", zh: "常见问题与排错", href: "faq/", zhPage: true },
      { title: "Glossary", zh: "术语表", href: "glossary/", zhPage: true },
    ],
  },
  {
    title: "The Path",
    zh: "修炼之道",
    han: "道",
    items: [
      { title: "Realms & Stages", zh: "境界与阶段", href: "realms/", zhPage: true },
      { title: "Qi Gathering", zh: "聚灵采气", href: "qi-gathering/", zhPage: true },
      { title: "Spirit Sense", zh: "灵气感知", href: "spirit-sense/", zhPage: true },
      { title: "Auras", zh: "修为气息", href: "auras/", zhPage: true },
      { title: "Tribulations", zh: "天劫", href: "tribulations/", zhPage: true },
      { title: "Races", zh: "种族", href: "races/", zhPage: true },
      { title: "Skill Tree", zh: "天赋树", href: "skilltree/", zhPage: true },
      { title: "The Dao", zh: "大道", href: "dao/", zhPage: true },
      { title: "Karma", zh: "业力", href: "karma/", zhPage: true },
      { title: "Titles", zh: "称号", href: "titles/", zhPage: true },
      { title: "Body Tempering", zh: "炼体", href: "body-tempering/" },
      { title: "Sacred Bodies", zh: "圣体", href: "sacred-bodies/" },
    ],
  },
  {
    title: "Arts & Treasures",
    zh: "功法与法宝",
    han: "術",
    items: [
      { title: "Techniques", zh: "功法", href: "techniques/", zhPage: true },
      { title: "Keybinds", zh: "快捷键", href: "keybinds/", zhPage: true },
      { title: "Manuals", zh: "秘籍", href: "manuals/", zhPage: true },
      { title: "Alchemy", zh: "炼丹", href: "alchemy/", zhPage: true },
      { title: "Weapon Refinement", zh: "炼器", href: "refinement/", zhPage: true },
      { title: "Life-Bound", zh: "本命法宝", href: "lifebound/", zhPage: true },
      { title: "Spirit Beasts", zh: "灵兽", href: "beasts/", zhPage: true },
      { title: "Jade Slip", zh: "玉简", href: "jade-slip/" },
    ],
  },
  {
    title: "The World",
    zh: "红尘世间",
    han: "界",
    items: [
      { title: "Sects", zh: "宗门", href: "sects/", zhPage: true },
      { title: "Formations", zh: "阵法", href: "formations/", zhPage: true },
      { title: "Cave Abode", zh: "洞府", href: "dwelling/", zhPage: true },
      { title: "Land Protection", zh: "领地守护", href: "land/", zhPage: true },
      { title: "Partnered Cultivation", zh: "双修", href: "partnered-cultivation/", zhPage: true },
      { title: "Duels", zh: "斗法", href: "duels/", zhPage: true },
      { title: "Sect Wars", zh: "宗门攻伐", href: "wars/", zhPage: true },
      { title: "Notices", zh: "屏显通告", href: "notices/", zhPage: true },
    ],
  },
  {
    title: "Tools",
    zh: "工具",
    han: "器",
    items: [
      { title: "Skill Tree Planner", zh: "天赋加点模拟", href: "planner/", zhPage: true },
      { title: "Qi Calculator", zh: "灵气计算器", href: "calculator/", zhPage: true },
    ],
  },
  {
    title: "Configuration",
    zh: "配置",
    han: "配",
    items: [
      { title: "Overview", zh: "总览", href: "config/", zhPage: true },
      { title: "Core Config", zh: "核心配置", href: "config-core/", zhPage: true },
      { title: "Cultivation", zh: "修炼配置", href: "config-cultivation/", zhPage: true },
      { title: "Arts", zh: "功法配置", href: "config-arts/", zhPage: true },
      { title: "Society", zh: "宗门社群", href: "config-society/", zhPage: true },
      { title: "Race", zh: "种族配置", href: "config-race/", zhPage: true },
      { title: "Data Files", zh: "存档文件", href: "config-data/", zhPage: true },
      { title: "Tuning Presets", zh: "调参预设", href: "presets/", zhPage: true },
    ],
  },
  {
    title: "For Developers",
    zh: "开发者",
    han: "匠",
    items: [
      { title: "API Overview", zh: "接口总览", href: "api/", zhPage: true },
      { title: "Reference", zh: "接口参考", href: "api-reference/", zhPage: true },
      { title: "Events", zh: "事件", href: "api-events/", zhPage: true },
      { title: "Building Add-ons", zh: "编写扩展", href: "api-addons/", zhPage: true },
      { title: "Registries", zh: "注册表", href: "api-registries/", zhPage: true },
    ],
  },
  {
    title: "About",
    zh: "关于",
    han: "誌",
    items: [
      { title: "Changelog", zh: "更新日志", href: "changelog/", zhPage: true },
      { title: "Compatibility", zh: "模组兼容", href: "compatibility/", zhPage: true },
      { title: "Placeholders", zh: "占位符", href: "placeholders/", zhPage: true },
      { title: "Compatible Mods", zh: "兼容模组", href: "addons/", zhPage: true },
    ],
  },
];

/** Display label for an item in the given language. */
export function labelFor(item: NavItem, lang: Lang): string {
  return lang === "zh" && item.zh ? item.zh : item.title;
}

/**
 * Resolve a language-neutral nav href to a real, root-absolute URL.
 *
 * A Chinese reader on a page with no translation is sent to the English page
 * rather than to a zh/ URL that would 404 — the same fallback site.js applied.
 */
export function hrefFor(item: NavItem, lang: Lang): string {
  const slug = item.href === "./" ? "" : item.href;
  if (lang === "zh" && item.zhPage) return `/zh/${slug}`;
  return `/${slug}`;
}

/** True when the item is readable in `lang`; false means "English only, so far". */
export function hasTranslation(item: NavItem, lang: Lang): boolean {
  return lang !== "zh" || !!item.zhPage;
}

/** Every nav item flattened into sidebar order, deduped — drives prev/next. */
export function flatItems(): NavItem[] {
  const seen = new Set<string>();
  const out: NavItem[] = [];
  for (const section of SECTIONS) {
    for (const item of section.items) {
      if (seen.has(item.href)) continue;
      seen.add(item.href);
      out.push(item);
    }
  }
  return out;
}

/** The sidebar group a slug belongs to, for breadcrumbs and search results. */
export function sectionForSlug(slug: string): NavSection | undefined {
  const href = slug === "" ? "./" : `${slug}/`;
  return SECTIONS.find((s) => s.items.some((i) => i.href === href));
}

/** Neighbours of a slug in flattened sidebar order. */
export function neighbours(slug: string): { prev?: NavItem; next?: NavItem } {
  const flat = flatItems();
  const href = slug === "" ? "./" : `${slug}/`;
  const idx = flat.findIndex((i) => i.href === href);
  if (idx < 0) return {};
  return { prev: flat[idx - 1], next: flat[idx + 1] };
}
