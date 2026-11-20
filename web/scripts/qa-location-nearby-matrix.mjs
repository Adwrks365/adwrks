/**
 * Nearby section: registry ids, title, intro, and rendered card slugs must align.
 * npx tsx scripts/qa-location-nearby-matrix.mjs
 */
import { LOCATION_ROUTES } from "../src/lib/pages/locations/paths.ts";
import { getLocationView } from "../src/lib/pages/locations/registry.ts";
import { NEARBY_BY_PAGE, NEARBY_IDS, REGION_IDS } from "../src/lib/pages/locations/location-nearby-2026.ts";

let failed = 0;

const lines = [];

for (const route of LOCATION_ROUTES) {
  if (route.kind === "hub") continue;
  const cfg = NEARBY_BY_PAGE[route.id];
  if (!cfg) {
    console.error("FAIL missing NEARBY_BY_PAGE", route.id);
    failed++;
    continue;
  }
  const registryIds = NEARBY_IDS[route.id];
  if (!registryIds || registryIds.join() !== cfg.ids.join()) {
    console.error("FAIL NEARBY_IDS mismatch", route.id);
    failed++;
  }

  for (const locale of ["he", "en"]) {
    const pathKey = locale === "he" ? route.he : route.en;
    const view = getLocationView(pathKey, locale);
    const { copy, nearby } = view;
    const title = copy.nearbyTitle;
    const intro = copy.nearbyIntro;
    const cardIds = nearby.map((c) => {
      const matched = LOCATION_ROUTES.find((r) => r.he === c.href || r.en === c.href);
      return matched?.id ?? c.href;
    });

    if (cardIds.join() !== cfg.ids.join()) {
      console.error("FAIL nearby cards", route.id, locale, cardIds, "expected", cfg.ids);
      failed++;
    }

    for (const nid of cfg.ids) {
      if (REGION_IDS.has(nid) && cfg.mode === "cities") {
        console.error("FAIL region in cities mode", route.id, nid);
        failed++;
      }
    }

    const expTitle = locale === "he" ? cfg.titleHe : cfg.titleEn;
    const expIntro = locale === "he" ? cfg.introHe : cfg.introEn;
    if (title !== expTitle || intro !== expIntro) {
      console.error("FAIL nearby copy", route.id, locale);
      failed++;
    }

    lines.push({
      id: route.id,
      locale,
      title,
      intro: intro.slice(0, 120) + (intro.length > 120 ? "…" : ""),
      links: cardIds.join(", "),
      mode: cfg.mode,
    });
    console.log("OK", route.id, locale, cardIds.join("+"));
  }
}

if (process.env.PRINT_MATRIX === "1") {
  console.log("\n--- MATRIX ---\n");
  for (const row of lines) {
    console.log(`| ${row.id} | ${row.locale} | ${row.mode} | ${row.title} | ${row.links} |`);
  }
}

process.exit(failed ? 1 : 0);