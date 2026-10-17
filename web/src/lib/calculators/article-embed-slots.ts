import { PAGESPEED_INSIGHTS_EMBED_SLOT } from "@/lib/pagespeed/pagespeed-insights-data";
import { PRICING_CALCULATOR_EMBED_SLOT } from "./pricing-calculator-data";
import { ROI_CALCULATOR_EMBED_SLOT } from "./roi-calculator-data";

export type ArticleEmbedSegment =
  | { kind: "html"; content: string }
  | { kind: "roi" }
  | { kind: "pricing" }
  | { kind: "pagespeed" };

const MARKERS: { token: string; kind: "roi" | "pricing" | "pagespeed" }[] = [
  { token: PAGESPEED_INSIGHTS_EMBED_SLOT, kind: "pagespeed" },
  { token: ROI_CALCULATOR_EMBED_SLOT, kind: "roi" },
  { token: PRICING_CALCULATOR_EMBED_SLOT, kind: "pricing" },
];

/** Split prepared article HTML into HTML chunks and calculator embed markers. */
export function splitArticleEmbedSegments(html: string): ArticleEmbedSegment[] | null {
  if (
    !html.includes("data-adwrks-roi-calculator") &&
    !html.includes("data-adwrks-pricing-calculator") &&
    !html.includes("data-adwrks-pagespeed-insights")
  ) {
    return null;
  }

  type Hit = { index: number; length: number; kind: "roi" | "pricing" | "pagespeed" };
  const hits: Hit[] = [];

  for (const { token, kind } of MARKERS) {
    let from = 0;
    while (from < html.length) {
      const index = html.indexOf(token, from);
      if (index === -1) break;
      hits.push({ index, length: token.length, kind });
      from = index + token.length;
    }
  }

  if (hits.length === 0) return null;

  hits.sort((a, b) => a.index - b.index);

  const segments: ArticleEmbedSegment[] = [];
  let cursor = 0;

  for (const hit of hits) {
    if (hit.index > cursor) {
      segments.push({ kind: "html", content: html.slice(cursor, hit.index) });
    }
    segments.push({ kind: hit.kind });
    cursor = hit.index + hit.length;
  }

  if (cursor < html.length) {
    segments.push({ kind: "html", content: html.slice(cursor) });
  }

  return segments;
}
