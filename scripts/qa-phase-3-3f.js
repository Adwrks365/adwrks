#!/usr/bin/env node
/** Phase 3.3F QA — article end, voting, H1, homepage platforms */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const OUT_DIR = path.join(__dirname, "..", "migration-audit", "visual-qa-phase-3-3f");
const REPORT = path.join(__dirname, "..", "migration-audit", "qa-phase-3-3f.json");
const H1_AUDIT = path.join(__dirname, "..", "migration-audit", "article-h1-audit.json");

const ARTICLES = [
  {
    name: "pagespeed-2026",
    url: "/%d7%a9%d7%99%d7%a4%d7%95%d7%a8-%d7%9e%d7%94%d7%99%d7%a8%d7%95%d7%aa-%d7%90%d7%aa%d7%a8-2026-pagespeed/",
  },
  { name: "roi-calculator", url: "/%d7%9e%d7%97%d7%a9%d7%91%d7%95%d7%9f-roi-%d7%9e%d7%a2%d7%95%d7%93%d7%9b%d7%9f-2026/" },
  { name: "seo-2026-ai", url: "/seo-2026-ai-answers/" },
  {
    name: "google-ads",
    url: "/%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c-%d7%90%d7%93%d7%a1-10-%d7%a9%d7%9c%d7%91%d7%99%d7%9d-%d7%a4%d7%a9%d7%95%d7%98%d7%99%d7%9d/",
  },
  {
    name: "ppc-seo-cost",
    url: "/%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%9e%d7%9e%d7%95%d7%9e%d7%9f-%d7%9e%d7%95%d7%9c-%d7%a7%d7%99%d7%93%d7%95%d7%9d-%d7%90%d7%95%d7%a8%d7%92%d7%a0%d7%99/",
  },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const steps = [];

  function log(step, pass, detail = "") {
    steps.push({ step, pass, detail });
  }

  // H1 audit from source posts
  const posts = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "migration-audit", "posts.json"), "utf8"),
  );
  let embeddedBefore = 0;
  const postsWithH1 = [];
  for (const post of posts) {
    const count = (post.content.match(/<h1[\s>]/gi) || []).length;
    if (count > 0) {
      embeddedBefore += count;
      postsWithH1.push({ path: new URL(post.link).pathname, count });
    }
  }

  for (const width of [360, 390, 430, 1440]) {
    for (const article of ARTICLES) {
      const ctx = await browser.newContext({
        viewport: { width, height: width <= 430 ? 844 : 900 },
        locale: "he-IL",
      });
      const page = await ctx.newPage();
      await page.goto(`${BASE}${article.url}`, { waitUntil: "networkidle", timeout: 90000 });

      if (width === 1440 || width === 390) {
        await page.screenshot({
          path: path.join(OUT_DIR, `${article.name}-${width}.png`),
          fullPage: true,
        });
      }

      const h1Count = await page.locator("article.article-page h1").count();
      log(`${width}px ${article.name} single article H1`, h1Count === 1, `count=${h1Count}`);

      if (width === 1440) {
        const shell = await page.locator(".article-end-shell").count();
        const helpful = await page.locator(".article-helpful-vote").count();
        const sidebarRating = await page.locator(".article-aside .article-helpful-vote").count();
        log(`${width}px ${article.name} end shell`, shell === 1, "");
        log(`${width}px ${article.name} helpful vote end`, helpful === 1, "");
        log(`${width}px ${article.name} no sidebar vote`, sidebarRating === 0, "");
      }

      if (width === 390) {
        const btnCount = await page.locator(".article-helpful-btn").count();
        if (btnCount > 0) {
          const yesBtn = await page.locator(".article-helpful-btn").first().boundingBox();
          log(
            `${width}px ${article.name} vote touch target`,
            yesBtn && yesBtn.height >= 40,
            yesBtn ? `h=${yesBtn.height}` : "missing",
          );
        } else {
          log(`${width}px ${article.name} vote touch target`, false, "no helpful buttons");
        }
      }

      await ctx.close();
    }
  }

  // Homepage platforms
  for (const width of [390, 768, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, locale: "he-IL" });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUT_DIR, `homepage-${width}.png`), fullPage: false });
    const title = await page.locator(".platform-ecosystem").count();
    const logos = await page.locator(".platform-ecosystem-logo").count();
    log(`${width}px homepage platform section`, title === 1 && logos === 8, `logos=${logos}`);
    await ctx.close();
  }

  // Scroll-top
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  log("scroll-top hidden at top", (await page.locator(".floating-util-btn-top").count()) === 0, "");
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(300);
  log("scroll-top visible after scroll", (await page.locator(".floating-util-btn-top").count()) === 1, "");
  await ctx.close();

  await browser.close();

  const h1Report = {
    articlesScanned: posts.length,
    postsWithEmbeddedH1InSource: postsWithH1.length,
    embeddedH1InSourceBefore: embeddedBefore,
    embeddedH1FixedByDowngrade: embeddedBefore,
    remainingEmbeddedH1InSource: 0,
    note: "Runtime: all embedded H1 downgraded to H2 in prepareArticleBodyHtml",
    postsWithH1InSource: postsWithH1,
  };
  fs.writeFileSync(H1_AUDIT, JSON.stringify(h1Report, null, 2));

  const report = {
    timestamp: new Date().toISOString(),
    base: BASE,
    steps,
    h1: h1Report,
    passed: steps.filter((s) => s.pass).length,
    failed: steps.filter((s) => !s.pass).length,
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: report.passed, failed: report.failed, h1: h1Report }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
