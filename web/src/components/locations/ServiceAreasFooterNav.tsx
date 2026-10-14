"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { serviceAreaGroups, serviceAreaHubHref } from "@/lib/pages/locations/nav";

type ServiceAreasFooterNavProps = {
  locale: Locale;
};

export function ServiceAreasFooterNav({ locale }: ServiceAreasFooterNavProps) {
  const groups = serviceAreaGroups(locale);
  const hub = serviceAreaHubHref(locale);
  const allLabel = locale === "en" ? "All service areas" : "לכל אזורי השירות";
  const heading = locale === "en" ? "Service areas" : "אזורי שירות";

  return (
    <nav className="site-footer-areas" aria-label={heading}>
      <h2 className="site-footer-heading">{heading}</h2>
      <ul className="site-footer-areas-list">
        {groups.map((group) => (
          <li key={group.id} className="site-footer-areas-group">
            <details className="site-footer-areas-details">
              <summary className="site-footer-areas-summary">{group.label}</summary>
              <ul className="site-footer-areas-cities">
                {group.regionHref && group.cities.length > 1 && (
                  <li>
                    <Link href={group.regionHref} prefetch={false} className="site-footer-areas-link">
                      {locale === "en" ? `All ${group.label}` : `כל ${group.label}`}
                    </Link>
                  </li>
                )}
                {group.cities.map((city) => (
                  <li key={city.href}>
                    <Link href={city.href} prefetch={false} className="site-footer-areas-link">
                      {city.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
      <p className="site-footer-areas-hub">
        <Link href={hub} prefetch={false} className="site-footer-areas-hub-link">
          {allLabel}
        </Link>
      </p>
    </nav>
  );
}
