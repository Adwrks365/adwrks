/**
 * Phase 5I.2C — Commercial final CTA / footer visual separation QA
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../migration-audit/phase-5i2c-qa");
const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4323";

const PAGES = [
  { slug: "about", path: "/about-us/" },
  { slug: "pricing", path: "/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/" },
  { slug: "google-ads", path: "/google-ads/" },
  { slug: "seo", path: "/seo/" },
  { slug: "website-building", path: "/website-building/" },
  { slug: "hosting", path: "/hosting-plans/" },
];

async function ctaMeta(page) {
  return page.evaluate(() => {
    const section = document.querySelector(".commercial-final-cta-section");
    const card = document.querySelector(".commercial-final-cta-card");
    const phone = document.querySelector(".commercial-final-cta-phone");
    const footer = document.querySelector("footer.site-footer, footer");
    const sectionBg = section ? getComputedStyle(section).backgroundColor : null;
    const cardBg = card ? getComputedStyle(card).backgroundColor : null;
    const footerBg = footer ? getComputedStyle(footer).backgroundColor : null;
    const phoneColor = phone ? getComputedStyle(phone).color : null;
    const sectionRect = section?.getBoundingClientRect();
    const cardRect = card?.getBoundingClientRect();
    const footerRect = footer?.getBoundingClientRect();
    return {
      hasSection: !!section,
      hasCard: !!card,
      hasPhone: !!phone,
      sectionBg,
      cardBg,
      footerBg,
      phoneColor,
      cardMaxWidth: card ? getComputedStyle(card).maxWidth : null,
      borderRadius: card ? getComputedStyle(card).borderRadius : null,
      sectionAboveFooterGap:
        sectionRect && footerRect ? footerRect.top - sectionRect.bottom : null,
      cardWidth: cardRect?.width ?? null,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    };
  });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const report = { base: BASE, pages: [], screenshots: [] };

  for (const { slug, path: pagePath } of PAGES) {
    const page = await browser.newPage({ locale: "he-IL" });
    await page.setViewportSize({ width: 1440, height: 900 });
    const url = `${BASE}${pagePath}`;
    const res = await page.goto(url, { waitUntil: "domcontentloaded" });
    const meta = await ctaMeta(page);
    report.pages.push({ slug, url, status: res?.status(), viewport: "1440", ...meta });

    await page.screenshot({ path: path.join(OUT_DIR, `${slug}-1440-full.png`), fullPage: true });
    report.screenshots.push(`${slug}-1440-full.png`);

    if (slug === "about" || slug === "pricing") {
      await page.evaluate(() => {
        document.querySelector(".commercial-final-cta-section")?.scrollIntoView({ block: "center" });
      });
      await page.screenshot({ path: path.join(OUT_DIR, `${slug}-1440-cta-footer.png`) });
      report.screenshots.push(`${slug}-1440-cta-footer.png`);

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const mobileMeta = await ctaMeta(page);
      report.pages.push({ slug, url, viewport: "390", ...mobileMeta });
      await page.evaluate(() => {
        document.querySelector(".commercial-final-cta-section")?.scrollIntoView({ block: "center" });
      });
      await page.screenshot({ path: path.join(OUT_DIR, `${slug}-390-cta-footer.png`) });
      report.screenshots.push(`${slug}-390-cta-footer.png`);
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
