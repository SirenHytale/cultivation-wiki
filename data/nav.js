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

  /* Top navigation bar */
  primary: [
    { title: "Home",            href: "index.html" },
    { title: "Getting Started", href: "docs/getting-started.html" },
    { title: "Realms",          href: "docs/realms.html" },
    { title: "Qi Gathering",    href: "docs/qi-gathering.html" }
  ],

  /* External links (rendered on the right of the top bar and in the footer) */
  external: [
    { title: "CurseForge", href: "https://www.curseforge.com/" },
    { title: "GitHub",     href: "https://github.com/" }
  ],

  /* Sidebar sections */
  sections: [
    {
      title: "Start Here", han: "起",
      items: [
        { title: "Home",             href: "index.html" },
        { title: "Getting Started",  href: "docs/getting-started.html" },
        { title: "Commands",         href: "docs/commands.html",      soon: true },
        { title: "Permissions",      href: "docs/permissions.html",   soon: true },
        { title: "Configuration",    href: "docs/config.html",        soon: true }
      ]
    },
    {
      title: "The Path", han: "道",
      items: [
        { title: "Realms & Stages",  href: "docs/realms.html" },
        { title: "Qi Gathering",     href: "docs/qi-gathering.html" },
        { title: "Tribulations",     href: "docs/tribulations.html",  soon: true },
        { title: "Races",            href: "docs/races.html",         soon: true },
        { title: "Skill Tree",       href: "docs/skilltree.html",     soon: true },
        { title: "The Dao",          href: "docs/dao.html",           soon: true },
        { title: "Karma",            href: "docs/karma.html",         soon: true }
      ]
    },
    {
      title: "Arts & Treasures", han: "術",
      items: [
        { title: "Techniques",       href: "docs/techniques.html",    soon: true },
        { title: "Manuals",          href: "docs/manuals.html",       soon: true },
        { title: "Alchemy",          href: "docs/alchemy.html",       soon: true },
        { title: "Weapon Refinement",href: "docs/refinement.html",    soon: true },
        { title: "Life-Bound",       href: "docs/lifebound.html",     soon: true },
        { title: "Spirit Beasts",    href: "docs/beasts.html",        soon: true }
      ]
    },
    {
      title: "The World", han: "界",
      items: [
        { title: "Sects",            href: "docs/sects.html",         soon: true },
        { title: "Formations",       href: "docs/formations.html",    soon: true },
        { title: "Cave Abode",       href: "docs/dwelling.html",      soon: true },
        { title: "Duels",            href: "docs/duels.html",         soon: true },
        { title: "Sect Wars",        href: "docs/wars.html",          soon: true }
      ]
    },
    {
      title: "For Developers", han: "匠",
      items: [
        { title: "API Overview",     href: "docs/api.html",           soon: true },
        { title: "Events",           href: "docs/api-events.html",    soon: true },
        { title: "Add-ons",          href: "docs/api-addons.html",    soon: true },
        { title: "Registries",       href: "docs/api-registries.html",soon: true }
      ]
    }
  ]
};
