import type { Locale } from "@/i18n/routing";

export type CaseStudyCategory = "google-ads" | "seo" | "meta-ads" | "website-building";

export type LocalizedString = Record<Locale, string>;

export type CaseStudyMetric = {
  label: LocalizedString;
  value: LocalizedString;
};

export type CaseStudyKeywordRank = {
  phrase: string;
  rank: number;
  note?: LocalizedString;
};

export type CaseStudyTestimony = {
  /** Must match published site copy when sourced from homepage */
  quote: LocalizedString;
  attribution: LocalizedString;
  sourceLabel: LocalizedString;
};

export type CaseStudyAdsSnapshot = {
  title: LocalizedString;
  period: LocalizedString;
  sourceLabel: LocalizedString;
  metrics: CaseStudyMetric[];
  disclaimer: LocalizedString;
};

export type CaseStudyRecord = {
  id: string;
  categories: readonly CaseStudyCategory[];
  status: "published" | "pending_data" | "pending_approval";
  title: LocalizedString;
  clientLabel: LocalizedString;
  clientSiteUrl?: string;
  industry: LocalizedString;
  services: LocalizedString;
  measurementPeriod: LocalizedString;
  dataSource: LocalizedString;
  challenge: LocalizedString;
  approach: LocalizedString;
  outcome: LocalizedString;
  /** One-line project context on service page cards */
  cardTeaser: LocalizedString;
  /** Up to 3 metrics on the card face (same verified values as reports) */
  cardMetrics: readonly CaseStudyMetric[];
  /** Short source line on cards; full text stays in dataSource / measurementPeriod */
  sourceNoteShort: LocalizedString;
  highlightMetrics: readonly CaseStudyMetric[];
  keywordRanks?: readonly CaseStudyKeywordRank[];
  limitations: LocalizedString;
  serviceHref: LocalizedString;
  portfolioImage?: string;
  portfolioImageAlt?: LocalizedString;
  testimony?: CaseStudyTestimony;
  adsSnapshot?: CaseStudyAdsSnapshot;
  metaAdSets?: readonly {
    label: LocalizedString;
    metrics: CaseStudyMetric[];
  }[];
};

export function t(loc: LocalizedString, locale: Locale): string {
  return loc[locale];
}
