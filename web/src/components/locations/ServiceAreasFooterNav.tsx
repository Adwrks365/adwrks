"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/i18n/routing";
import { serviceAreaGroups, serviceAreaHubHref, serviceAreaNavLabel } from "@/lib/pages/locations/nav";

type ServiceAreasFooterNavProps = {
  locale: Locale;
};

function AreaChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`site-footer-areas-chevron ${open ? "is-open" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ServiceAreasFooterNav({ locale }: ServiceAreasFooterNavProps) {
  const groups = serviceAreaGroups(locale);
  const hub = serviceAreaHubHref(locale);
  const allLabel = locale === "en" ? "All service areas" : "לכל אזורי השירות";
  const heading = serviceAreaNavLabel(locale);
  const [openRegionId, setOpenRegionId] = useState<string | null>(null);

  const toggleRegion = (id: string) => {
    setOpenRegionId((current) => (current === id ? null : id));
  };

  return (
    <nav className="site-footer-areas" aria-label={heading}>
      <h2 className="site-footer-heading">{heading}</h2>
      <ul className="site-footer-areas-list">
        {groups.map((group) => {
          const isOpen = openRegionId === group.id;
          return (
            <li
              key={group.id}
              className={`site-footer-areas-group ${isOpen ? "is-open" : ""}`.trim()}
            >
              <button
                type="button"
                className="site-footer-areas-trigger"
                aria-expanded={isOpen}
                onClick={() => toggleRegion(group.id)}
              >
                <span>{group.label}</span>
                <AreaChevron open={isOpen} />
              </button>
              {isOpen && (
                <ul className="site-footer-areas-cities">
                  {group.regionHref && (
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
              )}
            </li>
          );
        })}
      </ul>
      <p className="site-footer-areas-hub">
        <Link href={hub} prefetch={false} className="site-footer-areas-hub-link">
          {allLabel}
        </Link>
      </p>
    </nav>
  );
}
