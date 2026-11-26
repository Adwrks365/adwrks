import { hasVisitorContactPath } from "./contact-signals";
import type { AnalyzablePage } from "./findings";
import type { PositiveObservation, SiteCheckLocale } from "./types";

export function buildPositiveObservations(
  pages: AnalyzablePage[],
  locale: SiteCheckLocale,
): PositiveObservation[] {
  const usable = pages.filter((page) => page.readable);
  const observations: string[] = [];

  const titles = usable.map((page) => page.parsed.title.trim()).filter(Boolean);
  const uniqueTitles = new Set(titles.map((title) => title.toLowerCase()));
  if (titles.length >= 2 && uniqueTitles.size === titles.length) {
    observations.push(
      locale === "he"
        ? "לעמודים שנבדקו יש כותרות עמוד שונות — קל יותר להבדיל ביניהם."
        : "The pages we checked have different page titles — easier to tell them apart.",
    );
  }

  const contactPage = usable.find((page) => hasVisitorContactPath(page.parsed));
  if (contactPage) {
    const bits: string[] = [];
    if (contactPage.parsed.telHrefs.length > 0) {
      bits.push(locale === "he" ? "קישור חיוג" : "a tap-to-call link");
    } else if (contactPage.parsed.hasWhatsapp) {
      bits.push("WhatsApp");
    } else if (contactPage.parsed.hasForm) {
      bits.push(locale === "he" ? "טופס" : "a form");
    } else {
      bits.push(locale === "he" ? "קישור להרשמה או יצירת קשר" : "a sign-up or contact path");
    }
    observations.push(
      locale === "he"
        ? `באחד העמודים שנבדקו יש ${bits[0]} ברור למבקרים.`
        : `On one of the pages we checked, visitors have ${bits[0]}.`,
    );
  }

  return observations.slice(0, 2).map((text) => ({ text }));
}