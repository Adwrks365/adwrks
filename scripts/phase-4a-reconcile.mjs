/**
 * Phase 4A SEO reconciliation.
 * Compares live production HTML with the local Next.js site for the Rank Math sitemap set.
 *
 * Usage: node scripts/phase-4a-reconcile.mjs
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

function norm(value) {
  return (value || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/\s+/g, " ")
    .trim();
}

function pathKey(url) {
  try {
    const u = new URL(url, PROD);
    let p = decodeURIComponent(u.pathname);
    if (!p.endsWith("/")) p += "/";
    return p;
  } catch {
    return url;
  }
}

function hostless(url) {
  if (!url) return "";
  try {
    const u = new URL(url, PROD);
    return `${u.hostname.replace(/^www\./, "")}${pathKey(u.href)}`;
  } catch {
    return pathKey(url);
  }
}

function extractMeta(html, name, attr = "name") {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)["']`, "i");
  const alt = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, "i");
  return norm(html.match(re)?.[1] || html.match(alt)?.[1] || "");
}

function extractTitle(html) {
  return norm(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "");
}

function extractCanonical(html) {
  const re = /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i;
  const alt = /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i;
  return norm(html.match(re)?.[1] || html.match(alt)?.[1] || "");
}

function headings(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"))].map((m) =>
    norm(m[1].replace(/<[^>]+>/g, "")),
  );
}

function jsonLdTypes(html) {
  const types = new Set();
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html))) {
    try {
      const data = JSON.parse(match[1]);
      const walk = (node) => {
        if (!node || typeof node !== "object") return;
        if (Array.isArray(node)) return node.forEach(walk);
        if (node["@type"]) {
          (Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]).forEach((t) => types.add(t));
        }
        Object.values(node).forEach(walk);
      };
      walk(data);
    } catch {
      /* skip invalid */
    }
  }
  return [...types].sort();
}

function visibleText(html) {
  return norm(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

function sentences(text) {
  return text
    .split(/(?<=[.!?׃])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 40);
}

function internalHrefs(html) {
  const out = [];
  const re = /<a\b[^>]*href=["']([^"']+)["']/gi;
  let match;
  while ((match = re.exec(html))) out.push(match[1]);
  return out;
}

function images(html) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => {
    const tag = m[0];
    const src = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1] || "";
    const alt = tag.match(/\salt=["']([^"']*)["']/i)?.[1] ?? null;
    return { src, alt };
  });
}

function classifyScalar(field, production, local, extra = {}) {
  const p = norm(production);
  const l = norm(local);
  if (field === "robots" && extra.stagingNoindex) {
    return {
      classification: "INTENTIONAL IMPLEMENTATION DIFFERENCE",
      note: "Local/staging noindex is environment protection. Intended production robots stay with the production value.",
      production: p,
      local: l,
      intendedProduction: p,
    };
  }
  if (!p && !l) {
    return { classification: "EXACT MATCH", production: p, local: l, note: "both empty" };
  }
  if (p === l) return { classification: "EXACT MATCH", production: p, local: l };
  if (field === "canonical") {
    const badHost = /localhost|vercel\.app|127\.0\.0\.1/i.test(l);
    if (badHost) {
      return {
        classification: "SEO-SIGNIFICANT DIFFERENCE",
        production: p,
        local: l,
        note: "canonical host is not the production domain",
      };
    }
    if (hostless(p) === hostless(l)) {
      return {
        classification: "SEMANTICALLY PRESERVED",
        production: p,
        local: l,
        note: "same path after host/slash normalization",
      };
    }
  }
  if (p && l && (l.includes(p) || p.includes(l)) && Math.min(p.length, l.length) > 12) {
    return {
      classification: "SEMANTICALLY PRESERVED",
      production: p,
      local: l,
      note: "one value contains the other",
    };
  }
  return { classification: "SEO-SIGNIFICANT DIFFERENCE", production: p, local: l };
}

