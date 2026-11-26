/**
 * One live DataForSEO pilot (max 3 queries). Uses trial credits only; aborts if creds missing.
 *
 * Usage:
 *   $env:DATAFORSEO_LOGIN='...'; $env:DATAFORSEO_PASSWORD='...'; node scripts/dataforseo-live-pilot.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "migration-audit/site-check");
mkdirSync(OUT, { recursive: true });

const API_URL = "https://api.dataforseo.com/v3/serp/google/organic/live/advanced";
const DEPTH = 20;
const LOCATION_IL = 2376;

const login = process.env.DATAFORSEO_LOGIN?.trim();
const password = process.env.DATAFORSEO_PASSWORD?.trim();
if (!login || !password) {
  console.error("Missing DATAFORSEO_LOGIN or DATAFORSEO_PASSWORD — aborting (no API call).");
  process.exit(2);
}

const queries = (process.env.PILOT_QUERIES ?? "סוכנות שיווק דיגיטלי,בניית אתרים,קידום אתרים")
  .split(",")
  .map((q) => q.trim())
  .filter(Boolean)
  .slice(0, 3);

const domain = "adwrks.co.il";
const auth = Buffer.from(`${login}:${password}`).toString("base64");

function hostMatches(url, targetDomain) {
  try {
    const host = new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
    return host === targetDomain || host.endsWith(`.${targetDomain}`);
  } catch {
    return false;
  }
}

function parseAi(items) {
  const overview = items.find((i) => i.type === "ai_overview");
  if (!overview) return "not_shown";
  if (overview.asynchronous_ai_overview === true) return "unverified";
  const urls = [];
  overview.references?.forEach((r) => r.url && urls.push(r.url));
  overview.items?.forEach((el) => {
    el.references?.forEach((r) => r.url && urls.push(r.url));
    el.links?.forEach((l) => l.url && urls.push(l.url));
  });
  if (!urls.length) return "unverified";
  return urls.some((u) => hostMatches(u, domain)) ? "shown_site_cited" : "shown_site_not_cited";
}

const aiLabel = {
  not_shown: "לא הוצגה סקירת AI",
  shown_site_cited: "סקירת AI — האתר במקורות",
  shown_site_not_cited: "סקירת AI — האתר לא במקורות",
  unverified: "לא ניתן לאמת",
};

const rows = [];
let totalCost = 0;
let sawCost = false;

for (const query of queries) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        keyword: query,
        location_code: LOCATION_IL,
        language_code: "he",
        device: "mobile",
        depth: DEPTH,
        os: "android",
        load_async_ai_overview: true,
      },
    ]),
  });

  let cost = null;
  let items = [];
  if (response.ok) {
    const json = await response.json();
    cost = typeof json.cost === "number" ? json.cost : json.tasks?.[0]?.cost ?? null;
    if (typeof cost === "number") {
      sawCost = true;
      totalCost += cost;
    }
    const task = json.tasks?.[0];
    if (task?.status_code === 20000) items = task.result?.[0]?.items ?? [];
  }

  let position = null;
  let url = null;
  for (const item of items) {
    if (item.type !== "organic" || !item.url || item.rank_absolute > DEPTH) continue;
    if (hostMatches(item.url, domain)) {
      position = item.rank_absolute;
      url = item.url;
      break;
    }
  }

  rows.push({
    query,
    organicPosition: position,
    organicUrl: url,
    aiStatus: items.length ? parseAi(items) : "unverified",
    organicDepthChecked: DEPTH,
    queryCostUsd: cost,
  });
}

const payload = { queries, country: "IL", language: "he", device: "mobile", domain };
const result = { rows, providerCostUsd: sawCost ? totalCost : null };

const lines = [
  "# DataForSEO live pilot",
  "",
  `- מועד: ${new Date().toISOString()}`,
  `- IL · he · mobile · עומק ${DEPTH}`,
  `- עלות מצטברת: ${result.providerCostUsd != null ? `$${result.providerCostUsd.toFixed(4)}` : "לא דווח"}`,
  "",
];
rows.forEach((row, i) => {
  lines.push(
    `## ${i + 1}. «${row.query}»`,
    `- אורגני: ${row.organicPosition ?? `לא ב־${row.organicDepthChecked}`}`,
    `- עמוד: ${row.organicUrl ?? "—"}`,
    `- ${aiLabel[row.aiStatus]}`,
    row.queryCostUsd != null ? `- עלות ביטוי: $${row.queryCostUsd.toFixed(4)}` : "",
    "",
  );
});

const md = lines.join("\n");
writeFileSync(join(OUT, "PR21_DATAFORSEO_PILOT.json"), JSON.stringify({ payload, result }, null, 2));
writeFileSync(join(OUT, "PR21_DATAFORSEO_PILOT.md"), md);
console.log(md);