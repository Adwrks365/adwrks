/**
 * Fetch rendered HTML and verify authority link sprint injections.
 */
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE || "http://localhost:3000";

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(
  join(root, "web/src/lib/content/article-authority-linking-2026.ts"),
  "utf8",
);
const AUTHORITY = [...src.matchAll(/"(\/[^"]+\/)":/g)].map((m) => m[1]);

const list = AUTHORITY;
const rows = [];
function encodedPath(p) {
  return p
    .split("/")
    .map((seg, i) => (i === 0 || !seg ? seg : encodeURIComponent(seg)))
    .join("/");
}

for (const p of list) {
  const res = await fetch(`${BASE}${encodedPath(p)}`);
  const html = await res.text();
  const injected =
    html.includes("adwrks-authority-link-2026") ||
    html.includes("adwrks-authority-service-link");
  rows.push({ path: p, status: res.status, injected });
}
const injectedCount = rows.filter((r) => r.injected).length;
const out = {
  base: BASE,
  at: new Date().toISOString(),
  configured: list.length,
  injectedCount,
  notInjected: rows.filter((r) => !r.injected).map((r) => r.path),
  rows,
};
fs.writeFileSync(
  "migration-audit/internal-links-after-2026-11-26.json",
  JSON.stringify(out, null, 2),
);
console.log(`Injected ${injectedCount}/${list.length}`);