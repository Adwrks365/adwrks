import { mkdirSync, writeFileSync } from "fs";

const BASE = "https://adwrks.co.il";
const OUT = "migration-audit/phase-5g2c-production-qa";
mkdirSync(OUT, { recursive: true });

const report = { seo: {}, reads: [], arrows: [], gaps: [], stars: [], ui: {} };

async function fetchRating(path) {
  const res = await fetch(`${BASE}/api/articles/rate?path=${encodeURIComponent(path)}`, {
    cache: "no-store",
  });
  return { status: res.status, json: await res.json() };
}

async function main() {
  const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
  const sitemapText = await sitemapRes.text();
  const robotsRes = await fetch(`${BASE}/robots.txt`);
  const robotsText = await robotsRes.text();
  report.seo = {
    sitemapStatus: sitemapRes.status,
    sitemapCount: (sitemapText.match(/<loc>/g) || []).length,
    robotsStatus: robotsRes.status,
    robotsAllow: robotsText.includes("Allow: /"),
    robotsSitemap: robotsText.includes("sitemap.xml"),
  };

  for (const [name, path, expectedAvg, expectedCount] of [
    ["5.0", "/בדיקת-מהירות-אתר/", 5, 69],
    ["3.4", "/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/", 3.4, 5],
    ["4.9", "/רימרקטינג-מה-זה-איך-ולמה/", 4.9, 60],
  ]) {
    const r = await fetchRating(path);
    report.reads.push({ name, status: r.status, ...r.json, expectedAvg, expectedCount });
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch();

  const page = await browser.newPage();
  await page.goto(`${BASE}/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%9E%D7%94%D7%99%D7%A8%D7%95%D7%AA-%D7%90%D7%AA%D7%A8/`, {
    waitUntil: "networkidle",
  });
  report.ui.starsModule = (await page.locator(".article-rating").count()) > 0;
  report.ui.noYesNo = !(await page.content()).includes("הכתבה עניינה אותך");
  await page.screenshot({ path: `${OUT}/stars-module-production.png` });

  for (const width of [390, 430, 768, 1440]) {
    const p = await browser.newPage({ viewport: { width, height: 900 } });
    await p.goto(`${BASE}/%D7%90%D7%A1%D7%98%D7%A8%D7%98%D7%92%D7%99%D7%95%D7%95%D7%AA-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99-2025/`, {
      waitUntil: "networkidle",
    });
    await p.screenshot({ path: `${OUT}/gap-article-${width}.png` });
    const toc = p.locator(".article-toc-disclosure");
    const prose = p.locator(".article-template-prose");
    const firstP = p.locator(".article-body-html p").first();
    if ((await toc.count()) && (await prose.count()) && (await firstP.count())) {
      const tocBox = await toc.boundingBox();
      const proseBox = await prose.boundingBox();
      const pBox = await firstP.boundingBox();
      report.gaps.push({
        width,
        gapTocToProse: proseBox && tocBox ? proseBox.y - (tocBox.y + tocBox.height) : null,
        gapProseTopToFirstP: proseBox && pBox ? pBox.y - proseBox.y : null,
      });
    }

    const starsEl = p.locator(".article-rating-stars").first();
    if (await starsEl.count()) {
      const dir = await starsEl.getAttribute("dir");
      const first = await p.locator(".article-rating-star").first().boundingBox();
      const last = await p.locator(".article-rating-star").last().boundingBox();
      report.stars.push({ width, dir, pass: dir === "ltr" && first && last && first.x < last.x });
    }

    await p.goto(`${BASE}/blog/`, { waitUntil: "networkidle" });
    await p.screenshot({ path: `${OUT}/blog-arrows-${width}.png` });
    for (const [target, selector, expected] of [
      ["read-more", ".article-card-link .nav-phys-row", "←"],
      ["pagination-next", ".pagination-btn-nav .nav-phys-row", "←"],
    ]) {
      const row = p.locator(selector).first();
      if (!(await row.count())) continue;
      const ab = await row.locator(".nav-phys-arrow").boundingBox();
      const lb = await row.locator(".nav-phys-label").boundingBox();
      const text = (await row.locator(".nav-phys-arrow").innerText()).trim();
      report.arrows.push({
        width,
        target,
        arrowLeftOfLabel: ab && lb ? ab.x < lb.x : false,
        arrowChar: text,
        pass: ab && lb && ab.x < lb.x && text === expected,
      });
    }

    await p.goto(`${BASE}/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%9E%D7%94%D7%99%D7%A8%D7%95%D7%AA-%D7%90%D7%AA%D7%A8/`, {
      waitUntil: "networkidle",
    });
    for (const side of ["next", "prev"]) {
      const row = p.locator(`.article-adjacent-link-${side} .nav-phys-row`).first();
      if (!(await row.count())) continue;
      const ab = await row.locator(".nav-phys-arrow").boundingBox();
      const lb = await row.locator(".nav-phys-label").boundingBox();
      const text = (await row.locator(".nav-phys-arrow").innerText()).trim();
      const expected = side === "next" ? "←" : "→";
      report.arrows.push({
        width,
        target: `adjacent-${side}`,
        arrowLeftOfLabel: ab && lb ? ab.x < lb.x : false,
        arrowChar: text,
        pass: ab && lb && ab.x < lb.x && text === expected,
      });
    }
    await p.close();
  }

  await browser.close();
  writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main();
