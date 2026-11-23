import type { AnalyzablePage } from "./findings";
import { whyLabel } from "./findings";
import { buildPositiveObservations } from "./positives";
import type { SiteCheckFinding, SiteCheckLocale, SiteCheckReport, ScannedPage } from "./types";

const LIMIT_NOTE = {
  he: "בדיקה ראשונית של העמודים שנפתחו. בלי תכנית עבודה, מחקר מילות מפתח או המלצה על ערוץ פרסום.",
  en: "A first look at the pages we opened. No work plan, keyword research, or channel recommendation.",
} as const;

const CLEAR_TITLE = {
  he: "האתר נראה טוב בבדיקה הראשונית",
  en: "Your site looks good in this first check",
} as const;

const THIN_NOTE = {
  he: "האתר החזיר מעט תוכן לקריאה אוטומטית, ולכן אין כאן ממצא מבוסס.",
  en: "The site returned little content we could read automatically, so there is no evidence-based finding.",
} as const;

export function scopeLine(homeIsRoot: boolean, loadedCount: number, locale: SiteCheckLocale): string {
  const inner = Math.max(0, loadedCount - 1);
  if (locale === "en") {
    const first = homeIsRoot ? "the homepage" : "the page you entered";
    if (inner === 0) return `We checked ${first}.`;
    if (inner === 1) return `We checked ${first} and one inner page.`;
    return `We checked ${first} and ${inner} inner pages.`;
  }
  const first = homeIsRoot ? "את דף הבית" : "את העמוד שהוזן";
  if (inner === 0) return `בדקנו ${first}.`;
  if (inner === 1) return `בדקנו ${first} ועמוד פנימי אחד.`;
  if (inner === 2) return `בדקנו ${first} ושני עמודים פנימיים.`;
  return `בדקנו ${first} ושלושה עמודים פנימיים.`;
}

export function failedPagesNote(urls: string[], locale: SiteCheckLocale): string | null {
  if (urls.length === 0) return null;
  if (locale === "en") {
    return urls.length === 1
      ? `This page didn't load, so it isn't included in the findings: ${urls[0]}`
      : `These pages didn't load, so they aren't included in the findings: ${urls.join(", ")}`;
  }
  return urls.length === 1
    ? `העמוד הזה לא נטען, ולכן הוא לא נכלל בממצאים: ${urls[0]}`
    : `העמודים האלה לא נטענו, ולכן הם לא נכללים בממצאים: ${urls.join(", ")}`;
}

export function thinPagesNote(count: number, locale: SiteCheckLocale): string | null {
  if (count <= 0) return null;
  if (locale === "en") {
    return count === 1
      ? "One page loaded with very little content, so we didn't draw a finding from it."
      : "Some pages loaded with very little content, so we didn't draw findings from them.";
  }
  return count === 1
    ? "עמוד אחד נטען עם מעט תוכן, ולכן לא הסקנו ממנו ממצאים."
    : "חלק מהעמודים נטענו עם מעט תוכן, ולכן לא הסקנו מהם ממצאים.";
}

function joinNotes(notes: Array<string | null>): string | null {
  const text = notes.filter((note): note is string => Boolean(note)).join(" ");
  return text || null;
}

export function buildLeadNote(input: {
  locale: SiteCheckLocale;
  inputUrl: string;
  pages: ScannedPage[];
  partialNote: string | null;
  findings: SiteCheckFinding[];
  clearNote: string | null;
  positiveObservations: { text: string }[];
}): string {
  const he = input.locale === "he";
  const checked = input.pages.filter((page) => page.status !== "failed");
  const lines = [
    he ? `כתובת האתר: ${input.inputUrl}` : `Website: ${input.inputUrl}`,
    "",
    he ? "עמודים שנבדקו:" : "Pages checked:",
    ...(checked.length
      ? checked.map((page) => `- ${page.label} — ${page.url}`)
      : [he ? "- לא נטען עמוד לקריאה" : "- No readable page loaded"]),
  ];
  if (input.partialNote) lines.push("", input.partialNote);
  lines.push("", he ? "ממצאים שהוצגו:" : "Findings shown:");
  if (input.positiveObservations.length > 0) {
    lines.push("", he ? "מה עבד טוב בבדיקה:" : "What looked good:");
    input.positiveObservations.forEach((obs) => lines.push(`- ${obs.text}`));
  }
  if (input.findings.length === 0) {
    lines.push(input.clearNote ?? (he ? "לא הוצג ממצא." : "No finding was shown."));
  } else {
    input.findings.forEach((finding, index) => {
      lines.push(`${index + 1}. ${finding.pageLabel} — ${finding.pageUrl}`);
      lines.push(finding.observation);
      lines.push(`${whyLabel(input.locale)}: ${finding.why}`);
    });
  }
  return lines.join("\n").slice(0, 4500);
}

export function buildSiteCheckReport(input: {
  locale: SiteCheckLocale;
  inputUrl: string;
  homeIsRoot: boolean;
  pages: ScannedPage[];
  failedUrls: string[];
  thinCount: number;
  nothingReadable: boolean;
  findings: SiteCheckFinding[];
  analyzable: AnalyzablePage[];
}): SiteCheckReport {
  const loadedCount = input.pages.filter((page) => page.status !== "failed").length;
  const findings = input.findings.slice(0, 3);
  const isClear = !input.nothingReadable && findings.length === 0;
  const clearTitle = isClear ? CLEAR_TITLE[input.locale] : null;
  const positiveObservations = isClear
    ? buildPositiveObservations(input.analyzable, input.locale)
    : [];
  const clearNote = null;
  const partialNote = joinNotes([
    input.nothingReadable ? THIN_NOTE[input.locale] : thinPagesNote(input.thinCount, input.locale),
    failedPagesNote(input.failedUrls, input.locale),
  ]);
  const reportBase = {
    ok: true as const,
    inputUrl: input.inputUrl,
    scopeLine: scopeLine(input.homeIsRoot, loadedCount, input.locale),
    pages: input.pages,
    partialNote,
    findings,
    clearTitle,
    positiveObservations,
    clearNote,
    limitNote: LIMIT_NOTE[input.locale],
  };
  return {
    ...reportBase,
    leadNote: buildLeadNote({
      locale: input.locale,
      inputUrl: input.inputUrl,
      pages: input.pages,
      partialNote: reportBase.partialNote,
      findings,
      clearNote: clearTitle,
      positiveObservations,
    }),
  };
}
