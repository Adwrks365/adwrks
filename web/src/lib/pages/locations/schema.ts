import { inLanguageTag } from "@/i18n/locale";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/content/paths";
import { SITE } from "@/lib/site";
import { HUB_EN_PATH, HUB_HE_PATH } from "./paths";
import type { HubView, LocationView } from "./registry";

const ORG_ID = `${SITE.domain}/#organization`;

function breadcrumb(locale: Locale, items: { name: string; path: string }[]) {
  const pageUrl = absoluteUrl(items[items.length - 1]?.path ?? "/");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    inLanguage: inLanguageTag(locale),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function faqSchema(locale: Locale, path: string, items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    inLanguage: inLanguageTag(locale),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildLocationJsonLd(view: LocationView, locale: Locale): unknown[] {
  const homePath = locale === "en" ? "/en/" : "/";
  const homeLabel = locale === "en" ? "Home" : "דף הבית";
  const hubPath = locale === "en" ? HUB_EN_PATH : HUB_HE_PATH;
  const hubLabel = locale === "en" ? "Service areas" : "אזורי פעילות";
  const pageUrl = absoluteUrl(view.path);
  const provider =
    view.id === "karmiel"
      ? {
          "@type": "ProfessionalService",
          name: SITE.name,
          url: SITE.domain,
          address: {
            "@type": "PostalAddress",
            streetAddress: SITE.address.street,
            addressLocality: SITE.address.locality,
            addressRegion: SITE.address.region,
            addressCountry: SITE.address.country,
          },
        }
      : { "@id": ORG_ID };

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: view.copy.h1,
      description: view.copy.seoDescription,
      inLanguage: inLanguageTag(locale),
      isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.domain },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: view.copy.h1,
      serviceType: locale === "en" ? "Digital marketing" : "שיווק דיגיטלי",
      url: pageUrl,
      provider,
      areaServed: {
        "@type": view.areaServedType,
        name: view.copy.areaServedName,
      },
      inLanguage: inLanguageTag(locale),
    },
    faqSchema(locale, view.path, view.copy.faq),
    breadcrumb(locale, [
      { name: homeLabel, path: homePath },
      { name: hubLabel, path: hubPath },
      { name: view.copy.h1, path: view.path },
    ]),
  ];
}

export function buildHubJsonLd(view: HubView, locale: Locale): unknown[] {
  const homePath = locale === "en" ? "/en/" : "/";
  const homeLabel = locale === "en" ? "Home" : "דף הבית";
  const pageUrl = absoluteUrl(view.path);
  const areas = [...view.regions, ...view.cities];

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: view.copy.h1,
      description: view.copy.seoDescription,
      inLanguage: inLanguageTag(locale),
      isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.domain },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${pageUrl}#areas`,
      itemListElement: areas.map((area, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: area.title,
        url: absoluteUrl(area.href),
      })),
    },
    faqSchema(locale, view.path, view.copy.faq),
    breadcrumb(locale, [
      { name: homeLabel, path: homePath },
      { name: view.copy.h1, path: view.path },
    ]),
  ];
}
