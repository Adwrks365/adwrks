/**
 * Phase 5I.4A — Homepage CTA polish QA
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../migration-audit/phase-5i4a-qa");
const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4323";

async function captureRegion(page, selector, filename) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return false;
  await el.screenshot({ path: path.join(OUT_DIR, filename) });
  return true;
}

async function auditCta(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      classes: el.className,
      height: Math.round(rect.height),
      color: style.color,
      background: style.backgroundColor,
      border: style.borderColor,
      fontWeight: style.fontWeight,
    };
  }, selector);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const report = { base: BASE, ctas: {}, mobile: {}, screenshots: [] };

  for (const viewport of [
    { w: 1440, h: 900, suffix: "1440" },
    { w: 390, h: 844, suffix: "390" },
    { w: 430, h: 932, suffix: "430" },
  ]) {
    const page = await browser.newPage({ locale: "he-IL" });
    await page.setViewportSize({ width: viewport.w, height: viewport.h });
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

    if (viewport.suffix === "1440") {
      report.ctas.vision = await auditCta(page, '.home-vision-card-v2 a[href="#recommendations"]');
      report.ctas.envelope = await auditCta(page, ".home-envelope-body button");
      report.ctas.midPrimary = await auditCta(page, ".home-mid-cta-actions button");
      report.ctas.midPhone = await auditCta(page, '.home-mid-cta-actions a[href^="tel:"]');
      report.ctas.midWhatsapp = await auditCta(page, '.home-mid-cta-actions a[href*="wa.me"]');

      for (const [selector, name] of [
        [".home-vision-v2", "homepage-1440-vision.png"],
        [".home-envelope-360", "homepage-1440-envelope360.png"],
        [".home-mid-cta", "homepage-1440-mid-cta.png"],
      ]) {
        if (await captureRegion(page, selector, name)) report.screenshots.push(name);
      }
      await page.screenshot({ path: path.join(OUT_DIR, "homepage-1440-full.png"), fullPage: true });
      report.screenshots.push("homepage-1440-full.png");
    }

    if (viewport.suffix === "390") {
      report.mobile[390] = {
        envelopeHeight: (await auditCta(page, ".home-envelope-body button"))?.height,
        midPhoneHeight: (await auditCta(page, '.home-mid-cta-actions a[href^="tel:"]'))?.height,
        overflow: await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2),
      };
      for (const [selector, name] of [
        [".home-envelope-360", "homepage-390-envelope360.png"],
        [".home-mid-cta", "homepage-390-mid-cta.png"],
      ]) {
        if (await captureRegion(page, selector, name)) report.screenshots.push(name);
      }
    }

    if (viewport.suffix === "430") {
      report.mobile[430] = {
        midActionsWidth: await page.evaluate(() => {
          const el = document.querySelector(".home-mid-cta-actions");
          return el ? Math.round(el.getBoundingClientRect().width) : null;
        }),
      };
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