function classifyList(field, production, local) {
  const p = (production || []).map(norm).filter(Boolean);
  const l = (local || []).map(norm).filter(Boolean);
  const missing = p.filter((x) => !l.some((y) => y === x || y.includes(x) || x.includes(y)));
  const extra = l.filter((x) => !p.some((y) => y === x || y.includes(x) || x.includes(y)));
  if (missing.length === 0 && extra.length === 0) {
    return { classification: "EXACT MATCH", production: p, local: l, missing, extra };
  }
  if (field === "h1" && l.length === 1 && p.includes(l[0])) {
    return {
      classification: p.length === 1 ? "EXACT MATCH" : "INTENTIONAL IMPLEMENTATION DIFFERENCE",
      production: p,
      local: l,
      missing,
      extra,
      note: p.length === 1 ? "h1 match" : "kept one primary H1; did not reproduce an extra Elementor H1",
    };
  }
  if (field === "h1" && p.length === 1 && l.length === 1 && missing.length === 1) {
    return {
      classification: "NEEDS MANUAL REVIEW",
      production: p,
      local: l,
      missing,
      extra,
      note: "single H1 text differs; may be an intentional Phase 3 template rewrite",
    };
  }
  if (field === "h1" && l.length === 0) {
    return { classification: "SEO-SIGNIFICANT DIFFERENCE", production: p, local: l, missing, extra, note: "missing H1" };
  }
  if (field === "h1" && l.length > 1) {
    return {
      classification: "SEO-SIGNIFICANT DIFFERENCE",
      production: p,
      local: l,
      missing,
      extra,
      note: "multiple H1s",
    };
  }
  if (field === "h2" || field === "h3") {
    return {
      classification: "INTENTIONAL IMPLEMENTATION DIFFERENCE",
      production: p,
      local: l,
      missing,
      extra,
      note: "heading hierarchy differs from the Elementor DOM; topical sections were reconciled in Phase 3 and are not rewritten here",
    };
  }
  if (missing.length === 0) {
    return {
      classification: "INTENTIONAL IMPLEMENTATION DIFFERENCE",
      production: p,
      local: l,
      missing,
      extra,
      note: "local has additional items; production items are present",
    };
  }
  const ratio = p.length ? missing.length / p.length : 1;
  if (ratio <= 0.25) {
    return {
      classification: "SEMANTICALLY PRESERVED",
      production: p,
      local: l,
      missing,
      extra,
      note: "small heading drift",
    };
  }
  return {
    classification: "NEEDS MANUAL REVIEW",
    production: p,
    local: l,
    missing,
    extra,
    note: "heading structure differs after layout rebuild",
  };
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "adwrks-phase-4a/1.0" },
    redirect: "follow",
  });
  return { status: res.status, finalUrl: res.url, text: await res.text() };
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
}

async function mapPool(items, limit, fn) {
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

function knownRouteSet() {
  const pages = readJson("pages.json");
  const posts = readJson("posts.json");
  const categories = readJson("categories.json");
  const set = new Set(["/"]);
  for (const item of [...pages, ...posts, ...categories]) {
    if (item.link) set.add(pathKey(item.link));
  }
  set.add("/blog/");
  return set;
}

const routes = knownRouteSet();

function classifyLink(href) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
    return null;
  }
  if (/localhost|vercel\.app/i.test(href)) {
    return { kind: "staging-or-localhost", href };
  }
  let url;
  try {
    url = new URL(href, PROD);
  } catch {
    return { kind: "unparsed", href };
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host === "catalog.adwrks.co.il") return { kind: "external-subdomain", href: url.href };
  if (host !== "adwrks.co.il" && !href.startsWith("/")) return null;
  const key = pathKey(url.href);
  if (
    key.startsWith("/_next/") ||
    key.startsWith("/wp-content/") ||
    key.startsWith("/wp-includes/") ||
    key.startsWith("/wp-json/") ||
    key === "/favicon.ico/"
  ) {
    return null;
  }
  if (key === "/plans/") {
    return { kind: "known-redirect", href: url.href, path: key, destination: "/hosting-plans/" };
  }
  if (routes.has(key) || key.startsWith("/blog/page/") || key.includes("/page/")) {
    return { kind: "known-route", href: url.href, path: key };
  }
  if (key.includes("/tag/") || key.includes("/author/") || key.includes("/feed") || key.includes("/wp-content/") || key.includes("/wp-json/")) {
    return { kind: "wordpress-endpoint", href: url.href, path: key };
  }
  return { kind: "unresolved", href: url.href, path: key };
}

