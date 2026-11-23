import type { AiOverviewStatus, VisibilityRow } from "./types";

const API_URL = "https://api.dataforseo.com/v3/serp/google/organic/live/advanced";
export const ORGANIC_DEPTH = 20;

const LOCATION_CODES: Record<string, number> = {
  IL: 2376,
  US: 2840,
};

type SerpItem = {
  type?: string;
  rank_absolute?: number;
  url?: string;
  domain?: string;
  asynchronous_ai_overview?: boolean;
  references?: Array<{ url?: string; domain?: string }>;
  items?: Array<{
    references?: Array<{ url?: string; domain?: string }>;
    links?: Array<{ url?: string; domain?: string }>;
  }>;
};

function hostMatchesDomain(url: string, domain: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
    const target = domain.replace(/^www\./i, "").toLowerCase();
    return host === target || host.endsWith(`.${target}`);
  } catch {
    return false;
  }
}

function collectReferenceUrls(overview: SerpItem): string[] {
  const urls: string[] = [];
  const push = (u?: string) => {
    if (u?.trim()) urls.push(u.trim());
  };
  overview.references?.forEach((r) => push(r.url));
  overview.items?.forEach((el) => {
    el.references?.forEach((r) => push(r.url));
    el.links?.forEach((l) => push(l.url));
  });
  return urls;
}

function parseSerpItems(items: SerpItem[], domain: string, homeUrl: string, serviceUrl?: string | null): {
  position: number | null;
  url: string | null;
  pageLabel: string | null;
  organicCount: number;
  aiStatus: AiOverviewStatus;
} {
  const organic = items.filter((i) => i.type === "organic" && typeof i.rank_absolute === "number");
  const organicCount = Math.min(organic.length, ORGANIC_DEPTH);

  let position: number | null = null;
  let url: string | null = null;
  let pageLabel: string | null = null;

  for (const row of organic) {
    if (!row.url || row.rank_absolute == null || row.rank_absolute > ORGANIC_DEPTH) continue;
    if (!hostMatchesDomain(row.url, domain)) continue;
    position = row.rank_absolute;
    url = row.url;
    const normalizedHit = row.url.replace(/\/$/, "");
    const normalizedHome = homeUrl.replace(/\/$/, "");
    const normalizedService = serviceUrl?.split("?")[0]?.replace(/\/$/, "");
    if (normalizedService && normalizedHit.startsWith(normalizedService)) {
      pageLabel = "service";
    } else if (normalizedHit === normalizedHome) {
      pageLabel = "home";
    } else {
      pageLabel = null;
    }
    break;
  }

  const overview = items.find((i) => i.type === "ai_overview");
  if (!overview) {
    return { position, url, pageLabel, organicCount, aiStatus: "not_shown" };
  }

  if (overview.asynchronous_ai_overview === true) {
    return { position, url, pageLabel, organicCount, aiStatus: "unverified" };
  }

  const refUrls = collectReferenceUrls(overview);
  if (refUrls.length === 0) {
    return { position, url, pageLabel, organicCount, aiStatus: "unverified" };
  }

  const cited = refUrls.some((u) => hostMatchesDomain(u, domain));
  return {
    position,
    url,
    pageLabel,
    organicCount,
    aiStatus: cited ? "shown_site_cited" : "shown_site_not_cited",
  };
}

async function fetchOneQuery(input: {
  query: string;
  country: string;
  language: string;
  device: "mobile" | "desktop";
  domain: string;
  homeUrl: string;
  serviceUrl?: string | null;
}): Promise<VisibilityRow> {
  const login = process.env.DATAFORSEO_LOGIN?.trim();
  const password = process.env.DATAFORSEO_PASSWORD?.trim();
  if (!login || !password) {
    throw new Error("missing_credentials");
  }

  const locationCode = LOCATION_CODES[input.country.toUpperCase()] ?? LOCATION_CODES.IL;
  const auth = Buffer.from(`${login}:${password}`).toString("base64");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        keyword: input.query,
        location_code: locationCode,
        language_code: input.language,
        device: input.device,
        depth: ORGANIC_DEPTH,
        os: input.device === "mobile" ? "android" : "windows",
        load_async_ai_overview: true,
      },
    ]),
  });

  if (!response.ok) {
    return {
      query: input.query,
      organicPosition: null,
      organicUrl: null,
      organicPageLabel: null,
      aiStatus: "unverified",
      organicDepthChecked: ORGANIC_DEPTH,
      partialError: `http_${response.status}`,
    };
  }

  const json = (await response.json()) as {
    tasks?: Array<{
      status_code?: number;
      result?: Array<{ items?: SerpItem[] }>;
    }>;
  };

  const task = json.tasks?.[0];
  if (!task || task.status_code !== 20000) {
    return {
      query: input.query,
      organicPosition: null,
      organicUrl: null,
      organicPageLabel: null,
      aiStatus: "unverified",
      organicDepthChecked: ORGANIC_DEPTH,
      partialError: "provider_task_error",
    };
  }

  const items = task.result?.[0]?.items ?? [];
  const parsed = parseSerpItems(items, input.domain, input.homeUrl, input.serviceUrl);

  return {
    query: input.query,
    organicPosition: parsed.position,
    organicUrl: parsed.url,
    organicPageLabel: parsed.pageLabel,
    aiStatus: parsed.aiStatus,
    organicDepthChecked: parsed.organicCount > 0 ? parsed.organicCount : ORGANIC_DEPTH,
  };
}

export async function fetchDataForSeoVisibility(input: {
  queries: string[];
  country: string;
  language: string;
  device: "mobile" | "desktop";
  domain: string;
  homeUrl: string;
  serviceUrl?: string | null;
}): Promise<{ rows: VisibilityRow[]; partial: boolean } | null> {
  const rows: VisibilityRow[] = [];
  let partial = false;

  for (const query of input.queries) {
    try {
      const row = await fetchOneQuery({ ...input, query });
      if (row.partialError) partial = true;
      rows.push(row);
    } catch {
      partial = true;
      rows.push({
        query,
        organicPosition: null,
        organicUrl: null,
        organicPageLabel: null,
        aiStatus: "unverified",
        organicDepthChecked: ORGANIC_DEPTH,
        partialError: "provider_error",
      });
    }
  }

  const anyUsable = rows.some((r) => !r.partialError || r.organicPosition != null || r.aiStatus !== "unverified");
  if (!anyUsable) return null;

  return { rows, partial };
}