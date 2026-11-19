/**
 * Production smoke — PR #5 batch2 (11 articles).
 * QA_BASE=https://adwrks.co.il npx tsx scripts/qa-batch5-production.mjs
 */
import {
  countVisibleFaqSections,
  extractArticleBodyFromPageHtml,
} from "../src/lib/content/article-faq-detect.ts";

const BASE = process.env.QA_BASE || "https://adwrks.co.il";

const PAGES = [
  {
    path: "/en/digital-marketing-strategies-2025/",
    locale: "en",
    body2026: true,
    expectLdModPrefix: "2026-11-19",
    expectLdTime: "15:55",
    popup: false,
  },
  { path: "/en/future-of-seo-2025/", locale: "en", body2026: true, expectLdModPrefix: "2026-11-19", expectLdTime: "15:55" },
  { path: "/en/facebook-instagram-marketing/", locale: "en", body2026: true, expectLdModPrefix: "2026-11-19", expectLdTime: "15:55" },
  { path: "/en/seo-2026-ai-answers/", locale: "en", expectLdModPrefix: "2026-11-19", expectLdTime: "15:55" },
  { path: "/en/seo-pricing-guide/", locale: "en", expectLdModPrefix: "2026-11-19", expectLdTime: "15:55", popup: true },
  { path: "/en/google-shopping-guide/", locale: "en", body2026: true, faq: true, expectLdModPrefix: "2026-11-19", expectLdTime: "15:55" },
  { path: "/google-shopping-guide/", locale: "he", body2026: true, faq: true, expectLdModPrefix: "2026-11-19", expectLdTime: "15:55" },
  { path: "/משרד-פרסום-דיגיטלי/", locale: "he", faq: true, expectLdModPrefix: "2026-11-19", popup: false },
  { path: "/סוכנות-שיווק-דיגיטלית/", locale: "he", faq: true, expectLdModPrefix: "2026-11-19" },
  { path: "/אחסון-ותחזוקת-אתרים-למה-זה-חשוב/", locale: "he", expectLdModPrefix: "2026-11-19" },
  { path: "/שיווק-דיגיטלי-לעסקים/", locale: "he", expectLdModPrefix: "2026-11-19" },
];

const UA_MOBILE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function articleBody(html) {
  return extractArticleBodyFromPageHtml(html) || html;
}

function ldArticle(html) {
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [, json] of blocks) {
    try {
      const data = JSON.parse(json);
      const list = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];
      for (const node of list) {
        const t = node["@type"];
        const types = Array.isArray(t) ? t : t ? [t] : [];
        if (types.some((x) => x === "BlogPosting" || x === "Article")) return node;
      }
    } catch {
      /* ignore */
    }
  }
  return null;
}

async function checkPage(p, mobile) {
  const enc = p.path.startsWith("/en/") ? p.path : encodeURI(p.path);
  const url = `${BASE}${enc}`;
  const res = await fetch(url, {
    headers: mobile ? { "User-Agent": UA_MOBILE } : {},
    redirect: "follow",
  });
  const html = await res.text();
  const body = articleBody(html);
  const issues = [];

  if (!res.ok) issues.push(`HTTP ${res.status}`);
  const leads = (body.match(/class="adwrks-article-lead"/g) || []).length;
  if (leads !== 1) issues.push(`lead count ${leads}`);

  if (p.body2026) {
    if (!body.includes("adwrks-pilot-2026-body")) issues.push("missing 2026 body");
    const marker = p.locale === "he" ? "עדכון הקשר (2026)" : "2026 context";
    if (!body.includes(marker)) issues.push(`missing ${marker}`);
  }

  const faqAudit = countVisibleFaqSections(body);
  if (p.faq && faqAudit.totalSections !== 1) issues.push(`faq sections ${faqAudit.totalSections}`);
  if (!p.faq && faqAudit.totalSections > 1) issues.push(`duplicate faq ${JSON.stringify(faqAudit)}`);

  const canon = html.match(/rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  if (!canon?.includes("adwrks.co.il")) issues.push("canonical");
  if (p.locale === "en" && canon && !canon.includes("/en/")) issues.push("canonical not en");

  const hreflang = (html.match(/hreflang="/gi) || []).length;
  if (hreflang < 1) issues.push("no hreflang");

  const ld = ldArticle(html);
  if (!ld?.dateModified?.startsWith(p.expectLdModPrefix)) issues.push(`ld mod ${ld?.dateModified}`);
  if (p.expectLdTime && ld?.dateModified && !ld.dateModified.includes(p.expectLdTime)) {
    issues.push(`ld time expected ${p.expectLdTime} got ${ld.dateModified}`);
  }

  const dir = html.match(/<html[^>]+dir="([^"]+)"/i)?.[1];
  const expectDir = p.locale === "en" ? "ltr" : "rtl";
  if (dir && dir !== expectDir) issues.push(`dir ${dir}`);

  if (p.popup === true && !body.includes('data-open-contextual-popup="true"')) issues.push("missing popup");
  if (p.popup === false && body.includes('data-open-contextual-popup="true"')) issues.push("unexpected popup");

  return { path: p.path, mobile, issues, ldMod: ld?.dateModified, lead: leads === 1 };
}

async function waitForDeploy() {
  const probe = `${BASE}/google-shopping-guide/`;
  for (let i = 0; i < 24; i++) {
    try {
      const html = await (await fetch(probe)).text();
      const body = articleBody(html);
      if (body.includes("class=\"adwrks-article-lead\"") && body.includes("adwrks-pilot-2026-body")) {
        console.log("Deploy probe OK (shopping lead+2026)", `attempt ${i + 1}`);
        return true;
      }
    } catch {
      /* retry */
    }
    console.log("Waiting for production deploy...", i + 1);
    await new Promise((r) => setTimeout(r, 5000));
  }
  return false;
}

const deployed = await waitForDeploy();
if (!deployed) {
  console.error("CRITICAL: batch2 markers not on production after wait");
}

let failed = 0;
const summary = [];

for (const p of PAGES) {
  for (const mobile of [false, true]) {
    const r = await checkPage(p, mobile);
    if (r.issues.length) {
      failed++;
      console.error("FAIL", mobile ? "mobile" : "desktop", p.path, r.issues);
    } else {
      console.log("OK", mobile ? "mobile" : "desktop", p.path, r.ldMod);
    }
    if (!mobile) summary.push({ path: p.path, ldMod: r.ldMod, ok: r.issues.length === 0 });
  }
}

// HE pilot date split (regression)
const heUrl = `${BASE}${encodeURI("/אסטרטגיות-שיווק-דיגיטלי-2025/")}`;
const enUrl = `${BASE}/en/digital-marketing-strategies-2025/`;
const heLd = ldArticle(await (await fetch(heUrl)).text());
const enLd = ldArticle(await (await fetch(enUrl)).text());
if (!heLd?.dateModified?.includes("14:00")) {
  console.error("FAIL HE pilot mod expected 14:00", heLd?.dateModified);
  failed++;
} else {
  console.log("OK HE pilot locale date", heLd.dateModified);
}
if (!enLd?.dateModified?.includes("15:55")) {
  console.error("FAIL EN pair mod expected 15:55", enLd?.dateModified);
  failed++;
} else {
  console.log("OK EN pilot locale date", enLd.dateModified);
}

console.log("\n--- summary ---");
console.log(JSON.stringify({ deployed, failed, pages: summary }, null, 2));
process.exit(failed || !deployed ? 1 : 0);