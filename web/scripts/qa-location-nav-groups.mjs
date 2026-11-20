/**
 * Service area menu geography — cities appear once, correct region.
 * npx tsx scripts/qa-location-nav-groups.mjs
 */
import { serviceAreaGroups } from "../src/lib/pages/locations/nav.ts";

const EXPECTED = {
  north: ["karmiel", "haifa", "krayot", "akko", "afula"],
  sharon: ["netanya", "hadera", "herzliya", "kfar-saba", "raanana"],
  center: ["tel-aviv", "ramat-gan", "petah-tikva", "rishon-lezion", "holon", "bat-yam"],
  south: ["beer-sheva", "ashdod", "ashkelon"],
  jerusalem: ["jerusalem"],
};

let failed = 0;

for (const locale of ["he", "en"]) {
  const groups = serviceAreaGroups(locale);
  const seen = new Map();

  for (const group of groups) {
    const want = EXPECTED[group.id];
    if (!want) {
      console.error("FAIL unknown group", locale, group.id);
      failed++;
      continue;
    }
    const ids = group.cities.map((c) => c.id);
    if (JSON.stringify(ids) !== JSON.stringify(want)) {
      console.error("FAIL group cities", locale, group.id, "got", ids, "want", want);
      failed++;
    }
    for (const id of ids) {
      if (seen.has(id)) {
        console.error("FAIL duplicate city", locale, id, seen.get(id), "and", group.id);
        failed++;
      }
      seen.set(id, group.id);
    }
  }

  const order = groups.map((g) => g.id).join(",");
  if (order !== "north,sharon,center,south,jerusalem") {
    console.error("FAIL group order", locale, order);
    failed++;
  }
}

console.log(failed ? "FAILED" : "OK nav groups", failed);
process.exit(failed ? 1 : 0);