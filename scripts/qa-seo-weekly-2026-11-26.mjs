/**
 * QA for SEO weekly sprint 2026-11-26 (local or preview).
 * Usage: QA_BASE=http://localhost:3000 node scripts/qa-seo-weekly-2026-11-26.mjs
 */
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE || "http://localhost:3000";
const OUT = "migration-audit/seo-weekly-2026-11-26-qa.json";
const PATHS = [
  { path: "/", expectTitle: "סוכנות שיווק דיגיטלי", expectH1: "סוכנות שיווק דיגיטלי" },
  { path: "/שירותי-שיווק-דיגיטלי/", expectTitle: "שירותי שיווק דיגיטלי", expectH1: "שירותי שיווק דיגיטלי" },
  { path: "/seo/", expectTitle: "חברת קידום אתרים", expectH1: "קידום אתרים אורגני" },
  { path: "/google-ads/", expectTitle: "פרסום בגוגל לעסקים", expectH1: "פרסום ממומן" },
  { path: "/מחיר-קידום-אתרים/", expectTitle: "מחיר קידום", expectLink: "/seo/" },
  { path: "/בדיקת-מהירות-אתר/", expectTitle: "בדיקת מהירות", expectLink: "/website-building/" },
];

const results = [];

async function check(entry) {
  const url = `${BASE}${entry.path}`;
  const name = entry.path;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();
    const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "";
    const desc = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i) || [])[1] || "";
    const canonical = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i) || [])[1] || "";
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "";
    const h1Text = h1.replace(/<[^>]+>/g, "").trim();

    const okTitle = !entry.expectTitle || title.includes(entry.expectTitle);
    const okH1 = !entry.expectH1 || h1Text.includes(entry.expectH1);
    const okLink = !entry.expectLink || html.includes(`href="${entry.expectLink}"`) || html.includes(`href='${entry.expectLink}'`);
    const okCanon = canonical.includes("adwrks.co.il");

    results.push({
      path: name,
      status: res.status,
      ok: okTitle && okH1 && okLink && okCanon,
      title,
      metaDescription: desc.slice(0, 160),
      h1: h1Text.slice(0, 120),
      canonical,
      checks: { okTitle, okH1, okLink, okCanon },
    });
  } catch (e) {
    results.push({ path: name, ok: false, error: String(e.message || e) });
  }
}

for (const p of PATHS) await check(p);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ base: BASE, at: new Date().toISOString(), results }, null, 2));
const failed = results.filter((r) => !r.ok);
console.log(`QA: ${results.length - failed.length}/${results.length} passed`);
if (failed.length) {
  console.log("Failures:", failed);
  process.exitCode = 1;
}