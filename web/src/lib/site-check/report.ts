import type { AnalyzablePage } from "./findings";
import { whyLabel } from "./findings";
import { displayUrlReadable } from "./display-url";
import { buildPositiveObservations } from "./positives";
import { buildTopicSummaries } from "./topic-summaries";
import type {
  SiteCheckFinding,
  SiteCheckLocale,
  SiteCheckReport,
  ScannedPage,
  SiteCheckSummaryMetrics,
  SiteCheckTopicSummary,
} from "./types";

const LIMIT_NOTE = {
  he: "בדיקה ראשונית של העמודים שנפתחו. בלי תכנית עבודה, מחקר מילות מפתח או המלצה על ערוץ פרסום.",
  en: "A first look at the pages we opened. No work plan, keyword research, or channel recommendation.",
} as const;

const CLEAR_TITLE = {
  he: "האתר נראה טוב בבדיקה הראשונית",
  en: "Your site looks good in this first check",
} as const;

const PARTIAL_HEADLINE = {
  he: "הבדיקה הושלמה חלקית",
  en: "The check finished partially",
} as const;

const THIN_NOTE = {
  he: "האתר החזיר מעט תוכן לקריאה אוטומטית, ולכן אין כאן ממצא מבוסס.",
  en: "The site returned little content we could read automatically, so there is no evidence-based finding.",
} as const;

export function checksPerformedLine(input: {
  locale: SiteCheckLocale;
  contentScanned: number;
  linkProbesRun: number;
  imageProbesRun: number;
}): string {
  const { locale, contentScanned, linkProbesRun, imageProbesRun } = input;
  if (locale === "en") {
    const pages =
      contentScanned === 1 ? "one content page" : `${contentScanned} content pages`;
    return `On ${pages}: page title, meta description, main heading (H1), and noindex signals; ${linkProbesRun} internal links/CTAs probed; ${imageProbesRun} leading images checked.`;
  }
  const pages = contentScanned === 1 ? "עמוד תוכן אחד" : `${contentScanned} עמודי תוכן`;
  return `ב־${pages}: כותרת, תיאור מטא, כותרת ראשית (H1) וסימני noindex; ${linkProbesRun} קישורים וכפתורי פעולה נבדקו; ${imageProbesRun} תמונות מרכזיות נסרקו.`;
}

