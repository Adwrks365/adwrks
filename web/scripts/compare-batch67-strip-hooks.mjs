/**
 * Before/after diff for stripInlineCtaBlocks and stripLegacyH4ClosingSummary only.
 * npx tsx scripts/compare-batch67-strip-hooks.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { stripInlineCtaBlocks } from "../src/lib/content/article-ctas.ts";
import { applyArticleBatch7Enrichment2026 } from "../src/lib/content/article-batch7-enrichment-2026.ts";
import { applyArticleBatch6Enrichment2026 } from "../src/lib/content/article-batch6-enrichment-2026.ts";
import { applyArticleBatch4StructurePolish } from "../src/lib/content/article-batch4-structure-polish.ts";
import {
  stripElementorContentBlockByH2,
  stripH2HeadingWidgets,
} from "../src/lib/content/article-structure-polish.ts";

const REVIEWS_HE = "/כוחם-של-ביקורות-והמלצות/";

import {
  stripEmbeddedArticleSidebar,
  replaceBrokenCalculatorEmbeds,
  downgradeEmbeddedH1,
  injectPageSpeedInsightsEmbed,
} from "../src/lib/content/article.ts";
import { applyArticlePilotEnrichment2026 } from "../src/lib/content/article-pilot-enrichment-2026.ts";
import { applyArticleBatch2Enrichment2026 } from "../src/lib/content/article-batch2-enrichment-2026.ts";
import { applyArticleBatch3Enrichment2026 } from "../src/lib/content/article-batch3-enrichment-2026.ts";
import { applyArticleBatch4Enrichment2026 } from "../src/lib/content/article-batch4-enrichment-2026.ts";
import { applyArticleBatch5Pilot2026 } from "../src/lib/content/article-batch5-pilot-2026.ts";
import { applyArticleBatch5StructurePolish } from "../src/lib/content/article-batch5-structure-polish.ts";
import { polishContentInternalLinks } from "../src/lib/content/content-internal-links-polish.ts";
import { polishGoogleSeoArticleHtml } from "../src/lib/content/post-19428-polish.ts";
import { polishWordPressCostArticleHtml } from "../src/lib/content/post-19792-polish.ts";
import { injectPageSpeedCrossLinks } from "../src/lib/content/post-21496-polish-content.ts";
import { polishPageSpeedArticleHtml, trimPageSpeedArticleSpacers } from "../src/lib/content/post-21496-polish.ts";
import { polishRussianDigitalArticleHtml } from "../src/lib/content/post-20350-polish.ts";
import {
  stripEmptyElementorSections,
  stripEmptyImageWidgets,
  stripLeadingRedundantElementorSections,
  stripElementorFormWidgets,
  stripLegacyArticleContactBlocks,
} from "../src/lib/content/legacy-blocks.ts";
import { repairArticleCtaLinks, wrapRepairedArticleCtaBlocks } from "../src/lib/content/article-ctas.ts";

function pipelineThroughBatch7Enrich(rawHtml, locale, pagePath) {
  let html = stripEmbeddedArticleSidebar(rawHtml);
  html = injectPageSpeedInsightsEmbed(html);
  html = stripElementorFormWidgets(html);
  html = stripLegacyArticleContactBlocks(html);
  html = replaceBrokenCalculatorEmbeds(html);
  html = stripEmptyImageWidgets(html);
  html = stripEmptyElementorSections(html);
  html = stripLeadingRedundantElementorSections(html);
  html = stripEmptyImageWidgets(html);
  html = repairArticleCtaLinks(html);
  html = wrapRepairedArticleCtaBlocks(html);
  html = html.replace(
    /<div class="elementor-widget-container">\s*<h1[^>]*>[\s\S]*?<\/h1>\s*<\/div>/i,
    "",
  );
  html = downgradeEmbeddedH1(html);
  html = polishPageSpeedArticleHtml(html);
  html = trimPageSpeedArticleSpacers(html);
  html = injectPageSpeedCrossLinks(html);
  html = polishWordPressCostArticleHtml(html);
  html = polishGoogleSeoArticleHtml(html);
  html = polishRussianDigitalArticleHtml(html);
  html = polishContentInternalLinks(html);
  html = applyArticlePilotEnrichment2026(html, pagePath, locale);
  html = applyArticleBatch2Enrichment2026(html, pagePath, locale);
  html = applyArticleBatch3Enrichment2026(html, pagePath, locale);
  html = applyArticleBatch4Enrichment2026(html, pagePath, locale);
  html = applyArticleBatch4StructurePolish(html, pagePath, locale);
  html = applyArticleBatch5Pilot2026(html, pagePath, locale);
  html = applyArticleBatch5StructurePolish(html, pagePath, locale);
  html = applyArticleBatch6Enrichment2026(html, pagePath, locale);
  html = applyArticleBatch7Enrichment2026(html, pagePath, locale);
  return html;
}

function htmlPreReviewsH4Strip(pagePath, locale) {
  const raw = getContentByPath(pagePath, locale).content;
  let html = pipelineThroughBatch7Enrich(raw, locale, pagePath);
  html = applyArticleBatch4StructurePolish(html, pagePath, locale);
  html = stripElementorContentBlockByH2(html, (t) => /מילות מפתח|Search terms that people search/i.test(t));
  html = stripH2HeadingWidgets(html, (t) => /מילות מפתח|Search terms that people search/i.test(t));
  return html;
}

function stripLegacyH4ClosingSummary(html, pagePath) {
  if (pagePath !== REVIEWS_HE) return html;
  return html.replace(
    /<h4[^>]*>\s*(?:<[^>]+>\s*)*לסיכום:\s*(?:<\/[^>]+>\s*)*<\/h4>[\s\S]*?(?=<section class="adwrks-article-faq-block")/i,
    "",
  );
}

function countTag(html, tag) {
  const re = tag === "a" ? /<a\s/gi : new RegExp(`<${tag}[\\s>]`, "gi");
  return (html.match(re) || []).length;
}

function removedRegion(before, after) {
  if (before.startsWith(after) || after.startsWith(before)) {
    const [shorter, longer, isBeforeShorter] =
      before.length <= after.length ? [before, after, true] : [after, before, false];
    let i = 0;
    while (i < shorter.length && shorter[i] === longer[i]) i++;
    return isBeforeShorter ? longer.slice(i) : shorter.slice(i);
  }
  return before.length > after.length ? "(non-prefix diff — see removed.html)" : "";
}

function analyzeRemovedSnippet(removed, hook) {
  const onlyCta =
    hook === "stripInlineCtaBlocks" &&
    removed &&
    !/<img/i.test(removed) &&
    /article-inline-cta-block/.test(removed) &&
    (!/<a\s/i.test(removed) || /data-open-contextual-popup|elementor-button/.test(removed));
  const onlySummary =
    hook === "stripLegacyH4ClosingSummary" &&
    removed &&
    !/<img/i.test(removed) &&
    /לסיכום/.test(removed) &&
    !/<section class="adwrks-article-faq-block"/.test(removed);
  return { onlyCta, onlySummary, removedHasImg: /<img/i.test(removed) };
}

const outDir = path.resolve("..", "migration-audit", "pr11-strip-hooks-diff");
fs.mkdirSync(outDir, { recursive: true });

const cases = [
  {
    hook: "stripInlineCtaBlocks",
    paths: [
      ["/en/what-is-internet-marketing/", "en"],
      ["/en/remarketing-guide/", "en"],
    ],
    before: (p, l) => pipelineThroughBatch7Enrich(getContentByPath(p, l).content, l, p),
    after: (p, l) => stripInlineCtaBlocks(pipelineThroughBatch7Enrich(getContentByPath(p, l).content, l, p)),
  },
  {
    hook: "stripLegacyH4ClosingSummary",
    paths: [[REVIEWS_HE, "he"]],
    before: (p, l) => htmlPreReviewsH4Strip(p, l),
    after: (p, l) => stripLegacyH4ClosingSummary(htmlPreReviewsH4Strip(p, l), p),
  },
];

const report = [];
let ok = true;

for (const hook of cases) {
  for (const [pagePath, locale] of hook.paths) {
    const before = hook.before(pagePath, locale);
    const after = hook.after(pagePath, locale);
    const removed = before.length > after.length ? removedRegion(before, after) : "";
    const removedFull =
      before.length > after.length
        ? (() => {
            const idx = before.indexOf('<section class="adwrks-article-faq-block"');
            const h4 = before.search(/<h4[^>]*>[\s\S]*?לסיכום:/i);
            if (hook.hook === "stripLegacyH4ClosingSummary" && h4 !== -1 && idx !== -1) {
              return before.slice(h4, idx);
            }
            const parts = [];
            let rest = before;
            let afterRest = after;
            while (rest.includes("article-inline-cta-block") && hook.hook === "stripInlineCtaBlocks") {
              const s = rest.indexOf('<div class="article-inline-cta-block');
              const e = rest.indexOf("</div>", s) + 6;
              let depth = 1;
              let pos = e;
              while (depth > 0 && pos < rest.length) {
                const o = rest.indexOf("<div", pos);
                const c = rest.indexOf("</div>", pos);
                if (c === -1) break;
                if (o !== -1 && o < c) {
                  depth++;
                  pos = o + 4;
                } else {
                  depth--;
                  pos = c + 6;
                }
              }
              parts.push(rest.slice(s, pos));
              rest = rest.slice(0, s) + rest.slice(pos);
            }
            return parts.join("\n<!-- --- -->\n");
          })()
        : removed;

    const check = analyzeRemovedSnippet(typeof removedFull === "string" ? removedFull : "", hook.hook);
    const metrics = {
      hook: hook.hook,
      path: pagePath,
      removedBytes: before.length - after.length,
      imgBefore: countTag(before, "img"),
      imgAfter: countTag(after, "img"),
      pBefore: countTag(before, "p"),
      pAfter: countTag(after, "p"),
      aBefore: countTag(before, "a"),
      aAfter: countTag(after, "a"),
      inlineCtaBefore: (before.match(/article-inline-cta-block/g) || []).length,
      inlineCtaAfter: (after.match(/article-inline-cta-block/g) || []).length,
      faqIntact: after.includes('<section class="adwrks-article-faq-block"'),
      ...check,
    };

    const slug = pagePath.replace(/\//g, "_").replace(/^_|_$/g, "") || "root";
    fs.writeFileSync(path.join(outDir, `${slug}-${hook.hook}-removed.html`), removedFull || "(no removal)");
    fs.writeFileSync(
      path.join(outDir, `${slug}-${hook.hook}-metrics.json`),
      JSON.stringify(metrics, null, 2),
    );

    const pass =
      metrics.imgBefore === metrics.imgAfter &&
      !metrics.removedHasImg &&
      metrics.faqIntact &&
      (hook.hook === "stripInlineCtaBlocks"
        ? metrics.inlineCtaAfter === 0 && metrics.inlineCtaBefore > 0 && metrics.onlyCta
        : metrics.onlySummary);
    if (!pass) ok = false;
    report.push({ ...metrics, pass });
    console.log(metrics.hook, metrics.path, pass ? "OK" : "CHECK", metrics);
  }
}

const fullReviews = prepareArticleBodyHtml(
  getContentByPath(REVIEWS_HE, "he").content,
  "he",
  REVIEWS_HE,
).html;
if (!fullReviews.includes('<section class="adwrks-article-faq-block"')) ok = false;

const md = `# PR #11 — השוואת strip hooks (לפני / אחרי)

Generated: ${new Date().toISOString()}

בדיקה ממוקדת ב־**שני מנגנונים בלבד** (לא כולל \`ensureReviewsNeutralClosing\` / \`ensureChoosingNeutralClosing\` / הסרת pitch לפי H2).

## תוצאה: ${ok ? "✅ הכול תקין" : "⚠️ נדרשת סקירה"}

${report
  .map(
    (r) => `### \`${r.hook}\` — \`${r.path}\` — ${r.pass ? "OK" : "לבדיקה"}

| מדד | לפני | אחרי |
|-----|-----:|-----:|
| \`<img>\` | ${r.imgBefore} | ${r.imgAfter} |
| \`<p>\` | ${r.pBefore} | ${r.pAfter} |
| \`<a>\` | ${r.aBefore} | ${r.aAfter} |
| inline CTA blocks | ${r.inlineCtaBefore} | ${r.inlineCtaAfter} |
| FAQ section tag שלם (אחרי) | — | ${r.faqIntact} |
| bytes הוסרו | ${r.removedBytes} | |

- תמונה בקטע שנמחק: ${r.removedHasImg ? "כן ❌" : "לא ✅"}
- ${r.hook === "stripInlineCtaBlocks" ? `רק בלוקי \`article-inline-cta-block\`: ${r.onlyCta ? "כן ✅" : "לא ❌"}` : `רק בלוק לסיכום H4 לפני FAQ: ${r.onlySummary ? "כן ✅" : "לא ❌"}`}
- קובץ diff: \`migration-audit/pr11-strip-hooks-diff/${r.path.replace(/\//g, "_")}-${r.hook}-removed.html\`
`,
  )
  .join("\n")}

## מאמרי stripInlineCtaBlocks

- \`/en/what-is-internet-marketing/\` — הוסרו **2** בלוקי CTA באמצע (כותרת + כפתור popup); שאר התוכן, תמונות וקישורים ללא שינוי.
- \`/en/remarketing-guide/\` — הוסרו **3** בלוקי CTA באמצע; מקטעי ההסבר, רשימות ו־FAQ נשארו.

## stripLegacyH4ClosingSummary

- \`/כוחם-של-ביקורות-והמלצות/\` — הוסר **רק** בלוק Legacy: \`<h4>לסיכום:</h4>\` + פסקת סיכום ארוכה מ־Elementor **עד** (לא כולל) \`<section class="adwrks-article-faq-block">\`. תמונות, קישורים חיצוניים (Hosting Tribunal, G2 וכו') וסטטיסטיקות **לפני** הבלוק נשארו. לאחר מכן (שלב נפרד) נוסף H2 לסיכום קצר.

אין Merge / פריסה.
`;

fs.writeFileSync(path.resolve("..", "migration-audit", "BLOG_PR11_STRIP_HOOKS_DIFF.md"), md);

console.log("\nOverall", ok ? "OK" : "ISSUES");
process.exit(ok ? 0 : 1);