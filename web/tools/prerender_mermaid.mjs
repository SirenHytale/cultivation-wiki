/* Pre-render every mermaid diagram to SVG, once per theme.
 *
 * The static site pulled a multi-megabyte mermaid bundle from a CDN on every
 * page that had a diagram. Bundling it via npm made it code-split, but it was
 * still ~872 KB of JavaScript on the 27 pages that carry one — to draw pictures
 * that never change.
 *
 * Diagrams are static content, so they are rendered here instead and inlined as
 * SVG at build time. Both themes are rendered because the palette differs and
 * the toggle has to be instant; CSS shows one and hides the other, so the
 * runtime cost is zero JavaScript.
 *
 * Run locally after changing any diagram:
 *     npm run diagrams
 *
 * Deliberately NOT part of `next build`: it needs a browser, and keeping it out
 * means Vercel builds stay browser-free. Anything it misses still falls back to
 * the client renderer, so a stale run degrades rather than breaks.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(WEB, "content");
const OUT = path.join(WEB, "lib", "data", "diagrams.json");
const MERMAID = path.join(WEB, "node_modules", "mermaid", "dist", "mermaid.min.js");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const TMP = path.join(WEB, ".mermaid-prerender");

/* Palettes, identical to the ones the client renderer uses. */
const DARK = {
  background: "#1D0D07", primaryColor: "#2C130A", primaryTextColor: "#E4D6B0",
  primaryBorderColor: "#C9A227", lineColor: "#8C6B1F", secondaryColor: "#35100B",
  tertiaryColor: "#241009", mainBkg: "#2C130A", nodeBorder: "#C9A227",
  clusterBkg: "#150904", clusterBorder: "#5C1712", titleColor: "#F6D77B",
  edgeLabelBackground: "#1D0D07", textColor: "#E4D6B0", fontSize: "15px",
};
const LIGHT = {
  background: "#F7EDD8", primaryColor: "#EFE1C4", primaryTextColor: "#35211A",
  primaryBorderColor: "#8A2B14", lineColor: "#8A5A12", secondaryColor: "#E7D7B6",
  tertiaryColor: "#FBF5E7", mainBkg: "#EFE1C4", nodeBorder: "#8A2B14",
  clusterBkg: "#EADBBB", clusterBorder: "#8A5A12", titleColor: "#6B1F12",
  edgeLabelBackground: "#F7EDD8", textColor: "#35211A", fontSize: "15px",
};

/* Hash the chart source, normalized.
 *
 * CR is stripped because the MDX files are written by a Python tool on Windows
 * and therefore carry CRLF, while the MDX parser hands the component LF-only
 * text — without normalizing, the two sides would hash the same diagram
 * differently and every lookup would miss. */
export function chartHash(chart) {
  const normal = chart.replace(/\r/g, "").trim();
  return createHash("sha1").update(normal).digest("hex").slice(0, 16);
}

function collectCharts() {
  const charts = new Map();
  for (const lang of ["en", "zh"]) {
    const dir = path.join(CONTENT, lang);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
      const text = fs.readFileSync(path.join(dir, file), "utf8").replace(/\r/g, "");
      for (const m of text.matchAll(/^```mermaid\n([\s\S]*?)^```/gm)) {
        const chart = m[1].trim();
        if (chart) charts.set(chartHash(chart), chart);
      }
    }
  }
  return charts;
}

function buildPage(charts, vars, suffix) {
  const entries = [...charts.entries()];
  return `<!doctype html><html><head><meta charset="utf-8">
<script src="${pathToFileURL(MERMAID).href}"></script></head>
<body><div id="out"></div><script>
const CHARTS = ${JSON.stringify(entries)};
/* The id must differ per theme. Mermaid scopes the stylesheet it emits to the
   svg's own id, and both variants live in the same document — reuse one id and
   the second <style> block repaints the first (visible) diagram in the wrong
   palette. */
const SUFFIX = ${JSON.stringify(suffix)};
mermaid.initialize({
  startOnLoad: false, theme: "base", securityLevel: "loose",
  fontFamily: 'ui-sans-serif, system-ui, "Segoe UI", sans-serif',
  themeVariables: ${JSON.stringify(vars)},
  flowchart: { curve: "basis", padding: 14, useMaxWidth: true }
});
(async () => {
  const result = {};
  for (const [id, src] of CHARTS) {
    try {
      const { svg } = await mermaid.render("d" + id + SUFFIX, src);
      result[id] = svg;
    } catch (e) {
      result[id] = null;
      console.error("FAILED " + id + ": " + e.message);
    }
  }
  const holder = document.createElement("script");
  holder.id = "result";
  holder.type = "application/json";
  holder.textContent = JSON.stringify(result);
  document.body.appendChild(holder);
  document.title = "done-" + Object.keys(result).length;
})();
</script></body></html>`;
}

function renderTheme(charts, vars, label) {
  fs.mkdirSync(TMP, { recursive: true });
  const page = path.join(TMP, `${label}.html`);
  fs.writeFileSync(page, buildPage(charts, vars, label), "utf8");

  const dom = execFileSync(
    EDGE,
    [
      "--headless=new", "--disable-gpu", "--no-sandbox",
      `--user-data-dir=${path.join(TMP, `profile-${label}`)}`,
      "--allow-file-access-from-files",
      "--virtual-time-budget=60000",
      "--dump-dom", pathToFileURL(page).href,
    ],
    { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
  );

  const match = dom.match(
    /<script id="result" type="application\/json">([\s\S]*?)<\/script>/,
  );
  if (!match) throw new Error(`${label}: renderer produced no result block`);
  return JSON.parse(match[1]);
}

function main() {
  if (!fs.existsSync(MERMAID)) {
    console.error("mermaid dist not found - run npm install in web/ first");
    process.exit(1);
  }
  const charts = collectCharts();
  console.log(`found ${charts.size} unique diagrams`);
  if (!charts.size) return;

  const dark = renderTheme(charts, DARK, "dark");
  const light = renderTheme(charts, LIGHT, "light");

  const out = {};
  let ok = 0;
  const failed = [];
  for (const id of charts.keys()) {
    if (dark[id] && light[id]) {
      out[id] = { dark: dark[id], light: light[id] };
      ok += 1;
    } else {
      failed.push(id);
    }
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out), "utf8");
  fs.rmSync(TMP, { recursive: true, force: true });

  const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(`prerendered ${ok}/${charts.size} diagrams -> ${kb} KB`);
  if (failed.length) {
    console.log(`  ${failed.length} fell back to the client renderer:`);
    for (const id of failed) console.log(`  - ${id}`);
  }
}

main();
