/**
 * Prints markdown table of H1 before (main) vs after.
 * npx tsx scripts/dump-location-h1-before-after.mjs
 */
import { execSync } from "node:child_process";
import { LOCATION_ROUTES } from "../src/lib/pages/locations/paths.ts";
import { LOCATION_HE, HUB_HE } from "../src/lib/pages/locations/copy-he.ts";

function extractH1(src, id) {
  const idx = src.indexOf(`${id}:`);
  if (idx === -1) return null;
  const slice = src.slice(idx, idx + 4000);
  const m = slice.match(/h1:\s*"([^"]+)"/);
  return m?.[1] ?? null;
}

const oldHe = execSync("git show main:web/src/lib/pages/locations/copy-he.ts", { encoding: "utf8" });
const oldExtra = execSync("git show main:web/src/lib/pages/locations/copy-he-extra.ts", { encoding: "utf8" });

console.log("| ID | H1 לפני | H1 אחרי |");
console.log("|-----|---------|---------|");
const hubOld = oldHe.match(/h1:\s*"([^"]+)"/)?.[1];
console.log(`| hub | ${hubOld} | ${HUB_HE.h1} |`);

for (const r of LOCATION_ROUTES) {
  if (r.kind === "hub") continue;
  const old = extractH1(oldHe, r.id) ?? extractH1(oldExtra, r.id) ?? "—";
  console.log(`| ${r.id} | ${old} | ${LOCATION_HE[r.id].h1} |`);
}