/**
 * Sprint 3 UI smoke — overflow + case study balance markers.
 * node web/scripts/qa-sprint3-ui-smoke.mjs
 */
const BASE = "https://adwrks.co.il";

const paths = [
  "/",
  "/seo/",
  "/google-ads/",
  "/website-building/",
  "/social-media-management/",
  "/about-us/",
  "/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/",
  "/contact-us/",
  "/en/",
  "/en/seo/",
  "/en/contact-us/",
];

const widths = [390, 768, 1440];
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright required");
  process.exit(2);
}

const browser = await chromium.launch();
const results = [];

for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  for (const path of paths) {
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    const check = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth > doc.clientWidth + 1;
      return {
        overflow,
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        hasCaseBadge: !!document.querySelector(".sp-case-study-badge"),
        hasCaseThumb: !!document.querySelector(".sp-case-study-thumb"),
        caseCards: document.querySelectorAll(".sp-case-study-card--compact").length,
      };
    });
    results.push({ path, width: w, ...check, ok: !check.overflow });
  }
  await page.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(JSON.stringify({ ok: failed.length === 0, failed, sample: results.slice(0, 4) }, null, 2));
process.exit(failed.length ? 1 : 0);
