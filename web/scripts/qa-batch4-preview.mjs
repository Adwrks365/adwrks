/**
 * Preview smoke — Batch4 PR (#8): ratings GET, SEO regression, batch4 LD dates.
 * QA_BASE=https://adwrks-git-feat-batch4-...vercel.app npx tsx scripts/qa-batch4-preview.mjs
 */
import {
  countVisibleFaqSections,
  extractArticleBodyFromPageHtml,
} from "../src/lib/content/article-faq-detect.ts";

const BASE = (process.env.QA_BASE || "").replace(/\/$/, "");
if (!BASE) {
  console.error("Set QA_BASE to the Vercel Preview origin.");
  process.exit(1);
}

const RATING_PATHS = [
  { label: "old-he", path: "/קידום-אתרים-ברוסית/" },
  { label: "new-he", path: "/פרסום-בגוגל-7-אסטרטגיות/" },
  { label: "old-en", path: "/en/google-seo/" },
  { label: "new-en", path: "/en/seo-guide-for-beginners/" },
];

const PAGES = [
  {
    path: "/קידום-אתרים-ברוסית/",
    ldDate: "2026-11-19",
    batch4: false,
    minDetails: 2,
  },
  {
    path: "/פרסום-בגוגל-7-אסטרטגיות/",
    ldDate: "2026-11-19",
    batch4: true,
    minDetails: 2,
  },
  {
    path: "/בדיקת-מהירות-אתר/",
    pagespeed: true,
  },
];

const UA_MOBILE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15";

function articleBody(html) {
  return extractArticleBodyFromPageHtml(html) || html;
}

