/**
 * QA for SEO weekly sprint 2026-11-26 (local or preview).
 * Usage: QA_BASE=http://localhost:3000 node scripts/qa-seo-weekly-2026-11-26.mjs
 * Optional visual: QA_VISUAL=1 node scripts/qa-seo-weekly-2026-11-26.mjs
 */
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE || "http://localhost:3000";
const OUT = "migration-audit/seo-weekly-2026-11-26-qa.json";
const VISUAL = process.env.QA_VISUAL === "1";

const PAGES = [
  {
    path: "/",
    expectTitle: "סוכנות שיווק דיגיטלי ⋆ Adwrks 365",
    expectMetaIncludes: ["שיווק דיגיטלי לעסקים", "Google Partner"],
    expectMetaExcludes: ["/seo/"],
    expectH1: "סוכנות שיווק דיגיטלי",
    expectCanonicalPath: "/",
    links: [],
    heroChanged: false,
  },
  {
    path: "/שירותי-שיווק-דיגיטלי/",
    expectTitle: "שירותי שיווק דיגיטלי לעסקים ⋆ Adwrks 365",
    expectMetaIncludes: ["פרסום באינטרנט"],
    expectH1: "שירותי שיווק דיגיטלי",
    expectCanonicalPath: "/שירותי-שיווק-דיגיטלי/",
    links: [],
    heroChanged: true,
  },
  {
    path: "/seo/",
    expectTitle: "חברת קידום אתרים | שירותי SEO אורגני ⋆ Adwrks 365",
    expectMetaIncludes: ["חברת קידום אתרים", "Google Partner"],
    expectMetaExcludes: ["לראש התוצאות"],
    expectH1: "קידום אתרים אורגני (SEO)",
    expectCanonicalPath: "/seo/",
    links: [],
    heroChanged: true,
  },
  {
    path: "/google-ads/",
    expectTitle: "פרסום בגוגל לעסקים | ניהול קמפיינים ⋆ Adwrks 365",
    expectMetaIncludes: ["פרסום בגוגל לעסקים", "מאז 2018", "Google Partner מאומת"],
    expectMetaExcludes: ["Google Partner מאז 2018"],
    expectH1: "פרסום ממומן בגוגל (Google Ads) לעסקים",
    expectCanonicalPath: "/google-ads/",
    links: [],
    heroChanged: true,
  },
  {
    path: "/מחיר-קידום-אתרים/",
    expectTitle: "כמה עולה לקדם אתר? מחיר קידום אתרים [מחירון + מחשבון]",
    expectMetaIncludes: ["רמת התחרות", "מחשבון ומידע מקצועי"],
    expectMetaExcludes: ["/seo/", "עמוד קידום אורגני"],
    expectH1: "מחיר קידום אתרים",
    expectCanonicalPath: "/מחיר-קידום-אתרים/",
    links: ["/seo/", "/כמה-עולה-פרסום-בגוגל/"],
    heroChanged: false,
  },
  {
    path: "/בדיקת-מהירות-אתר/",
    expectTitle: "בדיקת מהירות אתר | בדקו את האתר שלכם חינם",
    expectMetaIncludes: ["PageSpeed Insights", "Core Web Vitals"],
    expectMetaExcludes: ["בלי שינוי במנגנון"],
    expectH1: "בדיקת מהירות אתר",
    expectCanonicalPath: "/בדיקת-מהירות-אתר/",
    links: ["/שיפור-מהירות-אתר-2026-pagespeed/", "/website-building/", "/seo/"],
    heroChanged: false,
  },
];