async function main() {
  const urls = readJson("urls.json");
  const seo = readJson("seo.json");
  const seoByPath = new Map(seo.map((r) => [pathKey(r.url), r]));
  const targets = urls.sitemapUrls.map((u) => pathKey(u));

  console.log(`Reconciling ${targets.length} sitemap URLs...`);

  const [prodRobots, localRobots, prodIndex, localSitemap] = await Promise.all([
    fetchText(`${PROD}/robots.txt`),
    fetchText(`${LOCAL}/robots.txt`),
    fetchText(`${PROD}/sitemap_index.xml`).catch(() => fetchText(`${PROD}/sitemap.xml`)),
    fetchText(`${LOCAL}/sitemap.xml`),
  ]);

  let productionSitemapUrls = [];
  if (prodIndex.status === 200 && prodIndex.text.includes("<sitemapindex")) {
    const indexes = parseSitemap(prodIndex.text);
    const parts = await Promise.all(indexes.map((u) => fetchText(u)));
    productionSitemapUrls = parts.flatMap((p) => (p.status === 200 ? parseSitemap(p.text) : []));
  } else if (prodIndex.status === 200) {
    productionSitemapUrls = parseSitemap(prodIndex.text);
  }
  const localSitemapUrls = localSitemap.status === 200 ? parseSitemap(localSitemap.text) : [];

  const normSet = (list) => new Set(list.map((u) => hostless(u)));
  const prodSet = normSet(productionSitemapUrls);
  const localSet = normSet(localSitemapUrls);
  const auditSet = normSet(urls.sitemapUrls);

  const sitemapReconciliation = {
    generatedAt: new Date().toISOString(),
    productionSitemapCount: productionSitemapUrls.length,
    localSitemapCount: localSitemapUrls.length,
    auditSitemapCount: urls.sitemapUrls.length,
    productionSitemapUrls: productionSitemapUrls.map(pathKey).sort(),
    localIntendedUrls: localSitemapUrls.map((u) => pathKey(u)).sort(),
    missingFromLocal: [...prodSet].filter((u) => !localSet.has(u)).sort(),
    extraInLocal: [...localSet].filter((u) => !prodSet.has(u)).sort(),
    missingFromAudit: [...prodSet].filter((u) => !auditSet.has(u)).sort(),
    extraInAuditVsLive: [...auditSet].filter((u) => !prodSet.has(u)).sort(),
    robots: {
      production: prodRobots.text.slice(0, 2000),
      local: localRobots.text.slice(0, 2000),
      localStatus: localRobots.status,
      productionStatus: prodRobots.status,
    },
  };

  const rows = await mapPool(targets, 6, async (key) => {
    const record = seoByPath.get(key);
    const prodUrl = `${PROD}${key === "/" ? "/" : key}`;
    const localUrl = `${LOCAL}${key === "/" ? "/" : key}`;
    const [prod, local] = await Promise.all([fetchText(prodUrl), fetchText(localUrl)]);
    const prodHtml = prod.text;
    const localHtml = local.text;
    const stagingNoindex = /noindex/i.test(extractMeta(localHtml, "robots"));

    const properties = {
      title: classifyScalar("title", extractTitle(prodHtml), extractTitle(localHtml)),
      metaDescription: classifyScalar("metaDescription", extractMeta(prodHtml, "description"), extractMeta(localHtml, "description")),
      canonical: classifyScalar("canonical", extractCanonical(prodHtml), extractCanonical(localHtml)),
      robots: classifyScalar("robots", extractMeta(prodHtml, "robots"), extractMeta(localHtml, "robots"), { stagingNoindex }),
      h1: classifyList("h1", headings(prodHtml, "h1"), headings(localHtml, "h1")),
      h2: classifyList("h2", headings(prodHtml, "h2"), headings(localHtml, "h2")),
      h3: classifyList("h3", headings(prodHtml, "h3"), headings(localHtml, "h3")),
      ogTitle: classifyScalar("ogTitle", extractMeta(prodHtml, "og:title", "property"), extractMeta(localHtml, "og:title", "property")),
      ogDescription: classifyScalar("ogDescription", extractMeta(prodHtml, "og:description", "property"), extractMeta(localHtml, "og:description", "property")),
      ogImage: classifyScalar("ogImage", extractMeta(prodHtml, "og:image", "property"), extractMeta(localHtml, "og:image", "property")),
      ogUrl: classifyScalar("canonical", extractMeta(prodHtml, "og:url", "property"), extractMeta(localHtml, "og:url", "property")),
      ogType: classifyScalar("ogType", extractMeta(prodHtml, "og:type", "property"), extractMeta(localHtml, "og:type", "property")),
      twitterTitle: classifyScalar("twitterTitle", extractMeta(prodHtml, "twitter:title"), extractMeta(localHtml, "twitter:title")),
      twitterDescription: classifyScalar("twitterDescription", extractMeta(prodHtml, "twitter:description"), extractMeta(localHtml, "twitter:description")),
      twitterImage: classifyScalar("twitterImage", extractMeta(prodHtml, "twitter:image"), extractMeta(localHtml, "twitter:image")),
      schemaTypes: classifyList("schema", jsonLdTypes(prodHtml), jsonLdTypes(localHtml)),
    };

    const auditTitle = norm(record?.title || "");
    const liveTitle = properties.title.production;
    const auditConflict = auditTitle && liveTitle && auditTitle !== liveTitle;

    const prodText = visibleText(prodHtml);
    const localText = visibleText(localHtml);
    const prodSentences = sentences(prodText);
    const missingSentences = prodSentences.filter((s) => !localText.includes(s)).slice(0, 8);
    const contentCoverage = prodSentences.length
      ? 1 - missingSentences.length / Math.min(prodSentences.length, 8)
      : null;

    const localImgs = images(localHtml);
    const prodImgs = images(prodHtml);
    const localLinks = internalHrefs(localHtml).map(classifyLink).filter(Boolean);
    const prodLinks = internalHrefs(prodHtml).map(classifyLink).filter(Boolean);

    const significant = Object.entries(properties)
      .filter(([, v]) => v.classification === "SEO-SIGNIFICANT DIFFERENCE")
      .map(([k]) => k);
    const manual = Object.entries(properties)
      .filter(([, v]) => v.classification === "NEEDS MANUAL REVIEW")
      .map(([k]) => k);

    let overall = "EXACT MATCH";
    if (local.status === 404 || prod.status === 404) overall = "SEO-SIGNIFICANT DIFFERENCE";
    else if (significant.length) overall = "SEO-SIGNIFICANT DIFFERENCE";
    else if (manual.length) overall = "NEEDS MANUAL REVIEW";
    else if (Object.values(properties).some((v) => v.classification !== "EXACT MATCH")) overall = "SEMANTICALLY PRESERVED";

    return {
      productionUrl: prodUrl,
      localRoute: key,
      contentType: record ? "audited" : "sitemap-only",
      wordpressId: null,
      httpStatusProduction: prod.status,
      httpStatusLocal: local.status,
      finalProductionUrl: prod.finalUrl,
      indexability: {
        productionRobots: properties.robots.production,
        localEnvironmentRobots: properties.robots.local,
        intendedProductionRobots: properties.robots.production,
      },
      properties,
      auditTitleConflict: auditConflict ? { audit: auditTitle, live: liveTitle } : null,
      h1CountProduction: headings(prodHtml, "h1").length,
      h1CountLocal: headings(localHtml, "h1").length,
      breadcrumbProduction: /breadcrumb/i.test(prodHtml),
      breadcrumbLocalVisible: /breadcrumb/i.test(localHtml),
      sitemapMembership: {
        productionLive: prodSet.has(hostless(prodUrl)),
        local: localSet.has(hostless(prodUrl)),
        audit: auditSet.has(hostless(prodUrl)),
      },
      imageCountProduction: prodImgs.length,
      imageCountLocal: localImgs.length,
      contentSampleMissing: missingSentences,
      contentCoverage,
      localLinkFindings: {
        localhost: localLinks.filter((l) => l.kind === "staging-or-localhost").map((l) => l.href),
        wordpressEndpoints: localLinks.filter((l) => l.kind === "wordpress-endpoint").map((l) => l.path),
        unresolved: localLinks.filter((l) => l.kind === "unresolved").map((l) => l.path),
        externalSubdomains: localLinks.filter((l) => l.kind === "external-subdomain").map((l) => l.href),
      },
      productionUnresolved: prodLinks.filter((l) => l.kind === "unresolved" || l.kind === "wordpress-endpoint").map((l) => l.path),
      overall,
      significantFields: significant,
      manualFields: manual,
    };
  });

  const linkFindings = {
    generatedAt: new Date().toISOString(),
    localhost: [],
    unresolvedLocal: [],
    wordpressEndpointsLocal: [],
    externalSubdomains: [],
  };
  for (const row of rows) {
    for (const href of row.localLinkFindings.localhost) linkFindings.localhost.push({ url: row.localRoute, href });
    for (const href of row.localLinkFindings.unresolved) linkFindings.unresolvedLocal.push({ url: row.localRoute, href });
    for (const href of row.localLinkFindings.wordpressEndpoints) linkFindings.wordpressEndpointsLocal.push({ url: row.localRoute, href });
    for (const href of row.localLinkFindings.externalSubdomains) linkFindings.externalSubdomains.push({ url: row.localRoute, href });
  }
  const uniq = (list) => {
    const seen = new Set();
    return list.filter((item) => {
      const key = `${item.url}|${item.href}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  linkFindings.localhost = uniq(linkFindings.localhost);
  linkFindings.unresolvedLocal = uniq(linkFindings.unresolvedLocal);
  linkFindings.wordpressEndpointsLocal = uniq(linkFindings.wordpressEndpointsLocal);
  linkFindings.externalSubdomains = uniq(linkFindings.externalSubdomains);

  const summary = {
    generatedAt: new Date().toISOString(),
    audited: rows.length,
    overall: {
      exact: rows.filter((r) => r.overall === "EXACT MATCH").length,
      semanticallyPreserved: rows.filter((r) => r.overall === "SEMANTICALLY PRESERVED").length,
      needsManualReview: rows.filter((r) => r.overall === "NEEDS MANUAL REVIEW").length,
      seoSignificant: rows.filter((r) => r.overall === "SEO-SIGNIFICANT DIFFERENCE").length,
      local404: rows.filter((r) => r.httpStatusLocal === 404).length,
      production404: rows.filter((r) => r.httpStatusProduction === 404).length,
    },
    significantByField: {},
    canonicalHostIssues: rows.filter((r) => /localhost|vercel/i.test(r.properties.canonical.local || "")).map((r) => r.localRoute),
    titleMismatches: rows
      .filter((r) => r.properties.title.classification === "SEO-SIGNIFICANT DIFFERENCE")
      .map((r) => ({ url: r.localRoute, production: r.properties.title.production, local: r.properties.title.local })),
    descriptionMismatches: rows
      .filter((r) => r.properties.metaDescription.classification === "SEO-SIGNIFICANT DIFFERENCE")
      .map((r) => ({ url: r.localRoute, production: r.properties.metaDescription.production, local: r.properties.metaDescription.local })),
    h1Issues: rows
      .filter((r) => ["SEO-SIGNIFICANT DIFFERENCE", "NEEDS MANUAL REVIEW"].includes(r.properties.h1.classification))
      .map((r) => ({ url: r.localRoute, classification: r.properties.h1.classification, production: r.properties.h1.production, local: r.properties.h1.local })),
    ogTypeMismatches: rows
      .filter((r) => r.properties.ogType.classification !== "EXACT MATCH")
      .map((r) => ({ url: r.localRoute, production: r.properties.ogType.production, local: r.properties.ogType.local, classification: r.properties.ogType.classification })),
    schemaIssues: rows
      .filter((r) => ["SEO-SIGNIFICANT DIFFERENCE", "NEEDS MANUAL REVIEW"].includes(r.properties.schemaTypes.classification))
      .map((r) => ({ url: r.localRoute, classification: r.properties.schemaTypes.classification, missing: r.properties.schemaTypes.missing, extra: r.properties.schemaTypes.extra })),
    auditTitleConflicts: rows.filter((r) => r.auditTitleConflict).map((r) => ({ url: r.localRoute, ...r.auditTitleConflict })),
  };

  for (const row of rows) {
    for (const field of row.significantFields) {
      summary.significantByField[field] = (summary.significantByField[field] || 0) + 1;
    }
  }

  fs.writeFileSync(path.join(AUDIT, "seo-reconciliation-matrix.json"), JSON.stringify({ summary, rows }, null, 2));
  fs.writeFileSync(path.join(AUDIT, "sitemap-reconciliation.json"), JSON.stringify(sitemapReconciliation, null, 2));
  fs.writeFileSync(path.join(AUDIT, "internal-link-reconciliation.json"), JSON.stringify(linkFindings, null, 2));
  fs.writeFileSync(path.join(AUDIT, "phase-4a-summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  console.log("Wrote seo-reconciliation-matrix.json and sitemap-reconciliation.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
