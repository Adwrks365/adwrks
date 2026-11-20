/**
 * Nearby section: data sync + honest geography / title rules.
 * npx tsx scripts/qa-location-nearby-matrix.mjs
 */
import { LOCATION_ROUTES } from "../src/lib/pages/locations/paths.ts";
import { getLocationView } from "../src/lib/pages/locations/registry.ts";
import {
  NEARBY_BY_PAGE,
  NEARBY_IDS,
  NEARBY_CITIES_ALLOWED,
  REGION_IDS,
} from "../src/lib/pages/locations/location-nearby-2026.ts";

const NEARBY_TITLE_HE = /ערים\s+סמוכות/;
const NEARBY_TITLE_EN = /\bCities near\b/i;

const DISTANCE_CLAIM_HE = /קרובה|צמודה|צמוד|שכנות.*מרחוב|נסיעה\s+קצר|במרחק\s+נסיעה/i;
const DISTANCE_CLAIM_EN = /\bclose to\b|\bsits next\b|\bnext-door\b|\bshort drive\b|\bneighboring\b/i;

const TYPO_HE = /שתי\s+עמודים|המטרופולין\s+הדרומית/;

/** Editorial — intros explain value to visitors, not why links were picked. */
const META_INTRO_HE = [
  /אינם «שכנות»/,
  /לא מוצגים/,
  /לא מוצג/,
  /בלי טענ/,
  /ללא כלילת/,
  /ללא הנחה/,
  /בלי לפרוש/,
  /אין כאן קישור/,
];
const META_INTRO_EN = [
  /not street-level/,
  /without implying/,
  /without stretching/,
  /without fake/,
  /without claiming/,
  /without a Beer/,
  /not shown as/,
  /not a generic/,
];

let failed = 0;

const lines = [];

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL", msg);
    failed++;
  }
}

for (const route of LOCATION_ROUTES) {
  if (route.kind === "hub") continue;
  const cfg = NEARBY_BY_PAGE[route.id];
  if (!cfg) {
    assert(false, `missing NEARBY_BY_PAGE ${route.id}`);
    continue;
  }

  assert(
    NEARBY_IDS[route.id]?.join() === cfg.ids.join(),
    `NEARBY_IDS mismatch ${route.id}`,
  );

  const hasNearbyHeTitle = NEARBY_TITLE_HE.test(cfg.titleHe);
  const hasNearbyEnTitle = NEARBY_TITLE_EN.test(cfg.titleEn);

  if (cfg.titleKind === "nearby") {
    assert(hasNearbyHeTitle, `${route.id} titleKind nearby but Hebrew title not «ערים סמוכות»`);
    assert(hasNearbyEnTitle, `${route.id} titleKind nearby but English title not «Cities near»`);
    for (const nid of cfg.ids) {
      assert(!REGION_IDS.has(nid), `${route.id} nearby title with region link ${nid}`);
    }
    const allowed = NEARBY_CITIES_ALLOWED[route.id];
    assert(allowed, `${route.id} nearby title without NEARBY_CITIES_ALLOWED entry`);
    if (allowed) {
      for (const nid of cfg.ids) {
        assert(allowed.includes(nid), `${route.id} ${nid} not in allowed nearby set`);
      }
    }
  } else {
    assert(!hasNearbyHeTitle, `${route.id} non-nearby kind but Hebrew uses «ערים סמוכות»`);
    assert(!hasNearbyEnTitle, `${route.id} non-nearby kind but English uses «Cities near»`);
  }

  if (cfg.titleKind === "areas") {
    const hasRegion = cfg.ids.some((id) => REGION_IDS.has(id));
    assert(hasRegion, `${route.id} areas kind should include at least one region page`);
    assert(
      /אזורי\s+שירות|More service areas/i.test(`${cfg.titleHe} ${cfg.titleEn}`),
      `${route.id} areas kind title should be «אזורי שירות» / More service areas`,
    );
  }

  if (cfg.titleKind === "more_cities") {
    assert(
      /עמודי\s+שירות|More city/i.test(`${cfg.titleHe} ${cfg.titleEn}`),
      `${route.id} more_cities title pattern`,
    );
    for (const nid of cfg.ids) {
      assert(!REGION_IDS.has(nid), `${route.id} more_cities with region ${nid}`);
    }
  }

  for (const locale of ["he", "en"]) {
    const pathKey = locale === "he" ? route.he : route.en;
    const view = getLocationView(pathKey, locale);
    const { copy, nearby } = view;
    const cardIds = nearby.map((c) => {
      const matched = LOCATION_ROUTES.find((r) => r.he === c.href || r.en === c.href);
      return matched?.id ?? c.href;
    });

    assert(cardIds.join() === cfg.ids.join(), `nearby cards ${route.id} ${locale}`);

    const title = copy.nearbyTitle;
    const intro = copy.nearbyIntro;
    const expTitle = locale === "he" ? cfg.titleHe : cfg.titleEn;
    const expIntro = locale === "he" ? cfg.introHe : cfg.introEn;
    assert(title === expTitle && intro === expIntro, `nearby copy ${route.id} ${locale}`);

    if (locale === "he" && TYPO_HE.test(intro)) {
      assert(false, `${route.id} he intro typo`);
    }
    for (const re of locale === "he" ? META_INTRO_HE : META_INTRO_EN) {
      if (re.test(intro)) assert(false, `${route.id} ${locale} meta/editorial intro: ${re}`);
    }

    if (cfg.titleKind !== "nearby") {
      const negated =
        /אינם|בלי טענ|ללא ה|לא מוצג|לא «|without|not implying|no false|are not shown/i.test(intro);
      const allowedExact =
        locale === "he"
          ? /ליד אשדוד|סמוכה לאשקלון|סמוכים יותר/.test(intro)
          : /coastal strip|closer service|along the coast/i.test(intro);
      if (!negated && !allowedExact) {
        if (locale === "he" && DISTANCE_CLAIM_HE.test(intro)) {
          assert(false, `${route.id} he intro distance claim with non-nearby title`);
        }
        if (locale === "en" && DISTANCE_CLAIM_EN.test(intro)) {
          assert(false, `${route.id} en intro distance claim with non-nearby title`);
        }
      }
    }

    lines.push({
      id: route.id,
      locale,
      titleKind: cfg.titleKind,
      title,
      links: cardIds.join(", "),
    });
    console.log("OK", route.id, locale, cfg.titleKind, cardIds.join("+"));
  }
}

if (process.env.PRINT_MATRIX === "1") {
  console.log("\n--- MATRIX ---\n");
  for (const row of lines) {
    console.log(`| ${row.id} | ${row.locale} | ${row.titleKind} | ${row.title} | ${row.links} |`);
  }
}

process.exit(failed ? 1 : 0);