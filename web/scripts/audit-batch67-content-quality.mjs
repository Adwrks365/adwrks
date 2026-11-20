/**
 * Batch6/7 — duplicate summaries, pitch blocks, inline CTAs.
 * npx tsx scripts/audit-batch67-content-quality.mjs
 */
import { getContentByPath } from "../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../src/lib/content/article.ts";
import { BATCH6_HE_PATHS } from "../src/lib/content/article-batch6-enrichment-2026.ts";
import { BATCH7_EN_PATHS } from "../src/lib/content/article-batch7-enrichment-2026.ts";

const SUMMARY_RE = /^(סיכום|לסיכום|לסיכום:|summary:|in conclusion)/i;
const PITCH_RE =
  /(למה לבחור ב(?:נו|-?\s*adwrks)|why choose adwrks|you chose adwrks|בחרתם נכון|the services offered by a leading)/i;

function audit(path, locale) {
  const c = getContentByPath(path, locale);
  const { html, headings } = prepareArticleBodyHtml(c.content, locale, path);
  const summaries = headings.filter((h) => SUMMARY_RE.test(h.text.trim()));
  const pitches = headings.filter((h) => PITCH_RE.test(h.text.trim()));
  const dupSummary = summaries.length > 1;
  const pitchBlocks = pitches.length;
  const inlineCta = (html.match(/article-inline-cta-block/g) || []).length;
  const elementorCta = (html.match(/elementor-button[^>]*>([^<]*(?:צור קשר|contact|ייעוץ)[^<]*)</gi) || []).length;
  const adwrksPitchParas = (
    html.match(/<p[^>]*>[^<]{0,200}(?:Adwrks 365|אדרקס)[^<]{0,400}<\/p>/gi) || []
  ).filter((p) => /בחרתם|why choose|leading digital|מובילה/i.test(p)).length;

  const issues = [];
  if (dupSummary) issues.push(`duplicate-summary:${summaries.map((s) => s.text.slice(0, 40)).join(" | ")}`);
  if (pitchBlocks > 1) issues.push(`pitch-headings:${pitchBlocks}`);
  if (pitchBlocks === 1 && pitches[0] && !html.includes("adwrks-article-faq-block")) issues.push("orphan-pitch");
  if (inlineCta > 1) issues.push(`inline-cta:${inlineCta}`);
  if (elementorCta > 2) issues.push(`elementor-buttons:${elementorCta}`);
  if (adwrksPitchParas > 2) issues.push(`pitch-paragraphs:${adwrksPitchParas}`);

  return { path, locale, summaries: summaries.length, pitches: pitchBlocks, inlineCta, elementorCta, adwrksPitchParas, issues };
}

const rows = [];
for (const p of BATCH6_HE_PATHS) rows.push(audit(p, "he"));
for (const p of BATCH7_EN_PATHS) rows.push(audit(p, "en"));

let failed = 0;
for (const r of rows) {
  if (r.issues.length) {
    console.log("ISSUES", r.path, r.issues.join("; "));
    failed++;
  } else {
    console.log("OK", r.path, `summaries=${r.summaries} pitches=${r.pitches}`);
  }
}
process.exit(failed ? 1 : 0);