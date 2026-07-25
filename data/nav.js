/* ---------------------------------------------------------------------------
   Site navigation — single source of truth for the top bar AND the sidebar.
   Loaded as a plain <script> (not fetch'd) so the site also works from
   file:// when you double-click index.html to preview it.

   Add a page:  drop the .html in docs/, add one line here, rerun
                python tools/build_index.py
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
    { title: "Home",            href: "index.html" },
    { title: "Getting Started", href: "docs/getting-started.html" },
    { title: "Realms",          href: "docs/realms.html" },
    { title: "Commands",        href: "docs/commands.html" },
    { title: "API",             href: "docs/api.html" }
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
        { title: "Home",             href: "index.html" },
        { title: "Getting Started",  href: "docs/getting-started.html" },
        { title: "Commands",         href: "docs/commands.html" },
        { title: "Permissions",      href: "docs/permissions.html" }
      ]
    },
    {
      title: "The Path", han: "道",
      items: [
        { title: "Realms & Stages",  href: "docs/realms.html" },
        { title: "Qi Gathering",     href: "docs/qi-gathering.html" },
        { title: "Tribulations",     href: "docs/tribulations.html" },
        { title: "Races",            href: "docs/races.html" },
        { title: "Skill Tree",       href: "docs/skilltree.html" },
        { title: "The Dao",          href: "docs/dao.html" },
        { title: "Karma",            href: "docs/karma.html" }
      ]
    },
    {
      title: "Arts & Treasures", han: "術",
      items: [
        { title: "Techniques",        href: "docs/techniques.html" },
        { title: "Manuals",           href: "docs/manuals.html" },
        { title: "Alchemy",           href: "docs/alchemy.html" },
        { title: "Weapon Refinement", href: "docs/refinement.html" },
        { title: "Life-Bound",        href: "docs/lifebound.html" },
        { title: "Spirit Beasts",     href: "docs/beasts.html" }
      ]
    },
    {
      title: "The World", han: "界",
      items: [
        { title: "Sects",            href: "docs/sects.html" },
        { title: "Formations",       href: "docs/formations.html" },
        { title: "Cave Abode",       href: "docs/dwelling.html" },
        { title: "Duels",            href: "docs/duels.html" },
        { title: "Sect Wars",        href: "docs/wars.html" }
      ]
    },
    {
      title: "Configuration", han: "配",
      items: [
        { title: "Overview",         href: "docs/config.html" },
        { title: "Core Config",      href: "docs/config-core.html" },
        { title: "Cultivation",      href: "docs/config-cultivation.html" },
        { title: "Arts",             href: "docs/config-arts.html" },
        { title: "Society",          href: "docs/config-society.html" },
        { title: "Race",             href: "docs/config-race.html" },
        { title: "Data Files",       href: "docs/config-data.html" }
      ]
    },
    {
      title: "For Developers", han: "匠",
      items: [
        { title: "API Overview",     href: "docs/api.html" },
        { title: "Reference",        href: "docs/api-reference.html" },
        { title: "Events",           href: "docs/api-events.html" },
        { title: "Add-ons",          href: "docs/api-addons.html" },
        { title: "Registries",       href: "docs/api-registries.html" }
      ]
    }
  ]
};
