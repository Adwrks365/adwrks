import type { AiOverviewStatus, VisibilityRow } from "./types";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const DEPTH = 20;

/** Deterministic demo SERP + AI rows for QA (not live rankings). */
export function mockVisibilityRows(input: {
  domain: string;
  queries: string[];
  homeUrl: string;
  serviceUrl?: string | null;
  partialIndex?: number;
}): { rows: VisibilityRow[]; partial: boolean } {
  const { domain, queries, homeUrl, serviceUrl, partialIndex } = input;
  const rows: VisibilityRow[] = [];
  let partial = false;

  queries.forEach((query, index) => {
    if (partialIndex === index) {
      partial = true;
      rows.push({
        query,
        organicPosition: null,
        organicUrl: null,
        organicPageLabel: null,
        aiStatus: "unverified",
        organicDepthChecked: DEPTH,
        partialError: "demo_partial",
      });
      return;
    }

    const h = hash(`${domain}:${query}`);
    const position = h % 25 === 0 ? null : (h % DEPTH) + 1;
    const useService = Boolean(serviceUrl && index === 0 && h % 3 !== 0);
    const url = useService ? serviceUrl! : position === 1 ? homeUrl : position ? homeUrl : null;
    const ai: AiOverviewStatus =
      h % 7 === 0
        ? "not_shown"
        : h % 5 === 0
          ? "shown_site_not_cited"
          : h % 4 === 0
            ? "unverified"
            : position && position <= 10
              ? "shown_site_cited"
              : "shown_site_not_cited";

    rows.push({
      query,
      organicPosition: position,
      organicUrl: position ? url : null,
      organicPageLabel: position ? (useService ? "service" : "home") : null,
      aiStatus: ai,
      organicDepthChecked: DEPTH,
    });
  });

  return { rows, partial };
}

export function mockScenario(input: {
  scenario?: string;
  domain: string;
  queries: string[];
  homeUrl: string;
  serviceUrl?: string | null;
}): { rows: VisibilityRow[]; partial: boolean } {
  const scenario = input.scenario ?? "success";
  if (scenario === "failure") {
    return {
      partial: true,
      rows: input.queries.map((query) => ({
        query,
        organicPosition: null,
        organicUrl: null,
        organicPageLabel: null,
        aiStatus: "unverified",
        organicDepthChecked: DEPTH,
        partialError: "demo_failure",
      })),
    };
  }
  if (scenario === "partial") {
    return mockVisibilityRows({ ...input, partialIndex: 1 });
  }
  return mockVisibilityRows(input);
}