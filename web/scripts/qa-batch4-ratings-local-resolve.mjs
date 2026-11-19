/**
 * Validates rating resolve logic without voting (needs Supabase env for full path).
 * Without env: confirms published posts are found in static content only.
 * npx tsx scripts/qa-batch4-ratings-local-resolve.mjs
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { normalizePath } from "../src/lib/content/paths.ts";
import { resolveArticleRatingPath } from "../src/lib/ratings/path.ts";
import { isRatingsConfigured } from "../src/lib/ratings/config.ts";
import { resolveArticleRatingContext } from "../src/lib/ratings/service.ts";

const PATHS = [
  "/קידום-אתרים-ברוסית/",
  "/פרסום-בגוגל-7-אסטרטגיות/",
  "/en/google-seo/",
  "/en/seo-guide-for-beginners/",
];

let failed = 0;

for (const path of PATHS) {
  const n = normalizePath(path);
  const locale = path.startsWith("/en/") ? "en" : "he";
  const item = getContentByPath(n, locale);
  if (!item?.id) {
    console.error("FAIL static missing", path);
    failed++;
    continue;
  }
  console.log("OK static", path, "id", item.id, "canonical", resolveArticleRatingPath(path));
}

if (isRatingsConfigured()) {
  for (const path of PATHS) {
    const ctx = await resolveArticleRatingContext(path);
    if (!ctx) {
      console.error("FAIL resolve", path);
      failed++;
    } else {
      console.log("OK resolve", path, ctx.canonicalPath, ctx.aggregate.totalVoteCount);
    }
  }
} else {
  console.log("SKIP Supabase resolve — env not set locally (expected)");
}

process.exit(failed ? 1 : 0);