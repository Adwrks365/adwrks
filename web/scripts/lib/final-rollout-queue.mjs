/**
 * Deterministic final-rollout queue (no gitignored JSON required).
 */
import { FINAL_ROLLOUT_PATHS } from "../../src/lib/content/article-final-rollout-enrichment-2026.ts";
import { getContentByPath } from "../../src/lib/content/loader.ts";
import { prepareArticleBodyHtml } from "../../src/lib/content/article.ts";

/** Root Elementor post marker, e.g. elementor-19398 */
export function extractPostMarker(html) {
  if (!html) return null;
  const wpPost = html.match(
    /data-elementor-type=["']wp-post["'][^>]*data-elementor-id=["'](\d+)["']/i,
  );
  if (wpPost) return `elementor-${wpPost[1]}`;
  const wpPostAlt = html.match(
    /data-elementor-id=["'](\d+)["'][^>]*data-elementor-type=["']wp-post["']/i,
  );
  if (wpPostAlt) return `elementor-${wpPostAlt[1]}`;
  const postRoot = html.match(
    /class=["']elementor elementor-(\d+)["'][^>]*data-elementor-post-type=["']post["']/i,
  );
  if (postRoot) return `elementor-${postRoot[1]}`;
  const loose = html.match(/\bclass=["']elementor elementor-(\d+)["']/i);
  if (loose) return `elementor-${loose[1]}`;
  if (html.includes("adwrks-roi-calculator-embed")) return "adwrks-roi-calculator-embed";
  if (html.includes("data-adwrks-pagespeed-insights")) return "data-adwrks-pagespeed-insights";
  if (html.includes("pricing-calculator-root")) return "pricing-calculator-root";
  return null;
}

const SKIP = { skipFinalRollout: true, skipBatch9: true, skipBatch8: true };

export function buildFinalRolloutQueue() {
  const queue = [];
  for (const articlePath of FINAL_ROLLOUT_PATHS) {
    const locale = articlePath.startsWith("/en/") ? "en" : "he";
    const item = getContentByPath(articlePath, locale);
    if (!item) {
      queue.push({
        id: null,
        locale,
        path: articlePath,
        title: articlePath,
        status: "missing",
        postMarker: null,
      });
      continue;
    }
    const before = prepareArticleBodyHtml(item.content, locale, articlePath, SKIP);
    const hadLead =
      before.html.includes("adwrks-article-lead-2026") || /adwrks-article-lead/.test(before.html);
    const faqBefore = (before.html.match(/adwrks-faq-item|<details[\s>]/gi) || []).length;
    const status = hadLead || faqBefore >= 2 ? "needs-partial" : "needs-content";
    const title = (item.title || "").replace(/<[^>]+>/g, "").slice(0, 120);
    queue.push({
      id: item.id,
      locale,
      path: articlePath,
      title,
      status,
      postMarker: extractPostMarker(item.content),
    });
  }
  queue.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  return queue;
}