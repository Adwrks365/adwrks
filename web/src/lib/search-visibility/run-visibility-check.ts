import type { SiteKind } from "../site-check/site-kind";
import { fetchDataForSeoVisibility } from "./dataforseo-provider";
import { buildVisibilityInsight, formatLeadAppendix } from "./visibility-insight";
import { mockScenario } from "./mock-provider";
import { visibilityProviderMode } from "./provider-mode";
import type { SearchVisibilityLocale, SearchVisibilityReport } from "./types";

export { visibilityProviderMode } from "./provider-mode";

export async function runVisibilityCheck(input: {
  locale: SearchVisibilityLocale;
  domain: string;
  homeUrl: string;
  serviceUrl?: string | null;
  siteKind: SiteKind;
  queries: string[];
  country: string;
  language: string;
  device: "mobile" | "desktop";
  partialScan: boolean;
  demoScenario?: string;
}): Promise<SearchVisibilityReport | null> {
  const mode = visibilityProviderMode();
  if (mode === "off") return null;

  const queries = input.queries.map((q) => q.trim()).filter(Boolean).slice(0, 3);
  if (queries.length === 0) return null;

  let provider: "mock" | "dataforseo";
  let isDemoData: boolean;
  let rows: SearchVisibilityReport["rows"];
  let partial: boolean;

  if (mode === "live") {
    provider = "dataforseo";
    isDemoData = false;
    const live = await fetchDataForSeoVisibility({
      queries,
      country: input.country,
      language: input.language,
      device: input.device,
      domain: input.domain,
      homeUrl: input.homeUrl,
      serviceUrl: input.serviceUrl,
    });
    if (!live) return null;
    rows = live.rows;
    partial = live.partial;
  } else {
    provider = "mock";
    isDemoData = true;
    const mock = mockScenario({
      scenario: input.demoScenario ?? process.env.SEARCH_VISIBILITY_DEMO_SCENARIO,
      domain: input.domain,
      queries,
      homeUrl: input.homeUrl,
      serviceUrl: input.serviceUrl,
    });
    rows = mock.rows;
    partial = mock.partial;
  }

  const insight = buildVisibilityInsight({
    locale: input.locale,
    siteKind: input.siteKind,
    rows,
    homeUrl: input.homeUrl,
    partialScan: input.partialScan || partial,
  });

  const report: SearchVisibilityReport = {
    ok: true,
    partial,
    provider,
    isDemoData,
    checkedAt: new Date().toISOString(),
    country: input.country,
    language: input.language,
    device: input.device,
    rows,
    insight,
    leadAppendix: "",
  };
  report.leadAppendix = formatLeadAppendix({ locale: input.locale, report });
  return report;
}