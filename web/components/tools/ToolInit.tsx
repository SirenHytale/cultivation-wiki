"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/nav";

/**
 * Boots one of the interactive tools once its markup is mounted.
 *
 * The tool module is pulled in with a dynamic import so its logic and the
 * 25 KB skill-tree dataset are code-split into a chunk only these two routes
 * ever request — on the static site both were plain <script> tags.
 */
export function ToolInit({ tool, lang }: { tool: "planner" | "calculator"; lang: Lang }) {
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const mod =
        tool === "planner"
          ? await import("@/lib/tools/planner.js")
          : await import("@/lib/tools/calculator.js");
      if (cancelled) return;
      try {
        mod.init(lang);
      } catch (err) {
        console.error(`[wiki] ${tool} failed to start:`, err);
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [tool, lang]);

  return null;
}
