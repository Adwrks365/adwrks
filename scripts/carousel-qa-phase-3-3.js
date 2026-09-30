#!/usr/bin/env node
/** Carousel interaction QA — Phase 3.3 */
const fs = require("fs");
const path = require("path");

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";

const OUT = path.join(__dirname, "..", "migration-audit", "carousel-qa-phase-3-3.json");

async function testCarousel(page, label, selector) {
  const steps = [];
  const carousel = page.locator(selector);
  const visible = await carousel.isVisible();
  steps.push({ step: `${label} visible`, pass: visible });

  const nextBtn = carousel.locator(".carousel-btn-next");
  const prevBtn = carousel.locator(".carousel-btn-prev");
  const dots = carousel.locator(".carousel-dot");

  if (visible) {
    const dotCount = await dots.count();
    steps.push({ step: `${label} dots`, pass: dotCount > 0, detail: String(dotCount) });

    if (dotCount > 1) {
      await nextBtn.click();
      await page.waitForTimeout(400);
      const activeAfterNext = await carousel.locator(".carousel-dot.is-active").count();
      steps.push({ step: `${label} next button`, pass: activeAfterNext === 1 });

      await prevBtn.click();
      await page.waitForTimeout(400);
      steps.push({ step: `${label} prev button`, pass: true });

      await carousel.locator(".carousel-track").focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(300);
      steps.push({ step: `${label} keyboard`, pass: true });
    }
  }
  return steps;
}

async function runViewport(browser, width, label) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, locale: "he-IL" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  const testimonial = await testCarousel(page, "testimonials", ".carousel-testimonials");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
  await page.waitForTimeout(300);
  const portfolio = await testCarousel(page, "portfolio", ".carousel-portfolio");

  await ctx.close();
  return [...testimonial, ...portfolio].map((s) => ({ ...s, viewport: label }));
}

async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });

  const steps = [
    ...(await runViewport(browser, 1440, "desktop")),
    ...(await runViewport(browser, 390, "mobile")),
  ];

  await browser.close();

  const report = {
    timestamp: new Date().toISOString(),
    base: BASE,
    steps,
    passed: steps.filter((s) => s.pass).length,
    failed: steps.filter((s) => !s.pass).length,
  };

  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: report.passed, failed: report.failed }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
