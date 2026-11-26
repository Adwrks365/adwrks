/**
 * Local Playwright smoke — about, SEO, sample authority articles (desktop + mobile).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE || "http://localhost:3000";
const OUT_DIR = path.join("migration-audit", "qa-authority-visual-local");
mkdirSync(OUT_DIR, { recursive: true });

const pages = [
  { path: "/about-us/", tag: "about" },
  { path: "/seo/", tag: "seo" },
  { path: "/%D7%A7%D7%99%D7%93%D7%95%D7%9D-%D7%90%D7%AA%D7%A8%D7%99%D7%9D-%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%9C%D7%9E%D7%AA%D7%97%D7%99%D7%9C%D7%99%D7%9D/", tag: "article-seo-guide" },
  { path: "/%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%9C%D7%91%D7%A0%D7%95%D7%AA-%D7%90%D7%AA%D7%A8-%D7%90%D7%99%D7%A0%D7%98%D7%A8%D7%A0%D7%98-%D7%91%D7%95%D7%95%D7%A8%D7%93%D7%A4%D7%A8%D7%A1/", tag: "article-wp-cost" },
];

const viewports = [
  { width: 390, height: 844, suffix: "mobile" },
  { width: 1440, height: 900, suffix: "desktop" },
];

const { chromium } = await import("playwright");
const browser = await chromium.launch();
const report = [];

for (const pg of pages) {
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const url = `${BASE}${pg.path.startsWith("/%") ? pg.path : pg.path}`;
    const row = { page: pg.tag, viewport: vp.suffix, url, ok: false };
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      row.status = res?.status();
      row.overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      );
      row.ok = row.status === 200 && !row.overflow;
      const file = path.join(OUT_DIR, `${pg.tag}-${vp.suffix}.png`);
      await page.screenshot({ path: file, fullPage: false });
      row.screenshot = file;
    } catch (e) {
      row.error = String(e.message || e);
    } finally {
      await page.close();
    }
    report.push(row);
  }
}
await browser.close();
writeFileSync(
  path.join("migration-audit", "qa-authority-visual-local.json"),
  JSON.stringify({ base: BASE, at: new Date().toISOString(), report }, null, 2),
);
const bad = report.filter((r) => !r.ok);
console.log(`Visual QA: ${report.length - bad.length}/${report.length}`);
if (bad.length) {
  console.log(bad);
  process.exitCode = 1;
}