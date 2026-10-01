import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  HOMEPAGE_PRIMARY_SERVICES,
  HOMEPAGE_SECONDARY_SERVICES,
} from "@/lib/homepage/data";

export function HomeServiceOverview() {
  const featured = HOMEPAGE_PRIMARY_SERVICES.find((s) => s.featured);
  const others = HOMEPAGE_PRIMARY_SERVICES.filter((s) => !s.featured);

  return (
    <section id="we-offer" className="home-services-v2" aria-labelledby="home-services-heading">
      <Container>
        <header className="home-section-header reveal">
          <p className="home-section-label">שירותים</p>
          <h2 id="home-services-heading" className="home-section-title">
            פתרונות שיווק דיגיטלי לעסקים
          </h2>
          <p className="home-section-lead">
            SEO, פרסום ממומן, סושיאל ובניית אתרים — כל ערוץ עובד יחד לתוצאות.
          </p>
        </header>

        <div className="home-services-v2-grid reveal">
          {featured ? (
            <Link href={featured.href} className="home-service-featured">
              <span className="home-service-featured-label">שירות מרכזי</span>
              <h3 className="home-service-featured-title">{featured.title}</h3>
              <p className="home-service-featured-desc">{featured.description}</p>
              <span className="home-service-link-arrow">לפרטים ←</span>
            </Link>
          ) : null}

          <div className="home-services-v2-primary">
            {others.map((service) => (
              <Link key={service.href} href={service.href} className="home-service-card">
                <h3 className="home-service-card-title">{service.title}</h3>
                <p className="home-service-card-desc">{service.description}</p>
                <span className="home-service-link-arrow">לפרטים ←</span>
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
