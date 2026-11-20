import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import { BATCH9_PATHS } from "@/lib/content/article-batch9-enrichment-2026";
import {
  polishBusinessGrowthArticleHtml,
  polishEnDigitalMarketingAgencyMaximizeArticleHtml,
  polishEnGoogleBusinessProfileArticleHtml,
  polishEnPromotionGuideArticleHtml,
} from "@/lib/content/post-batch9-content-polish";

const BATCH9 = new Set(BATCH9_PATHS.map((p) => normalizePath(p)));

/** Batch9 — sales/CTA cleanup and closing blocks after lead injection. */
export function applyArticleBatch9StructurePolish(html: string, path: string, locale: Locale): string {
  const key = normalizePath(path);
  if (!BATCH9.has(key) || !html.includes("adwrks-article-lead-2026")) return html;

  let next = html;

  if (key === "/צמיחה-עסקית-באמצעות-קידום-באינטרנט/" || key === "/en/business-growth-through-seo/") {
    next = polishBusinessGrowthArticleHtml(next, locale);
  }
  if (key === "/en/google-business-profile/") {
    next = polishEnGoogleBusinessProfileArticleHtml(next);
  }
  if (key === "/en/google-business-promotion-guide/") {
    next = polishEnPromotionGuideArticleHtml(next);
  }
  if (key === "/en/digital-marketing-agency-maximize/") {
    next = polishEnDigitalMarketingAgencyMaximizeArticleHtml(next);
  }

  return next;
}