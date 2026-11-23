import type { SiteKind } from "../site-check/site-kind";
import type { SearchVisibilityLocale, VisibilityInsight, VisibilityRow } from "./types";

export function buildVisibilityInsight(input: {
  locale: SearchVisibilityLocale;
  siteKind: SiteKind;
  rows: VisibilityRow[];
  homeUrl: string;
  partialScan: boolean;
}): VisibilityInsight {
  const { locale, siteKind, rows, homeUrl, partialScan } = input;
  const ranked = rows.filter((r) => r.organicPosition && r.organicUrl);
  const homeHit = ranked.find((r) => r.organicUrl === homeUrl || r.organicPageLabel === "home");
  const serviceHit = ranked.find((r) => r.organicPageLabel === "service");

  if (locale === "en") {
    if (homeHit && serviceHit && homeHit.query !== serviceHit.query) {
      return {
        headline: "Homepage ranks — consider strengthening the dedicated service page",
        detail: `For “${homeHit.query}” we saw the homepage around position ${homeHit.organicPosition}, while “${serviceHit.query}” maps to a service URL. A focused service page often converts better.`,
        recommendedStep:
          "Compare titles, H1, and internal links on the service page vs. the homepage for overlapping searches.",
      };
    }
    if (!ranked.length) {
      return {
        headline: partialScan
          ? "Limited visibility sample on the phrases we checked"
          : "Not in the organic range we checked",
        detail: rows
          .map(
            (r) =>
              `“${r.query}”: ${r.organicPosition ? `~${r.organicPosition}` : `not in top ${r.organicDepthChecked}`}`,
          )
          .join("; "),
        recommendedStep: "Pick the page that best matches each phrase and align its title and H1.",
      };
    }
    const first = ranked[0]!;
    return {
      headline: `One place to grow: “${first.query}”`,
      detail: `Around position ${first.organicPosition} on ${first.organicUrl ?? homeUrl}${siteKind === "store" ? " (store scan)" : ""}.`,
      recommendedStep: "Strengthen that page’s content and links from categories or services you already have.",
    };
  }

  if (homeHit && serviceHit) {
    return {
      headline: "דף הבית מדורג — שווה לחזק את עמוד השירות הייעודי",
      detail: `בביטוי «${homeHit.query}» נראה דף הבית סביב מיקום ${homeHit.organicPosition}, וב־«${serviceHit.query}» עמוד שירות. לעיתים עמוד ייעודי מתאים יותר ללקוח שמחפש שירות ספציפי.`,
      recommendedStep: "השוו כותרת, H1 וקישורים פנימיים בין דף הבית לעמוד השירות על אותם חיפושים.",
    };
  }

  if (!ranked.length) {
    return {
      headline: partialScan ? "נראות חלקית על מה שנבדק" : "לא במדגם האורגני שנבדק",
      detail: rows
        .map(
          (r) =>
            `«${r.query}»: ${r.organicPosition ? `בערך ${r.organicPosition}` : `לא ב־${r.organicDepthChecked} התוצאות שנבדקו`}`,
        )
        .join("; "),
      recommendedStep: "בחרו לכל ביטוי את העמוד שהכי מתאים לו והתאימו כותרת ו-H1.",
    };
  }

  const first = ranked[0]!;
  return {
    headline: `כיוון עיקרי: «${first.query}»`,
    detail: `סביב מיקום ${first.organicPosition} ב־${first.organicUrl ?? homeUrl}.`,
    recommendedStep:
      siteKind === "store"
        ? "חזקו את העמוד או הקטגוריה הרלוונטית וקשרו ממנה למוצרים שכבר נסרקו."
        : "חזקו את העמוד הרלוונטי בתוכן וקישורים פנימיים מהעמודים שנפתחו בסריקה.",
  };
}

export function formatLeadAppendix(input: {
  locale: SearchVisibilityLocale;
  report: {
    checkedAt: string;
    country: string;
    language: string;
    device: string;
    isDemoData: boolean;
    rows: VisibilityRow[];
    insight: VisibilityInsight;
  };
}): string {
  const { locale, report } = input;
  const lines: string[] = [];
  lines.push(
    locale === "en"
      ? "--- Search visibility check ---"
      : "--- בדיקת נראות בחיפוש ---",
  );
  if (report.isDemoData) {
    lines.push(locale === "en" ? "(Demo data — not live Google rankings)" : "(נתוני דוגמה — לא דירוג חי)");
  }
  lines.push(
    locale === "en"
      ? `When: ${report.checkedAt} · ${report.country} · ${report.language} · ${report.device}`
      : `מועד: ${report.checkedAt} · מדינה: ${report.country} · שפה: ${report.language} · מכשיר: ${report.device}`,
  );
  report.rows.forEach((row, i) => {
    const pos =
      row.organicPosition != null
        ? `${row.organicPosition}`
        : locale === "en"
          ? `not in top ${row.organicDepthChecked}`
          : `לא ב־${row.organicDepthChecked} אורגניות שנבדקו`;
    const ai =
      row.aiStatus === "not_shown"
        ? locale === "en"
          ? "AI overview: not shown"
          : "סקירת AI: לא הוצגה"
        : row.aiStatus === "shown_site_cited"
          ? locale === "en"
            ? "AI overview: shown, site in sources"
            : "סקירת AI: הוצגה, האתר במקורות"
          : row.aiStatus === "shown_site_not_cited"
            ? locale === "en"
              ? "AI overview: shown, site not in sources checked"
              : "סקירת AI: הוצגה, האתר לא במקורות שנבדקו"
            : locale === "en"
              ? "AI overview: could not verify"
              : "סקירת AI: לא ניתן לאמת";
    lines.push(`${i + 1}. ${row.query} · pos ${pos} · ${row.organicUrl ?? "—"} · ${ai}`);
    if (row.partialError) lines.push(`   (${row.partialError})`);
  });
  lines.push(`${report.insight.headline}: ${report.insight.recommendedStep}`);
  return lines.join("\n");
}