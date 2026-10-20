import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const legacyUrl = pathToFileURL(
  path.join(__dirname, "../web/src/lib/routing/legacy-redirects.ts"),
).href;

const { resolveLegacyRedirect } = await import(legacyUrl);

const csvPath = path.join(__dirname, "../.gsc-coverage-1/טבלה.csv");
const urls = fs
  .readFileSync(csvPath, "utf8")
  .trim()
  .split(/\n/)
  .slice(1)
  .map((l) => new URL(l.split(",")[0]).pathname);

let ok = 0;
let miss = 0;
for (const p of urls) {
  const t = resolveLegacyRedirect(p);
  if (t) {
    ok++;
    console.log("REDIRECT", p, "->", t);
  } else {
    miss++;
    console.log("NONE", p);
  }
}
console.log("\nredirects", ok, "none", miss);
