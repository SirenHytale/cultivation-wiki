"use client";

import { useEffect, useId, useState } from "react";

/* Diagram themes, lifted from the static site's mermaidVars() so the palettes
   still match the Yin / Yang stylesheet exactly. */
const DARK_VARS = {
  background: "#1D0D07",
  primaryColor: "#2C130A",
  primaryTextColor: "#E4D6B0",
  primaryBorderColor: "#C9A227",
  lineColor: "#8C6B1F",
  secondaryColor: "#35100B",
  tertiaryColor: "#241009",
  mainBkg: "#2C130A",
  nodeBorder: "#C9A227",
  clusterBkg: "#150904",
  clusterBorder: "#5C1712",
  titleColor: "#F6D77B",
  edgeLabelBackground: "#1D0D07",
  textColor: "#E4D6B0",
  fontSize: "15px",
};

const LIGHT_VARS = {
  background: "#F7EDD8",
  primaryColor: "#EFE1C4",
  primaryTextColor: "#35211A",
  primaryBorderColor: "#8A2B14",
  lineColor: "#8A5A12",
  secondaryColor: "#E7D7B6",
  tertiaryColor: "#FBF5E7",
  mainBkg: "#EFE1C4",
  nodeBorder: "#8A2B14",
  clusterBkg: "#EADBBB",
  clusterBorder: "#8A5A12",
  titleColor: "#6B1F12",
  edgeLabelBackground: "#F7EDD8",
  textColor: "#35211A",
  fontSize: "15px",
};

/**
 * A mermaid diagram.
 *
 * The static site pulled a multi-megabyte UMD bundle from a CDN via a plain
 * <script> tag. Here mermaid is an npm dependency loaded through a dynamic
 * import, so it is code-split into its own chunk, versioned with the lockfile,
 * and never requested on the ~80 pages that have no diagram.
 */
export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const [svg, setSvg] = useState<string>("");
  // useId rather than a module counter: mermaid needs a unique DOM id per
  // diagram, and a counter incremented during render is a side effect that
  // desyncs between the server and client passes.
  const baseId = `mmd${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const light = document.documentElement.getAttribute("data-theme") === "light";
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "loose",
        fontFamily: 'ui-sans-serif, system-ui, "Segoe UI", sans-serif',
        themeVariables: light ? LIGHT_VARS : DARK_VARS,
        flowchart: { curve: "basis", padding: 14, useMaxWidth: true },
      });
      try {
        const { svg: out } = await mermaid.render(`${baseId}-${light ? "l" : "d"}`, chart);
        if (!cancelled) setSvg(out);
      } catch (err) {
        console.warn("[wiki] mermaid render failed:", err);
      }
    }

    void render();
    const onTheme = () => void render();
    window.addEventListener("wiki:themechange", onTheme);
    return () => {
      cancelled = true;
      window.removeEventListener("wiki:themechange", onTheme);
    };
  }, [chart, baseId]);

  // A <pre class="mermaid"> rather than a div: the stylesheet already fades
  // one in on data-processed and forces its SVG to fill the frame (mermaid
  // writes an inline max-width that otherwise leaves diagrams marooned).
  return (
    <div className="mermaid-wrap">
      <pre
        className="mermaid"
        data-processed={svg ? "true" : undefined}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && <span className="mermaid-cap">{caption}</span>}
    </div>
  );
}
