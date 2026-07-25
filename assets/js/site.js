/* ---------------------------------------------------------------------------
   Cultivation Wiki — site engine.

   Every page ships only its own <main> content. This file injects the shared
   header, sidebar, footer and search modal from data/nav.js, so the chrome
   lives in exactly one place and a new page is just content + one nav.js line.

   Deliberately dependency-free and build-free: it runs identically from
   file:// (double-click preview) and from GitHub Pages.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  var SITE = window.SITE || { sections: [], primary: [], external: [] };
  var ROOT = document.documentElement.getAttribute("data-root") || "";
  var STORE_KEY = "cultivation-wiki-theme";

  function url(href) {
    return /^https?:/i.test(href) ? href : ROOT + href;
  }
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  /* Resolve a nav href and the current location to comparable paths. */
  function samePage(href) {
    try {
      var a = new URL(url(href), location.href).pathname.replace(/\/index\.html$/, "/");
      var b = location.pathname.replace(/\/index\.html$/, "/");
      return a === b;
    } catch (e) { return false; }
  }

  /* ---------- Icons ------------------------------------------------------ */
  var ICON = {
    search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>',
    menu:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    /* taiji — the theme toggle */
    taiji:  '<svg width="17" height="17" viewBox="0 0 100 100" fill="currentColor"><path d="M50 2a48 48 0 100 96 48 48 0 000-96zm0 8a40 40 0 010 80 20 20 0 010-40 20 20 0 000-40z"/><circle cx="50" cy="30" r="6"/><circle cx="50" cy="70" r="6" fill="none" stroke="currentColor" stroke-width="5"/></svg>'
  };

  /* ---------- Header ----------------------------------------------------- */
  function buildHeader() {
    var mount = document.getElementById("site-header");
    if (!mount) return;

    var primary = SITE.primary.map(function (it) {
      return '<a class="nav-link' + (samePage(it.href) ? " is-active" : "") + '" href="' + url(it.href) + '">' + esc(it.title) + "</a>";
    }).join("");

    var header = el(
      '<header class="site-header">' +
        '<button class="icon-btn menu-toggle" aria-label="Open navigation" aria-expanded="false">' + ICON.menu + "</button>" +
        '<a class="brand" href="' + url("index.html") + '">' +
          '<img src="' + url("assets/img/logo.png") + '" alt="" width="34" height="34">' +
          '<span class="brand-text">' +
            '<span class="brand-name">' + esc(SITE.title) + "</span>" +
            '<span class="brand-sub han">' + esc(SITE.han) + "</span>" +
          "</span>" +
        "</a>" +
        '<nav class="nav-main" aria-label="Primary">' + primary + "</nav>" +
        '<div class="header-tools">' +
          '<button class="search-trigger" aria-label="Search the wiki">' +
            ICON.search +
            '<span class="label">Search the wiki…</span>' +
            '<span class="kbd kbd-hint">Ctrl K</span>' +
          "</button>" +
          '<button class="icon-btn theme-toggle" aria-label="Toggle day / night theme" title="Yin / Yang">' + ICON.taiji + "</button>" +
        "</div>" +
      "</header>"
    );
    mount.replaceWith(header);
  }

  /* ---------- Sidebar ---------------------------------------------------- */
  function buildSidebar() {
    var mount = document.getElementById("site-sidebar");
    if (!mount) return;

    var groups = SITE.sections.map(function (sec) {
      var items = sec.items.map(function (it) {
        if (it.soon) {
          return '<li><a class="is-soon" aria-disabled="true" title="Not written yet">' +
                 esc(it.title) + '<span class="soon">soon</span></a></li>';
        }
        return '<li><a href="' + url(it.href) + '"' + (samePage(it.href) ? ' class="is-current" aria-current="page"' : "") + ">" +
               esc(it.title) + "</a></li>";
      }).join("");

      return '<div class="side-group">' +
               '<h4 class="side-title">' + esc(sec.title) +
                 '<span class="han-dim">' + esc(sec.han || "") + "</span>" +
               "</h4>" +
               '<ul class="side-list">' + items + "</ul>" +
             "</div>";
    }).join("");

    var aside = el('<aside class="sidebar" id="sidebar" aria-label="Wiki sections">' + groups + "</aside>");
    mount.replaceWith(aside);

    /* "soon" rows are inert */
    aside.querySelectorAll("a.is-soon").forEach(function (a) {
      a.style.opacity = "0.42";
      a.style.cursor = "not-allowed";
      a.addEventListener("click", function (e) { e.preventDefault(); });
    });

    /* Mobile drawer */
    var scrim = el('<div class="scrim"></div>');
    document.body.appendChild(scrim);
    var toggle = document.querySelector(".menu-toggle");
    function setOpen(open) {
      aside.classList.toggle("is-open", open);
      scrim.classList.toggle("is-open", open);
      if (toggle) toggle.setAttribute("aria-expanded", String(open));
    }
    if (toggle) toggle.addEventListener("click", function () { setOpen(!aside.classList.contains("is-open")); });
    scrim.addEventListener("click", function () { setOpen(false); });
    aside.addEventListener("click", function (e) { if (e.target.closest("a[href]")) setOpen(false); });

    /* Keep the current page visible in a long sidebar */
    var cur = aside.querySelector(".is-current");
    if (cur && cur.offsetTop > aside.clientHeight - 90) {
      aside.scrollTop = cur.offsetTop - aside.clientHeight / 2;
    }
  }

  /* ---------- Footer ----------------------------------------------------- */
  function buildFooter() {
    var mount = document.getElementById("site-footer");
    if (!mount) return;

    var cols = SITE.sections.slice(0, 3).map(function (sec) {
      var links = sec.items.filter(function (i) { return !i.soon; }).slice(0, 5).map(function (i) {
        return '<li><a href="' + url(i.href) + '">' + esc(i.title) + "</a></li>";
      }).join("");
      return '<div class="footer-col"><h5>' + esc(sec.title).toUpperCase() + "</h5><ul>" + links + "</ul></div>";
    }).join("");

    var ext = (SITE.external || []).map(function (i) {
      return '<li><a href="' + i.href + '" rel="noopener">' + esc(i.title) + "</a></li>";
    }).join("");

    var footer = el(
      '<footer class="site-footer">' +
        '<div class="footer-inner">' +
          cols +
          '<div class="footer-col"><h5>ELSEWHERE</h5><ul>' + ext + "</ul></div>" +
          '<div class="footer-seal">' +
            '<div class="big han">道法自然</div>' +
            "<div>Cultivation " + esc(SITE.version) + " &middot; a Hytale mod</div>" +
            "<div>&copy; " + new Date().getFullYear() + " " + esc(SITE.owner || "Siren") +
              ". All rights reserved.</div>" +
          "</div>" +
        "</div>" +
      "</footer>"
    );
    mount.replaceWith(footer);
  }

  /* ---------- Table of contents + scroll spy ----------------------------- */
  function buildToc() {
    var mount = document.getElementById("site-toc");
    var main = document.querySelector("main.content");
    if (!mount || !main) return;

    var heads = Array.prototype.slice.call(main.querySelectorAll("h2, h3"));
    heads.forEach(function (h, i) {
      if (!h.id) {
        h.id = (h.textContent || "s")
          .toLowerCase().trim()
          .replace(/[^\w一-鿿]+/g, "-")
          .replace(/^-+|-+$/g, "") || "section-" + i;
      }
      /* clickable heading anchor */
      var a = document.createElement("a");
      a.className = "heading-anchor";
      a.href = "#" + h.id;
      a.setAttribute("aria-label", "Link to this section");
      a.textContent = "§";
      h.appendChild(a);
    });

    if (heads.length < 2) { mount.remove(); return; }

    var items = heads.map(function (h) {
      return '<li class="lvl-' + h.tagName[1] + '"><a href="#' + h.id + '">' +
             esc(h.textContent.replace(/§$/, "").trim()) + "</a></li>";
    }).join("");

    var toc = el('<nav class="toc" aria-label="On this page">' +
                   '<div class="toc-title">On this page</div><ul>' + items + "</ul></nav>");
    mount.replaceWith(toc);

    var links = Array.prototype.slice.call(toc.querySelectorAll("a"));
    var spy = null;
    if ("IntersectionObserver" in window) {
      spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) {
            l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id);
          });
        });
      }, { rootMargin: "-12% 0px -76% 0px", threshold: 0 });
      heads.forEach(function (h) { spy.observe(h); });
    }
  }

  /* ---------- Theme (Yin / Yang) ----------------------------------------- */
  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(STORE_KEY); } catch (e) {}
    var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    setTheme(stored || (prefersLight ? "light" : "dark"), false);

    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        setTheme(next, true);
      });
    }
  }
  function setTheme(name, persist) {
    document.documentElement.setAttribute("data-theme", name);
    if (persist) { try { localStorage.setItem(STORE_KEY, name); } catch (e) {} }
    renderMermaid();
  }

  /* ---------- Search ----------------------------------------------------- */
  function initSearch() {
    var index = window.SEARCH_INDEX || [];

    var overlay = el(
      '<div class="search-overlay" role="dialog" aria-modal="true" aria-label="Search the wiki">' +
        '<div class="search-box">' +
          '<div class="search-field">' + ICON.search +
            '<input type="search" placeholder="Search realms, Qi, commands…" autocomplete="off" spellcheck="false" aria-label="Search query">' +
          "</div>" +
          '<div class="search-results" role="listbox"></div>' +
          '<div class="search-foot">' +
            '<span><span class="kbd">↑</span><span class="kbd">↓</span> navigate</span>' +
            '<span><span class="kbd">↵</span> open</span>' +
            '<span><span class="kbd">Esc</span> close</span>' +
          "</div>" +
        "</div>" +
      "</div>"
    );
    document.body.appendChild(overlay);

    var input = overlay.querySelector("input");
    var results = overlay.querySelector(".search-results");
    var sel = 0, hits = [];

    function open() {
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      input.value = "";
      render("");
      setTimeout(function () { input.focus(); }, 30);
    }
    function close() {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    function score(entry, terms) {
      var title = entry.t.toLowerCase();
      var head = (entry.h || "").toLowerCase();
      var body = (entry.x || "").toLowerCase();
      var total = 0;
      for (var i = 0; i < terms.length; i++) {
        var q = terms[i], s = 0;
        if (title.indexOf(q) === 0) s += 120;
        else if (title.indexOf(q) > -1) s += 70;
        if (head.indexOf(q) > -1) s += 45;
        var n = body.split(q).length - 1;
        if (n) s += Math.min(30, 8 + n * 3);
        if (!s) return 0;              /* every term must appear somewhere */
        total += s;
      }
      return total;
    }

    function snippet(text, terms) {
      var low = text.toLowerCase(), at = -1;
      for (var i = 0; i < terms.length && at < 0; i++) at = low.indexOf(terms[i]);
      if (at < 0) at = 0;
      var start = Math.max(0, at - 70);
      var frag = (start ? "…" : "") + text.slice(start, start + 190) + "…";
      return esc(frag).replace(new RegExp("(" + terms.map(function (t) {
        return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }).join("|") + ")", "gi"), "<mark>$1</mark>");
    }

    function render(q) {
      var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) {
        hits = [];
        results.innerHTML =
          '<div class="search-empty"><span class="han">尋</span>' +
          "Search across every page of the wiki.</div>";
        return;
      }
      hits = index.map(function (e) { return { e: e, s: score(e, terms) }; })
                  .filter(function (r) { return r.s > 0; })
                  .sort(function (a, b) { return b.s - a.s; })
                  .slice(0, 24);

      if (!hits.length) {
        results.innerHTML =
          '<div class="search-empty"><span class="han">無</span>' +
          "No results for <strong>" + esc(q) + "</strong>.</div>";
        return;
      }
      sel = 0;
      results.innerHTML = hits.map(function (r, i) {
        var e = r.e;
        return '<a class="search-hit' + (i === 0 ? " is-sel" : "") + '" href="' + url(e.u) + '" role="option">' +
                 '<div class="hit-crumb">' + esc(e.s || "Wiki") + "</div>" +
                 '<div class="hit-title">' + esc(e.t) + "</div>" +
                 (e.x ? '<div class="hit-snip">' + snippet(e.x, terms) + "</div>" : "") +
               "</a>";
      }).join("");
    }

    function move(delta) {
      var nodes = results.querySelectorAll(".search-hit");
      if (!nodes.length) return;
      nodes[sel] && nodes[sel].classList.remove("is-sel");
      sel = (sel + delta + nodes.length) % nodes.length;
      nodes[sel].classList.add("is-sel");
      nodes[sel].scrollIntoView({ block: "nearest" });
    }

    input.addEventListener("input", function () { render(input.value); });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });

    overlay.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") {
        var n = results.querySelectorAll(".search-hit")[sel];
        if (n) { e.preventDefault(); location.href = n.getAttribute("href"); }
      }
    });

    document.addEventListener("keydown", function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open(); }
      else if (e.key === "/" && !typing && !overlay.classList.contains("is-open")) { e.preventDefault(); open(); }
    });

    var trig = document.querySelector(".search-trigger");
    if (trig) trig.addEventListener("click", open);

    if (!index.length) {
      console.warn("[wiki] search index is empty — run: python tools/build_index.py");
    }
  }

  /* ---------- Mermaid ---------------------------------------------------- */
  function mermaidVars() {
    var light = document.documentElement.getAttribute("data-theme") === "light";
    return light ? {
      background: "#F7EDD8", primaryColor: "#EFE1C4", primaryTextColor: "#35211A",
      primaryBorderColor: "#8A2B14", lineColor: "#8A5A12", secondaryColor: "#E7D7B6",
      tertiaryColor: "#FBF5E7", mainBkg: "#EFE1C4", nodeBorder: "#8A2B14",
      clusterBkg: "#EADBBB", clusterBorder: "#8A5A12", titleColor: "#6B1F12",
      edgeLabelBackground: "#F7EDD8", textColor: "#35211A", fontSize: "15px"
    } : {
      background: "#1D0D07", primaryColor: "#2C130A", primaryTextColor: "#E4D6B0",
      primaryBorderColor: "#C9A227", lineColor: "#8C6B1F", secondaryColor: "#35100B",
      tertiaryColor: "#241009", mainBkg: "#2C130A", nodeBorder: "#C9A227",
      clusterBkg: "#150904", clusterBorder: "#5C1712", titleColor: "#F6D77B",
      edgeLabelBackground: "#1D0D07", textColor: "#E4D6B0", fontSize: "15px"
    };
  }

  function renderMermaid() {
    if (!window.mermaid) return;
    var blocks = document.querySelectorAll("pre.mermaid");
    if (!blocks.length) return;

    /* Stash the source once so a theme switch can re-render from it. */
    blocks.forEach(function (b) {
      if (!b.hasAttribute("data-src")) b.setAttribute("data-src", b.textContent.trim());
      b.removeAttribute("data-processed");
      b.innerHTML = b.getAttribute("data-src");
    });

    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "loose",
        fontFamily: 'ui-sans-serif, system-ui, "Segoe UI", sans-serif',
        themeVariables: mermaidVars(),
        flowchart: { curve: "basis", padding: 14, useMaxWidth: true }
      });
      window.mermaid.run({ nodes: blocks });
    } catch (err) {
      console.warn("[wiki] mermaid render failed:", err);
    }
  }
  window.renderMermaid = renderMermaid;

  /* ---------- Qi motes (hero canvas) ------------------------------------- */
  function initMotes() {
    var canvas = document.querySelector("canvas.hero-motes");
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var ctx = canvas.getContext("2d");
    var motes = [], raf = null, w = 0, h = 0;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      var n = Math.round(Math.min(70, Math.max(24, w / 18)));
      motes = [];
      for (var i = 0; i < n; i++) {
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 1.9,
          vy: -(0.10 + Math.random() * 0.34),
          vx: (Math.random() - 0.5) * 0.18,
          a: 0.16 + Math.random() * 0.55,
          p: Math.random() * Math.PI * 2,
          sp: 0.006 + Math.random() * 0.018
        });
      }
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.p += m.sp;
        m.y += m.vy;
        m.x += m.vx + Math.sin(m.p) * 0.22;
        if (m.y < -12) { m.y = h + 10; m.x = Math.random() * w; }
        if (m.x < -12) m.x = w + 10;
        if (m.x > w + 12) m.x = -10;

        var pulse = m.a * (0.62 + 0.38 * Math.sin(m.p * 1.7));
        var g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 5);
        g.addColorStop(0, "rgba(246, 215, 123, " + pulse.toFixed(3) + ")");
        g.addColorStop(0.4, "rgba(224, 180, 76, " + (pulse * 0.32).toFixed(3) + ")");
        g.addColorStop(1, "rgba(224, 180, 76, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    size(); seed(); frame();

    var t = null;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () { size(); seed(); }, 160);
    });
    /* Stop burning cycles when the hero is off-screen or the tab is hidden. */
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) frame();
    });
  }

  /* ---------- Misc ------------------------------------------------------- */
  function wrapTables() {
    document.querySelectorAll("main.content table").forEach(function (t) {
      if (t.parentElement && t.parentElement.classList.contains("table-wrap")) return;
      var w = document.createElement("div");
      w.className = "table-wrap";
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }

  /* Prev / next from the flattened sidebar order. */
  function buildPageNav() {
    var main = document.querySelector("main.content");
    if (!main || main.querySelector(".page-nav")) return;
    var flat = [];
    SITE.sections.forEach(function (s) {
      s.items.forEach(function (i) { if (!i.soon && !flat.some(function (f) { return f.href === i.href; })) flat.push(i); });
    });
    var idx = flat.findIndex(function (i) { return samePage(i.href); });
    if (idx < 0) return;
    var prev = flat[idx - 1], next = flat[idx + 1];
    if (!prev && !next) return;

    var html = '<nav class="page-nav" aria-label="Page navigation">';
    if (prev) html += '<a class="prev" href="' + url(prev.href) + '"><span class="dir">← Previous</span><span class="ttl">' + esc(prev.title) + "</span></a>";
    if (next) html += '<a class="next" href="' + url(next.href) + '"><span class="dir">Next →</span><span class="ttl">' + esc(next.title) + "</span></a>";
    main.appendChild(el(html + "</nav>"));
  }

  function boot() {
    buildHeader();
    buildSidebar();
    buildToc();
    wrapTables();
    buildPageNav();
    buildFooter();
    initTheme();
    initSearch();
    initMotes();
    renderMermaid();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