function ldArticle(html) {
  for (const [, json] of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
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

async function checkRatingsConfigured() {
  const probe = `${BASE}/api/articles/rate?path=${encodeURIComponent("/קידום-אתרים-ברוסית/")}`;
  const res = await fetch(probe, { redirect: "follow" });
  const data = await res.json().catch(() => ({}));
  if (res.status === 503) {
    return { configured: false, reason: data.message };
  }
  if (res.status === 401 && data?.error?.code === "401") {
    return { configured: "unknown", reason: "Vercel Authentication on Preview" };
  }
  return { configured: data.ok === true, sample: data };
}

async function checkRatingGet(path, label) {
  const url = `${BASE}/api/articles/rate?path=${encodeURIComponent(path)}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (res.status === 404 && data.message === "מאמר לא נמצא.") {
    return { label, ok: false, issue: "404 not found" };
  }
  if (!res.ok) {
    return { label, ok: false, issue: `HTTP ${res.status} ${data.message || ""}` };
  }
  if (data.ok !== true) {
    return { label, ok: false, issue: "ok:false" };
  }
  return {
    label,
    ok: true,
    totalVoteCount: data.totalVoteCount,
    hasVoted: data.hasVoted,
  };
}

function cookieHeaderFromSetCookie(headers) {
  const raw = headers.getSetCookie?.() ?? [];
  const vid = raw
    .map((c) => c.split(";")[0])
    .find((c) => c.startsWith("adwrks_vid="));
  return vid ?? "";
}

/** One controlled submit + duplicate on Preview (shared Supabase — not production hostname). */
async function checkRatingSubmitDuplicate(path) {
  if (process.env.QA_RATINGS_SKIP_SUBMIT === "1") {
    return { skipped: true };
  }
  const getUrl = `${BASE}/api/articles/rate?path=${encodeURIComponent(path)}`;
  const warm = await fetch(getUrl);
  const voterCookie = cookieHeaderFromSetCookie(warm.headers);
  const headers = {
    "Content-Type": "application/json",
    ...(voterCookie ? { Cookie: voterCookie } : {}),
  };
  const body = { articlePath: path, rating: 4 };
  const first = await fetch(`${BASE}/api/articles/rate`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const firstData = await first.json().catch(() => ({}));
  if (!first.ok) {
    return { ok: false, issue: `first POST ${first.status}`, firstData, hadCookie: Boolean(voterCookie) };
  }
  const second = await fetch(`${BASE}/api/articles/rate`, {
    method: "POST",
    headers,
    body: JSON.stringify({ ...body, rating: 5 }),
  });
  const secondData = await second.json().catch(() => ({}));
  const dupBlocked =
    second.ok && (secondData.accepted === false || firstData.accepted === true);
  return {
    ok: first.ok && dupBlocked,
    first: { accepted: firstData.accepted, total: firstData.totalVoteCount },
    second: { accepted: secondData.accepted, hasVoted: secondData.hasVoted },
    hadCookie: Boolean(voterCookie),
  };
}

async function checkPage(p, mobile) {
  const url = `${BASE}${encodeURI(p.path)}`;
  const res = await fetch(url, {
    headers: mobile ? { "User-Agent": UA_MOBILE } : {},
    redirect: "follow",
  });
  const html = await res.text();
  const body = articleBody(html);
  const issues = [];

  if (!res.ok) issues.push(`HTTP ${res.status}`);
  const canon = html.match(/rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
  if (!canon?.includes("adwrks.co.il")) issues.push(`canonical ${canon}`);
  const hreflangCount = (html.match(/hreflang="/gi) || []).length;
  if (!p.pagespeed && hreflangCount < 1 && !html.includes('rel="alternate"')) {
    issues.push("hreflang");
  }
  if (html.includes("AggregateRating")) issues.push("aggregateRating in ld");

  if (p.pagespeed) {
    if (!body.includes("data-adwrks-pagespeed-insights")) issues.push("no pagespeed embed");
    if (!body.includes("<h1")) issues.push("no h1");
    const h2 = (body.match(/<h2/gi) || []).length;
    if (h2 < 5) issues.push(`h2 count ${h2}`);
  } else {
    if (p.batch4 && (body.match(/class="adwrks-article-lead"/g) || []).length !== 1) {
      issues.push("lead");
    }
    if (!body.includes("adwrks-faq-accordion")) issues.push("no accordion");
    const details = (body.match(/<details class="adwrks-faq-item"/g) || []).length;
    if (details < (p.minDetails ?? 1)) issues.push(`details ${details}`);
    const faq = countVisibleFaqSections(body);
    if (faq.totalSections > 1) issues.push(`faq sections ${faq.totalSections}`);
    const ld = ldArticle(html);
    if (p.ldDate && p.batch4 && !ld?.dateModified?.startsWith(p.ldDate)) {
      issues.push(`ld modified ${ld?.dateModified}`);
    }
  }

  const ratingErr = html.includes("מאמר לא נמצא") && html.includes("article-rating");
  if (ratingErr) issues.push("rating error visible");

  return { path: p.path, mobile, issues };
}

let failed = 0;

const cfg = await checkRatingsConfigured();
console.log("ratings_configured", cfg);

if (cfg.configured === true) {
  for (const r of RATING_PATHS) {
    const out = await checkRatingGet(r.path, r.label);
    console.log(out.ok ? "OK rating GET" : "FAIL rating GET", out);
    if (!out.ok) failed++;
  }
  const submit = await checkRatingSubmitDuplicate("/פרסום-בגוגל-7-אסטרטגיות/");
  if (submit.skipped) {
    console.log("SKIP rating submit QA_RATINGS_SKIP_SUBMIT=1");
  } else {
    console.log(submit.ok ? "OK rating submit+dup" : "FAIL rating submit", submit);
    if (!submit.ok) failed++;
  }
} else {
  console.log(
    "SKIP rating GET/submit —",
    cfg.reason || "Supabase unavailable or Preview protected",
  );
}

for (const p of PAGES) {
  for (const mobile of [false, true]) {
    const r = await checkPage(p, mobile);
    if (r.issues.length) {
      console.error("FAIL page", r);
      failed++;
    } else {
      console.log("OK page", r.path, mobile ? "mobile" : "desktop");
    }
  }
}

process.exit(failed ? 1 : 0);