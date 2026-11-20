/**
 * Read-only production spot check for batch8 URLs (and optional batch9 via BATCH_SPOT=batch9).
 * QA_BASE=https://adwrks.co.il npx tsx scripts/qa-batch8-production-spot.mjs
 */
const BASE = (process.env.QA_BASE ?? "https://adwrks.co.il").replace(/\/$/, "");
const SPOT = process.env.BATCH_SPOT === "batch9" ? "batch9" : "batch8";

const BATCH8 = [
  "/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/",
  "/google-business-profile/",
  "/en/popular-google-searches-israel/",
  "/en/power-of-reviews/",
  "/en/digital-advertising-office/",
];

const BATCH9 = [
  "/צמיחה-עסקית-באמצעות-קידום-באינטרנט/",
  "/en/google-business-profile/",
  "/en/google-business-promotion-guide/",
  "/en/business-growth-through-seo/",
  "/en/digital-marketing-agency-maximize/",
];

const PATHS = SPOT === "batch9" ? BATCH9 : BATCH8;

let failed = 0;

for (const p of PATHS) {
  const url = `${BASE}${p}`;
  try {
    const res = await fetch(url, { headers: { "user-agent": "adwrks-batch-spot-qa/1.0" } });
    if (!res.ok) {
      console.error("FAIL status", url, res.status);
      failed++;
      continue;
    }
    const html = await res.text();
    if (!html.includes("adwrks-article-lead")) {
      console.warn("WARN no lead on prod (may be pre-deploy)", url);
    }
    if (html.includes('id="trend-table"')) {
      console.error("FAIL trend table on prod", url);
      failed++;
    }
    console.log("OK", url, res.status);
  } catch (e) {
    console.error("FAIL fetch", url, e.message);
    failed++;
  }
}

process.exit(failed ? 1 : 0);