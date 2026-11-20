/**
 * Location pages — hero copy + H1 QA (static).
 * npx tsx scripts/qa-location-hero-2026.mjs
 */
import { LOCATION_ROUTES } from "../src/lib/pages/locations/paths.ts";
import { LOCATION_HE, HUB_HE } from "../src/lib/pages/locations/copy-he.ts";
import { LOCATION_EN, HUB_EN } from "../src/lib/pages/locations/copy-en.ts";
import { LOCATION_HERO_PATCHES_HE } from "../src/lib/pages/locations/location-hero-copy-2026.ts";

const FORBIDDEN_LOCAL =
  /(?:יש לנו משרד|משרדנו ב|נמצאים ב|נפגשים אצלנו ב)(?:תל אביב|חיפה|ירושלים|כרמיאל|באר שבע)/i;

let failed = 0;
const checked = [];

for (const route of LOCATION_ROUTES) {
  if (route.kind === "hub") {
    for (const [label, copy] of [
      ["hub-he", HUB_HE],
      ["hub-en", HUB_EN],
    ]) {
      if (!copy.h1 || !copy.lead) {
        console.error("FAIL missing hero", label);
        failed++;
      }
      if (label === "hub-he" && !copy.h1.includes("שיווק דיגיטלי")) {
        console.error("FAIL hub he missing keyword", copy.h1);
        failed++;
      }
      checked.push({ id: "hub", locale: label, path: route.he, h1: copy.h1 });
    }
    continue;
  }
  const he = LOCATION_HE[route.id];
  const en = LOCATION_EN[route.id];
  if (!he || !en) {
    console.error("FAIL missing copy", route.id);
    failed++;
    continue;
  }
  if (!he.h1.includes("שיווק דיגיטלי")) {
    console.error("FAIL he h1 keyword", route.id, he.h1);
    failed++;
  }
  if (he.h1.length > 90) {
    console.error("FAIL he h1 too long", route.id, he.h1.length);
    failed++;
  }
  if (FORBIDDEN_LOCAL.test(he.lead)) {
    console.error("FAIL false local office claim", route.id);
    failed++;
  }
  if (!/digital marketing/i.test(en.h1)) {
    console.error("FAIL en h1", route.id, en.h1);
    failed++;
  }
  const patch = LOCATION_HERO_PATCHES_HE[route.id];
  if (patch && he.h1 !== patch.h1) {
    console.error("FAIL patch not applied", route.id);
    failed++;
  }
  checked.push({ id: route.id, path: route.he, h1: he.h1 });
  console.log("OK", route.id, he.h1.slice(0, 50));
}

console.log("checked", checked.length, "pages");
process.exit(failed ? 1 : 0);