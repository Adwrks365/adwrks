#!/usr/bin/env node
/** Phase 3.3G visual + interaction checks */
const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:3000";
const OUT = path.join(__dirname, "..", "migration-audit", "visual-qa-phase-3-3g");
const REPORT = path.join(__dirname, "..", "migration-audit", "qa-phase-3-3g.json");

const PAGES = [
  { name: "home", url: "/" },
  { name: "about", url: "/about-us/" },
  { name: "contact", url: "/contact-us/" },
  { name: "services", url: "/%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/" },
  { name: "seo", url: "/seo/" },
  { name: "google-ads-service", url: "/google-ads/" },
  { name: "social", url: "/social-media-management/" },
  { name: "website", url: "/website-building/" },
  { name: "blog", url: "/blog/" },
  { name: "category", url: "/digital-marketing/" },
  { name: "article-pagespeed", url: "/%d7%a9%d7%99%d7%a4%d7%95%d7%a8-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8-2026-pagespeed/" },
  { name: "article-roi", url: "/%d7%9e%d7%97%d7%a9%d7%91%d7%95%d7%9f-roi-%d7%9e%d7%a2%d7%95%d7%93%d7%9b%d7%9f-2026/" },
  { name: "article-seo", url: "/seo-2026-ai-answers/" },
  { name: "article-gads", url: "/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c-%d7%90%d7%93%d7%a1-10-%d7%a9%d7%9c%d7%91%d7%99%d7%9d-%d7%a4%d7%a9%d7%95%d7%98%d7%99%d7%9d/" },
  { name: "article-ppc", url: "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%9e%d7%9e%d7%95%d7%9e%d7%9f-%d7%9e%d7%95%d7%9c-%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%95%d7%a8%d7%92%d7%a0%d7%99/" },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const steps = [];
  const log = (step, pass, detail = "") => steps.push({ step, pass, detail });

  for (const width of [390, 1440]) {
    for (const page of PAGES) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, locale: "he-IL" });
      const p = await ctx.newPage();
      const res = await p.goto(`${BASE}${page.url}`, { waitUntil: "domcontentloaded", timeout: 90000 });
      log(`${width} ${page.name} status`, res && res.status() < 400, String(res && res.status()));
      await p.screenshot({ path: path.join(OUT, `${page.name}-${width}.png`), fullPage: width === 1440 && page.name.startsWith("article") ? false : true });
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      log(`${width} ${page.name} no overflow`, !overflow, "");
      await ctx.close();
    }
  }

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "he-IL" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  log("home marquee", (await page.locator(".platform-marquee-logo").count()) >= 8, "");
  log("home results", (await page.locator(".home-result-card").count()) === 3, "");
  log("google reviews link", (await page.locator('a[href*="g.page"]').count()) >= 1, "");
  log("no standalone authority badge", (await page.locator("#about img[alt='Google Partner']").count()) === 0, "");
  await page.goto(`${BASE}/%d7%a9%d7%99%d7%a4%d7%95%d7%a8-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8-2026-pagespeed/`, { waitUntil: "domcontentloaded" });
  log("article h1", (await page.locator("article.article-page h1").count()) === 1, "");
  log("toc closed", (await page.locator(".article-toc-disclosure[open]").count()) === 0, "");
  log("helpful headline", (await page.locator(".article-helpful-vote").innerText()).includes("הכתבה עניינה אותך"), "");
  log("no public vote total", (await page.locator(".article-helpful-count").count()) === 0, "");
  log("privacy checkbox", (await page.locator(".article-sidebar-contact input[name='privacyConsent']").count()) === 1, "");
  log("email not required", (await page.locator(".article-sidebar-contact input[name='email']").getAttribute("required")) === null, "");
  await page.locator(".floating-util-btn-a11y").click();
  log("a11y panel opens", (await page.locator(".a11y-panel").count()) === 1, "");
  await ctx.close();

  await browser.close();
  const report = {
    timestamp: new Date().toISOString(),
    passed: steps.filter((s) => s.pass).length,
    failed: steps.filter((s) => !s.pass).length,
    steps,
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: report.passed, failed: report.failed }, null, 2));
  if (report.failed) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
