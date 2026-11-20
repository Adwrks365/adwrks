/**
 * Location SEO QA — titles unique, brand, length, H1 unchanged vs hero patches.
 * npx tsx scripts/qa-location-seo-2026.mjs
 */
import { LOCATION_ROUTES } from "../src/lib/pages/locations/paths.ts";
import { getHubView, getLocationView } from "../src/lib/pages/locations/registry.ts";
import { clampSeoDescription, clampSeoTitle } from "../src/lib/content/seo-clamp.ts";
import { LOCATION_HERO_PATCHES_HE } from "../src/lib/pages/locations/location-hero-copy-2026.ts";

let failed = 0;
const titles = new Set();
const descs = new Set();

for (const route of LOCATION_ROUTES) {
  for (const locale of ["he", "en"]) {
    const pathKey = locale === "he" ? route.he : route.en;
    const copy =
      route.kind === "hub" ? getHubView(pathKey, locale).copy : getLocationView(pathKey, locale).copy;
    if (!copy.seoTitle.includes("Adwrks 365")) {
      console.error("FAIL brand title", route.id, locale);
      failed++;
    }
    if (locale === "he" && /חברה לפרסום/.test(copy.seoTitle)) {
      console.error("FAIL awkward he title", route.id, copy.seoTitle);
      failed++;
    }
    if (locale === "en" && !copy.seoDescription.includes("Adwrks 365")) {
      console.error("FAIL brand desc", route.id, locale);
      failed++;
    }
    if (
      locale === "he" &&
      route.id !== "hub" &&
      !/שיווק דיגיטלי|פרסום דיגיטלי|חברה לשיווק|סוכנות לשיווק|סוכנות שיווק/.test(
        `${copy.seoTitle} ${copy.seoDescription}`,
      )
    ) {
      console.error("FAIL keyword he", route.id);
      failed++;
    }
    const tKey = `${locale}:${copy.seoTitle}`;
    const dKey = `${locale}:${copy.seoDescription}`;
    if (titles.has(tKey)) {
      console.error("FAIL dup title", tKey);
      failed++;
    }
    if (descs.has(dKey)) {
      console.error("FAIL dup desc", dKey);
      failed++;
    }
    titles.add(tKey);
    descs.add(dKey);
    const ct = clampSeoTitle(copy.seoTitle);
    const cd = clampSeoDescription(copy.seoDescription);
    if (ct.length < 20) {
      console.error("FAIL title short", route.id);
      failed++;
    }
    console.log("OK", route.id, locale, copy.seoTitle.length, cd.length);
  }
}

for (const [id, patch] of Object.entries(LOCATION_HERO_PATCHES_HE)) {
  const view = getLocationView(
    LOCATION_ROUTES.find((r) => r.id === id)?.he ?? "",
    "he",
  );
  if (view && view.copy.h1 !== patch.h1) {
    console.error("FAIL h1 changed", id, view.copy.h1, patch.h1);
    failed++;
  }
}

process.exit(failed ? 1 : 0);