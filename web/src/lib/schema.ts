import type { Locale } from "@/i18n/routing";
import { SITE } from "@/lib/site";

export const ORGANIZATION_ID = `${SITE.domain}/#organization`;

/** Official profiles owned by the business — not third-party listings that mention it. */
export const ORGANIZATION_SAME_AS: readonly string[] = [
  SITE.social.facebook,
  SITE.social.instagram,
  SITE.social.youtube,
  SITE.mapsUrl,
  SITE.googlePartnerUrl,
];

/** Verified organization facts applied to the shared `#organization` entity on every locale. */
export function organizationEntityFields(locale: Locale): Record<string, unknown> {
  return {
    foundingDate: SITE.foundingYear,
    founder: SITE.founders.map((founder) => ({ "@type": "Person", name: founder[locale] })),
    knowsLanguage: [...SITE.serviceLanguages],
  };
}
