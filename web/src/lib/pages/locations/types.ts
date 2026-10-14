export type LocationFaq = {
  q: string;
  a: string;
};

export type LocationStep = {
  title: string;
  text: string;
};

export type ServiceBlock = {
  title: string;
  text: string;
};

export type LocationCopy = {
  name: string;
  cardText: string;
  badge: string;
  h1: string;
  lead: string;
  seoTitle: string;
  seoDescription: string;
  workLabel: string;
  workTitle: string;
  workIntro: string;
  workSteps: LocationStep[];
  challengesLabel: string;
  challengesTitle: string;
  challengesIntro: string;
  challengesPoints: string[];
  audienceLabel: string;
  audienceTitle: string;
  audienceItems: string[];
  servicesLabel: string;
  servicesTitle: string;
  servicesIntro: string;
  serviceBlocks: ServiceBlock[];
  faqTitle: string;
  faq: LocationFaq[];
  contactTitle: string;
  contactIntro: string;
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
  workLabel: string;
  workTitle: string;
  workIntro: string;
  workSteps: LocationStep[];
  regionsTitle: string;
  regionsIntro: string;
  faqTitle: string;
  faq: LocationFaq[];
  contactTitle: string;
  contactIntro: string;
  finalCtaEyebrow: string;
  finalCtaTitle: string;
  finalCtaBody: string;
  popupHeadline: string;
  popupDescription: string;
  popupCta: string;
};
