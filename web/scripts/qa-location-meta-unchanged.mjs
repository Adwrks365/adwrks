/**
 * Ensure location URLs and seoTitle/seoDescription unchanged vs main.
 * npx tsx scripts/qa-location-meta-unchanged.mjs
 */
import { execSync } from "node:child_process";
import { LOCATION_ROUTES } from "../src/lib/pages/locations/paths.ts";
import { LOCATION_HE, HUB_HE } from "../src/lib/pages/locations/copy-he.ts";
import { LOCATION_EN, HUB_EN } from "../src/lib/pages/locations/copy-en.ts";

function extractBlock(src, id) {
  const key = src.includes(`"${id}"`) ? `"${id}"` : `${id}:`;
  const idx = src.indexOf(key);
  if (idx === -1) return null;
  const slice = src.slice(idx, idx + 6000);
  const seoTitle = slice.match(/seoTitle:\s*"([^"]+)"/)?.[1];
  const seoDescription = slice.match(/seoDescription:\s*\n?\s*"([^"]+)"/s)?.[1]
    ?? slice.match(/seoDescription:\s*"([^"]+)"/)?.[1];
  return { seoTitle, seoDescription };
}

const oldHe = execSync("git show main:web/src/lib/pages/locations/copy-he.ts", { encoding: "utf8" });
const oldExtra = execSync("git show main:web/src/lib/pages/locations/copy-he-extra.ts", { encoding: "utf8" });
const oldEn = execSync("git show main:web/src/lib/pages/locations/copy-en.ts", { encoding: "utf8" });
const oldEnExtra = execSync("git show main:web/src/lib/pages/locations/copy-en-extra.ts", { encoding: "utf8" });
const oldPaths = execSync("git show main:web/src/lib/pages/locations/paths.ts", { encoding: "utf8" });

let failed = 0;

if (oldPaths !== execSync("git show HEAD:web/src/lib/pages/locations/paths.ts", { encoding: "utf8" })) {
  console.error("FAIL paths.ts changed");
  failed++;
} else {
  console.log("OK paths unchanged");
}

for (const r of LOCATION_ROUTES) {
  if (r.he !== r.he) failed++;
}
for (const route of LOCATION_ROUTES) {
  for (const [loc, table, old, oldEx, cur] of [
    ["he", LOCATION_HE, oldHe, oldExtra, route.kind === "hub" ? HUB_HE : null],
    ["en", LOCATION_EN, oldEn, oldEnExtra, route.kind === "hub" ? HUB_EN : null],
  ]) {
    const id = route.id;
    const current =
      id === "hub"
        ? loc === "he"
          ? HUB_HE
          : HUB_EN
        : loc === "he"
          ? LOCATION_HE[id]
          : LOCATION_EN[id];
    const prev = id === "hub"
      ? { seoTitle: old.match(/seoTitle:\s*"([^"]+)"/)?.[1], seoDescription: old.match(/seoDescription:\s*\n?\s*"([^"]+)"/)?.[1] }
      : extractBlock(old, id) ?? extractBlock(oldEx, id);
    if (!prev?.seoTitle || !current?.seoTitle) continue;
    if (prev.seoTitle !== current.seoTitle) {
      console.error("FAIL seoTitle", id, loc, prev.seoTitle, "->", current.seoTitle);
      failed++;
    }
    if (prev.seoDescription !== current.seoDescription) {
      console.error("FAIL seoDescription", id, loc);
      failed++;
    }
  }
}

if (!failed) console.log("OK all seoTitle/seoDescription match main");
process.exit(failed ? 1 : 0);