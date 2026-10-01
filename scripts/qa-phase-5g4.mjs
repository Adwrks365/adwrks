/**
 * Phase 5G.4 — local visual QA: CTAs, rating UI, minimized CTA dismiss.
 */
import fs from "fs";
import { mkdirSync } from "fs";

const BASE = process.env.BASE_URL || "http://localhost:3022";
const OUT = "migration-audit/phase-5g4-qa";
mkdirSync(OUT, { recursive: true });

const posts = JSON.parse(fs.readFileSync("web/src/data/content/posts.json", "utf8"));
function pathFor(id) {
  return new URL(posts.find((p) => p.id === id).link).pathname;
}

async function waitForServer(maxMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(`${BASE}/blog/`);
      if (res.ok) return true;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

async function main() {
  if (!(await waitForServer())) {
    console.error("Server not ready at", BASE);
    process.exit(1);
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const report = {
    cta: {},
    rating: {},
    minimized: {},
    sitemap: null,
  };

  // Sitemap
  const sitemapPage = await browser.newPage();
  await sitemapPage.goto(`${BASE}/sitemap.xml`);
  const sitemapText = await sitemapPage.textContent("body");
  report.sitemap = (sitemapText?.match(/<loc>/g) || []).length;
  await sitemapPage.close();

  // Repaired CTA article (speed test has consultation buttons)
  const ctaPath = pathFor(21496);
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`${BASE}${ctaPath}`, { waitUntil: "networkidle" });
    const cta = page.locator('[data-open-contextual-popup="true"]').first();
    await cta.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${OUT}/cta-repaired-${width}.png` });

    if (width === 390) {
      const count = await page.locator('[data-open-contextual-popup="true"]').count();
      const broken = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll(".article-body-html a.elementor-button")];
        return buttons.filter((a) => {
          if (a.getAttribute("data-open-contextual-popup") === "true") return false;
          const href = (a.getAttribute("href") || "").trim();
          return (
            !href ||
            href === "#" ||
            href === "#contact" ||
            href === "#form-section" ||
            href.startsWith("javascript:")
          );
        }).length;
      });
      report.cta.repairedCount = count;
      report.cta.brokenRemaining = broken;
    }
    await page.close();
  }

  // Rating module — remarketing 4.9/60
  const ratingPath = pathFor(21272);
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`${BASE}${ratingPath}`, { waitUntil: "networkidle" });
    await page.locator(".article-rating").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${OUT}/rating-module-${width}.png` });

    if (width === 1440) {
      const data = await page.evaluate(() => {
        const summary = document.querySelector(".article-rating-summary")?.textContent || "";
        const stars = document.querySelectorAll(".article-rating-star").length;
        const height = document.querySelector(".article-rating")?.getBoundingClientRect().height;
        return { summary, stars, height };
      });
      report.rating = {
        ...data,
        pass: data.stars === 5 && (data.height ?? 0) < 180,
      };
    }
    await page.close();
  }

  // Minimized CTA with × — simulate dismiss cooldown via localStorage
  const longPath = pathFor(21776);
  const pageA = await browser.newPage({ viewport: { width, height: 900 } });
  await pageA.addInitScript(() => {
    localStorage.setItem("adwrks_popup_dismissed_until", String(Date.now() + 86400000));
  });
  await pageA.goto(`${BASE}${longPath}`, { waitUntil: "networkidle" });
  await pageA.waitForSelector(".popup-minimized-cta-wrap", { timeout: 10000 });
  await pageA.screenshot({ path: `${OUT}/minimized-cta-with-x-390.png`, fullPage: false });
  await pageA.setViewportSize({ width: 1440, height: 900 });
  await pageA.screenshot({ path: `${OUT}/minimized-cta-with-x-1440.png`, fullPage: false });
  await pageA.setViewportSize({ width: 390, height: 900 });

  const closeBtn = pageA.locator(".popup-minimized-cta-close");
  await closeBtn.click();
  await pageA.waitForTimeout(300);
  const visibleAfterDismiss = await pageA.locator(".popup-minimized-cta-wrap").count();
  await pageA.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pageA.waitForTimeout(300);
  const visibleAfterScroll = await pageA.locator(".popup-minimized-cta-wrap").count();
  report.minimized.samePageDismiss =
    visibleAfterDismiss === 0 && visibleAfterScroll === 0;

  // Navigate to page B
  const pageBPath = pathFor(21496);
  await pageA.goto(`${BASE}${pageBPath}`, { waitUntil: "networkidle" });
  await pageA.waitForTimeout(500);
  const visibleOnPageB = await pageA.locator(".popup-minimized-cta-wrap").count();
  report.minimized.nextPageReappear = visibleOnPageB > 0;

  // Open popup on page B via minimized click
  if (visibleOnPageB > 0) {
    await pageA.locator(".popup-minimized-cta").click();
    await pageA.waitForSelector(".contextual-popup-dialog", { timeout: 5000 });
    const headline = await pageA.locator(".contextual-popup-dialog h2").textContent();
    report.minimized.popupContext = headline?.includes("מהירות") || headline?.length > 3;
    await pageA.keyboard.press("Escape");
  }

  await pageA.close();

  report.minimized.pass =
    report.minimized.samePageDismiss &&
    report.minimized.nextPageReappear &&
    report.minimized.popupContext;

  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}

const width = 390;
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
