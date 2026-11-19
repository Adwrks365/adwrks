import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import {
  stripElementorContentBlockByH2,
  stripH2HeadingWidgets,
} from "@/lib/content/article-structure-polish";

const BATCH4_PATHS = new Set([
  "/פרסום-בגוגל-7-אסטרטגיות/",
  "/חברה-לשיווק-דיגיטלי/",
  "/כך-בוחרים-חברה-לשיווק-דיגיטלי/",
  "/קידום-אתרים-מדריך-למתחילים/",
  "/יועץ-דיגיטל-הוא-השותף-שלך-להצלחה/",
]);

function isSummaryHeading(text: string): boolean {
  const t = text.trim();
  if (t === "סיכום" || t === "לסיכום") return true;
  if (/^לסיכום:/i.test(t)) return true;
  if (/^summary:/i.test(t)) return true;
  return false;
}

function isAgencyPitchHeading(text: string): boolean {
  const t = text.toLowerCase();
  if (t.includes("למה לבחור בנו") || t.includes("למה לבחור ב- adwrks")) return true;
  if (t.includes("מדוע לבחור ב-adwrks") || t.includes("קידום אתרים עם adwrks")) return true;
  if (t.startsWith("לסיכום: בחרתם נכון")) return true;
  if (t.includes("sell") && t.includes("adwrks") && t.includes("shopping")) return true;
  return false;
}

/** Drop redundant סיכום / סוכנות CTAs when runtime lead + end-of-article CTA exist. */
export function applyArticleBatch4StructurePolish(
  html: string,
  path: string,
  locale: Locale,
): string {
  if (locale !== "he") return html;
  if (!BATCH4_PATHS.has(normalizePath(path))) return html;
  if (!html.includes("adwrks-article-lead-2026")) return html;

  let next = html;
  next = stripElementorContentBlockByH2(
    next,
    (t) => isSummaryHeading(t) || isAgencyPitchHeading(t),
  );
  // Orphan pitch headings without a full section wrapper
  next = stripH2HeadingWidgets(next, (t) => isAgencyPitchHeading(t));

  if (normalizePath(path) === "/כך-בוחרים-חברה-לשיווק-דיגיטלי/") {
    next = stripElementorContentBlockByH2(next, (t) =>
      t.startsWith("השירותים שמציעה חברה לשיווק דיגיטלי מובילה"),
    );
  }

  return next;
}