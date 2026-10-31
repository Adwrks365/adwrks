/**
 * Sync FAQPage in seo.json with service *-content.ts FAQ arrays (Sprint 1).
 * Run from repo root: node web/scripts/sync-sprint1-service-faq.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seoPath = path.join(__dirname, "..", "src", "data", "content", "seo.json");

/** @type {Record<string, { url: string, importPath: string, exportName: string }>} */
const SERVICES = {
  googleAds: {
    url: "https://adwrks.co.il/google-ads/",
    importPath: "../src/lib/pages/services/google-ads-content.ts",
    exportName: "GOOGLE_ADS_FAQ",
  },
  seo: {
    url: "https://adwrks.co.il/seo/",
    importPath: "../src/lib/pages/services/seo-content.ts",
    exportName: "SEO_FAQ",
  },
  social: {
    url: "https://adwrks.co.il/social-media-management/",
    importPath: "../src/lib/pages/services/social-media-content.ts",
    exportName: "SOCIAL_FAQ",
  },
  websiteBuilding: {
    url: "https://adwrks.co.il/website-building/",
    importPath: "../src/lib/pages/services/website-building-content.ts",
    exportName: "WEBSITE_BUILDING_FAQ",
  },
};

function faqPage(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

const seo = JSON.parse(fs.readFileSync(seoPath, "utf8"));
const report = {};

for (const [key, cfg] of Object.entries(SERVICES)) {
  const mod = await import(new URL(cfg.importPath, import.meta.url).href);
  const items = mod[cfg.exportName];
  if (!items?.length) throw new Error(`Missing ${cfg.exportName} from ${cfg.importPath}`);

  const record = seo.find((e) => e.url === cfg.url);
  if (!record) throw new Error(`seo.json missing ${cfg.url}`);

  record.jsonLd = (record.jsonLd ?? []).filter((j) => j["@type"] !== "FAQPage");
  record.jsonLd.push(faqPage(items));
  report[key] = items.length;
}

fs.writeFileSync(seoPath, JSON.stringify(seo));
console.log(JSON.stringify({ ok: true, faqCounts: report }, null, 2));
