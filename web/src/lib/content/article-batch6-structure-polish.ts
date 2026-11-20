import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import {
  stripElementorContentBlockByH2,
  stripH2HeadingWidgets,
} from "@/lib/content/article-structure-polish";
import { applyArticleBatch4StructurePolish } from "@/lib/content/article-batch4-structure-polish";
import { BATCH6_HE_PATHS } from "@/lib/content/article-batch6-enrichment-2026";

const BATCH6_HE = new Set(BATCH6_HE_PATHS.map((p) => normalizePath(p)));

function isKeywordListHeading(text: string): boolean {
  return /מילות מפתח|Search terms that people search/i.test(text);
}

/** Batch6 — duplicate summary + legacy keyword block cleanup on enriched HE posts. */
export function applyArticleBatch6StructurePolish(html: string, path: string, locale: Locale): string {
  if (locale !== "he") return html;
  if (!BATCH6_HE.has(normalizePath(path))) return html;
  if (!html.includes("adwrks-article-lead-2026")) return html;

  let next = applyArticleBatch4StructurePolish(html, path, locale);
  next = stripElementorContentBlockByH2(next, (t) => isKeywordListHeading(t));
  next = stripH2HeadingWidgets(next, (t) => isKeywordListHeading(t));
  return next;
}