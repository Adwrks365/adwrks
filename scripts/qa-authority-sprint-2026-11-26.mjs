/**
 * QA for authority/AI sprint — links, PR#22 meta unchanged, build smoke paths.
 */
import fs from "node:fs";

const BASE = process.env.QA_BASE || "http://localhost:3000";
const OUT = "migration-audit/qa-authority-sprint-2026-11-26.json";

const PR22_META = [
  { path: "/seo/", title: "חברת קידום אתרים | שירותי SEO אורגני ⋆ Adwrks 365" },
  { path: "/google-ads/", title: "פרסום בגוגל לעסקים | ניהול קמפיינים ⋆ Adwrks 365" },
];

const EDITED_ARTICLES = [
  "/קידום-אתרים-מדריך-למתחילים/",
  "/כמה-עולה-לבנות-אתר-אינטרנט-בוורדפרס/",
  "/קידום-אתרים-ברוסית/",
  "/פרסום-עסק-חינם/",
];
const EDITED_PAGES = ["/about-us/", "/seo/"];

const results = [];

async function check(path, extra = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url);
  const html = await res.text();
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "";
  const row = { path, status: res.status, title, ...extra, ok: res.status === 200 };
  if (extra.expectTitle) row.ok = row.ok && title === extra.expectTitle;
  if (extra.marker) row.ok = row.ok && html.includes(extra.marker);
  if (extra.href) row.ok = row.ok && (html.includes(`href="${extra.href}"`) || html.includes(`href='${extra.href}'`));
  results.push(row);
}

for (const m of PR22_META) await check(m.path, { expectTitle: m.title, note: "PR22 meta lock" });
for (const p of EDITED_ARTICLES) {
  await check(p, { marker: "adwrks-authority-link-2026", note: "edited article" });
}
for (const p of EDITED_PAGES) await check(p, { note: "edited page (no article marker)" });

const authorityArticles = [
  "/קידום-אתרים-מדריך-למתחילים/",
  "/כמה-עולה-לבנות-אתר-אינטרנט-בוורדפרס/",
  "/פרסום-עסק-חינם/",
  "/פלטפורמה-בניית-אתר/",
  "/פרסום-בגוגל-7-אסטרטגיות/",
];
for (const p of authorityArticles) {
  await check(p, { marker: "adwrks-authority-link-2026", note: "authority inject" });
}

// links we added (sample)
const linkSamples = [
  { path: "/קידום-אתרים-מדריך-למתחילים/", href: "/seo/" },
  { path: "/כמה-עולה-פרסום-בגוגל/", href: "/google-ads/" },
  { path: "/פלטפורמה-בניית-אתר/", href: "/website-building/" },
];
for (const s of linkSamples) await check(s.path, { href: s.href, note: "internal link" });

fs.mkdirSync("migration-audit", { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ base: BASE, at: new Date().toISOString(), results }, null, 2));
const failed = results.filter((r) => !r.ok);
console.log(`QA: ${results.length - failed.length}/${results.length}`);
if (failed.length) {
  console.log(failed);
  process.exitCode = 1;
}