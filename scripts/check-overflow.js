#!/usr/bin/env node
const { chromium } = require("playwright");

const pages = [
  "/seo-2026-ai-answers/",
  "/%d7%9b%d7%9e%d7%94-%d7%a2%d7%95%d7%9c%d7%94-%d7%a4%d7%a8%d7%a1%d7%95%d7%9d-%d7%91%d7%92%d7%95%d7%92%d7%9c/",
];
const widths = [360, 768];

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const p of pages) {
    for (const w of widths) {
      const page = await browser.newPage({ viewport: { width: w, height: 900 } });
      await page.goto(`http://localhost:3000${p}`, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      console.log(`${p} @ ${w}px overflow=${overflow}`);
      await page.close();
    }
  }
  await browser.close();
})();
