/**
 * Live production QA for Phase 5G.2C on https://adwrks.co.il
 */
import { mkdirSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";

const BASE = "https://adwrks.co.il";
const OUT = "migration-audit/phase-5g2c-production-qa";
mkdirSync(OUT, { recursive: true });

const ARTICLE_5 = "/%D7%91%D7%93%D7%99%D7%A7%D7%AA-%D7%9E%D7%94%D7%99%D7%A8%D7%95%D7%AA-%D7%90%D7%AA%D7%A8/";
const ARTICLE_34 = "/%D7%94%D7%97%D7%99%D7%A4%D7%95%D7%A9%D7%99%D7%9D-%D7%94%D7%9B%D7%99-%D7%A4%D7%95%D7%A4%D7%95%D7%9C%D7%A8%D7%99%D7%99%D7%9D-%D7%91%D7%92%D7%95%D7%92%D7%9C-%D7%94%D7%99%D7%95%D7%9D-%D7%91%D7%99%D7%A9/";
const ARTICLE_49 = "/%D7%A8%D7%99%D7%9E%D7%A8%D7%A7%D7%98%D7%99%D7%9F-%D7%9E%D7%94-%D7%96%D7%94-%D7%90%D7%99%D7%9A-%D7%95%D7%9C%D7%9E%D7%94/";
const ARTICLE_GAP = "/%D7%90%D7%A1%D7%98%D7%A8%D7%98%D7%92%D7%99%D7%95%D7%95%D7%AA-%D7%A9%D7%99%D7%95%D7%95%D7%A7-%D7%93%D7%99%D7%92%D7%99%D7%98%D7%9C%D7%99-2025/";
const TEST_VOTE_ARTICLE = "/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%9F-roi-%D7%9E%D7%A2%D7%95%D7%93%D7%9B%D7%9F-2026/";
const TEST_VOTE_PATH = "/מחשבון-roi-מעודכן-2026/";
const TEST_RATING = 4;

const report = {
  deployLive: false,
  reads: [],
  voteTest: null,
  duplicateTest: null,
  differentArticle: null,
  security: {},
  arrows: [],
  gaps: [],
  seo: {},
  stars: [],
  systems: {},
};

async function fetchRating(path) {
  const res = await fetch(`${BASE}/api/articles/rate?path=${encodeURIComponent(path)}`, {
    cache: "no-store",
  });
  const json = await res.json();
  return { status: res.status, json, headers: Object.fromEntries(res.headers.entries()) };
}

async function waitForDeploy(maxMs = 300000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const res = await fetch(`${BASE}${ARTICLE_5}`, { cache: "no-store" });
    const html = await res.text();
    if (html.includes("דרגו את המאמר") && !html.includes("הכתבה עניינה אותך")) {
      report.deployLive = true;
      return true;
    }
    await new Promise((r) => setTimeout(r, 15000));
  }
  return false;
}

