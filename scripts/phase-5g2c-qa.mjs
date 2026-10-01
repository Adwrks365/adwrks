import fs from "fs";
import { spawnSync } from "child_process";

const results = {
  sitemapUrls: null,
  blankGapArticles: null,
  secretsInClientBundle: [],
  arrowScript: null,
  supabaseEnvPresent: false,
};

results.sitemapUrls = JSON.parse(
  fs.readFileSync("web/src/data/content/urls.json", "utf8"),
).sitemapUrls.length;

const gapAudit = spawnSync("node", ["scripts/audit-blank-gap-after-cleanup.mjs"], {
  encoding: "utf8",
});
results.blankGapArticles = JSON.parse(gapAudit.stdout.trim());

const clientChunks = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".js")) clientChunks.push(full);
  }
}
if (fs.existsSync("web/.next/static/chunks")) {
  walk("web/.next/static/chunks");
}

const secretPatterns = [
  "SUPABASE_SECRET_KEY",
  "ARTICLE_RATING_VOTER_SECRET",
  "service_role",
];
for (const file of clientChunks) {
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of secretPatterns) {
    if (text.includes(pattern)) {
      results.secretsInClientBundle.push({ file, pattern });
    }
  }
}

results.supabaseEnvPresent = Boolean(
  process.env.SUPABASE_URL &&
    process.env.SUPABASE_SECRET_KEY &&
    process.env.ARTICLE_RATING_VOTER_SECRET,
);

if (results.supabaseEnvPresent) {
  const live = spawnSync(
    "node",
    ["scripts/phase-5g2c-supabase-live-test.mjs"],
    { encoding: "utf8", env: process.env },
  );
  results.liveSupabase = live.stdout.trim();
  results.liveSupabaseError = live.stderr.trim();
}

console.log(JSON.stringify(results, null, 2));
