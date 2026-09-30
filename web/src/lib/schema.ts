import { SITE } from "@/lib/site";

/** Organization schema derived from verified audit data. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.domain,
    logo: SITE.logoFull,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.countryCode,
    },
    sameAs: [
      SITE.social.facebook,
      SITE.social.instagram,
      SITE.social.youtube,
    ],
  };
}
