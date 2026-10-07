import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getHomepageData } from "@/lib/homepage";
import type { LocaleProps } from "@/lib/locale-props";
import { getSiteConfig } from "@/lib/site";

function ServiceCheckList({
  items,
}: {
  items: readonly { text: string; href?: string }[];
}) {
  return (
    <ul className="home-about-checklist">
      {items.map((item) => (
        <li key={item.text}>
          <span className="home-about-check" aria-hidden="true">
            ✓
          </span>
          {item.href ? (
            <Link href={item.href} className="home-about-check-link">
              {item.text}
            </Link>
          ) : (
            <span>{item.text}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function HomeAbout({ locale = "he" }: LocaleProps) {
  const { HOMEPAGE_ABOUT, HOMEPAGE_SERVICE_LIST } = getHomepageData(locale);
  const site = getSiteConfig(locale);
  return (
    <section id="about" className="home-about-v2" aria-labelledby="home-about-heading">
      <Container>
        <div className="home-about-v2-grid reveal">
          <div className="home-about-v2-copy">
            <p className="home-section-label">{HOMEPAGE_ABOUT.label}</p>
            <h2 id="home-about-heading" className="home-section-title">
              {HOMEPAGE_ABOUT.title}
            </h2>
            <p className="home-about-lead">{HOMEPAGE_ABOUT.subtitle}</p>
            <p className="home-about-body">{HOMEPAGE_ABOUT.body}</p>
            <p className="home-trust-line">
              <a href={site.googlePartnerUrl} target="_blank" rel="noopener noreferrer">
                Google Partner
              </a>
              <span aria-hidden="true">·</span>
              <span>{HOMEPAGE_ABOUT.trustPartners}</span>
            </p>
          </div>
          <div className="home-about-v2-services">
            <h3 className="home-about-services-title">{HOMEPAGE_ABOUT.servicesTitle}</h3>
            <ServiceCheckList items={HOMEPAGE_SERVICE_LIST} />
          </div>
        </div>
      </Container>
    </section>
  );
}
