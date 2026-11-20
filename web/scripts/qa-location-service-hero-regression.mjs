/**
 * Service pages must NOT use sp-hero--location.
 * npx tsx scripts/qa-location-service-hero-regression.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const PATHS = ["/seo/", "/google-ads/", "/שירותי-שיווק-דיגיטלי/"];

async function main() {
  const browser = await chromium.launch();
  let failed = 0;
  for (const slug of PATHS) {
    const page = await browser.newPage();
    await page.goto(`${BASE}${encodeURI(slug)}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    const cls = await page.locator(".sp-hero").first().getAttribute("class");
    if (cls?.includes("sp-hero--location")) {
      console.error("FAIL service has location hero", slug, cls);
      failed++;
    } else {
      console.log("OK service hero", slug);
    }
    await page.close();
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
}

main();