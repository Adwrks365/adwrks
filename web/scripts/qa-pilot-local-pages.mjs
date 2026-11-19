/**
 * Fetch local pilot pages: lead, FAQ count, canonical, JSON-LD dates, popups.
 */
const BASE = process.env.QA_BASE || "http://localhost:3000";

const PILOT_HE = [
  { slug: "אסטרטגיות-שיווק-דיגיטלי-2025", body2026: true },
  { slug: "עתיד-ה-seo-כך-ייראה-הקידום-האורגני-ב-2025-ומעב", body2026: true },
  { slug: "seo-2026-ai-answers", body2026: false },
  { slug: "מחיר-קידום-אתרים", body2026: false },
  { slug: "שיווק-בפייסבוק-ואינסטגרם", body2026: true },
];

const PILOT_EN = [
  "/en/digital-marketing-strategies-2025/",
  "/en/future-of-seo-2025/",
  "/en/facebook-instagram-marketing/",
];

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

function articleBody(html) {
  const m = html.match(/class="article-body-html[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/article>/i);
  return m ? m[1] : html;
}

let failed = 0;
for (const item of PILOT_HE) {
  const path = `/${encodeURIComponent(item.slug).replace(/%2F/g, "/")}/`.replace(/\/$/, "") + "/";
  const pathFetch = `/${item.slug}/`;
  const url = `${BASE}${pathFetch}`;
  let res;
  try {
    res = await fetch(url, { redirect: "follow" });
  } catch (e) {
    console.error("FETCH FAIL", pathFetch, e.message);
    failed++;
    continue;
  }
  const html = await res.text();
  const body = articleBody(html);
  const ok = res.ok;
  const lead = body.includes("adwrks-article-lead");
  const body2026 = body.includes("adwrks-pilot-2026-body");
  const canonical = pick(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
  const ldMods = [...html.matchAll(/"dateModified"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  const ldMod = ldMods.find((d) => d.startsWith("2026-11-19")) ?? ldMods[0];
  const ldPub = pick(html, /"datePublished"\s*:\s*"([^"]+)"/);
  const updatedUi = /(עודכן|Updated)/i.test(html) && /(2026-11-19|19\.11\.2026)/.test(html);
  const popup = body.includes('data-open-contextual-popup="true"');
  const faqMarkers = (body.match(/adwrks-article-faq-2026/g) || []).length;
  const h2Faq = (body.match(/<h2[^>]*>[^<]*(שאלות נפוצות|Frequently asked)/gi) || []).length;

  if (!ok) {
    console.error("HTTP", res.status, pathFetch);
    failed++;
  }
  if (!lead) {
    console.error("MISSING LEAD", pathFetch);
    failed++;
  }
  if (item.body2026 && !body2026) {
    console.error("MISSING 2026 BODY", pathFetch);
    failed++;
  }
  if (faqMarkers > 0) {
    console.error("UNEXPECTED PILOT FAQ", pathFetch, faqMarkers);
    failed++;
  }
  if (!updatedUi) {
    console.error("VISIBLE UPDATE DATE", pathFetch);
    failed++;
  }
  if (!ldMod?.startsWith("2026-11-19")) {
    console.error("JSON-LD MOD", pathFetch, ldMod);
    failed++;
  }

  console.log(
    JSON.stringify({ path: pathFetch, ok, lead, body2026, h2Faq, popup, canonical: !!canonical, ldPub, ldMod }),
  );
}

for (const path of PILOT_EN) {
  const url = `${BASE}${path}`;
  const res = await fetch(url);
  const html = await res.text();
  const body = articleBody(html);
  console.log(
    JSON.stringify({
      path,
      ok: res.ok,
      lead: body.includes("adwrks-article-lead"),
      body2026: body.includes("adwrks-pilot-2026-body"),
    }),
  );
}

process.exit(failed ? 1 : 0);