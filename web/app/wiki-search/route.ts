import { NextResponse } from "next/server";
import { runSearch } from "@/lib/search";
import type { Lang } from "@/lib/nav";

/* Deliberately NOT under /api — that prefix is reserved for the wiki's own
   published JSON endpoints (/api/get/version/*.json), which deployed mods poll
   for update and compat checks. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUERY = 120;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").slice(0, MAX_QUERY).trim();
  const lang: Lang = searchParams.get("lang") === "zh" ? "zh" : "en";

  if (!query) {
    return NextResponse.json({ hits: [] }, { headers: { "cache-control": "no-store" } });
  }

  const hits = runSearch(query, lang).map((hit) => ({
    u: hit.u,
    t: hit.t,
    s: hit.s,
    snippet: hit.snippet,
  }));

  return NextResponse.json(
    { hits },
    {
      headers: {
        // Queries repeat heavily and the corpus only changes on redeploy, so
        // let the edge answer most of them without waking a function.
        "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
