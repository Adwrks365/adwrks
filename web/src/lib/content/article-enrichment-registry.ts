import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import { PILOT_ARTICLE_PATHS } from "@/lib/content/article-pilot-enrichment-2026";
import { BATCH6_HE_PATHS } from "@/lib/content/article-batch6-enrichment-2026";
import { BATCH7_EN_PATHS } from "@/lib/content/article-batch7-enrichment-2026";
import { FINAL_ROLLOUT_PATHS } from "@/lib/content/article-final-rollout-enrichment-2026";
import { AUTHORITY_LINKING_PATHS } from "@/lib/content/article-authority-linking-2026";

/** Static paths from enrichment modules — single place for rollout audits. */
const BATCH2_HE = [
  "/google-shopping-guide/",
  "/משרד-פרסום-דיגיטלי/",
  "/סוכנות-שיווק-דיגיטלית/",
  "/אחסון-ותחזוקת-אתרים-למה-זה-חשוב/",
  "/שיווק-דיגיטלי-לעסקים/",
];

const BATCH2_EN = [
  "/en/digital-marketing-strategies-2025/",
  "/en/future-of-seo-2025/",
  "/en/facebook-instagram-marketing/",
  "/en/seo-2026-ai-answers/",
  "/en/google-shopping-guide/",
  "/en/seo-pricing-guide/",
];

const BATCH3_HE = [
  "/פרסום-בגוגל-אדס-10-שלבים-פשוטים/",
  "/כמה-עולה-פרסום-בגוגל/",
  "/כמה-עולה-לבנות-אתר-אינטרנט-בוורדפרס/",
  "/פרסום-בגוגל-מפות/",
  "/מה-ההבדל-בין-sem-ל-ppc/",
];

const BATCH4_HE = [
  "/פרסום-בגוגל-7-אסטרטגיות/",
  "/חברה-לשיווק-דיגיטלי/",
  "/כך-בוחרים-חברה-לשיווק-דיגיטלי/",
  "/קידום-אתרים-מדריך-למתחילים/",
  "/יועץ-דיגיטל-הוא-השותף-שלך-להצלחה/",
];

const BATCH5_HE = [
  "/ניהול-עסק-בעידן-הדיגיטלי/",
  "/יועץ-שיווק-באינטרנט/",
  "/יועץ-אינטרנט/",
  "/אחסון-אתרים-מנוהל/",
  "/החשיבות-של-משרד-פרסום-דיגיטלי/",
];

const BATCH5_EN = ["/en/managing-business-digital-age/"];

const BATCH6_HE = BATCH6_HE_PATHS;
const BATCH7_EN = BATCH7_EN_PATHS;

const POLISH_ONLY: Array<{ path: string; locale: Locale; source: string }> = [
  { path: "/קידום-אתרים-בגוגל/", locale: "he", source: "post-polish-19428" },
  { path: "/פרסום-דיגיטלי-בשפה-הרוסית/", locale: "he", source: "post-polish-20350" },
  { path: "/שיפור-מהירות-אתר-2026-pagespeed/", locale: "he", source: "post-polish-21496" },
  { path: "/en/website-speed-optimization-2026-pagespeed/", locale: "en", source: "post-polish-21496" },
];

const MAP: Array<{ path: string; locale?: Locale; source: string }> = [
  ...PILOT_ARTICLE_PATHS.map((p) => ({ path: p, locale: "he" as Locale, source: "pilot-2026" })),
  ...BATCH2_HE.map((p) => ({ path: p, locale: "he" as Locale, source: "batch2-2026" })),
  ...BATCH2_EN.map((p) => ({ path: p, locale: "en" as Locale, source: "batch2-2026" })),
  ...BATCH3_HE.map((p) => ({ path: p, locale: "he" as Locale, source: "batch3-2026" })),
  ...BATCH4_HE.map((p) => ({ path: p, locale: "he" as Locale, source: "batch4-2026" })),
  ...BATCH5_HE.map((p) => ({ path: p, locale: "he" as Locale, source: "batch5-pilot-2026" })),
  ...BATCH5_EN.map((p) => ({ path: p, locale: "en" as Locale, source: "batch5-pilot-2026" })),
  ...BATCH6_HE.map((p) => ({ path: p, locale: "he" as Locale, source: "batch6-2026" })),
  ...BATCH7_EN.map((p) => ({ path: p, locale: "en" as Locale, source: "batch7-2026" })),
  { path: "/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/", locale: "he", source: "batch8-2026" },
  { path: "/google-business-profile/", locale: "he", source: "batch8-2026" },
  { path: "/en/popular-google-searches-israel/", locale: "en", source: "batch8-2026" },
  { path: "/en/power-of-reviews/", locale: "en", source: "batch8-2026" },
  { path: "/en/digital-advertising-office/", locale: "en", source: "batch8-2026" },
  { path: "/צמיחה-עסקית-באמצעות-קידום-באינטרנט/", locale: "he", source: "batch9-2026" },
  { path: "/en/google-business-profile/", locale: "en", source: "batch9-2026" },
  { path: "/en/google-business-promotion-guide/", locale: "en", source: "batch9-2026" },
  { path: "/en/business-growth-through-seo/", locale: "en", source: "batch9-2026" },
  { path: "/en/digital-marketing-agency-maximize/", locale: "en", source: "batch9-2026" },
  ...FINAL_ROLLOUT_PATHS.map((p) => ({
    path: p,
    locale: (p.startsWith("/en/") ? "en" : "he") as Locale,
    source: "final-rollout-2026",
  })),
  ...POLISH_ONLY,
  ...AUTHORITY_LINKING_PATHS.map((p) => ({ path: p, locale: "he" as Locale, source: "authority-linking-2026" })),
];

export function getArticleEnrichmentSource(pagePath: string, locale: Locale): string | null {
  const key = normalizePath(pagePath);
  for (const row of MAP) {
    if (normalizePath(row.path) !== key) continue;
    if (row.locale && row.locale !== locale) continue;
    return row.source;
  }
  return null;
}

export const ENRICHED_POST_COUNT_ESTIMATE = MAP.length;