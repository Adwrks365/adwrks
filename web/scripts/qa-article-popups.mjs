/**
 * Verify article popup headlines for SEO-week pages.
 * Run: npx tsx scripts/qa-article-popups.mjs (from web/)
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { resolveArticlePopupConfig } from "../src/lib/popups/article-pages.ts";
import { normalizePath } from "../src/lib/content/paths.ts";

const EXPECTED = {
  "/פרסום-דיגיטלי-בשפה-הרוסית/": {
    headline: "רוצים להגיע ללקוחות דוברי רוסית?",
    ctaLabel: "בואו נדבר על הפרסום שלכם",
  },
  "/קידום-אתרים-בגוגל/": {
    context: "seo",
  },
  "/בדיקת-מהירות-אתר/": {
    context: "website-speed",
  },
  "/בניית-אתרים-ברוסית/": {
    headline: "רוצים אתר או דף נחיתה לקהל דובר רוסית?",
  },
  "/קידום-אתרים-ברוסית/": {
    headline: "רוצים לקדם את האתר בגוגל לקהל דובר רוסית?",
  },
};

let failed = 0;
for (const [path, expect] of Object.entries(EXPECTED)) {
  const content = getContentByPath(path);
  if (!content) {
    console.error("MISSING CONTENT", path);
    failed++;
    continue;
  }
  const cfg = resolveArticlePopupConfig(content, "he");
  const okPath = normalizePath(cfg.pagePath) === normalizePath(path);
  if (!okPath) {
    console.error("PATH MISMATCH", path, cfg.pagePath);
    failed++;
  }
  if (expect.context && cfg.popupContext !== expect.context) {
    console.error("CONTEXT", path, "expected", expect.context, "got", cfg.popupContext);
    failed++;
  }
  if (expect.headline && cfg.headline !== expect.headline) {
    console.error("HEADLINE", path, "\n expected:", expect.headline, "\n got:", cfg.headline);
    failed++;
  }
  if (expect.ctaLabel && cfg.ctaLabel !== expect.ctaLabel) {
    console.error("CTA", path, "\n expected:", expect.ctaLabel, "\n got:", cfg.ctaLabel);
    failed++;
  }
  if (!failed) console.log("OK", path, "→", cfg.headline.slice(0, 50));
}

process.exit(failed ? 1 : 0);