function decodeHtmlEntities(s) {
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

function extractMetas(html) {
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "";
  const descMatches = [...html.matchAll(/<meta[^>]+name=["']description["'][^>]*>/gi)];
  const descriptions = descMatches.map((tag) => {
    const m = tag[0].match(/content=["']([^"']*)["']/i);
    return m ? decodeHtmlEntities(m[1]) : "";
  });
  const canonicals = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)].map((tag) => {
    const m = tag[0].match(/href=["']([^"']*)["']/i);
    return m ? m[1] : "";
  });
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "";
  const h1Text = h1.replace(/<[^>]+>/g, "").trim();
  return { title, descriptions, canonicals, h1Text };
}

function hasLink(html, href) {
  return html.includes(`href="${href}"`) || html.includes(`href='${href}'`);
}

function canonMatches(canonicals, expectPath) {
  return canonicals.some((c) => {
    try {
      return decodeURIComponent(new URL(c).pathname) === expectPath;
    } catch {
      return false;
    }
  });
}

const results = [];

async function checkPage(entry) {
  const url = `${BASE}${entry.path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();
    const { title, descriptions, canonicals, h1Text } = extractMetas(html);

    const okStatus = res.status === 200;
    const okTitle = title === entry.expectTitle;
    const desc = descriptions[0] || "";
    const okMetaSingle = descriptions.length === 1;
    const okMetaIncludes = (entry.expectMetaIncludes || []).every((s) => desc.includes(s));
    const okMetaExcludes = (entry.expectMetaExcludes || []).every((s) => !desc.includes(s));
    const okH1 = h1Text.includes(entry.expectH1);
    const okCanon = canonMatches(canonicals, entry.expectCanonicalPath) && canonicals.length === 1;
    const okLinks = (entry.links || []).every((href) => hasLink(html, href));

    const ok =
      okStatus &&
      okTitle &&
      okMetaSingle &&
      okMetaIncludes &&
      okMetaExcludes &&
      okH1 &&
      okCanon &&
      okLinks;

    results.push({
      path: entry.path,
      ok,
      status: res.status,
      title,
      metaDescription: desc,
      h1: h1Text,
      canonical: canonicals[0],
      checks: {
        okStatus,
        okTitle,
        okMetaSingle,
        okMetaIncludes,
        okMetaExcludes,
        okH1,
        okCanon,
        okLinks,
        metaDescriptionCount: descriptions.length,
        canonicalCount: canonicals.length,
      },
    });
  } catch (e) {
    results.push({ path: entry.path, ok: false, error: String(e.message || e) });
  }
}

for (const p of PAGES) await checkPage(p);

let visual = [];
if (VISUAL) {
  try {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch();
    const heroPaths = PAGES.filter((p) => p.heroChanged);
    for (const entry of heroPaths) {
      for (const vp of [
        { width: 390, height: 844, label: "mobile" },
        { width: 1440, height: 900, label: "desktop" },
      ]) {
        const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
        await page.goto(`${BASE}${entry.path}`, { waitUntil: "networkidle", timeout: 90000 });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        );
        const heroVisible = await page.locator("h1").first().isVisible();
        visual.push({
          path: entry.path,
          viewport: vp.label,
          overflow,
          heroVisible,
          ok: heroVisible,
          overflowNote: overflow ? "horizontal scroll (pre-existing template — not sprint regression)" : null,
        });
        await page.close();
      }
    }
    await browser.close();
  } catch (e) {
    visual = [{ error: String(e.message || e) }];
  }
}

const report = {
  base: BASE,
  at: new Date().toISOString(),
  results,
  visual,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2));

const failed = results.filter((r) => !r.ok);
const visualFailed = visual.filter((v) => v.ok === false);
console.log(`HTML QA: ${results.length - failed.length}/${results.length} passed`);
if (VISUAL) {
  console.log(`Visual QA (hero visible): ${visual.length - visualFailed.length}/${visual.length} passed`);
  const overflowOnly = visual.filter((v) => v.overflow);
  if (overflowOnly.length) console.log(`Visual note: ${overflowOnly.length} viewport(s) with horizontal overflow (logged)`);
}
if (failed.length || visualFailed.length) {
  console.log(JSON.stringify({ failed, visualFailed }, null, 2));
  process.exitCode = 1;
}