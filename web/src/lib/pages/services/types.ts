export type ServiceCta = {
  text: string;
  href: string;
  variant?: "primary" | "outline";
};

export type ServiceStep = {
  title: string;
  text: string;
};

export type ServiceCard = {
  title: string;
  text: string;
};

export type ServiceFaq = {
  q: string;
  a: string;
};

export type ServiceSection = {
  eyebrow?: string;
  heading: string;
  paragraphs?: string[];
  html?: string;
  list?: string[];
  steps?: ServiceStep[];
  cards?: ServiceCard[];
  image?: { src: string; alt: string };
  cta?: ServiceCta;
  faq?: ServiceFaq[];
  layout?: "default" | "split" | "steps" | "cards" | "list-only";
};

export type ServicePageContent = {
  path: string;
  slug: string;
  title: string;
  hero: {
    title: string;
    subtitle: string;
    image?: { src: string; alt: string };
    ctas?: ServiceCta[];
  };
  sections: ServiceSection[];
  finalCta?: {
    eyebrow?: string;
    heading: string;
    paragraphs?: string[];
    html?: string;
    ctas?: ServiceCta[];
  };
};

/** Section is renderable only when it has meaningful body content. */
export function sectionHasContent(section: ServiceSection): boolean {
  return Boolean(
    section.paragraphs?.some((p) => p.trim().length > 20) ||
      section.html?.trim() ||
      section.list?.length ||
      section.steps?.length ||
      section.cards?.length ||
      section.faq?.length ||
      (section.image && (section.paragraphs?.length || section.list?.length || section.steps?.length)),
  );
}
