import type { BusinessInsight, SiteCheckFinding, SiteCheckLocale } from "./types";
import type { RankedIssue } from "./findings";

export function buildBusinessInsights(input: {
  locale: SiteCheckLocale;
  findings: SiteCheckFinding[];
  ranked: RankedIssue[];
}): BusinessInsight[] {
  return input.findings.slice(0, 3).map((finding, index) => {
    const issue = input.ranked[index];
    const count = issue?.count ?? 1;
    const pointFix = issue?.type === "missing-h1" && count === 1;
    const headline =
      issue?.type === "missing-h1" && count > 1
        ? input.locale === "en"
          ? `${count} pages are missing a main heading (H1)`
          : `ב־${count} עמודים לא נמצאה כותרת ראשית (H1)`
        : finding.observation;
    return {
      headline,
      detail: pointFix ? finding.pageLabel : "",
      recommendedStep: finding.recommendedStep,
      why: finding.why,
      exampleUrl: issue?.exampleUrl ?? finding.pageUrl,
      relatedPageUrl: issue?.relatedPageUrl,
      affectedPages: count > 1 ? count : undefined,
      pointFix,
    };
  });
}
