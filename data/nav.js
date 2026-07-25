/* ---------------------------------------------------------------------------
   Site navigation — single source of truth for the top bar AND the sidebar.
   Loaded as a plain <script> rather than fetch'd JSON — one less request and
   no CORS/MIME surprises on a static host.

   Pages serve at clean URLs: docs/<slug>/index.html is reached as
   "docs/<slug>/", so every href here ends in a slash and never ".html".

   Add a page:  create docs/<slug>/index.html, add one line here, then rerun
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
    { title: "Getting Started", href: "docs/getting-started/" },
    { title: "Realms",          href: "docs/realms/" },
    { title: "Commands",        href: "docs/commands/" },
    { title: "API",             href: "docs/api/" }
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
        { title: "Getting Started",  href: "docs/getting-started/" },
        { title: "Commands",         href: "docs/commands/" },
        { title: "Permissions",      href: "docs/permissions/" }
      ]
    },
    {
      title: "The Path", han: "道",
      items: [
        { title: "Realms & Stages",  href: "docs/realms/" },
        { title: "Qi Gathering",     href: "docs/qi-gathering/" },
        { title: "Tribulations",     href: "docs/tribulations/" },
        { title: "Races",            href: "docs/races/" },
        { title: "Skill Tree",       href: "docs/skilltree/" },
        { title: "The Dao",          href: "docs/dao/" },
        { title: "Karma",            href: "docs/karma/" }
      ]
    },
    {
      title: "Arts & Treasures", han: "術",
      items: [
        { title: "Techniques",        href: "docs/techniques/" },
        { title: "Manuals",           href: "docs/manuals/" },
        { title: "Alchemy",           href: "docs/alchemy/" },
        { title: "Weapon Refinement", href: "docs/refinement/" },
        { title: "Life-Bound",        href: "docs/lifebound/" },
        { title: "Spirit Beasts",     href: "docs/beasts/" }
      ]
    },
    {
      title: "The World", han: "界",
      items: [
        { title: "Sects",            href: "docs/sects/" },
        { title: "Formations",       href: "docs/formations/" },
        { title: "Cave Abode",       href: "docs/dwelling/" },
        { title: "Duels",            href: "docs/duels/" },
        { title: "Sect Wars",        href: "docs/wars/" }
      ]
    },
    {
      title: "Configuration", han: "配",
      items: [
        { title: "Overview",         href: "docs/config/" },
        { title: "Core Config",      href: "docs/config-core/" },
        { title: "Cultivation",      href: "docs/config-cultivation/" },
        { title: "Arts",             href: "docs/config-arts/" },
        { title: "Society",          href: "docs/config-society/" },
        { title: "Race",             href: "docs/config-race/" },
        { title: "Data Files",       href: "docs/config-data/" }
      ]
    },
    {
      title: "For Developers", han: "匠",
      items: [
        { title: "API Overview",     href: "docs/api/" },
        { title: "Reference",        href: "docs/api-reference/" },
        { title: "Events",           href: "docs/api-events/" },
        { title: "Add-ons",          href: "docs/api-addons/" },
        { title: "Registries",       href: "docs/api-registries/" }
      ]
    }
  ]
};
