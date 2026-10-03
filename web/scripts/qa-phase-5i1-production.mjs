/**
 * Phase 5I.1 production/local QA — pricing page + contact redirect
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../migration-audit/phase-5i1-qa");
const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4323";

const PRICING_PATH = "/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/";

const REGRESSION_PATHS = [
  "/",
  "/website-building/",
  "/%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/",
  "/seo/",
  "/google-ads/",
  "/social-media-management/",
  "/hosting-plans/",
  "/about-us/",
  "/contact-us/",
  "/blog/",
];

async function pageMeta(page) {
  return page.evaluate(() => {
    const h1s = [...document.querySelectorAll("h1")].map((el) => el.textContent?.trim());
    const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((el) => {
      try {
        const parsed = JSON.parse(el.textContent || "{}");
        if (parsed["@type"]) return [parsed["@type"]];
        if (parsed["@graph"]) return parsed["@graph"].map((n) => n["@type"]).filter(Boolean);
        return [];
      } catch {
        return [];
      }
    });
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null;
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null;
    return {
      h1: h1s[0] ?? null,
      h1Count: h1s.length,
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
      canonical,
      robots,
      jsonLdTypes: jsonLd,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
      hasPricingPage: !!document.querySelector(".pp-page"),
      hasCalculatorPlaceholder: !!document.querySelector(".pp-calculator-placeholder"),
      hasIframe: !!document.querySelector("#pricing-calculator-iframe"),
    };
  });
}

async function checkRedirect(request, url) {
  const res = await request.get(url, { maxRedirects: 0 });
  return { status: res.status(), location: res.headers()["location"] ?? null };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ locale: "he-IL" });
  const page = await context.newPage();
  const report = { base: BASE, pricing: null, contactRedirect: null, regression: [], screenshots: [] };

  // Pricing page desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  const pricingUrl = `${BASE}${PRICING_PATH}`;
  const pricingRes = await page.goto(pricingUrl, { waitUntil: "networkidle" });
  report.pricing = {
    url: pricingUrl,
    status: pricingRes?.status(),
    ...(await pageMeta(page)),
  };
  const desktopShot = path.join(OUT_DIR, "pricing-1440.png");
  await page.screenshot({ path: desktopShot, fullPage: true });
  report.screenshots.push(desktopShot);

  await page.locator(".pp-section-cards").scrollIntoViewIfNeeded();
  const cardsShot = path.join(OUT_DIR, "pricing-cards-1440.png");
  await page.screenshot({ path: cardsShot });
  report.screenshots.push(cardsShot);

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(pricingUrl, { waitUntil: "networkidle" });
  report.pricing.mobile = {
    ...(await pageMeta(page)),
    viewport: "390x844",
  };
  const mobileShot = path.join(OUT_DIR, "pricing-390.png");
  await page.screenshot({ path: mobileShot, fullPage: true });
  report.screenshots.push(mobileShot);

  // Contact redirect
  report.contactRedirect = await checkRedirect(context.request, `${BASE}/contact/`);

  // Regression
  for (const p of REGRESSION_PATHS) {
    const res = await page.goto(`${BASE}${p}`, { waitUntil: "domcontentloaded" });
    report.regression.push({ path: p, status: res?.status() });
  }

  await browser.close();

  const outFile = path.join(OUT_DIR, "report.json");
  await writeFile(outFile, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
