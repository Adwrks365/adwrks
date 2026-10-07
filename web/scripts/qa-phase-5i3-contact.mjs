/**
 * Phase 5I.3 — Contact page QA
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../migration-audit/phase-5i3-qa");
const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4323";

async function pageMeta(page) {
  return page.evaluate(() => {
    const h1s = [...document.querySelectorAll("h1")].map((el) => el.textContent?.trim());
    const form = document.querySelector(".contact-form");
    const finalCta = document.querySelector(".commercial-final-cta");
    const cpHero = document.querySelector(".cp-hero");
    const formRect = form?.getBoundingClientRect();
    return {
      h1: h1s[0] ?? null,
      h1Count: h1s.length,
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null,
      hasCpHero: !!cpHero,
      hasCommercialFinalCta: !!finalCta,
      formVisibleAboveFold: formRect ? formRect.top < window.innerHeight : false,
      formAction: form?.getAttribute("action") ?? "client-submit",
      formFields: form ? [...form.querySelectorAll("input[name], textarea[name]")].map((el) => el.getAttribute("name")) : [],
      phoneHref: document.querySelector('.cp-direct-item[href^="tel:"]')?.getAttribute("href") ?? null,
      whatsappHref: document.querySelector('.cp-direct-item[href*="wa.me"]')?.getAttribute("href") ?? null,
      emailHref: document.querySelector('.cp-direct-item[href^="mailto:"]')?.getAttribute("href") ?? null,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const report = { base: BASE, contact: {}, redirect: null, screenshots: [] };

  for (const viewport of [
    { w: 1440, h: 900, suffix: "1440" },
    { w: 390, h: 844, suffix: "390" },
    { w: 430, h: 932, suffix: "430" },
  ]) {
    const page = await browser.newPage({ locale: "he-IL" });
    await page.setViewportSize({ width: viewport.w, height: viewport.h });
    await page.goto(`${BASE}/contact-us/`, { waitUntil: "domcontentloaded" });
    const meta = await pageMeta(page);
    report.contact[viewport.suffix] = meta;
    await page.screenshot({ path: path.join(OUT_DIR, `contact-${viewport.suffix}-full.png`), fullPage: true });
    report.screenshots.push(`contact-${viewport.suffix}-full.png`);
    if (viewport.suffix === "1440") {
      await page.screenshot({ path: path.join(OUT_DIR, "contact-1440-above-fold.png") });
      report.screenshots.push("contact-1440-above-fold.png");
    }
    await page.close();
  }

  const redirectPage = await browser.newPage({ locale: "he-IL" });
  const redirectRes = await redirectPage.goto(`${BASE}/contact/`, { waitUntil: "domcontentloaded" });
  report.redirect = {
    status: redirectRes?.status(),
    url: redirectPage.url(),
  };
  await redirectPage.close();
  await browser.close();

  await writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
