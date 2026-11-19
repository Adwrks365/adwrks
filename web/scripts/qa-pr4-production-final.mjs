/**
 * Final production QA for PR #4 pilot (5 HE articles).
 * QA_BASE=http://localhost:3002 node scripts/qa-pr4-production-final.mjs
 */
const BASE = process.env.QA_BASE || "http://localhost:3002";

const PILOTS = [
  {
    path: "/אסטרטגיות-שיווק-דיגיטלי-2025/",
    id: 21776,
    body2026: true,
    titleYear: "2025",
    popup: false,
  },
  {
    path: "/עתיד-ה-seo-כך-ייראה-הקידום-האורגני-ב-2025-ומעב/",
    id: 21817,
    body2026: true,
    titleYear: "2025",
    popup: false,
  },
  { path: "/seo-2026-ai-answers/", id: 22368, body2026: false, titleYear: "2026", popup: false },
  { path: "/מחיר-קידום-אתרים/", id: 21161, body2026: false, titleYear: null, popup: true },
  {
    path: "/שיווק-בפייסבוק-ואינסטגרם/",
    id: 21578,
    body2026: true,
    titleYear: "2025",
    popup: false,
  },
];

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function articleBody(html) {
  const m = html.match(/class="article-body-html[^"]*"[^>]*>([\s\S]*?)<\/article>/i);
  return m ? m[1] : html;
}

function pickMeta(html, name) {
  const re = new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]+content="([^"]*)"`, "i");
  const alt = new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="${name}"`, "i");
  return (html.match(re) || html.match(alt))?.[1] ?? null;
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

function extractBlock(body, cls) {
  const m = body.match(new RegExp(`<(?:aside|div)[^>]*class="${cls}"[\\s\\S]*?</(?:aside|div)>`, "i"));
  return m ? stripHtml(m[0]) : "";
}

let failed = 0;
const rows = [];

for (const p of PILOTS) {
  const url = `${BASE}${p.path}`;
  const res = await fetch(url, { redirect: "follow" });
  const html = await res.text();
  const body = articleBody(html);
  const issues = [];

  if (!res.ok) issues.push(`HTTP ${res.status}`);

  if (!body.includes("adwrks-article-lead")) issues.push("missing lead");
  if (p.body2026 && !body.includes("adwrks-pilot-2026-body")) issues.push("missing 2026 body block");
  if (p.body2026 && !body.includes("עדכון הקשר (2026)")) issues.push("missing factual 2026 marker");

  const pilotFaq = (body.match(/adwrks-article-faq-2026/g) || []).length;
  if (pilotFaq > 0) issues.push(`pilot FAQ injected (${pilotFaq})`);

  const canon = html.match(/rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  if (!canon?.includes("adwrks.co.il")) issues.push("canonical");
  if (canon && !canon.endsWith(encodeURI(p.path).replace(/%2F/g, "/").replace(/\/$/, "") + "/") && !canon.includes(decodeURIComponent(p.path).slice(1, -1)))
    issues.push("canonical path mismatch");

  const title = html.match(/<title>([^<]*)</i)?.[1];
  const ogTitle = pickMeta(html, "og:title");
  const desc = pickMeta(html, "description");
  if (!title) issues.push("no title");
  if (p.titleYear && title && !title.includes(p.titleYear)) issues.push("title year unexpected");
  if (!desc) issues.push("no meta description");

  const updated =
    /עודכן[^<]{0,40}(19[./\s]*11[./\s]*2026|2026-11-19)/i.test(html) ||
    /dateTime="2026-11-19/i.test(html);
  if (!updated) issues.push("visible update date");

  const ld = ldArticle(html);
  if (!ld?.dateModified?.startsWith("2026-11-19")) issues.push(`JSON-LD mod ${ld?.dateModified}`);
  if (!ld?.datePublished) issues.push("JSON-LD published");

  const popup = body.includes('data-open-contextual-popup="true"');
  if (popup !== p.popup) issues.push(`popup expected ${p.popup} got ${popup}`);

  const leadText = extractBlock(body, "adwrks-article-lead");
  const ctxText = extractBlock(body, "adwrks-pilot-2026-body");
  if (leadText && ctxText && leadText.slice(0, 80) === ctxText.slice(0, 80)) issues.push("lead/2026 body duplicate opener");

  if (issues.length) {
    failed++;
    console.error("FAIL", p.path, issues);
  } else {
    console.log("OK", p.path);
  }

  rows.push({
    path: p.path,
    title: title?.slice(0, 60),
    metaDescLen: desc?.length ?? 0,
    canonical: !!canon,
    lead: !!leadText,
    body2026: body.includes("adwrks-pilot-2026-body"),
    ldMod: ld?.dateModified,
    popup,
    issues,
  });
}

console.log("\n--- summary ---");
console.log(JSON.stringify(rows, null, 2));
process.exit(failed ? 1 : 0);