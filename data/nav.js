/* ---------------------------------------------------------------------------
   Site navigation — single source of truth for the top bar AND the sidebar.
   Loaded as a plain <script> rather than fetch'd JSON — one less request and
   no CORS/MIME surprises on a static host.

   Pages serve at clean URLs: <slug>/index.html is reached as
   "<slug>/", so every href here ends in a slash and never ".html".

   Add a page:  create <slug>/index.html, add one line here, then rerun
                python tools/build_index.py
   Preview:     python tools/serve.py   (file:// cannot resolve directory URLs)
   `soon: true` renders a greyed "soon" row instead of a link, so an
   unwritten page never 404s.
--------------------------------------------------------------------------- */

window.SITE = {
  title: "Cultivation",
  tagline: "Hytale Mod Wiki",
  han: "修仙",
  version: "v0.5.0",
  owner: "Siren",          // shown in the footer copyright line

  /* Top navigation bar */
  primary: [
    { title: "Home",            href: "./" },
    { title: "Getting Started", href: "getting-started/" },
    { title: "Realms",          href: "realms/" },
    { title: "Commands",        href: "commands/" },
    { title: "API",             href: "api/" }
  ],

  /* External links (rendered in the footer) */
  external: [
    { title: "CurseForge", href: "https://www.curseforge.com/hytale/mods/cultivation/" },
    { title: "Download",   href: "https://www.curseforge.com/hytale/mods/cultivation/download" },
    { title: "Source",     href: "https://github.com/meFroggy/Cultivation" },
    { title: "HStats",     href: "https://hstats.dev/mods/828f65ac-8c45-4510-893b-cc90cd9734aa" }
  ],

  /* Sidebar sections */
  sections: [
    {
      title: "Start Here", han: "起",
      items: [
        { title: "Home",             href: "./" },
        { title: "Getting Started",  href: "getting-started/" },
        { title: "Commands",         href: "commands/" },
        { title: "Permissions",      href: "permissions/" }
      ]
    },
    {
      title: "The Path", han: "道",
      items: [
        { title: "Realms & Stages",  href: "realms/" },
        { title: "Qi Gathering",     href: "qi-gathering/" },
        { title: "Tribulations",     href: "tribulations/" },
        { title: "Races",            href: "races/" },
        { title: "Skill Tree",       href: "skilltree/" },
        { title: "The Dao",          href: "dao/" },
        { title: "Karma",            href: "karma/" }
      ]
    },
    {
      title: "Arts & Treasures", han: "術",
      items: [
        { title: "Techniques",        href: "techniques/" },
        { title: "Manuals",           href: "manuals/" },
        { title: "Alchemy",           href: "alchemy/" },
        { title: "Weapon Refinement", href: "refinement/" },
        { title: "Life-Bound",        href: "lifebound/" },
        { title: "Spirit Beasts",     href: "beasts/" }
      ]
    },
    {
      title: "The World", han: "界",
      items: [
        { title: "Sects",            href: "sects/" },
        { title: "Formations",       href: "formations/" },
        { title: "Cave Abode",       href: "dwelling/" },
        { title: "Duels",            href: "duels/" },
        { title: "Sect Wars",        href: "wars/" }
      ]
    },
    {
      title: "Configuration", han: "配",
      items: [
        { title: "Overview",         href: "config/" },
        { title: "Core Config",      href: "config-core/" },
        { title: "Cultivation",      href: "config-cultivation/" },
        { title: "Arts",             href: "config-arts/" },
        { title: "Society",          href: "config-society/" },
        { title: "Race",             href: "config-race/" },
        { title: "Data Files",       href: "config-data/" }
      ]
    },
    {
      title: "For Developers", han: "匠",
      items: [
        { title: "API Overview",     href: "api/" },
        { title: "Reference",        href: "api-reference/" },
        { title: "Events",           href: "api-events/" },
        { title: "Add-ons",          href: "api-addons/" },
        { title: "Registries",       href: "api-registries/" }
      ]
    }
  ]
};
