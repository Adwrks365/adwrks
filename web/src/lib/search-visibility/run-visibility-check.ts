import type { SiteKind } from "../site-check/site-kind";
import { buildVisibilityInsight, formatLeadAppendix } from "./visibility-insight";
import { mockScenario } from "./mock-provider";
import type { SearchVisibilityLocale, SearchVisibilityReport } from "./types";

export function visibilityProviderMode(): "off" | "mock" | "live" {
  const raw = process.env.SEARCH_VISIBILITY_PROVIDER?.trim().toLowerCase();
  if (raw === "off" || raw === "disabled") return "off";
  if (raw === "live" || raw === "dataforseo") {
    if (process.env.DATAFORSEO_LOGIN?.trim() && process.env.DATAFORSEO_PASSWORD?.trim()) return "live";
    return "mock";
  }
  return "mock";
}

export function runVisibilityCheck(input: {
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
}): SearchVisibilityReport | null {
  const mode = visibilityProviderMode();
  if (mode === "off") return null;

  const queries = input.queries.map((q) => q.trim()).filter(Boolean).slice(0, 3);
  if (queries.length === 0) return null;

  const provider: "mock" | "dataforseo" = mode === "live" ? "dataforseo" : "mock";
  const isDemoData = provider === "mock" || mode === "live"; /* live stub uses demo rows until API wired */

  const { rows, partial } = mockScenario({
    scenario: input.demoScenario ?? process.env.SEARCH_VISIBILITY_DEMO_SCENARIO,
    domain: input.domain,
    queries,
    homeUrl: input.homeUrl,
    serviceUrl: input.serviceUrl,
  });

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