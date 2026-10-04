/**
 * Phase 5I.2 — About page QA
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../migration-audit/phase-5i2-qa");
const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4323";

const REGRESSION = [
  "/",
  "/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/",
  "/website-building/",
  "/%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/",
  "/seo/",
  "/google-ads/",
  "/social-media-management/",
  "/hosting-plans/",
  "/contact-us/",
  "/blog/",
];

async function pageMeta(page) {
  return page.evaluate(() => {
    const h1s = [...document.querySelectorAll("h1")].map((el) => el.textContent?.trim());
    const faqPages = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((el) => {
      try {
        const parsed = JSON.parse(el.textContent || "{}");
        if (parsed["@type"] === "FAQPage") return ["FAQPage"];
        if (parsed["@graph"]) return parsed["@graph"].filter((n) => n["@type"] === "FAQPage").map(() => "FAQPage");
        return [];
      } catch {
        return [];
      }
    });
    return {
      h1: h1s[0] ?? null,
      h1Count: h1s.length,
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null,
      faqPageCount: faqPages.length,
      hasAboutPage: !!document.querySelector(".ab-page"),
      hasHomeTestimonials: !!document.querySelector(".home-results-grid"),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ locale: "he-IL" });
  const report = { base: BASE, about: null, regression: [], screenshots: [] };

  await page.setViewportSize({ width: 1440, height: 900 });
  const aboutUrl = `${BASE}/about-us/`;
  const res = await page.goto(aboutUrl, { waitUntil: "domcontentloaded" });
  report.about = { url: aboutUrl, status: res?.status(), ...(await pageMeta(page)) };

  await page.locator(".ab-hero").scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(OUT_DIR, "about-hero-1440.png") });
  report.screenshots.push("about-hero-1440.png");

  await page.evaluate(() => document.querySelector(".ab-trust-strip")?.scrollIntoView({ block: "center" }));
  await page.screenshot({ path: path.join(OUT_DIR, "about-trust-1440.png") });
  report.screenshots.push("about-trust-1440.png");

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(OUT_DIR, "about-1440.png"), fullPage: true });
  report.screenshots.push("about-1440.png");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(aboutUrl, { waitUntil: "domcontentloaded" });
  report.about.mobile = { ...(await pageMeta(page)), viewport: "390x844" };
  await page.screenshot({ path: path.join(OUT_DIR, "about-390.png"), fullPage: true });
  report.screenshots.push("about-390.png");

  for (const p of REGRESSION) {
    const r = await page.goto(`${BASE}${p}`, { waitUntil: "domcontentloaded" });
    report.regression.push({ path: p, status: r?.status() });
  }

  await browser.close();
  const outFile = path.join(OUT_DIR, "report.json");
  await writeFile(outFile, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