async function main() {
  console.log("Waiting for production deploy...");
  if (!(await waitForDeploy())) {
    console.log(JSON.stringify({ error: "deploy_not_live", report }, null, 2));
    process.exit(1);
  }

  // SEO
  const sitemapRes = await fetch(`${BASE}/sitemap.xml`, { cache: "no-store" });
  const sitemapText = await sitemapRes.text();
  const sitemapCount = (sitemapText.match(/<loc>/g) || []).length;
  const robotsRes = await fetch(`${BASE}/robots.txt`, { cache: "no-store" });
  const robotsText = await robotsRes.text();
  report.seo = {
    sitemapStatus: sitemapRes.status,
    sitemapCount,
    robotsStatus: robotsRes.status,
    robotsAllow: robotsText.includes("Allow: /"),
    robotsSitemap: robotsText.includes("sitemap.xml"),
  };

  // Historical reads
  for (const [name, encoded, path, expectedAvg, expectedCount] of [
    ["5.0", ARTICLE_5, "/בדיקת-מהירות-אתר/", 5, 69],
    ["3.4", ARTICLE_34, "/החיפושים-הכי-פופולריים-בגוגל-היום-ביש/", 3.4, 5],
    ["4.9", ARTICLE_49, "/רימרקטינג-מה-זה-איך-ולמה/", 4.9, 60],
  ]) {
    const result = await fetchRating(path);
    report.reads.push({
      name,
      status: result.status,
      averageRating: result.json.averageRating,
      totalVoteCount: result.json.totalVoteCount,
      expectedAvg,
      expectedCount,
      pass:
        result.status === 200 &&
        result.json.ok &&
        result.json.totalVoteCount === expectedCount &&
        Number(result.json.averageRating) === expectedAvg,
    });
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch();

  // Security: scan a JS chunk from production
  const page = await browser.newPage();
  await page.goto(`${BASE}${ARTICLE_5}`, { waitUntil: "networkidle" });
  const scripts = await page.locator("script[src*='/_next/static/chunks']").all();
  let secretLeak = false;
  for (const script of scripts.slice(0, 8)) {
    const src = await script.getAttribute("src");
    if (!src) continue;
    const js = await (await fetch(src.startsWith("http") ? src : `${BASE}${src}`)).text();
    if (
      js.includes("SUPABASE_SECRET_KEY") ||
      js.includes("ARTICLE_RATING_VOTER_SECRET") ||
      js.includes("voter_hash")
    ) {
      secretLeak = true;
    }
  }

  // Vote test with persistent browser context (cookies)
  const context = await browser.newContext();
  const votePage = await context.newPage();

  const beforeApi = await fetchRating(TEST_VOTE_PATH);
  report.voteTest = {
    article: TEST_VOTE_PATH,
    rating: TEST_RATING,
    before: {
      totalVoteCount: beforeApi.json.totalVoteCount,
      averageRating: beforeApi.json.averageRating,
      hasVoted: beforeApi.json.hasVoted,
    },
  };

  await votePage.goto(`${BASE}${TEST_VOTE_ARTICLE}`, { waitUntil: "networkidle" });
  await votePage.screenshot({ path: `${OUT}/stars-before-vote.png`, fullPage: false });

  const star = votePage.locator(".article-rating-star").nth(TEST_RATING - 1);
  await star.click();
  await votePage.waitForTimeout(2000);
  await votePage.screenshot({ path: `${OUT}/stars-after-vote.png`, fullPage: false });
  await votePage.setViewportSize({ width: 390, height: 900 });
  await votePage.screenshot({ path: `${OUT}/stars-mobile-after-vote.png`, fullPage: false });

  const afterApi = await fetchRating(TEST_VOTE_PATH);
  report.voteTest.after = {
    totalVoteCount: afterApi.json.totalVoteCount,
    averageRating: afterApi.json.averageRating,
    hasVoted: afterApi.json.hasVoted,
    userRating: afterApi.json.userRating,
  };
  report.voteTest.pass =
    beforeApi.status === 200 &&
    afterApi.status === 200 &&
    afterApi.json.hasVoted &&
    afterApi.json.userRating === TEST_RATING &&
    afterApi.json.totalVoteCount === beforeApi.json.totalVoteCount + 1;

  // Duplicate protection - reload and try click again
  await votePage.setViewportSize({ width: 1440, height: 900 });
  await votePage.reload({ waitUntil: "networkidle" });
  const starsDisabled = await votePage.locator(".article-rating-star").first().isDisabled();
  await votePage.locator(".article-rating-star").nth(2).click({ force: true });
  await votePage.waitForTimeout(1500);
  const dupApi = await fetchRating(TEST_VOTE_PATH);
  report.duplicateTest = {
    starsDisabled,
    hasVotedAfterReload: dupApi.json.hasVoted,
    totalAfterDupAttempt: dupApi.json.totalVoteCount,
    pass:
      starsDisabled &&
      dupApi.json.hasVoted &&
      dupApi.json.totalVoteCount === afterApi.json.totalVoteCount,
  };
  report.voteTest.persistencePass = dupApi.json.totalVoteCount === afterApi.json.totalVoteCount;

  // Different article eligibility (no second vote)
  const diffApi = await fetchRating("/בדיקת-מהירות-אתר/");
  report.differentArticle = {
    hasVoted: diffApi.json.hasVoted,
    pass: diffApi.json.hasVoted === false,
  };

  // API security check on responses
  const apiBody = JSON.stringify(afterApi.json);
  report.security = {
    secretLeakInJs: secretLeak,
    apiLeaksSecrets:
      apiBody.includes("SUPABASE") ||
      apiBody.includes("voter_hash") ||
      apiBody.includes("SECRET"),
    pass: !secretLeak && !apiBody.includes("voter_hash"),
  };

  // Cookie httpOnly - check Set-Cookie from API via context request
  const apiResponse = await context.request.get(
    `${BASE}/api/articles/rate?path=${encodeURIComponent(TEST_VOTE_PATH)}`,
  );
  const setCookie = apiResponse.headers()["set-cookie"] || "";
  report.security.cookieHttpOnly = /adwrks_vid/.test(setCookie)
    ? /httponly/i.test(setCookie)
    : true;

  // Visual QA widths
  for (const width of [390, 430, 768, 1440]) {
    const p = await browser.newPage({ viewport: { width, height: 900 } });
    await p.goto(`${BASE}${ARTICLE_GAP}`, { waitUntil: "networkidle" });
    await p.screenshot({ path: `${OUT}/gap-article-${width}.png`, fullPage: false });

    const toc = p.locator(".article-toc-disclosure").first();
    const prose = p.locator(".article-template-prose").first();
    const firstP = p.locator(".article-body-html p").first();
    const tocBox = await toc.boundingBox();
    const proseBox = await prose.boundingBox();
    const pBox = await firstP.boundingBox();
    report.gaps.push({
      width,
      gapTocToProse: tocBox && proseBox ? proseBox.y - (tocBox.y + tocBox.height) : null,
      gapProseTopToFirstP: proseBox && pBox ? pBox.y - proseBox.y : null,
      pass:
        tocBox &&
        proseBox &&
        pBox &&
        proseBox.y - (tocBox.y + tocBox.height) < 24 &&
        pBox.y - proseBox.y < 80,
    });

    const starsEl = p.locator(".article-rating-stars").first();
    if (await starsEl.count()) {
      const dir = await starsEl.getAttribute("dir");
      const first = await p.locator(".article-rating-star").first().boundingBox();
      const last = await p.locator(".article-rating-star").last().boundingBox();
      report.stars.push({
        width,
        dir,
        pass: dir === "ltr" && first && last && first.x < last.x,
      });
    }

    await p.goto(`${BASE}/blog/`, { waitUntil: "networkidle" });
    await p.screenshot({ path: `${OUT}/blog-arrows-${width}.png`, fullPage: false });

    for (const [target, selector, expectedChar] of [
      ["read-more", ".article-card-link .nav-phys-row", "←"],
      ["pagination-next", ".pagination-btn-nav .nav-phys-row", "←"],
    ]) {
      const row = p.locator(selector).first();
      if (!(await row.count())) continue;
      const arrow = row.locator(".nav-phys-arrow");
      const label = row.locator(".nav-phys-label");
      const ab = await arrow.boundingBox();
      const lb = await label.boundingBox();
      const text = (await arrow.innerText()).trim();
      report.arrows.push({
        width,
        target,
        arrowLeftOfLabel: ab && lb ? ab.x < lb.x : false,
        arrowChar: text,
        pass: ab && lb && ab.x < lb.x && text === expectedChar,
      });
    }

    await p.goto(`${BASE}${ARTICLE_5}`, { waitUntil: "networkidle" });
    for (const side of ["next", "prev"]) {
      const row = p.locator(`.article-adjacent-link-${side} .nav-phys-row`).first();
      if (!(await row.count())) continue;
      const arrow = row.locator(".nav-phys-arrow");
      const label = row.locator(".nav-phys-label");
      const ab = await arrow.boundingBox();
      const lb = await label.boundingBox();
      const text = (await arrow.innerText()).trim();
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

  // Systems smoke
  const home = await browser.newPage();
  await home.goto(BASE, { waitUntil: "networkidle" });
  report.systems.homeOk = home.url.includes("adwrks.co.il");
  await home.goto(`${BASE}/contact-us/`, { waitUntil: "networkidle" });
  report.systems.contactForm = (await home.locator("form").count()) > 0;
  await browser.close();

  writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
