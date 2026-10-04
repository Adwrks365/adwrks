/**
 * Phase 5I.4B — Partner badge consistency QA
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../migration-audit/phase-5i4b-qa");
const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4323";

async function auditPage(page, pathName, trustSelector) {
  await page.goto(`${BASE}${pathName}`, { waitUntil: "networkidle" });
  return page.evaluate((sel) => {
    const strip = document.querySelector(sel);
    const imgs = strip ? [...strip.querySelectorAll("img")] : [];
    const html = document.documentElement.innerHTML;
    return {
      hasTrust: !!strip,
      badgeCount: imgs.length,
      alts: imgs.map((img) => img.getAttribute("alt")),
      srcs: imgs.map((img) => img.getAttribute("src") || img.getAttribute("srcset") || ""),
      hasOldCombined: html.includes("google-meta-partners-e1769685292174"),
      hasMetaBadge: html.includes("Meta-Badge"),
    };
  }, trustSelector);
}

async function capture(page, selector, name) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return false;
  await el.screenshot({ path: path.join(OUT_DIR, name) });
  return true;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const report = { base: BASE, pages: {}, footer: null, gadsHero: null, screenshots: [] };

  const checks = [
    ["/about-us/", ".ab-trust-strip", "about", "1440"],
    ["/contact-us/", ".cp-trust-strip", "contact", "1440"],
    ["/%d7%9e%d7%97%d7%99%d7%a8%d7%95%d7%9f-%d7%a9%d7%99%d7%95%d7%95%d7%a7-%d7%93%d7%99%d7%92%d7%99%d7%98%d7%9c%d7%99/", ".pp-trust-strip", "pricing", "1440"],
    ["/", ".home-about-v2", "homepage", "1440"],
    ["/google-ads/", ".sp-gads-hero-partner-badge", "googleAdsHero", "1440"],
  ];

  for (const [pathName, selector, key] of checks) {
    const page = await browser.newPage({ locale: "he-IL" });
    await page.setViewportSize({ width: 1440, height: 900 });
    report.pages[key] = await auditPage(page, pathName, selector);
    const shot = `${key}-1440-trust.png`;
    if (await capture(page, selector, shot)) report.screenshots.push(shot);
    await page.close();
  }

  for (const [pathName, selector, key, w] of [
    ["/about-us/", ".ab-trust-strip", "about", 390],
    ["/contact-us/", ".cp-trust-strip", "contact", 390],
    ["/", "footer .site-footer-partners", "footer", 1440],
    ["/", "footer .site-footer-partners", "footer", 390],
  ]) {
    const page = await browser.newPage({ locale: "he-IL" });
    await page.setViewportSize({ width: Number(w), height: w === "390" ? 844 : 900 });
    await page.goto(`${BASE}${pathName}`, { waitUntil: "networkidle" });
    const shot = `${key}-${w}.png`;
    if (await capture(page, selector, shot)) report.screenshots.push(shot);
    if (key === "footer" && w === 1440) {
      report.footer = await page.evaluate(() => ({
        badgeCount: document.querySelectorAll(".site-footer-partners img").length,
        hasOldCombined: document.documentElement.innerHTML.includes("google-meta-partners-e1769685292174"),
      }));
    }
    await page.close();
  }

  await browser.close();
  await writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
