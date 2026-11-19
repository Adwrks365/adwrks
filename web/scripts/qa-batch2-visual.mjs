/**
 * Visual/smoke QA against local production server (default :3003).
 * npx next start -p 3003 && npx tsx scripts/qa-batch2-visual.mjs
 */
const BASE = process.env.QA_BASE_URL ?? "http://localhost:3003";

const PATHS = [
  "/en/digital-marketing-strategies-2025/",
  "/en/future-of-seo-2025/",
  "/en/facebook-instagram-marketing/",
  "/en/seo-2026-ai-answers/",
  "/en/seo-pricing-guide/",
  "/en/google-shopping-guide/",
  "/google-shopping-guide/",
  "/%d7%9e%d7%a9%d7%a8%d7%93-%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/",
  "/%d7%a1%d7%95%d7%9b%d7%a0%d7%95%d7%aa-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99%d7%aa/",
  "/%d7%90%d7%97%d7%a1%d7%95%d7%9f-%d7%95%d7%aa%d7%97%d7%96%d7%95%d7%a7%d7%aa-%d7%90%d7%aa%d7%a8%d7%99%d7%9d-%d7%9c%d7%9e%d7%94-%d7%96%d7%94-%d7%97%d7%a9%d7%95%d7%91/",
  "/%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99-%d7%9c%d7%a2%d7%a1%d7%a7%d7%99%d7%9d/",
];

const UA_MOBILE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

let failed = 0;

async function check(path, mobile) {
  const res = await fetch(`${BASE}${path}`, {
    headers: mobile ? { "User-Agent": UA_MOBILE } : {},
    redirect: "follow",
  });
  if (!res.ok) {
    console.error("HTTP", res.status, path);
    failed++;
    return;
  }
  const html = await res.text();
  const lead = (html.match(/class="adwrks-article-lead"/g) || []).length;
  const dir = html.match(/<html[^>]+dir="([^"]+)"/i)?.[1];
  const isEn = path.startsWith("/en/");
  if (lead < 1) {
    console.error("no lead rendered", path, mobile ? "mobile" : "desktop");
    failed++;
    return;
  }
  if (lead > 1) {
    console.error("duplicate lead", path, lead);
    failed++;
  }
  const expectDir = isEn ? "ltr" : "rtl";
  if (dir && dir !== expectDir) {
    console.error("FAIL dir", path, dir, "expected", expectDir);
    failed++;
  }
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  if (!canonical?.includes(isEn ? "/en/" : "adwrks.co.il")) {
    console.error("canonical", path, canonical);
    failed++;
  }
  const hasHreflang =
    /hreflang=/i.test(html) ||
    (html.includes("alternate") && /rel="alternate"/i.test(html));
  if (!hasHreflang && isEn) {
    console.warn("note: hreflang not in HTML slice", path.slice(0, 30));
  }
  console.log("OK", mobile ? "mobile" : "desktop", path.slice(0, 40), { lead, dir: dir ?? "?" });
}

for (const p of PATHS) {
  await check(p, false);
  await check(p, true);
}

process.exit(failed ? 1 : 0);