import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import { BATCH8_PATHS } from "@/lib/content/article-batch8-enrichment-2026";
import {
  polishEnDigitalAdvertisingOfficeArticleHtml,
  polishEnPowerOfReviewsArticleHtml,
  polishGoogleBusinessProfileArticleHtml,
  polishPopularGoogleSearchesArticleHtml,
} from "@/lib/content/post-batch8-content-polish";

const BATCH8 = new Set(BATCH8_PATHS.map((p) => normalizePath(p)));

/** Batch8 — remove fake trend tables, sales blocks, and broken EN stats after lead injection. */
export function applyArticleBatch8StructurePolish(html: string, path: string, locale: Locale): string {
  const key = normalizePath(path);
  if (!BATCH8.has(key) || !html.includes("adwrks-article-lead-2026")) return html;

  let next = html;

  if (key === "/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/" || key === "/en/popular-google-searches-israel/") {
    next = polishPopularGoogleSearchesArticleHtml(next, locale);
  }
  if (key === "/google-business-profile/") {
    next = polishGoogleBusinessProfileArticleHtml(next);
  }
  if (key === "/en/power-of-reviews/") {
    next = polishEnPowerOfReviewsArticleHtml(next);
  }
  if (key === "/en/digital-advertising-office/") {
    next = polishEnDigitalAdvertisingOfficeArticleHtml(next);
  }

  return next;
}