import Link from "next/link";

export type RelatedService = {
  href: string;
  title: string;
  text: string;
};

type ServiceRelatedServicesProps = {
  services: readonly RelatedService[];
};

export function ServiceRelatedServices({ services }: ServiceRelatedServicesProps) {
  return (
    <ul className="sp-related-services">
      {services.map((service) => (
        <li key={service.href}>
          <Link href={service.href} className="sp-related-service-link">
            <span className="sp-related-service-title">{service.title}</span>
            <span className="sp-related-service-text">{service.text}</span>
            <span className="sp-related-service-arrow" aria-hidden="true">
              ←
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
