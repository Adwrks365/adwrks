import type { Locale } from "@/i18n/routing";
import { normalizePath, slugSegmentsFromPath } from "@/lib/content/paths";
import type { RelatedService } from "@/components/services/shared/ServiceRelatedServices";
import { LOCATION_EN, HUB_EN } from "./copy-en";
import { LOCATION_HE, HUB_HE } from "./copy-he";
import {
  HUB_EN_PATH,
  HUB_HE_PATH,
  LOCATION_ROUTES,
  locationRouteByPath,
  type LocationRoute,
} from "./paths";
import type { HubCopy, LocationCopy } from "./types";

const NEARBY: Record<string, readonly string[]> = {
  karmiel: ["north", "haifa", "afula"],
  north: ["karmiel", "haifa", "hadera"],
  krayot: ["haifa", "karmiel", "akko"],
  center: ["tel-aviv", "ramat-gan", "petah-tikva"],
  sharon: ["herzliya", "netanya", "kfar-saba"],
  south: ["beer-sheva", "ashdod", "ashkelon"],
  haifa: ["krayot", "karmiel", "akko"],
  "tel-aviv": ["center", "ramat-gan", "holon"],
  "ramat-gan": ["tel-aviv", "center", "petah-tikva"],
  "petah-tikva": ["ramat-gan", "rishon-lezion", "center"],
  "rishon-lezion": ["holon", "bat-yam", "petah-tikva"],
  holon: ["bat-yam", "tel-aviv", "rishon-lezion"],
  "bat-yam": ["holon", "tel-aviv", "rishon-lezion"],
  akko: ["haifa", "krayot", "hadera"],
  hadera: ["netanya", "afula", "haifa"],
  afula: ["karmiel", "north", "hadera"],
  herzliya: ["raanana", "kfar-saba", "tel-aviv"],
  "kfar-saba": ["raanana", "herzliya", "netanya"],
  raanana: ["kfar-saba", "herzliya", "sharon"],
  netanya: ["hadera", "sharon", "herzliya"],
  jerusalem: ["center", "beer-sheva", "ashdod"],
  "beer-sheva": ["ashkelon", "ashdod", "jerusalem"],
  ashdod: ["ashkelon", "beer-sheva", "south"],
  ashkelon: ["ashdod", "beer-sheva", "south"],
};

const AREA_TYPE: Record<string, "City" | "AdministrativeArea"> = {
  north: "AdministrativeArea",
  krayot: "AdministrativeArea",
  center: "AdministrativeArea",
  sharon: "AdministrativeArea",
  south: "AdministrativeArea",
};

export type LocationView = {
  id: string;
  kind: "city" | "region";
  path: string;
  areaServedType: "City" | "AdministrativeArea";
  copy: LocationCopy;
  nearby: RelatedService[];
  services: RelatedService[];
  hubHref: string;
};

export type HubView = {
  path: string;
  copy: HubCopy;
  regions: RelatedService[];
  cities: RelatedService[];
  services: RelatedService[];
};

function copyFor(id: string, locale: Locale): LocationCopy {
  const table = locale === "en" ? LOCATION_EN : LOCATION_HE;
  const copy = table[id];
  if (!copy) throw new Error(`Missing location copy: ${id} (${locale})`);
  return copy;
}

function routeById(id: string): LocationRoute {
  const route = LOCATION_ROUTES.find((item) => item.id === id);
  if (!route) throw new Error(`Missing location route: ${id}`);
  return route;
}

export function locationServiceLinks(locale: Locale): RelatedService[] {
  if (locale === "en") {
    return [
      {
        href: "/en/seo/",
        title: "SEO",
        text: "Organic search built for intent, not for a keyword list.",
      },
      {
        href: "/en/google-ads/",
        title: "Google Ads",
        text: "Paid search with a clear offer and a page that can hold it.",
      },
      {
        href: "/en/social-media-management/",
        title: "Social",
        text: "Social and Meta when the buyer decides there, not as a default.",
      },
      {
        href: "/en/website-building/",
        title: "Websites",
        text: "A site as one service inside the agency, when the page is what blocks the lead.",
      },
      {
        href: "/en/hosting-plans/",
        title: "Hosting",
        text: "Hosting and care so the site stays fast and looked after.",
      },
      {
        href: "/en/digital-marketing-services/",
        title: "All services",
        text: "The full practice, from the same team.",
      },
    ];
  }

  return [
    {
      href: "/seo/",
      title: "קידום אורגני",
      text: "נוכחות בגוגל לפי כוונת חיפוש, לא לפי רשימת מילים.",
    },
    {
      href: "/google-ads/",
      title: "Google Ads",
      text: "פרסום ממומן עם הצעה ברורה ודף שמסוגל להחזיק אותה.",
    },
    {
      href: "/social-media-management/",
      title: "רשתות חברתיות",
      text: "סושיאל ומטא כשהקונה מחליט שם, לא כברירת מחדל.",
    },
    {
      href: "/website-building/",
      title: "בניית אתרים",
      text: "אתר כשירות אחד בתוך הסוכנות, כשהדף הוא מה שעוצר את הפנייה.",
    },
    {
      href: "/hosting-plans/",
      title: "אחסון ותחזוקה",
      text: "אחסון וטיפול שוטף כדי שהאתר יישאר מהיר ומתוחזק.",
    },
    {
      href: "/שירותי-שיווק-דיגיטלי/",
      title: "כל השירותים",
      text: "המעטפת המלאה, מאותו צוות.",
    },
  ];
}

function card(id: string, locale: Locale): RelatedService {
  const route = routeById(id);
  const copy = copyFor(id, locale);
  return {
    href: locale === "en" ? route.en : route.he,
    title: copy.name,
    text: copy.cardText,
  };
}

export function getLocationView(path: string, locale: Locale): LocationView | null {
  const route = locationRouteByPath(normalizePath(path));
  if (!route || route.kind === "hub") return null;

  const nearbyIds = NEARBY[route.id] ?? [];
  return {
    id: route.id,
    kind: route.kind,
    path: locale === "en" ? route.en : route.he,
    areaServedType: AREA_TYPE[route.id] ?? "City",
    copy: copyFor(route.id, locale),
    nearby: nearbyIds.map((id) => card(id, locale)),
    services: locationServiceLinks(locale),
    hubHref: locale === "en" ? HUB_EN_PATH : HUB_HE_PATH,
  };
}

export function getHubView(path: string, locale: Locale): HubView | null {
  const route = locationRouteByPath(normalizePath(path));
  if (!route || route.kind !== "hub") return null;

  const regions = LOCATION_ROUTES.filter((item) => item.kind === "region").map((item) =>
    card(item.id, locale),
  );
  const cities = LOCATION_ROUTES.filter((item) => item.kind === "city").map((item) =>
    card(item.id, locale),
  );

  return {
    path: locale === "en" ? route.en : route.he,
    copy: locale === "en" ? HUB_EN : HUB_HE,
    regions,
    cities,
    services: locationServiceLinks(locale),
  };
}

export function locationStaticParams(): { locale: Locale; slug: string[] }[] {
  const params: { locale: Locale; slug: string[] }[] = [];
  for (const route of LOCATION_ROUTES) {
    params.push({ locale: "he", slug: slugSegmentsFromPath(route.he) });
    const enSegments = slugSegmentsFromPath(route.en);
    params.push({ locale: "en", slug: enSegments[0] === "en" ? enSegments.slice(1) : enSegments });
  }
  return params;
}

export function locationSitemapPaths(locale: Locale): string[] {
  return LOCATION_ROUTES.map((route) => (locale === "en" ? route.en : route.he));
}
