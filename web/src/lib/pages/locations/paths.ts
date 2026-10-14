/**
 * Location route table.
 * Karmiel's Hebrew URL is frozen: it already ranks and must stay byte-for-byte.
 */

export const KARMIEL_HE_PATH = "/סוכנות-פרסום-שיווק-בכרמיאל/" as const;
export const KARMIEL_EN_PATH = "/en/digital-marketing-agency-carmiel/" as const;

export const HUB_HE_PATH = "/אזורי-פעילות/" as const;
export const HUB_EN_PATH = "/en/service-areas/" as const;

export type LocationRouteKind = "hub" | "region" | "city";

export type LocationRoute = {
  id: string;
  kind: LocationRouteKind;
  he: string;
  en: string;
};

export const LOCATION_ROUTES: readonly LocationRoute[] = [
  { id: "hub", kind: "hub", he: HUB_HE_PATH, en: HUB_EN_PATH },
  { id: "karmiel", kind: "city", he: KARMIEL_HE_PATH, en: KARMIEL_EN_PATH },
  {
    id: "north",
    kind: "region",
    he: "/סוכנות-שיווק-דיגיטלי-בצפון/",
    en: "/en/digital-marketing-north/",
  },
  {
    id: "krayot",
    kind: "region",
    he: "/סוכנות-שיווק-דיגיטלי-בקריות/",
    en: "/en/digital-marketing-krayot/",
  },
  {
    id: "center",
    kind: "region",
    he: "/סוכנות-שיווק-דיגיטלי-במרכז/",
    en: "/en/digital-marketing-center/",
  },
  {
    id: "haifa",
    kind: "city",
    he: "/סוכנות-שיווק-דיגיטלי-בחיפה/",
    en: "/en/digital-marketing-haifa/",
  },
  {
    id: "tel-aviv",
    kind: "city",
    he: "/סוכנות-שיווק-דיגיטלי-בתל-אביב/",
    en: "/en/digital-marketing-tel-aviv/",
  },
  {
    id: "jerusalem",
    kind: "city",
    he: "/סוכנות-שיווק-דיגיטלי-בירושלים/",
    en: "/en/digital-marketing-jerusalem/",
  },
  {
    id: "beer-sheva",
    kind: "city",
    he: "/סוכנות-שיווק-דיגיטלי-בבאר-שבע/",
    en: "/en/digital-marketing-beer-sheva/",
  },
  {
    id: "netanya",
    kind: "city",
    he: "/סוכנות-שיווק-דיגיטלי-בנתניה/",
    en: "/en/digital-marketing-netanya/",
  },
];

/** The legacy Karmiel article stays at its URL, but should not compete in blog listings. */
export const HIDDEN_FROM_LISTINGS = new Set<string>([KARMIEL_HE_PATH, KARMIEL_EN_PATH]);

const byPath = new Map<string, LocationRoute>();
for (const route of LOCATION_ROUTES) {
  byPath.set(route.he, route);
  byPath.set(route.en, route);
}

export function locationRouteByPath(path: string): LocationRoute | undefined {
  return byPath.get(path);
}

export function locationAlternatePaths(path: string): { he: string; en: string } | null {
  const route = byPath.get(path);
  if (!route) return null;
  return { he: route.he, en: route.en };
}

export function isLocationRoutablePath(path: string): boolean {
  return byPath.has(path);
}
