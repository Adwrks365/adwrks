/**
 * Screenshot + DOM measurement verification for RTL arrows and article TOC gap.
 */
import { mkdirSync } from "fs";

const BASE = process.env.BASE_URL || "http://localhost:3005";
const OUT = "migration-audit/phase-5g2c-screenshots";
mkdirSync(OUT, { recursive: true });

const widths = [390, 430, 768, 1440];
const articlePath = "/%D7%90%D7%A1%D7%98%D7%A8%D7%98%D7%92%D7%99%D7%95%D7%AA-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99-2025/";
const blogPath = "/blog/";

async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const results = { base: BASE, arrows: [], gaps: [], stars: [], arrowPass: true, gapPass: true, starPass: true };

  try {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(`${BASE}${articlePath}`, { waitUntil: "networkidle" });

      await page.screenshot({ path: `${OUT}/article-${width}.png`, fullPage: false });

      if (width === 390 || width === 1440) {
        const toc = page.locator(".article-toc-disclosure").first();
        const prose = page.locator(".article-template-prose").first();
        const firstP = page.locator(".article-body-html p").first();
        const tocBox = await toc.boundingBox();
        const proseBox = await prose.boundingBox();
        const pBox = await firstP.boundingBox();
        const gapTocToProse =
          tocBox && proseBox ? proseBox.y - (tocBox.y + tocBox.height) : null;
        const gapProseTopToFirstP =
          proseBox && pBox ? pBox.y - proseBox.y : null;
        const pass =
          gapTocToProse !== null &&
          gapTocToProse < 24 &&
          gapProseTopToFirstP !== null &&
          gapProseTopToFirstP < 80;
        results.gaps.push({ width, gapTocToProse, gapProseTopToFirstP, pass });
        if (!pass) results.gapPass = false;
      }

      const stars = page.locator(".article-rating-stars");
      if (await stars.count()) {
        const dir = await stars.getAttribute("dir");
        const firstStar = page.locator(".article-rating-star").first();
        const lastStar = page.locator(".article-rating-star").last();
        const firstBox = await firstStar.boundingBox();
        const lastBox = await lastStar.boundingBox();
        const pass = dir === "ltr" && firstBox && lastBox && firstBox.x < lastBox.x;
        results.stars.push({ width, dir, pass });
        if (!pass) results.starPass = false;
      }

      for (const side of ["next", "prev"]) {
        const row = page.locator(`.article-adjacent-link-${side} .nav-phys-row`).first();
        if (!(await row.count())) continue;
        const arrow = row.locator(".nav-phys-arrow");
        const label = row.locator(".nav-phys-label");
        const arrowBox = await arrow.boundingBox();
        const labelBox = await label.boundingBox();
        const text = (await arrow.innerText()).trim();
        const arrowLeftOfLabel = arrowBox && labelBox ? arrowBox.x < labelBox.x : false;
        const expectedChar = side === "next" ? "←" : "→";
        const pass = arrowLeftOfLabel && text === expectedChar;
        results.arrows.push({
          width,
          target: `adjacent-${side}`,
          arrowLeftOfLabel,
          arrowChar: text,
          pass,
        });
        if (!pass) results.arrowPass = false;
      }

      await page.goto(`${BASE}${blogPath}`, { waitUntil: "networkidle" });
      await page.screenshot({ path: `${OUT}/blog-${width}.png`, fullPage: false });

      const paginationRows = page.locator(".pagination-btn-nav .nav-phys-row");
      const count = await paginationRows.count();
      for (let i = 0; i < count; i++) {
        const row = paginationRows.nth(i);
        const label = (await row.locator(".nav-phys-label").innerText()).trim();
        const arrow = row.locator(".nav-phys-arrow");
        const arrowBox = await arrow.boundingBox();
        const labelBox = await row.locator(".nav-phys-label").boundingBox();
        const text = (await arrow.innerText()).trim();
        const arrowLeftOfLabel = arrowBox && labelBox ? arrowBox.x < labelBox.x : false;
        const isNext = label === "הבא";
        const expectedChar = isNext ? "←" : "→";
        const pass = arrowLeftOfLabel && text === expectedChar;
        results.arrows.push({
          width,
          target: isNext ? "pagination-next" : "pagination-prev",
          arrowLeftOfLabel,
          arrowChar: text,
          pass,
        });
        if (!pass) results.arrowPass = false;
      }

      const readRow = page.locator(".article-card-link .nav-phys-row").first();
      if (await readRow.count()) {
        const arrow = readRow.locator(".nav-phys-arrow");
        const label = readRow.locator(".nav-phys-label");
        const arrowBox = await arrow.boundingBox();
        const labelBox = await label.boundingBox();
        const text = (await arrow.innerText()).trim();
        const arrowLeftOfLabel = arrowBox && labelBox ? arrowBox.x < labelBox.x : false;
        const pass = arrowLeftOfLabel && text === "←";
        results.arrows.push({
          width,
          target: "read-more",
          arrowLeftOfLabel,
          arrowChar: text,
          pass,
        });
        if (!pass) results.arrowPass = false;
      }

      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
