import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { linkWithArrow } from "@/i18n/ui-arrows";
import { getHomepageData } from "@/lib/homepage";
import type { LocaleProps } from "@/lib/locale-props";

export function HomeServiceOverview({ locale = "he" }: LocaleProps) {
  const { HOMEPAGE_PRIMARY_SERVICES, HOMEPAGE_SECONDARY_SERVICES, HOMEPAGE_SERVICES } =
    getHomepageData(locale);
  const featured = HOMEPAGE_PRIMARY_SERVICES.find((s) => s.featured);
  const others = HOMEPAGE_PRIMARY_SERVICES.filter((s) => !s.featured);

  return (
    <section id="we-offer" className="home-services-v2" aria-labelledby="home-services-heading">
      <Container>
        <header className="home-section-header reveal">
          <p className="home-section-label">{HOMEPAGE_SERVICES.label}</p>
          <h2 id="home-services-heading" className="home-section-title">
            {HOMEPAGE_SERVICES.title}
          </h2>
          <p className="home-section-lead">{HOMEPAGE_SERVICES.lead}</p>
        </header>

        <div className="home-services-v2-grid reveal">
          {featured ? (
            <Link href={featured.href} className="home-service-featured">
              <span className="home-service-featured-label">{HOMEPAGE_SERVICES.featuredLabel}</span>
              <h3 className="home-service-featured-title">{featured.title}</h3>
              <p className="home-service-featured-desc">{featured.description}</p>
              <span className="home-service-link-arrow">
                {linkWithArrow(locale, HOMEPAGE_SERVICES.detailsLabel)}
              </span>
            </Link>
          ) : null}

          <div className="home-services-v2-primary">
            {others.map((service) => (
              <Link key={service.href} href={service.href} className="home-service-card">
                <h3 className="home-service-card-title">{service.title}</h3>
                <p className="home-service-card-desc">{service.description}</p>
                <span className="home-service-link-arrow">
                  {linkWithArrow(locale, HOMEPAGE_SERVICES.detailsLabel)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <ul className="home-services-v2-secondary reveal">
          {HOMEPAGE_SECONDARY_SERVICES.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="home-service-secondary-link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
