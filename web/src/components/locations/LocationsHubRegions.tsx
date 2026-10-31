import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { serviceAreaGroups, type ServiceAreaGroup } from "@/lib/pages/locations/nav";

type LocationsHubRegionsProps = {
  locale: Locale;
  intro: string;
};

function RegionPanel({ group, locale }: { group: ServiceAreaGroup; locale: Locale }) {
  const allLabel = locale === "en" ? `All ${group.label}` : `כל ${group.label}`;

  return (
    <section className="loc-hub-region" aria-labelledby={`loc-hub-${group.id}`}>
      <h3 className="loc-hub-region-title" id={`loc-hub-${group.id}`}>
        {group.label}
      </h3>
      <ul className="loc-hub-region-links">
        {group.regionHref ? (
          <li className="loc-hub-region-links-item loc-hub-region-links-item--region">
            <Link href={group.regionHref} prefetch={false}>
              {allLabel}
            </Link>
          </li>
        ) : null}
        {group.cities.map((city) => (
          <li key={city.href} className="loc-hub-region-links-item">
            <Link href={city.href} prefetch={false}>
              {city.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LocationsHubRegions({ locale, intro }: LocationsHubRegionsProps) {
  const groups = serviceAreaGroups(locale);

  return (
    <div className="loc-hub-regions-wrap">
      <p className="loc-hub-regions-intro">{intro}</p>
      <div className="loc-hub-regions">
        {groups.map((group) => (
          <RegionPanel key={group.id} group={group} locale={locale} />
        ))}
      </div>
    </div>
  );
}
