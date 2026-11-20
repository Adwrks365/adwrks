import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import { stripInlineCtaBlocks } from "@/lib/content/article-ctas";
import {
  stripElementorContentBlockByH2,
  stripElementorContentBlockByH3,
  stripH2HeadingWidgets,
} from "@/lib/content/article-structure-polish";
import { FINAL_ROLLOUT_PATHS } from "@/lib/content/article-final-rollout-enrichment-2026";

const FINAL_SET = new Set(FINAL_ROLLOUT_PATHS.map((p) => normalizePath(p)));

function isLegacyEnPitchHeading(text: string): boolean {
  const t = text.trim();
  return (
    /^why choose adwrks/i.test(t) ||
    /^free advertising package/i.test(t) ||
    /with us you can enjoy/i.test(t) ||
    /^the services offered by a leading digital marketing company/i.test(t)
  );
}

function isLegacyHePitchHeading(text: string): boolean {
  const t = text.trim();
  return (
    /^למה לבחור באדרוורקס/i.test(t) ||
    /^חבילת פרסום חינם/i.test(t) ||
    /^עבודה עם adwrks/i.test(t) ||
    /^דרכים ליצירת קשר/i.test(t)
  );
}

/** Shared safe polish for final-rollout articles after lead injection. */
export function applyArticleFinalRolloutStructurePolish(
  html: string,
  path: string,
  locale: Locale,
): string {
  const key = normalizePath(path);
  if (!FINAL_SET.has(key) || !html.includes("adwrks-article-lead-2026")) return html;

  let next = html;
  next = next.replace(/<ins class="adsbygoogle"[\s\S]*?<\/ins>\s*/gi, "");
  next = stripInlineCtaBlocks(next);

  if (locale === "en") {
    next = stripElementorContentBlockByH2(next, (t) => isLegacyEnPitchHeading(t));
    next = stripH2HeadingWidgets(next, (t) => isLegacyEnPitchHeading(t));
    next = stripElementorContentBlockByH2(next, (t) => /^summary$/i.test(t));
    next = stripElementorContentBlockByH3(next, (t) => /^summary$/i.test(t));
  } else {
    next = stripElementorContentBlockByH2(next, (t) => isLegacyHePitchHeading(t));
    next = stripElementorContentBlockByH3(next, (t) => /^(סיכום|לסיכום)$/i.test(t));
  }

  return next;
}