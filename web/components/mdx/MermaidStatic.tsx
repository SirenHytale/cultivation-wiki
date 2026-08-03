import { createHash } from "node:crypto";
import diagrams from "@/lib/data/diagrams.json";
import { Mermaid } from "./Mermaid";

type DiagramMap = Record<string, { dark: string; light: string }>;
const DIAGRAMS = diagrams as DiagramMap;

/** Must match chartHash() in tools/prerender_mermaid.mjs exactly. */
function chartHash(chart: string): string {
  const normal = chart.replace(/\r/g, "").trim();
  return createHash("sha1").update(normal).digest("hex").slice(0, 16);
}

/**
 * A mermaid diagram, drawn at build time.
 *
 * Diagrams never change between requests, so shipping a renderer to draw them
 * in the browser was ~872 KB of JavaScript spent on a fixed picture. Both
 * theme variants are inlined as SVG and CSS shows the right one, which makes
 * the toggle instant and the runtime cost nil.
 *
 * A diagram with no prerendered entry — someone added one without re-running
 * the script — falls back to the client renderer rather than rendering
 * nothing, so the page degrades instead of breaking.
 */
export function MermaidStatic({ chart, caption }: { chart: string; caption?: string }) {
  const entry = DIAGRAMS[chartHash(chart)];

  if (!entry) {
    return <Mermaid chart={chart} caption={caption} />;
  }

  return (
    <div className="mermaid-wrap">
      <pre
        className="mermaid diagram-dark"
        data-processed="true"
        dangerouslySetInnerHTML={{ __html: entry.dark }}
      />
      <pre
        className="mermaid diagram-light"
        data-processed="true"
        dangerouslySetInnerHTML={{ __html: entry.light }}
      />
      {caption && <span className="mermaid-cap">{caption}</span>}
    </div>
  );
}
