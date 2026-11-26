export type SearchVisibilityLocale = "he" | "en";

export type AiOverviewStatus =
  | "not_shown"
  | "shown_site_not_cited"
  | "shown_site_cited"
  | "unverified";

export type VisibilityRow = {
  query: string;
  organicPosition: number | null;
  organicUrl: string | null;
  organicPageLabel: string | null;
  aiStatus: AiOverviewStatus;
  organicDepthChecked: number;
  partialError?: string;
};

export type VisibilityInsight = {
  headline: string;
  detail: string;
  recommendedStep: string;
};

export type SearchVisibilityReport = {
  ok: true;
  partial: boolean;
  provider: "mock" | "dataforseo";
  isDemoData: boolean;
  checkedAt: string;
  country: string;
  language: string;
  device: "mobile" | "desktop";
  rows: VisibilityRow[];
  insight: VisibilityInsight;
  leadAppendix: string;
  /** Sum of DataForSEO `cost` fields when provider=dataforseo */
  providerCostUsd?: number | null;
};

export type SearchVisibilityError = {
  ok: false;
  message: "unavailable" | "daily_limit" | "invalid_body" | "invalid_queries";
  limit?: number;
  remaining?: number;
};