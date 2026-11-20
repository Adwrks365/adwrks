/**
 * Asserts final metadata after buildAreaMetadata + seo-clamp (as in HTML head).
 * npx tsx scripts/qa-location-seo-rendered.mjs
 */
import { LOCATION_ROUTES } from "../src/lib/pages/locations/paths.ts";
import { getHubView, getLocationView } from "../src/lib/pages/locations/registry.ts";
import { buildAreaMetadata } from "../src/lib/pages/locations/metadata.ts";

let failed = 0;

for (const route of LOCATION_ROUTES) {
  for (const locale of ["he", "en"]) {
    const pathKey = locale === "he" ? route.he : route.en;
    const copy =
      route.kind === "hub" ? getHubView(pathKey, locale).copy : getLocationView(pathKey, locale).copy;
    const meta = buildAreaMetadata(pathKey, copy.seoTitle, copy.seoDescription, locale);
    const title = typeof meta.title === "string" ? meta.title : meta.title?.absolute ?? "";
    const desc = meta.description ?? "";
    if (!title.includes("Adwrks 365")) {
      console.error("FAIL rendered title brand", route.id, locale, title);
      failed++;
    }
    if (locale === "en" && !desc.includes("Adwrks 365")) {
      console.error("FAIL rendered desc brand", route.id, locale);
      failed++;
    }
    if (title.includes("…") && copy.seoTitle.length <= 60) {
      console.warn("WARN title clamped despite short source", route.id, locale, title, copy.seoTitle.length);
    }
    if (title.length > 65) {
      console.error("FAIL rendered title too long", route.id, title);
      failed++;
    }
    if (desc.length > 165) {
      console.error("FAIL rendered desc too long", route.id, desc.length);
      failed++;
    }
    console.log("OK render", route.id, locale, title.length, desc.length);
  }
}

process.exit(failed ? 1 : 0);