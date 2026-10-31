/**
 * Production smoke — case study sections (HE + EN).
 * Run after deploy: node web/scripts/qa-case-studies-prod.mjs
 */
const BASE = "https://adwrks.co.il";

const pages = [
  {
    path: "/seo/",
    needHe: [
      "31 בעלייה",
      "10 בעלייה",
      "28 בירידה",
      "הובלות בזול בירושלים",
      "52 → 23.52",
      "33.11 → 19.50",
      "sp-case-study-card",
    ],
    needEn: ["31 up", "10 up", "28 down", "33.11 → 19.50", "52 → 23.52", "sp-case-study-card"],
    forbid: ["הובלות בבית שמש", "245-608"],
  },
  {
    path: "/google-ads/",
    needHe: ["450", "350%", "1–31 באוקטובר 2026", "sp-case-study-card"],
    needEn: ["450", "350%", "October 1–31, 2026", "sp-case-study-card"],
    forbid: ["245-608"],
  },
  {
    path: "/website-building/",
    needHe: ["450", "350%", "sp-case-study-card"],
    needEn: ["450", "350%", "sp-case-study-card"],
    forbid: [],
  },
  {
    path: "/social-media-management/",
    needHe: ["לידים מטופס", "שיחות מסנג", "₪14.40", "₪34.31", "sp-case-study-card"],
    needEn: ["Form leads", "Messaging conversations", "₪14.40", "₪34.31", "sp-case-study-card"],
    forbid: ["13 לידים מטופס", "13 form leads only"],
  },
];

const homeChecks = {
  path: "/",
  need: ["350%", "טל שינה"],
};

async function checkPage({ path, need, forbid = [] }) {
  const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const html = await res.text();
  const missing = need.filter((n) => !html.includes(n));
  const forbidden = forbid.filter((n) => html.includes(n));
  return {
    path,
    status: res.status,
    ok: res.ok && missing.length === 0 && forbidden.length === 0,
    missing,
    forbidden,
    canonical: html.match(/rel="canonical" href="([^"]+)"/)?.[1],
    hreflangCount: (html.match(/hreflang="/g) || []).length,
    hasCaseSection: html.includes("sp-case-study"),
    tel: html.includes("tel:"),
    whatsapp: html.includes("wa.me") || html.includes("whatsapp"),
  };
}

const results = [];
for (const p of pages) {
  results.push(await checkPage({ path: p.path, need: p.needHe, forbid: p.forbid }));
  const enPath = p.path === "/seo/" ? "/en/seo/" : `/en${p.path}`;
  results.push(await checkPage({ path: enPath, need: p.needEn, forbid: p.forbid }));
}
results.push(await checkPage({ path: homeChecks.path, need: homeChecks.need }));

const failed = results.filter((r) => !r.ok);
console.log(JSON.stringify({ ok: failed.length === 0, results }, null, 2));
process.exit(failed.length ? 1 : 0);
