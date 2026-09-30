/**
 * Phase 4B pre-launch audit. Read-only against production; local checks against localhost.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const AUDIT = path.join(ROOT, "migration-audit");
const LOCAL = process.env.MIGRATION_VALIDATE_BASE || "http://localhost:3000";
const PROD = "https://adwrks.co.il";

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(AUDIT, name), "utf8"));
}

function pathKey(url) {
  const u = new URL(url, PROD);
  let p = decodeURIComponent(u.pathname);
  if (!p.endsWith("/")) p += "/";
  return p;
}

async function fetchText(url, redirect = "follow") {
  const res = await fetch(url, {
    headers: { "User-Agent": "adwrks-phase-4b/1.0" },
    redirect,
  });
  return { status: res.status, location: res.headers.get("location"), finalUrl: res.url, text: await res.text() };
}

function meta(html, name, attr = "name") {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)["']`, "i");
  const alt = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, "i");
  return (html.match(re)?.[1] || html.match(alt)?.[1] || "").replace(/&#x27;/g, "'").trim();
}

function titleOf(html) {
  return (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "").trim();
}

function canonicalOf(html) {
  const re = /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i;
  const alt = /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i;
  return html.match(re)?.[1] || html.match(alt)?.[1] || "";
}

function h1s(html) {
  return [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  );
}

async function pool(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return out;
}

function extractRating(html) {
  const avg = html.match(/js-rmp-avg-rating">([^<]*)</)?.[1]?.trim() || null;
  const votes = html.match(/js-rmp-vote-count">([^<]*)</)?.[1]?.trim() || null;
  const postId = html.match(/data-post-id="(\d+)"/)?.[1] || null;
  const hasWidget = html.includes("rmp-rating-widget");
  let schema = null;
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of blocks) {
    if (block[1].includes("AggregateRating")) {
      try {
        const data = JSON.parse(block[1]);
        const list = Array.isArray(data) ? data : [data];
        for (const node of list) {
          if (node.aggregateRating) {
            schema = {
              type: node["@type"] || null,
              ratingValue: node.aggregateRating.ratingValue ?? null,
              ratingCount: node.aggregateRating.ratingCount ?? null,
              bestRating: node.aggregateRating.bestRating ?? null,
            };
          }
        }
      } catch {
        schema = { parseError: true };
      }
    }
  }
  return { hasWidget, postId, avg, votes, schema };
}

const BAD_HOST = /localhost|127\.0\.0\.1|vercel\.app|10\.\d+\.\d+\.\d+/i;

async function main() {
  const urls = readJson("urls.json").sitemapUrls.map(pathKey);
  const posts = readJson("posts.json");
  const postByPath = new Map(posts.map((p) => [pathKey(p.link), p]));
  const postPaths = urls.filter((u) => postByPath.has(u));

  console.log(`Local crawl ${urls.length}; rating harvest ${postPaths.length}`);

  const localRows = await pool(urls, 6, async (key) => {
    const res = await fetchText(`${LOCAL}${key === "/" ? "/" : key}`);
    const html = res.text;
    const canonical = canonicalOf(html);
    const ogUrl = meta(html, "og:url", "property");
    const httpResources = [...html.matchAll(/(?:src|href)=["']http:\/\/[^"']+/gi)].map((m) => m[0]).slice(0, 8);
    const wpHotlinks = (html.match(/https?:\/\/(?:www\.)?adwrks\.co\.il\/wp-content\/uploads/g) || []).length;
    return {
      path: key,
      status: res.status,
      title: titleOf(html),
      description: meta(html, "description"),
      canonical,
      robots: meta(html, "robots"),
      h1: h1s(html),
      ogType: meta(html, "og:type", "property"),
      ogUrl,
      badCanonical: BAD_HOST.test(canonical) || BAD_HOST.test(ogUrl),
      wwwCanonical: /www\.adwrks\.co\.il/i.test(canonical),
      localhostInHtml: /localhost|127\.0\.0\.1|vercel\.app/i.test(html),
      httpResources,
      wpHotlinks,
      aggregateRating: html.includes("AggregateRating"),
    };
  });

  const ratings = await pool(postPaths, 5, async (key) => {
    const post = postByPath.get(key);
    const res = await fetchText(`${PROD}${key}`);
    const extracted = extractRating(res.text);
    const votes = extracted.votes == null ? null : Number(extracted.votes);
    return {
      productionUrl: `${PROD}${key}`,
      localRoute: key,
      wordpressId: post.id,
      source: "live production HTML, Rate My Post widget (read-only)",
      plugin: "rate-my-post",
      recovered: extracted.hasWidget && extracted.avg != null && extracted.votes != null,
      average: extracted.avg,
      voteCount: Number.isFinite(votes) ? votes : null,
      widgetPostId: extracted.postId,
      productionSchema: extracted.schema,
      httpStatus: res.status,
    };
  });

  const withRatings = ratings.filter((r) => r.recovered && (r.voteCount || 0) > 0);
  const withoutRatings = ratings.filter((r) => !r.recovered || !r.voteCount);

  const slashSamples = ["/", "/seo/", "/about-us/", "/blog/", "/google-ads/", "/%D7%A7%D7%99%D7%93%D7%95%D7%9D-%D7%90%D7%AA%D7%A8%D7%99%D7%9D-%D7%91%D7%92%D7%95%D7%92%D7%9C/"];
  const slash = [];
  for (const sample of slashSamples) {
    const withSlash = sample.endsWith("/") ? sample : `${sample}/`;
    const without = withSlash === "/" ? "/" : withSlash.replace(/\/$/, "");
    const a = await fetchText(`${LOCAL}${withSlash}`);
    const b = without === "/" ? a : await fetchText(`${LOCAL}${without}`, "manual");
    slash.push({
      path: withSlash,
      withSlash: a.status,
      withoutSlash: without === "/" ? a.status : b.status,
      withoutLocation: b.location || null,
    });
  }

  const missing = await fetchText(`${LOCAL}/this-page-does-not-exist-4b/`);
  const plans = await fetchText(`${LOCAL}/plans/`, "manual");
  const landing = await fetchText(`${LOCAL}/landing-page/`);
  const websiteDesign = await fetchText(`${LOCAL}/website-design/`);
  const organic = await fetchText(`${LOCAL}/${encodeURIComponent("קידום-אורגני")}/`);
  const prodLanding = await fetchText(`${PROD}/landing-page/`);
  const prodDesign = await fetchText(`${PROD}/website-design/`);
  const prodOrganic = await fetchText(`${PROD}/${encodeURIComponent("קידום-אורגני")}/`);
  const prodHome = await fetchText(`${PROD}/`);
  const localHome = localRows.find((r) => r.path === "/");

  const legal = ["/privacy-policy/", "/accessibility-statement/", "/terms-of-use/"];
  const legalRows = [];
  for (const key of legal) {
    const res = await fetchText(`${LOCAL}${key}`);
    legalRows.push({
      path: key,
      status: res.status,
      title: titleOf(res.text),
      h1: h1s(res.text),
      textLength: res.text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length,
      elementor: res.text.includes("elementor-widget"),
    });
  }

  const assets = [
    "/wp-content/uploads/cropped-adwrks-white-32x32.webp",
    "/wp-content/uploads/cropped-adwrks-white-180x180.webp",
    "/wp-content/uploads/cropped-adwrks-white-192x192.webp",
    "/favicon.ico",
  ];
  const assetStatus = [];
  for (const asset of assets) {
    const res = await fetch(LOCAL + asset, { method: "HEAD" });
    assetStatus.push({ asset, status: res.status });
  }

  const formCases = [
    { name: "missing consent", body: { name: "A", phone: "050", email: "a@b.co" }, expect: 400 },
    { name: "article email optional", body: { name: "A", phone: "050", formType: "article", privacyConsent: true }, expect: 200 },
    { name: "honeypot", body: { name: "A", phone: "050", email: "a@b.co", website: "spam", privacyConsent: true }, expect: 200 },
    { name: "bad email", body: { name: "A", phone: "050", email: "nope", privacyConsent: true }, expect: 400 },
  ];
  const forms = [];
  for (const test of formCases) {
    const res = await fetch(`${LOCAL}/api/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(test.body),
    });
    forms.push({ name: test.name, status: res.status, expected: test.expect, pass: res.status === test.expect });
  }

  const contamination = localRows.filter((r) => r.badCanonical || r.wwwCanonical || r.localhostInHtml || r.httpResources.length);
  const not200 = localRows.filter((r) => r.status !== 200);
  const multiH1 = localRows.filter((r) => r.h1.length !== 1);
  const hotlinkPages = localRows.filter((r) => r.wpHotlinks > 0).length;

  const summary = {
    generatedAt: new Date().toISOString(),
    localPages: localRows.length,
    localNot200: not200.map((r) => ({ path: r.path, status: r.status })),
    contamination: contamination.map((r) => ({
      path: r.path,
      badCanonical: r.badCanonical,
      www: r.wwwCanonical,
      localhostInHtml: r.localhostInHtml,
      httpResources: r.httpResources,
    })),
    multiOrMissingH1: multiH1.map((r) => ({ path: r.path, h1: r.h1 })),
    stagingNoindex: localRows.filter((r) => /noindex/i.test(r.robots)).length,
    aggregateRatingLocalPages: localRows.filter((r) => r.aggregateRating).length,
    wpUploadHotlinkPages: hotlinkPages,
    slash,
    missingPage: { status: missing.status, canonical: canonicalOf(missing.text), title: titleOf(missing.text), h1: h1s(missing.text) },
    plans: { status: plans.status, location: plans.location },
    legacy: {
      landingLocal: landing.status,
      landingProd: prodLanding.status,
      landingProdRobots: meta(prodLanding.text, "robots"),
      websiteDesignLocal: websiteDesign.status,
      websiteDesignProd: prodDesign.status,
      organicLocal: organic.status,
      organicProd: prodOrganic.status,
    },
    homepage: {
      productionH1: h1s(prodHome.text),
      localH1: localHome?.h1 || [],
      productionTitle: titleOf(prodHome.text),
      localTitle: localHome?.title || "",
      oldH1StillOnLocal: (localHome ? localRows.find((r) => r.path === "/") : null) &&
        (await fetchText(`${LOCAL}/`)).text.includes("סוכנות שיווק דיגיטלי ואסטרטגיית צמיחה"),
    },
    legalRows,
    assetStatus,
    forms,
    ratings: {
      postsChecked: ratings.length,
      recoveredWithVotes: withRatings.length,
      withoutVotesOrWidget: withoutRatings.length,
      schemaTypes: [...new Set(ratings.map((r) => r.productionSchema?.type).filter(Boolean))],
    },
  };

  fs.writeFileSync(path.join(AUDIT, "phase-4b-summary.json"), JSON.stringify(summary, null, 2));
  fs.writeFileSync(
    path.join(AUDIT, "article-rating-migration.json"),
    JSON.stringify(
      {
        generatedAt: summary.generatedAt,
        plugin: "rate-my-post",
        source: "Live production HTML widget text and data-post-id. Not estimated. localStorage votes are not included.",
        note: "Production also emits AggregateRating inside a CreativeWorkSeason JSON-LD block from Rate My Post. That schema type was not added or extended in Next.js beyond the previously captured Rank Math/page JSON-LD. Do not treat these counts as a new AggregateRating implementation.",
        postsChecked: ratings.length,
        withVotes: withRatings.length,
        withoutVotes: ratings.length - withRatings.length,
        articles: ratings,
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