export function scopeLine(input: {
  locale: SiteCheckLocale;
  homeIsRoot: boolean;
  contentScanned: number;
  contentPlanned: number;
  partialScan: boolean;
}): string {
  const { locale, homeIsRoot, contentScanned, contentPlanned, partialScan } = input;
  const enteredHe = homeIsRoot ? "העמוד שהזנתם" : "העמוד שהזנתם ואת דף הבית";
  const enteredEn = homeIsRoot ? "the page you entered" : "the page you entered and the homepage";

  if (locale === "en") {
    if (partialScan && contentPlanned > contentScanned) {
      return `Partial check: we opened ${contentScanned} of ${contentPlanned} content pages (including ${enteredEn}).`;
    }
    if (contentScanned === 1) {
      return homeIsRoot
        ? "We checked one content page — the page you entered."
        : "We checked one content page — the page you entered and the homepage.";
    }
    return `We checked ${contentScanned} content pages, including ${enteredEn}.`;
  }

  if (partialScan && contentPlanned > contentScanned) {
    return `נפתחו ${contentScanned} מתוך ${contentPlanned} עמודי תוכן שנבחרו, כולל ${enteredHe}.`;
  }
  if (contentScanned === 1) {
    return homeIsRoot
      ? "בדקנו עמוד תוכן אחד — העמוד שהזנתם."
      : "בדקנו עמוד תוכן אחד — העמוד שהזנתם ואת דף הבית.";
  }
  return `בדקנו ${contentScanned} עמודי תוכן, כולל ${enteredHe}.`;
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
  inputLabel: string;
  metrics: SiteCheckSummaryMetrics;
  pages: ScannedPage[];
  partialNote: string | null;
  scopeLine: string;
  checksLine: string;
  topicSummaries: SiteCheckTopicSummary[];
  findings: SiteCheckFinding[];
  clearNote: string | null;
  positiveObservations: { text: string }[];
  partialScan: boolean;
}): string {
  const he = input.locale === "he";
  const checked = input.pages.filter((page) => page.status !== "failed");
  const lines = [
    he ? `כתובת האתר: ${input.inputLabel}` : `Website: ${input.inputLabel}`,
    he ? `קישור מלא: ${input.inputUrl}` : `Full URL: ${input.inputUrl}`,
    "",
    input.scopeLine,
    input.checksLine,
    "",
    ...(input.topicSummaries.length
      ? [
          he ? "סיכום לפי נושאים:" : "Summary by topic:",
          ...input.topicSummaries.map((topic) => `- ${topic.detail}`),
        ]
      : []),
    "",
    he
      ? `מדדים: ${input.metrics.contentScanned}/${input.metrics.contentPlanned} עמודי תוכן · ${input.metrics.findingsCount} ממצאים · ${input.metrics.brokenLinksVerified} קישורים שבורים שאומתו`
      : `Metrics: ${input.metrics.contentScanned}/${input.metrics.contentPlanned} content pages · ${input.metrics.findingsCount} findings · ${input.metrics.brokenLinksVerified} broken links verified`,
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
  homeUrl: string;
  pages: ScannedPage[];
  failedUrls: string[];
  thinCount: number;
  nothingReadable: boolean;
  findings: SiteCheckFinding[];
  analyzable: AnalyzablePage[];
  partialScan: boolean;
  contentPlanned: number;
  contentScanned: number;
  brokenLinksVerified: number;
  linkProbesRun: number;
  imageProbesRun: number;
  brokenImagesCount: number;
  durationMs: number;
}): SiteCheckReport {
  const findings = input.findings.slice(0, 3);
  const isClear = !input.nothingReadable && findings.length === 0;
  const clearTitle = isClear ? CLEAR_TITLE[input.locale] : null;
  const positiveObservations = isClear
    ? buildPositiveObservations(input.analyzable, input.locale)
    : [];
  const clearNote = null;
  const partialHeadline = input.partialScan ? PARTIAL_HEADLINE[input.locale] : null;
  const partialNote = joinNotes([
    input.nothingReadable ? THIN_NOTE[input.locale] : thinPagesNote(input.thinCount, input.locale),
  ]);
  const metrics: SiteCheckSummaryMetrics = {
    contentScanned: input.contentScanned,
    contentPlanned: input.contentPlanned,
    findingsCount: findings.length,
    brokenLinksVerified: input.brokenLinksVerified,
  };
  const scope = scopeLine({
    locale: input.locale,
    homeIsRoot: input.homeIsRoot,
    contentScanned: input.contentScanned,
    contentPlanned: input.contentPlanned,
    partialScan: input.partialScan,
  });
  const checks = checksPerformedLine({
    locale: input.locale,
    contentScanned: input.contentScanned,
    linkProbesRun: input.linkProbesRun,
    imageProbesRun: input.imageProbesRun,
  });
  const topicSummaries = buildTopicSummaries({
    locale: input.locale,
    contentScanned: input.contentScanned,
    partialScan: input.partialScan,
    analyzable: input.analyzable,
    linkProbesRun: input.linkProbesRun,
    imageProbesRun: input.imageProbesRun,
    brokenLinksVerified: input.brokenLinksVerified,
    brokenImagesCount: input.brokenImagesCount,
  });
  const inputLabel = displayUrlReadable(input.inputUrl);
  const reportBase = {
    ok: true as const,
    inputUrl: input.inputUrl,
    inputLabel,
    homeUrl: input.homeUrl,
    scopeLine: scope,
    checksLine: checks,
    topicSummaries,
    metrics,
    partialScan: input.partialScan,
    partialHeadline,
    pagesPlanned: input.contentPlanned,
    pagesScanned: input.contentScanned,
    durationMs: input.durationMs,
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
      inputLabel,
      metrics,
      pages: input.pages,
      partialNote: reportBase.partialNote,
      scopeLine: scope,
      checksLine: checks,
      topicSummaries,
      findings,
      clearNote: clearTitle,
      positiveObservations,
      partialScan: input.partialScan,
    }),
  };
}