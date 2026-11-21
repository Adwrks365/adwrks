import type { Locale } from "@/i18n/routing";
import { applyArticleFinalRolloutBatch1015Enrichment2026 } from "@/lib/content/article-final-rollout-batch10-15-enrichment-2026";
import { applyArticleFinalRolloutBatch1620Enrichment2026 } from "@/lib/content/article-final-rollout-batch16-20-enrichment-2026";
import { FINAL_ROLLOUT_BATCH10_15_PATHS } from "@/lib/content/article-final-rollout-batch10-15-enrichment-2026";
import { FINAL_ROLLOUT_BATCH16_20_PATHS } from "@/lib/content/article-final-rollout-batch16-20-enrichment-2026";

/** Single apply hook for final blog rollout (batches 10–20). */
export function applyArticleFinalRolloutEnrichment2026(
  html: string,
  path: string,
  locale: Locale,
): string {
  let next = applyArticleFinalRolloutBatch1015Enrichment2026(html, path, locale);
  next = applyArticleFinalRolloutBatch1620Enrichment2026(next, path, locale);
  return next;
}

export const FINAL_ROLLOUT_PATHS = [
  ...new Set([...FINAL_ROLLOUT_BATCH10_15_PATHS, ...FINAL_ROLLOUT_BATCH16_20_PATHS]),
];