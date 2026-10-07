/**
 * Phase 5I.2D — Commercial page visual system QA
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../migration-audit/phase-5i2d-qa");
const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:4323";

const PAGES = [
  { slug: "about", path: "/about-us/" },
  { slug: "pricing", path: "/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/" },
  { slug: "hub", path: "/%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99/" },
  { slug: "seo", path: "/seo/" },
  { slug: "google-ads", path: "/google-ads/" },
  { slug: "social", path: "/social-media-management/" },
  { slug: "website-building", path: "/website-building/" },
  { slug: "hosting", path: "/hosting-plans/" },
];

async function pageMeta(page) {
  return page.evaluate(() => {
    const hero = document.querySelector(".ab-hero, .pp-hero, .sp-hero, .wb-hero");
    const heroBg = hero ? getComputedStyle(hero).backgroundColor : null;
    const darkMidCta = document.querySelector(".sp-mid-cta-section.section-tone-dark, .wb-mid-cta-section.section-tone-dark");
    const lightMidCta = document.querySelector(".commercial-mid-cta-panel");
    const finalCard = document.querySelector(".commercial-final-cta-card");
    const phone = document.querySelector(".commercial-final-cta-phone");
    return {
      heroClass: hero?.className ?? null,
      heroIsDark: hero?.classList.contains("ab-hero--dark") ?? false,
      heroBg,
      darkMidCtaRemaining: !!darkMidCta,
      lightMidCta: !!lightMidCta,
      finalCard: !!finalCard,
      phoneColor: phone ? getComputedStyle(phone).color : null,
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
    await page.goto(url, { waitUntil: "domcontentloaded" });
    report.pages.push({ slug, url, viewport: "1440", ...(await pageMeta(page)) });
    await page.screenshot({ path: path.join(OUT_DIR, `${slug}-1440-full.png`), fullPage: true });
    report.screenshots.push(`${slug}-1440-full.png`);
    await page.screenshot({ path: path.join(OUT_DIR, `${slug}-1440-hero.png`) });
    report.screenshots.push(`${slug}-1440-hero.png`);

    if (["about", "social", "google-ads", "seo", "pricing"].includes(slug)) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(url, { waitUntil: "domcontentloaded" });
      report.pages.push({ slug, url, viewport: "390", ...(await pageMeta(page)) });
      await page.screenshot({ path: path.join(OUT_DIR, `${slug}-390-full.png`), fullPage: true });
      report.screenshots.push(`${slug}-390-full.png`);
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
