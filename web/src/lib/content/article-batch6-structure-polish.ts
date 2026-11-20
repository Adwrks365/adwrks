import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import {
  stripElementorContentBlockByH2,
  stripH2HeadingWidgets,
} from "@/lib/content/article-structure-polish";
import { applyArticleBatch4StructurePolish } from "@/lib/content/article-batch4-structure-polish";
import { BATCH6_HE_PATHS } from "@/lib/content/article-batch6-enrichment-2026";

const BATCH6_HE = new Set(BATCH6_HE_PATHS.map((p) => normalizePath(p)));
const REVIEWS_HE_PATH = normalizePath("/כוחם-של-ביקורות-והמלצות/");

/** Legacy H4 «לסיכום:» block before injected FAQ (lead already covers the takeaway). */
function stripLegacyH4ClosingSummary(html: string, path: string): string {
  if (normalizePath(path) !== REVIEWS_HE_PATH) return html;
  return html.replace(
    /<h4[^>]*>\s*(?:<[^>]+>\s*)*לסיכום:\s*(?:<\/[^>]+>\s*)*<\/h4>[\s\S]*?(?=<section class="adwrks-article-faq-block")/i,
    "",
  );
}

function ensureReviewsNeutralClosing(html: string, path: string): string {
  if (normalizePath(path) !== REVIEWS_HE_PATH) return html;
  if (/לסיכום|סיכום:/i.test(html)) return html;
  const block =
    '<h2 class="elementor-heading-title elementor-size-default">לסיכום</h2><p>ניהול ביקורות והמלצות באופן שוטף — איסוף אתי, מענה מקצועי והצגה נכונה בדיגיטל — מחזק אמון ותומך בפרסום וב־SEO.</p>';
  const marker = '<section class="adwrks-article-faq-block"';
  const idx = html.indexOf(marker);
  if (idx === -1) return `${html}${block}`;
  return `${html.slice(0, idx)}${block}${html.slice(idx)}`;
}

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
  next = stripLegacyH4ClosingSummary(next, path);
  next = ensureReviewsNeutralClosing(next, path);
  return next;
}