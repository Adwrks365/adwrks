/**
 * Full-page + section captures for visual QA (Playwright).
 * node web/scripts/capture-visual-audit-pages.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] ?? "https://adwrks.co.il";
const outRoot = path.join(__dirname, "..", "..", "migration-audit", "visual-qa-2026-10-31");

const pages = [
  { slug: "home", path: "/", section: null },
  { slug: "seo", path: "/seo/", section: ".sp-section-case-studies" },
  { slug: "locations-hub", path: "/%D7%90%D7%96%D7%95%D7%A8%D7%99-%D7%A4%D7%A2%D7%99%D7%9C%D7%95%D7%AA/", section: ".sp-section-loc-hub-regions" },
  { slug: "pricing", path: "/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/", section: null },
  { slug: "contact", path: "/contact-us/", section: null },
];

const widths = [
  { name: "390", w: 390 },
  { name: "768", w: 768 },
  { name: "1440", w: 1440 },
];

const { chromium } = await import("playwright");
fs.mkdirSync(outRoot, { recursive: true });
const browser = await chromium.launch();

for (const width of widths) {
  const dir = path.join(outRoot, width.name);
  fs.mkdirSync(dir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: width.w, height: 900 } });
  for (const p of pages) {
    await page.goto(`${base}${p.path}`, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(500);
    const full = path.join(dir, `${p.slug}-full.png`);
    await page.screenshot({ path: full, fullPage: true });
    if (p.section) {
      const loc = page.locator(p.section).first();
      if (await loc.count()) {
        await loc.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: path.join(dir, `${p.slug}-section.png`),
          clip: await loc.boundingBox(),
        });
      }
    }
    console.log("wrote", full);
  }
  await page.close();
}

await browser.close();
console.log(JSON.stringify({ ok: true, outRoot }, null, 2));
