import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import { stripInlineCtaBlocks } from "@/lib/content/article-ctas";
import {
  stripElementorContentBlockByH2,
  stripH2HeadingWidgets,
} from "@/lib/content/article-structure-polish";
import { BATCH7_EN_PATHS } from "@/lib/content/article-batch7-enrichment-2026";

const BATCH7_EN = new Set(BATCH7_EN_PATHS.map((p) => normalizePath(p)));

function isEnPitchOrDuplicateClosing(text: string): boolean {
  const t = text.trim();
  if (/^why choose adwrks/i.test(t)) return true;
  if (/^in conclusion:\s*you made the right choice/i.test(t)) return true;
  if (/^the services offered by a leading digital marketing company/i.test(t)) return true;
  if (/adwrks 365 company:\s*leading internet marketing/i.test(t)) return true;
  if (/^sell on (?:google shopping|facebook) with adwrks/i.test(t)) return true;
  return false;
}

const CHOOSING_EN_PATH = normalizePath("/en/choosing-digital-marketing-agency/");

function ensureChoosingNeutralClosing(html: string, path: string): string {
  if (normalizePath(path) !== CHOOSING_EN_PATH) return html;
  if (/in conclusion|summary:/i.test(html)) return html;
  const block =
    '<h2 class="elementor-heading-title elementor-size-default">In conclusion</h2><p>Compare agencies on the same brief, confirm you own ad accounts, and review results after 90 days before scaling spend.</p>';
  const marker = '<section class="adwrks-article-faq-block"';
  const idx = html.indexOf(marker);
  if (idx === -1) return `${html}${block}`;
  return `${html.slice(0, idx)}${block}${html.slice(idx)}`;
}

/** Batch7 EN — drop legacy agency pitch blocks + redundant mid-article CTAs when rollout lead exists. */
export function applyArticleBatch7StructurePolish(html: string, path: string, locale: Locale): string {
  if (locale !== "en") return html;
  if (!BATCH7_EN.has(normalizePath(path))) return html;
  if (!html.includes("adwrks-article-lead-2026")) return html;

  let next = html;
  next = stripElementorContentBlockByH2(next, (t) => isEnPitchOrDuplicateClosing(t));
  next = stripH2HeadingWidgets(next, (t) => isEnPitchOrDuplicateClosing(t));
  next = stripInlineCtaBlocks(next);
  next = ensureChoosingNeutralClosing(next, path);
  return next;
}