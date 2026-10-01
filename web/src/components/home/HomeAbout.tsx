import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { HOMEPAGE_ABOUT, HOMEPAGE_SERVICE_LIST } from "@/lib/homepage/data";
import { SITE } from "@/lib/site";

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

export function HomeAbout() {
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
              <a href={SITE.googlePartnerUrl} target="_blank" rel="noopener noreferrer">
                Google Partner
              </a>
              <span aria-hidden="true">·</span>
              <span>עובדים עם Google ו-Meta</span>
            </p>
          </div>
          <div className="home-about-v2-services">
            <h3 className="home-about-services-title">שירותים שאנחנו מציעים</h3>
            <ServiceCheckList items={HOMEPAGE_SERVICE_LIST} />
          </div>
        </div>
      </Container>
    </section>
  );
}
