import type { Locale } from "@/i18n/routing";
import type { NavAreaGroup, NavItem } from "@/lib/site";
import { LOCATION_EN } from "./copy-en";
import { LOCATION_HE } from "./copy-he";
import { HUB_EN_PATH, HUB_HE_PATH, locationRouteById } from "./paths";

export type ServiceAreaCityLink = {
  id: string;
  href: string;
  label: string;
};

export type ServiceAreaGroup = {
  id: string;
  label: string;
  regionHref?: string;
  cities: ServiceAreaCityLink[];
};

function cityLink(id: string, locale: Locale): ServiceAreaCityLink {
  const route = locationRouteById(id);
  if (!route || route.kind === "hub") throw new Error(`Missing city route for nav: ${id}`);
  const table = locale === "en" ? LOCATION_EN : LOCATION_HE;
  const copy = table[id];
  if (!copy) throw new Error(`Missing location copy for nav: ${id}`);
  return {
    id,
    href: locale === "en" ? route.en : route.he,
    label: copy.name,
  };
}

function regionHref(id: string, locale: Locale): string | undefined {
  const route = locationRouteById(id);
  if (!route || route.kind !== "region") return undefined;
  return locale === "en" ? route.en : route.he;
}

export function serviceAreaHubHref(locale: Locale): string {
  return locale === "en" ? HUB_EN_PATH : HUB_HE_PATH;
}

export function serviceAreaGroups(locale: Locale): ServiceAreaGroup[] {
  const L = (he: string, en: string) => (locale === "en" ? en : he);

  return [
    {
      id: "center",
      label: L("מרכז", "Center"),
      regionHref: regionHref("center", locale),
      cities: [
        cityLink("tel-aviv", locale),
        cityLink("ramat-gan", locale),
        cityLink("petah-tikva", locale),
        cityLink("rishon-lezion", locale),
        cityLink("holon", locale),
        cityLink("bat-yam", locale),
      ],
    },
    {
      id: "north",
      label: L("צפון", "North"),
      regionHref: regionHref("north", locale),
      cities: [
        cityLink("haifa", locale),
        cityLink("krayot", locale),
        cityLink("akko", locale),
        cityLink("hadera", locale),
        cityLink("netanya", locale),
        cityLink("afula", locale),
        cityLink("karmiel", locale),
      ],
    },
    {
      id: "sharon",
      label: L("שרון", "Sharon"),
      regionHref: regionHref("sharon", locale),
      cities: [
        cityLink("herzliya", locale),
        cityLink("kfar-saba", locale),
        cityLink("raanana", locale),
        cityLink("netanya", locale),
      ],
    },
    {
      id: "south",
      label: L("דרום", "South"),
      regionHref: regionHref("south", locale),
      cities: [
        cityLink("beer-sheva", locale),
        cityLink("ashdod", locale),
        cityLink("ashkelon", locale),
      ],
    },
    {
      id: "jerusalem",
      label: L("ירושלים והסביבה", "Jerusalem and area"),
      cities: [cityLink("jerusalem", locale)],
    },
  ];
}

export function serviceAreasNavGroups(locale: Locale): NavAreaGroup[] {
  return serviceAreaGroups(locale).map((group) => ({
    id: group.id,
    label: group.label,
    regionHref: group.regionHref,
    items: group.cities.map((city) => ({ label: city.label, href: city.href })),
  }));
}

export function serviceAreaNavLabel(locale: Locale): string {
  return locale === "en" ? "Marketing in your area" : "שירותי שיווק באזורך";
}

export function serviceAreasNavItem(locale: Locale): NavItem {
  const hub = serviceAreaHubHref(locale);
  return {
    label: serviceAreaNavLabel(locale),
    href: hub,
    areaGroups: serviceAreasNavGroups(locale),
  };
}

export function isServiceAreasPath(pathname: string, locale: Locale): boolean {
  const hub = serviceAreaHubHref(locale);
  if (pathname === hub || pathname.startsWith(hub)) return true;
  return serviceAreaGroups(locale).some(
    (g) =>
      g.regionHref === pathname ||
      g.cities.some((c) => c.href === pathname || pathname.startsWith(c.href)),
  );
}
