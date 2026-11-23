import { inLanguageTag } from "@/i18n/locale";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/content/paths";
import { SITE } from "@/lib/site";
import type { SiteCheckCopy } from "./copy";

export function buildSiteCheckJsonLd(locale: Locale, copy: SiteCheckCopy): unknown[] {
  const pageUrl = absoluteUrl(copy.path);
  const homePath = locale === "en" ? "/en/" : "/";
  const homeLabel = locale === "en" ? "Home" : "דף הבית";
  const pageName = locale === "en" ? "Website check" : "בדיקת אתר";

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: copy.title,
      description: copy.seoDescription,
      inLanguage: inLanguageTag(locale),
      isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.domain },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${pageUrl}#app`,
      name: pageName,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: pageUrl,
      description: copy.seoDescription,
      offers: { "@type": "Offer", price: "0", priceCurrency: "ILS" },
      provider: { "@id": `${SITE.domain}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: homeLabel, item: absoluteUrl(homePath) },
        { "@type": "ListItem", position: 2, name: pageName, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      inLanguage: inLanguageTag(locale),
      mainEntity: copy.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];
}
