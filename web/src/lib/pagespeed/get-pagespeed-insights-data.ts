import type { Locale } from "@/i18n/routing";
import {
  PAGESPEED_INSIGHTS_LABELS_HE,
  type PageSpeedInsightsLabels,
} from "./pagespeed-insights-data";
import { PAGESPEED_INSIGHTS_LABELS_EN } from "./pagespeed-insights-data.en";

export type PageSpeedInsightsUiData = {
  labels: PageSpeedInsightsLabels;
  dir: "rtl" | "ltr";
};

export function getPageSpeedInsightsData(locale: Locale = "he"): PageSpeedInsightsUiData {
  if (locale === "en") {
    return { labels: PAGESPEED_INSIGHTS_LABELS_EN, dir: "ltr" };
  }
  return { labels: PAGESPEED_INSIGHTS_LABELS_HE, dir: "rtl" };
}

export function scoreColor(score: number): string {
  if (score >= 90) return "#0cce6b";
  if (score >= 50) return "#ffa400";
  return "#ff4e42";
}

export function performanceRecommendation(score: number, locale: Locale): string {
  if (locale === "en") {
    if (score >= 90) return "Your site loads quickly. Keep monitoring after updates.";
    if (score >= 50) return "Moderate speed — compress images, reduce scripts, and cache static assets.";
    return "Slow loading — prioritize image optimization, server response time, and render-blocking resources.";
  }
  if (score >= 90) return "האתר נטען במהירות טובה. המשיכו לעקוב אחרי עדכונים.";
  if (score >= 50) return "מהירות בינונית — כדאי לכווץ תמונות, לצמצם סקריפטים ולהוסיף מטמון.";
  return "טעינה איטית — מומלץ לייעל תמונות, זמן תגובת שרת ומשאבים שחוסמים רינדור.";
}
