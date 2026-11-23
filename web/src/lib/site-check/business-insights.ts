import type { BusinessInsight, SiteCheckFinding, SiteCheckLocale } from "./types";
import type { SiteKind } from "./site-kind";
import type { RankedIssue } from "./findings";

function localizedSiteKind(locale: SiteCheckLocale, siteKind: SiteKind): string {
  if (locale === "en") {
    return (
      { store: "store", service: "service site", landing: "landing page", general: "website" } as const
    )[siteKind];
  }
  return (
    { store: "חנות", service: "אתר שירות", landing: "עמוד נחיתה", general: "אתר תוכן" } as const
  )[siteKind];
}

function headlineForFinding(
  locale: SiteCheckLocale,
  issue: RankedIssue | undefined,
  finding: SiteCheckFinding,
): string {
  if (!issue) return finding.observation;
  const count = issue.count ?? 1;
  if (issue.type === "missing-h1" && count === 1) {
    return locale === "en"
      ? `Quick fix: main heading (H1) on ${finding.pageLabel}`
      : `תיקון נקודתי: כותרת ראשית (H1) ב־${finding.pageLabel}`;
  }
  if (count > 1) {
    return locale === "en"
      ? `${finding.observation} (${count} pages)`
      : `${finding.observation} (ב־${count} עמודים)`;
  }
  return finding.observation;
}

function detailForFinding(
  locale: SiteCheckLocale,
  issue: RankedIssue | undefined,
  finding: SiteCheckFinding,
  siteKind: SiteKind,
): string {
  const kind = localizedSiteKind(locale, siteKind);
  const count = issue?.count ?? 1;
  const prefix =
    locale === "en"
      ? `On this ${kind} scan`
      : `בסריקת ${kind} זו`;

  if (count > 1 && issue?.exampleUrl) {
    return locale === "en"
      ? `${prefix}, this showed up on ${count} pages. Example: ${issue.exampleUrl}`
      : `${prefix} הבעיה חוזרת ב־${count} עמודים. לדוגמה: ${issue.exampleUrl}`;
  }

  if (finding.pageUrl) {
    return locale === "en"
      ? `${prefix} — see ${finding.pageUrl}`
      : `${prefix} — ראו ${finding.pageUrl}`;
  }
  return finding.observation;
}

/** Up to 3 owner-facing insights; derived from ranked issues + findings already capped. */
export function buildBusinessInsights(input: {
  locale: SiteCheckLocale;
  siteKind: SiteKind;
  findings: SiteCheckFinding[];
  ranked: RankedIssue[];
  storeAuditLines: string[];
}): BusinessInsight[] {
  const { locale, siteKind, findings, ranked, storeAuditLines } = input;

  const insights: BusinessInsight[] = findings.slice(0, 3).map((finding, index) => {
    const issue = ranked[index];
    const pointFix = issue?.type === "missing-h1" && (issue.count ?? 1) === 1;
    return {
      headline: headlineForFinding(locale, issue, finding),
      detail: detailForFinding(locale, issue, finding, siteKind),
      recommendedStep: finding.recommendedStep,
      why: finding.why,
      exampleUrl: issue?.exampleUrl ?? finding.pageUrl,
      affectedPages: issue?.count && issue.count > 1 ? issue.count : undefined,
      pointFix,
    };
  });

  if (siteKind === "store" && storeAuditLines.length > 0 && insights.length < 3) {
    const extra = storeAuditLines[0];
    if (extra && !insights.some((row) => row.detail.includes(extra.slice(0, 12)))) {
      insights.push({
        headline:
          locale === "en"
            ? "Store pages we opened (products & categories)"
            : "מה בדקנו בעמודי קטגוריה ומוצר",
        detail: storeAuditLines.join(" "),
        recommendedStep:
          locale === "en"
            ? "Compare a product page and a category page on your phone — titles, images, and the path to purchase."
            : "השוו במובייל עמוד מוצר ועמוד קטגוריה — כותרות, תמונות ודרך לרכישה.",
        why:
          locale === "en"
            ? "In a store, category and product pages are where shoppers decide to buy."
            : "בחנות, עמודי הקטגוריה והמוצר הם המקום שבו מחליטים לקנות.",
        pointFix: false,
      });
    }
  }

  return insights.slice(0, 3);
}