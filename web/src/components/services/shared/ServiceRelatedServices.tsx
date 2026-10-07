import Link from "next/link";
import { forwardArrow } from "@/i18n/ui-arrows";
import type { Locale } from "@/i18n/routing";

export type RelatedService = {
  href: string;
  title: string;
  text: string;
};

type ServiceRelatedServicesProps = {
  services: readonly RelatedService[];
  locale?: Locale;
};

export function ServiceRelatedServices({ services, locale = "he" }: ServiceRelatedServicesProps) {
  return (
    <ul className="sp-related-services">
      {services.map((service) => (
        <li key={service.href}>
          <Link href={service.href} className="sp-related-service-link">
            <span className="sp-related-service-title">{service.title}</span>
            <span className="sp-related-service-text">{service.text}</span>
            <span className="sp-related-service-arrow" aria-hidden="true">
              {forwardArrow(locale)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
