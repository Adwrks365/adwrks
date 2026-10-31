/**
 * Production GEO/SEO technical audit (read-only).
 * node web/scripts/qa-geo-production-audit.mjs
 */
const BASE = "https://adwrks.co.il";

const pages = [
  { path: "/seo/", locale: "he" },
  { path: "/google-ads/", locale: "he" },
  { path: "/website-building/", locale: "he" },
  { path: "/social-media-management/", locale: "he" },
  { path: "/about-us/", locale: "he" },
  { path: "/en/seo/", locale: "en" },
  { path: "/en/google-ads/", locale: "en" },
  { path: "/%D7%90%D7%96%D7%95%D7%A8%D7%99-%D7%A4%D7%A2%D7%99%D7%9C%D7%95%D7%AA/", locale: "he" },
];

function parseJsonLd(html) {
  const blocks = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      blocks.push({ parseError: true });
    }
  }
  return blocks;
}

function findOrg(graph) {
  const nodes = [];
  const walk = (o) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) return o.forEach(walk);
    if (o["@graph"]) return walk(o["@graph"]);
    const t = o["@type"];
    const types = Array.isArray(t) ? t : t ? [t] : [];
    if (types.some((x) => /Organization|ProfessionalService|LocalBusiness/.test(String(x)))) nodes.push(o);
    Object.values(o).forEach(walk);
  };
  if (Array.isArray(graph)) graph.forEach(walk);
  else walk(graph);
  return nodes;
}

const robots = await (await fetch(`${BASE}/robots.txt`)).text();
const robotsOk = /Allow:\s*\//.test(robots) && robots.includes("Sitemap:");

const pageResults = [];
for (const { path, locale } of pages) {
  const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const html = await res.text();
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const hrefLangRe = /hreflang="([^"]+)"[^>]*href="([^"]+)"|hrefLang="([^"]+)"[^>]*href="([^"]+)"/gi;
  const hreflangs = [];
  for (const m of html.matchAll(hrefLangRe)) {
    hreflangs.push({ lang: m[1] ?? m[3], href: m[2] ?? m[4] });
  }
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1/i)?.[1]?.replace(/<[^>]+>/g, "").trim();
  const robotsMeta = html.match(/name="robots" content="([^"]+)"/i)?.[1];
  const jsonLd = parseJsonLd(html);
  const orgs = jsonLd.flatMap(findOrg);
  const sameAs = [...new Set(orgs.flatMap((o) => (Array.isArray(o.sameAs) ? o.sameAs : o.sameAs ? [o.sameAs] : [])))];
  pageResults.push({
    path,
    status: res.status,
    ok:
      res.ok &&
      canonical?.startsWith(BASE) &&
      h1 &&
      !html.includes('content="noindex"') &&
      jsonLd.every((b) => !b.parseError),
    canonical,
    hreflangCount: hreflangs.length,
    h1: h1?.slice(0, 80),
    robotsMeta: robotsMeta ?? "(none)",
    jsonLdBlocks: jsonLd.length,
    orgNodes: orgs.length,
    sameAsCount: sameAs.length,
    sameAsSample: sameAs.slice(0, 5),
  });
}

const llms = await (await fetch(`${BASE}/llms.txt`)).text();
const llmsOk = llms.includes("adwrks.co.il") && llms.length > 200;

console.log(
  JSON.stringify(
    {
      ok: robotsOk && llmsOk && pageResults.every((p) => p.ok),
      robots: { ok: robotsOk, allowsAll: robots.includes("User-Agent: *") },
      llms: { ok: llmsOk, bytes: llms.length },
      pages: pageResults,
      notes: {
        OAI_SearchBot: "Covered by User-agent: * Allow: / (no block for GPTBot/OAI-SearchBot)",
        round1: "NOT_RUN — requires owner manual sessions per R1_CHATGPT_PILOT_RUNBOOK.md",
      },
    },
    null,
    2,
  ),
);

process.exit(robotsOk && llmsOk && pageResults.every((p) => p.ok) ? 0 : 1);
