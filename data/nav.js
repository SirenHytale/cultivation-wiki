/* ---------------------------------------------------------------------------
   Site navigation — single source of truth for the top bar AND the sidebar,
   in both languages.

   Loaded as a plain <script> rather than fetch'd JSON — one less request and
   no CORS/MIME surprises on a static host.

   Pages serve at clean URLs: <slug>/index.html is reached as "<slug>/", so
   every href here ends in a slash and never ".html". The Chinese site mirrors
   the same slugs under zh/ (zh/realms/), so hrefs stay language-neutral and
   site.js adds the prefix.

   Per item:
     zh      Chinese label — always present, so the zh sidebar reads Chinese
             even for pages whose body is still English.
     zhPage  true ONLY when a translated page exists at zh/<slug>/. Items
             without it link to the English page and are marked "EN".

   Add a page:  create <slug>/index.html, add one line here, then rerun
                python tools/build_index.py
   Preview:     python tools/serve.py   (file:// cannot resolve directory URLs)
--------------------------------------------------------------------------- */

window.SITE = {
  title: "Cultivation",
  tagline: "Hytale Mod Wiki",
  han: "修仙",
  version: "v0.5.1",
  owner: "Siren",          // shown in the footer copyright line

  zhTitle: "修真",
  zhTagline: "Hytale 模组百科",

  /* Chrome strings injected by site.js, per language. */
  ui: {
    en: {
      search: "Search the wiki…",
      searchAria: "Search the wiki",
      searchPlaceholder: "Search realms, Qi, commands…",
      searchEmpty: "Search across every page of the wiki.",
      noResults: "No results for",
      onThisPage: "On this page",
      prev: "← Previous", next: "Next →",
      navigate: "navigate", openHit: "open", closeHit: "close",
      elsewhere: "ELSEWHERE",
      rights: "All rights reserved.",
      aHytaleMod: "a Hytale mod",
      langName: "中文", langSwitch: "Switch to Chinese",
      untranslated: "EN",
      untranslatedTitle: "Not translated yet — opens the English page"
    },
    zh: {
      search: "搜索本站…",
      searchAria: "搜索本站",
      searchPlaceholder: "搜索境界、灵气、指令…",
      searchEmpty: "搜索本站所有页面。",
      noResults: "未找到结果：",
      onThisPage: "本页目录",
      prev: "← 上一页", next: "下一页 →",
      navigate: "选择", openHit: "打开", closeHit: "关闭",
      elsewhere: "相关链接",
      rights: "版权所有。",
      aHytaleMod: "Hytale 模组",
      langName: "English", langSwitch: "切换到英文",
      untranslated: "EN",
      untranslatedTitle: "尚未翻译 —— 将打开英文页面"
    }
  },

  /* Top navigation bar */
  primary: [
    { title: "Home",            zh: "首页",     href: "./",               zhPage: true },
    { title: "Getting Started", zh: "入门",     href: "getting-started/", zhPage: true },
    { title: "Realms",          zh: "境界",     href: "realms/",          zhPage: true },
    { title: "Commands",        zh: "指令",     href: "commands/" },
    { title: "Planner",         zh: "加点模拟", href: "planner/" },
    { title: "FAQ",             zh: "常见问题", href: "faq/" },
    { title: "API",             zh: "接口",     href: "api/" }
  ],

  /* External links (rendered in the footer) */
  external: [
    { title: "CurseForge", href: "https://www.curseforge.com/hytale/mods/cultivation/" },
    { title: "Download",   href: "https://www.curseforge.com/hytale/mods/cultivation/download" },
    { title: "HStats",     href: "https://hstats.dev/mods/828f65ac-8c45-4510-893b-cc90cd9734aa" }
  ],

  /* Sidebar sections */
  sections: [
    {
      title: "Start Here", zh: "由此开始", han: "起",
      items: [
        { title: "Home",                  zh: "首页",           href: "./",               zhPage: true },
        { title: "Getting Started",       zh: "入门指南",       href: "getting-started/", zhPage: true },
        { title: "Commands",              zh: "指令",           href: "commands/" },
        { title: "Permissions",           zh: "权限",           href: "permissions/" },
        { title: "FAQ & Troubleshooting", zh: "常见问题与排错", href: "faq/" },
        { title: "Glossary",              zh: "术语表",         href: "glossary/",        zhPage: true }
      ]
    },
    {
      title: "The Path", zh: "修炼之道", han: "道",
      items: [
        { title: "Realms & Stages",  zh: "境界与阶段", href: "realms/",       zhPage: true },
        { title: "Qi Gathering",     zh: "聚灵采气",   href: "qi-gathering/", zhPage: true },
        { title: "Tribulations",     zh: "天劫",       href: "tribulations/", zhPage: true },
        { title: "Races",            zh: "种族",       href: "races/", zhPage: true },
        { title: "Skill Tree",       zh: "天赋树",     href: "skilltree/", zhPage: true },
        { title: "The Dao",          zh: "大道",       href: "dao/", zhPage: true },
        { title: "Karma",            zh: "业力",       href: "karma/", zhPage: true }
      ]
    },
    {
      title: "Arts & Treasures", zh: "功法与法宝", han: "術",
      items: [
        { title: "Techniques",        zh: "功法",     href: "techniques/" },
        { title: "Manuals",           zh: "秘籍",     href: "manuals/", zhPage: true },
        { title: "Alchemy",           zh: "炼丹",     href: "alchemy/" },
        { title: "Weapon Refinement", zh: "炼器",     href: "refinement/" },
        { title: "Life-Bound",        zh: "本命法宝", href: "lifebound/", zhPage: true },
        { title: "Spirit Beasts",     zh: "灵兽",     href: "beasts/" }
      ]
    },
    {
      title: "The World", zh: "红尘世间", han: "界",
      items: [
        { title: "Sects",      zh: "宗门",     href: "sects/" },
        { title: "Formations", zh: "阵法",     href: "formations/" },
        { title: "Cave Abode", zh: "洞府",     href: "dwelling/" },
        { title: "Duels",      zh: "斗法",     href: "duels/" },
        { title: "Sect Wars",  zh: "宗门攻伐", href: "wars/" }
      ]
    },
    {
      title: "Tools", zh: "工具", han: "器",
      items: [
        { title: "Skill Tree Planner", zh: "天赋加点模拟", href: "planner/" },
        { title: "Qi Calculator",      zh: "灵气计算器",   href: "calculator/" }
      ]
    },
    {
      title: "Configuration", zh: "配置", han: "配",
      items: [
        { title: "Overview",       zh: "总览",     href: "config/" },
        { title: "Core Config",    zh: "核心配置", href: "config-core/" },
        { title: "Cultivation",    zh: "修炼配置", href: "config-cultivation/" },
        { title: "Arts",           zh: "功法配置", href: "config-arts/" },
        { title: "Society",        zh: "宗门社群", href: "config-society/" },
        { title: "Race",           zh: "种族配置", href: "config-race/" },
        { title: "Data Files",     zh: "存档文件", href: "config-data/" },
        { title: "Tuning Presets", zh: "调参预设", href: "presets/" }
      ]
    },
    {
      title: "For Developers", zh: "开发者", han: "匠",
      items: [
        { title: "API Overview",     zh: "接口总览", href: "api/" },
        { title: "Reference",        zh: "接口参考", href: "api-reference/" },
        { title: "Events",           zh: "事件",     href: "api-events/" },
        { title: "Building Add-ons", zh: "编写扩展", href: "api-addons/" },
        { title: "Registries",       zh: "注册表",   href: "api-registries/" }
      ]
    },
    {
      title: "About", zh: "关于", han: "誌",
      items: [
        { title: "Changelog",       zh: "更新日志", href: "changelog/" },
        { title: "Compatible Mods", zh: "兼容模组", href: "addons/" }
      ]
    }
  ]
};
