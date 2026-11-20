import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import {
  stripElementorContentBlockByH2,
  stripH2HeadingWidgets,
} from "@/lib/content/article-structure-polish";
import { applyArticleBatch4StructurePolish } from "@/lib/content/article-batch4-structure-polish";

const BATCH5_HE = new Set([
  "/ניהול-עסק-בעידן-הדיגיטלי/",
  "/יועץ-שיווק-באינטרנט/",
  "/יועץ-אינטרנט/",
  "/אחסון-אתרים-מנוהל/",
  "/החשיבות-של-משרד-פרסום-דיגיטלי/",
]);

function isKeywordListHeading(text: string): boolean {
  return /מילות מפתח|Search terms that people search/i.test(text);
}

/** Batch5 pilot — reuse batch4 summary/agency strip + keyword dumps. */
export function applyArticleBatch5StructurePolish(
  html: string,
  path: string,
  locale: Locale,
): string {
  if (locale !== "he") return html;
  if (!BATCH5_HE.has(normalizePath(path))) return html;
  if (!html.includes("adwrks-article-lead-2026")) return html;

  let next = applyArticleBatch4StructurePolish(html, path, locale);
  next = stripElementorContentBlockByH2(next, (t) => isKeywordListHeading(t));
  next = stripH2HeadingWidgets(next, (t) => isKeywordListHeading(t));
  return next;
}