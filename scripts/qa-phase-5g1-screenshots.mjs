#!/usr/bin/env node
import fs from "fs";
import path from "path";

const base = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3011";

const outDir = path.join(process.cwd(), "migration-audit", "phase-5g1-qa");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto(`${base}/%D7%90%D7%A1%D7%98%D7%A8%D7%98%D7%92%D7%99%D7%95%D7%AA-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99-2025/`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.screenshot({ path: path.join(outDir, "article-cleaned-desktop.png"), fullPage: false });

  await page.setViewportSize({ width: 390, height: 900 });
  await page.reload({ waitUntil: "networkidle", timeout: 90000 });
  await page.screenshot({ path: path.join(outDir, "article-cleaned-mobile.png"), fullPage: false });

  await page.setViewportSize({ width: 1440, height: 1400 });
  await page.goto(`${base}/%D7%A7%D7%99%D7%93%D7%95%D7%9D-%D7%90%D7%AA%D7%A8%D7%99%D7%9D-%D7%91%D7%92%D7%95%D7%92%D7%9C/`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, "article-adjacent-nav.png"), fullPage: false });

  await page.goto(`${base}/blog/`, { waitUntil: "networkidle", timeout: 90000 });
  await page.screenshot({ path: path.join(outDir, "blog-grid-3x3.png"), fullPage: false });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "blog-pagination-rtl.png"), fullPage: false });

  await browser.close();
  console.log("screenshots written to", outDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
