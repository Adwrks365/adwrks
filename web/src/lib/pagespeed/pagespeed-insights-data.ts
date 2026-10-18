/** Placeholder inserted where the legacy Elementor PageSpeed HTML widget lived. */
export const PAGESPEED_INSIGHTS_EMBED_SLOT =
  '<div class="adwrks-pagespeed-insights-embed" data-adwrks-pagespeed-insights></div>';

export const PAGESPEED_DAILY_LIMIT = 3;

export type PageSpeedStrategy = "mobile" | "desktop";

export type PageSpeedCategoryKey = "performance" | "accessibility" | "bestPractices" | "seo";

export type PageSpeedInsightsLabels = {
  title: string;
  intro: string;
  urlLabel: string;
  urlPlaceholder: string;
  strategy: string;
  strategyMobile: string;
  strategyDesktop: string;
  submit: string;
  retry: string;
  running: string;
  poweredBy: string;
  remaining: string;
  limitReached: string;
  errorGeneric: string;
  errorInvalidUrl: string;
  errorUnavailable: string;
  categories: Record<PageSpeedCategoryKey, string>;
  performanceHint: string;
  resultsHeading: string;
  psiNote: string;
  switchStrategyHint: string;
};

export const PAGESPEED_INSIGHTS_LABELS_HE: PageSpeedInsightsLabels = {
  title: "כלי בדיקת מהירות אתר (PageSpeed Insights)",
  intro: "הזינו כתובת אתר לקבלת ציוני Lighthouse מ-Google — ביצועים, נגישות, שיטות מומלצות ו-SEO.",
  urlLabel: "כתובת האתר",
  urlPlaceholder: "https://example.com",
  strategy: "סוג בדיקה",
  strategyMobile: "נייד",
  strategyDesktop: "מחשב",
  submit: "הרץ בדיקה",
  retry: "בדיקה חדשה",
  running: "מריצים בדיקה… התוצאות יופיעו בעוד מספר שניות.",
  poweredBy: "מבוסס על Google PageSpeed Insights API",
  remaining: "נותרו {count} בדיקות להיום (מקסימום {limit}).",
  limitReached: "הגעתם למכסה היומית ({limit} בדיקות). נסו שוב מחר.",
  errorGeneric: "לא ניתן להשלים את הבדיקה. בדקו את הכתובת ונסו שוב.",
  errorInvalidUrl: "כתובת לא תקינה.",
  errorUnavailable: "כלי הבדיקה אינו זמין כרגע.",
  categories: {
    performance: "ביצועים",
    accessibility: "נגישות",
    bestPractices: "שיטות מומלצות",
    seo: "SEO",
  },
  performanceHint: "המלצה",
  resultsHeading: "תוצאות {strategy}",
  psiNote:
    "הציונים מגיעים מאותו API של PageSpeed Insights. לפעמים יש הבדל קטן מול pagespeed.web.dev בגלל זמן הרצה ומטמון.",
  switchStrategyHint: "לבדיקת {strategy} נדרשת הרצה נוספת (נותרו {count} בדיקות להיום).",
};
