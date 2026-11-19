/**
 * Verify published posts resolve for ratings (no live votes).
 * npx tsx scripts/qa-article-rating-resolve.mjs
 */
import { resolveArticleRatingContext } from "../src/lib/ratings/service.ts";
import { isRatingsConfigured } from "../src/lib/ratings/config.ts";

const PATHS = [
  "/קידום-אתרים-ברוסית/",
  "/פרסום-בגוגל-7-אסטרטגיות/",
  "/בדיקת-מהירות-אתר/",
  "/en/google-seo/",
];

if (!isRatingsConfigured()) {
  console.log("SKIP: ratings env not configured locally");
  process.exit(0);
}

let failed = 0;
for (const path of PATHS) {
  const ctx = await resolveArticleRatingContext(path);
  if (!ctx) {
    console.error("FAIL not resolved", path);
    failed++;
  } else {
    console.log("OK", path, ctx.canonicalPath, ctx.aggregate.totalVoteCount);
  }
}

process.exit(failed ? 1 : 0);