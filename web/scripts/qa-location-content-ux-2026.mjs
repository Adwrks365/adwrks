/**
 * Content UX QA — jargon, SEO/meta untouched, audience depth, CTAs.
 * npx tsx scripts/qa-location-content-ux-2026.mjs
 */
import { LOCATION_ROUTES } from "../src/lib/pages/locations/paths.ts";
import { getHubView, getLocationView } from "../src/lib/pages/locations/registry.ts";
import { LOCATION_SEO_META_EN, LOCATION_SEO_META_HE } from "../src/lib/pages/locations/location-seo-meta-2026.ts";

const TYPO_HE = [/קפות/, /נמדיד/];
const BANNED_HE = [
  /Search לכוונה/,
  /נבדוק tracking/,
  /ROI ליד גוש/,
  /ריטיינר עמום/,
  /\bbuzz\b/i,
  /לידים ליד גוש/,
  /עסקים שרוצים scale/,
  /ניצחים מקומית/,
  /איך ניצחים/,
  /Meta לvisual/i,
  /\bremarketing\b/i,
  /MVP קמפיין/,
];
const BANNED_EN = [/\bvanity clicks\b/i, /improve ROI faster/i, /measurable ROI only/i];

function walkStrings(val, fn, path = "") {
  if (typeof val === "string") fn(path, val);
  else if (Array.isArray(val)) val.forEach((item, i) => walkStrings(item, fn, `${path}[${i}]`));
  else if (val && typeof val === "object")
    for (const [k, v] of Object.entries(val)) walkStrings(v, fn, path ? `${path}.${k}` : k);
}

let failed = 0;

for (const route of LOCATION_ROUTES) {
  for (const locale of ["he", "en"]) {
    const pathKey = locale === "he" ? route.he : route.en;
    const copy =
      route.kind === "hub" ? getHubView(pathKey, locale).copy : getLocationView(pathKey, locale).copy;
    const banned = locale === "he" ? BANNED_HE : BANNED_EN;
    walkStrings(copy, (field, text) => {
      if (field === "seoTitle" || field === "seoDescription") return;
      for (const re of TYPO_HE) {
        if (re.test(text)) {
          console.error("FAIL typo", route.id, locale, field, text.slice(0, 80));
          failed++;
        }
      }
      for (const re of banned) {
        if (re.test(text)) {
          console.error("FAIL banned", route.id, locale, field, text.slice(0, 80));
          failed++;
        }
      }
    });
    if (route.kind !== "hub") {
      const row = copy;
      if (row.audienceItems.length < 5) {
        console.error("FAIL audience short", route.id, row.audienceItems.length);
        failed++;
      }
      if (!row.midCtaTitle?.includes("?")) {
        console.error("FAIL mid cta", route.id, locale);
        failed++;
      }
      const seoTable = locale === "he" ? LOCATION_SEO_META_HE : LOCATION_SEO_META_EN;
      const seoPatch = seoTable[route.id];
      if (seoPatch && row.seoTitle !== seoPatch.seoTitle) {
        console.error("FAIL seo title changed", route.id, locale, row.seoTitle);
        failed++;
      }
    }
    console.log("OK", route.id, locale);
  }
}

process.exit(failed ? 1 : 0);