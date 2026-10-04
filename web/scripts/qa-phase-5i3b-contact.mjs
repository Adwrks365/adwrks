/**
 * Phase 5I.3B — Contact page conversion refinement QA
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../migration-audit/phase-5i3b-qa");
const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4323";

async function pageMeta(page) {
  return page.evaluate(() => {
    const h1s = [...document.querySelectorAll("h1")].map((el) => el.textContent?.trim());
    const formInHero = document.querySelector(".cp-hero .contact-form");
    const conversion = document.querySelector("#contact-form");
    const planner = document.querySelector(".cp-planner");
    const businessSection = document.querySelector(".cp-business-grid");
    const finalCta = document.querySelector(".commercial-final-cta");
    const testimonials = document.querySelectorAll(".cp-testimonial-card");
    const trustStrip = document.querySelector(".cp-trust-strip");
    const heroFormCard = document.querySelector(".cp-hero .cp-form-card");
    return {
      h1: h1s[0] ?? null,
      h1Count: h1s.length,
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null,
      hasHeroForm: !!formInHero || !!heroFormCard,
      hasConversionSection: !!conversion,
      hasPlanner: !!planner,
      plannerChips: planner ? planner.querySelectorAll(".cp-planner-chip").length : 0,
      hasBusinessSection: !!businessSection,
      hasCommercialFinalCta: !!finalCta,
      testimonialCount: testimonials.length,
      hasTrustStrip: !!trustStrip,
      directLinks: [...document.querySelectorAll(".cp-direct-link")].map((el) => el.textContent?.trim()),
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  });
}

async function captureRegion(page, selector, filename) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return false;
  await el.screenshot({ path: path.join(OUT_DIR, filename) });
  return true;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const report = { base: BASE, contact: {}, redirect: null, sitemap: null, screenshots: [] };

  for (const viewport of [
    { w: 1440, h: 900, suffix: "1440" },
    { w: 390, h: 844, suffix: "390" },
    { w: 430, h: 932, suffix: "430" },
  ]) {
    const page = await browser.newPage({ locale: "he-IL" });
    await page.setViewportSize({ width: viewport.w, height: viewport.h });
    await page.goto(`${BASE}/contact-us/`, { waitUntil: "networkidle" });
    report.contact[viewport.suffix] = await pageMeta(page);

    const fullName = `contact-${viewport.suffix}-full.png`;
    await page.screenshot({ path: path.join(OUT_DIR, fullName), fullPage: true });
    report.screenshots.push(fullName);

    if (viewport.suffix === "1440") {
      for (const [selector, name] of [
        [".cp-hero", "contact-1440-hero.png"],
        ["#contact-form", "contact-1440-conversion.png"],
        [".cp-section-testimonials", "contact-1440-testimonials.png"],
        [".cp-section-trust", "contact-1440-trust-footer.png"],
      ]) {
        if (await captureRegion(page, selector, name)) report.screenshots.push(name);
      }
    }

    if (viewport.suffix === "390") {
      for (const [selector, name] of [
        [".cp-hero", "contact-390-hero.png"],
        ["#contact-form", "contact-390-conversion.png"],
      ]) {
        if (await captureRegion(page, selector, name)) report.screenshots.push(name);
      }
    }

    if (viewport.suffix === "430") {
      await page.screenshot({ path: path.join(OUT_DIR, "contact-430-above-fold.png") });
      report.screenshots.push("contact-430-above-fold.png");
    }

    await page.close();
  }

  const redirectPage = await browser.newPage({ locale: "he-IL" });
  const redirectRes = await redirectPage.goto(`${BASE}/contact/`, { waitUntil: "domcontentloaded" });
  report.redirect = { status: redirectRes?.status(), url: redirectPage.url() };
  await redirectPage.close();

  const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
  const sitemapText = await sitemapRes.text();
  const urlCount = (sitemapText.match(/<loc>/g) || []).length;
  report.sitemap = { status: sitemapRes.status, urlCount, hasContactUs: sitemapText.includes("/contact-us/") };

  await browser.close();
  await writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
