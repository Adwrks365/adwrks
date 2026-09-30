#!/usr/bin/env node
/** Phase 3.3D visual/UX QA */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const OUT_DIR = path.join(__dirname, "..", "migration-audit", "visual-qa-phase-3-3d");
const REPORT = path.join(__dirname, "..", "migration-audit", "qa-phase-3-3d.json");

const PAGES = [
  { name: "homepage", url: "/" },
  { name: "services", url: "/%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/" },
  { name: "social", url: "/social-media-management/" },
  { name: "about", url: "/about-us/" },
  { name: "contact", url: "/contact-us/" },
  { name: "blog", url: "/blog/" },
  { name: "article", url: "/%d7%91%d7%93%d7%99%d7%a7%d7%aa-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8/" },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const steps = [];

  function log(step, pass, detail = "") {
    steps.push({ step, pass, detail });
  }

  for (const width of [390, 1440]) {
    for (const page of PAGES) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, locale: "he-IL" });
      const p = await ctx.newPage();
      await p.goto(`${BASE}${page.url}`, { waitUntil: "networkidle", timeout: 90000 });
      await p.screenshot({ path: path.join(OUT_DIR, `${page.name}-${width}.png`), fullPage: true });

      if (page.name === "article" && width === 1440) {
        const discovery = await p.locator(".article-sidebar-discovery").count();
        const tocScroll = await p.locator(".article-toc-scroll").count();
        log(`${width}px article discovery before TOC`, discovery === 1 && tocScroll === 1, "");
      }

      if (page.name === "blog") {
        const filters = await p.locator(".blog-category-filters").count();
        const chips = await p.locator(".blog-category-chip").count();
        log(`${width}px blog category filters`, filters === 1 && chips > 2, `chips=${chips}`);
        const excerpt = await p.locator(".article-card-excerpt").first().innerText().catch(() => "");
        log(`${width}px blog excerpt decoded`, !/&quot;|&#8211;|&amp;/.test(excerpt), excerpt.slice(0, 60));
      }

      if (page.name === "social" && width === 1440) {
        const cols = await p.locator(".service-cards-grid").first().evaluate((el) =>
          getComputedStyle(el).gridTemplateColumns.split(" ").length,
        );
        log(`${width}px social 4-card row`, cols >= 4, `cols=${cols}`);
      }

      await ctx.close();
    }
  }

  // Scroll-to-top behavior
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  log("scroll-top hidden at top", (await page.locator(".floating-util-btn-top").count()) === 0, "");
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(300);
  log("scroll-top visible after scroll", (await page.locator(".floating-util-btn-top").count()) === 1, "");
  await page.locator(".floating-util-btn-top").click();
  await page.waitForTimeout(400);
  const y = await page.evaluate(() => window.scrollY);
  log("scroll-top returns near top", y < 40, `y=${y}`);
  await ctx.close();

  // Independent hover widths
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p2 = await ctx2.newPage();
  await p2.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const waBefore = await p2.locator(".floating-action-whatsapp").evaluate((el) => el.getBoundingClientRect().width);
  const phBefore = await p2.locator(".floating-action-phone").evaluate((el) => el.getBoundingClientRect().width);
  await p2.locator(".floating-action-whatsapp").hover();
  await p2.waitForTimeout(200);
  const waAfter = await p2.locator(".floating-action-whatsapp").evaluate((el) => el.getBoundingClientRect().width);
  const phAfter = await p2.locator(".floating-action-phone").evaluate((el) => el.getBoundingClientRect().width);
  log("whatsapp hover expands only whatsapp", waAfter > waBefore && Math.abs(phAfter - phBefore) < 8, `wa ${waBefore}->${waAfter}, ph ${phBefore}->${phAfter}`);
  await ctx2.close();

  await browser.close();

  const report = {
    timestamp: new Date().toISOString(),
    base: BASE,
    steps,
    passed: steps.filter((s) => s.pass).length,
    failed: steps.filter((s) => !s.pass).length,
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: report.passed, failed: report.failed }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
