import type { PopupContextKey } from "@/lib/popups/types";

export const POPUP_MESSAGING_EN: Record<
  PopupContextKey,
  { headline: string; description: string; ctaLabel: string; contextLabel: string }
> = {
  "google-ads": {
    contextLabel: "Google Ads",
    headline: "Want to review your Google campaigns?",
    description:
      "Tell us about your business and we'll explore how paid search on Google can fit your goals — no obligation.",
    ctaLabel: "Request Google Ads consultation",
  },
  seo: {
    contextLabel: "Organic SEO",
    headline: "Want stronger organic visibility on Google?",
    description:
      "We'll review your organic search presence together and suggest practical next steps tailored to your business.",
    ctaLabel: "Request SEO consultation",
  },
  "meta-ads": {
    contextLabel: "Meta Ads",
    headline: "Want to improve Facebook & Instagram advertising?",
    description:
      "Let's talk about your Meta campaigns and how to improve reach, leads, and results.",
    ctaLabel: "Request Meta Ads consultation",
  },
  website: {
    contextLabel: "Website building",
    headline: "Want a website or landing page that generates leads?",
    description:
      "Tell us about your project and we'll explore how a tailored website can support your marketing and growth.",
    ctaLabel: "Request website consultation",
  },
  hosting: {
    contextLabel: "Hosting & maintenance",
    headline: "Need peace of mind about your website?",
    description:
      "We'll review your hosting and maintenance needs and recommend a package that fits your traffic and goals.",
    ctaLabel: "Request hosting consultation",
  },
  "google-maps": {
    contextLabel: "Google Maps",
    headline: "Want better local visibility on Google?",
    description:
      "We'll review your Google Maps and Business Profile presence and suggest ways to improve local exposure.",
    ctaLabel: "Request Google Maps consultation",
  },
  "digital-marketing": {
    contextLabel: "Digital marketing",
    headline: "Want a tailored digital marketing envelope?",
    description:
      "Tell us about your business and we'll explore which marketing channels fit your goals — practical and transparent.",
    ctaLabel: "Let's talk",
  },
  pricing: {
    contextLabel: "Pricing",
    headline: "Want to understand what fits your budget?",
    description:
      "Leave your details and we'll get back with clear direction on the marketing services that fit your needs and goals.",
    ctaLabel: "Get tailored guidance",
  },
  general: {
    contextLabel: "Marketing consultation",
    headline: "Want sharper digital marketing?",
    description: "Tell us what you want to promote and we'll explore which channel fits your business best.",
    ctaLabel: "Let's talk",
  },
};
