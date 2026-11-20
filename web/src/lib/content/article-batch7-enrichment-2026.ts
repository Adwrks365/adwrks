import type { Locale } from "@/i18n/routing";
import { normalizePath } from "@/lib/content/paths";
import {
  buildArticleFaqBlock,
  buildArticleLeadBlock,
  upsertArticleFaq,
  upsertArticleLead,
} from "@/lib/content/article-content-blocks";

type BatchConfig = {
  postMarker: string;
  lead: (locale: Locale) => string;
  faq: (locale: Locale) => string;
};

const BATCH7_EN: Record<string, BatchConfig> = {
  "/en/business-advertising/": {
    postMarker: "elementor-19070",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Business advertising in 2026 should start with a measurable goal — leads, sales, or awareness — then pick channels (search, social, maps, SEO) that fit that goal.",
        "This guide covers budgeting, channel mix, and avoiding wasted spend. Next steps: <a href=\"/en/google-ads/\">Google Ads</a> · <a href=\"/en/social-media-management/\">social media management</a> · <a href=\"/en/digital-marketing-services/\">digital marketing services</a>.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Which channel works best for a local small business?",
          answer:
            "Often Google Business Profile, a focused search campaign, and a site with a clear contact form. Add remarketing or social when budget allows.",
        },
        {
          question: "What is a realistic minimum ad budget?",
          answer:
            "Depends on niche and competition. Allow at least one to three months of learning with proper tracking — not a token amount that cannot gather data.",
        },
        {
          question: "When is SEO better than paid ads?",
          answer:
            "When you can wait for results and do not need instant visibility. Paid works when you need leads quickly or want to test messaging first.",
        },
        {
          question: "How do you know ads produce leads, not just clicks?",
          answer:
            "Set GA4 conversions, use UTMs on campaigns, and track cost per lead or sale — not vanity metrics alone.",
        },
      ]),
  },
  "/en/what-is-internet-marketing/": {
    postMarker: "elementor-21051",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Internet marketing is the set of practices that help businesses be found, trusted, and chosen online — through search, paid media, content, email, and social channels working toward defined KPIs.",
        "This article maps the main building blocks and when each is worth prioritizing for a small or mid-sized business.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Is internet marketing the same as digital marketing?",
          answer:
            "Most people use the terms interchangeably. Both refer to marketing that uses online channels and measurable data.",
        },
        {
          question: "What should a business fix first?",
          answer:
            "A working website, clear contact path, and analytics. Then one growth channel aligned with where customers search.",
        },
        {
          question: "Do you need every channel at once?",
          answer:
            "No. Depth on one or two channels usually beats thin presence everywhere.",
        },
        {
          question: "When does outsourcing make sense?",
          answer:
            "When ad spend, content volume, or reporting exceed what the owner can manage weekly with quality.",
        },
      ]),
  },
  "/en/paid-vs-organic-seo/": {
    postMarker: "elementor-21860",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Paid search and organic SEO solve different timelines: ads can deliver traffic quickly; SEO builds durable visibility when content and technical foundations are solid.",
        "Use this guide to decide how to split budget and effort — and when running both together is justified.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Can I stop paid ads and rely only on SEO?",
          answer:
            "Sometimes, after SEO gains and stable lead flow. Competitive niches often still use paid for coverage gaps.",
        },
        {
          question: "Does paid traffic help SEO rankings?",
          answer:
            "Paid does not buy organic rankings. Indirectly, brand searches and engagement can support overall visibility.",
        },
        {
          question: "What is a sensible starter split?",
          answer:
            "Depends on urgency. Need leads this month: heavier paid. Building for next year: heavier SEO and content.",
        },
        {
          question: "How long until SEO shows results?",
          answer:
            "Often several months. Depends on competition, domain history, and content quality.",
        },
      ]),
  },
  "/en/remarketing-guide/": {
    postMarker: "elementor-21272",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Remarketing shows ads to people who already visited your site or engaged with your brand — useful when the sales cycle is longer than one session.",
        "This guide explains setup basics, frequency caps, and how to avoid annoying past visitors while staying within privacy rules.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "When is remarketing worth it?",
          answer:
            "When you have enough site traffic, a clear offer, and visitors who research before buying. Very low traffic may not justify setup cost.",
        },
        {
          question: "Which platforms support remarketing?",
          answer:
            "Google Ads, Meta, and others via pixels or tag managers. Each has audience size minimums and policy rules.",
        },
        {
          question: "How often should people see remarketing ads?",
          answer:
            "Use frequency caps and segment by intent (cart abandoners vs. blog readers). Too many impressions hurts brand trust.",
        },
        {
          question: "Do remarketing ads replace email follow-up?",
          answer:
            "They complement it. Email works for opted-in contacts; remarketing reaches broader site visitors within platform policies.",
        },
      ]),
  },
  "/en/choosing-digital-marketing-agency/": {
    postMarker: "elementor-21716",
    lead: () =>
      buildArticleLeadBlock("en", [
        "Choosing a digital marketing agency means matching your goals, budget, and internal capacity to a partner that reports clearly and protects your ad accounts and data access.",
        "This article lists practical questions for proposals, red flags, and what a healthy first 90 days should look like.",
      ]),
    faq: () =>
      buildArticleFaqBlock("en", [
        {
          question: "Should the agency own our Google Ads account?",
          answer:
            "You should remain owner. Agency access via MCC or admin invite is fine; avoid lock-in without credentials.",
        },
        {
          question: "What belongs in a transparent proposal?",
          answer:
            "Channels, reporting cadence, who does the work, exclusions, and KPIs — not vague «growth» promises.",
        },
        {
          question: "Agency vs. freelance consultant?",
          answer:
            "Agencies bring breadth and backup; consultants can be lean for strategy-only. Pick based on execution volume you need.",
        },
        {
          question: "When is it time to switch agencies?",
          answer:
            "Repeated lack of reporting transparency, no improvement after an agreed onboarding period, or misalignment on goals despite written feedback.",
        },
      ]),
  },
};

function applyMap(
  html: string,
  path: string,
  locale: Locale,
  map: Record<string, BatchConfig>,
): string {
  const row = map[normalizePath(path)];
  if (!row) return html;
  let next = html;
  next = upsertArticleLead(next, row.lead(locale));
  next = upsertArticleFaq(next, row.faq(locale), row.postMarker);
  return next;
}

/** Batch7 — English reading UX rollout (+ HE pair for business advertising in batch6). */
export function applyArticleBatch7Enrichment2026(html: string, path: string, locale: Locale): string {
  if (locale !== "en") return html;
  return applyMap(html, path, locale, BATCH7_EN);
}

export const BATCH7_EN_PATHS = Object.keys(BATCH7_EN);