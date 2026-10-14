export type LocationFaq = {
  q: string;
  a: string;
};

export type LocationCopy = {
  name: string;
  /** One line used on the hub and on nearby-area cards. */
  cardText: string;
  badge: string;
  h1: string;
  lead: string;
  seoTitle: string;
  seoDescription: string;
  marketLabel: string;
  marketTitle: string;
  marketIntro: string;
  marketPoints: string[];
  audienceLabel: string;
  audienceTitle: string;
  audienceItems: string[];
  studioLabel: string;
  studioTitle: string;
  studioIntro: string;
  studioPoints: string[];
  servicesLabel: string;
  servicesTitle: string;
  servicesIntro: string;
  faqTitle: string;
  faq: LocationFaq[];
  nearbyTitle: string;
  nearbyIntro: string;
  midCtaEyebrow: string;
  midCtaTitle: string;
  midCtaBody: string;
  finalCtaEyebrow: string;
  finalCtaTitle: string;
  finalCtaBody: string;
  popupHeadline: string;
  popupDescription: string;
  popupCta: string;
  imageAlt: string;
  areaServedName: string;
};

export type HubCopy = {
  badge: string;
  h1: string;
  lead: string;
  seoTitle: string;
  seoDescription: string;
  modelLabel: string;
  modelTitle: string;
  modelIntro: string;
  modelPoints: string[];
  regionsTitle: string;
  regionsIntro: string;
  citiesTitle: string;
  citiesIntro: string;
  faqTitle: string;
  faq: LocationFaq[];
  finalCtaEyebrow: string;
  finalCtaTitle: string;
  finalCtaBody: string;
  popupHeadline: string;
  popupDescription: string;
  popupCta: string;
};
