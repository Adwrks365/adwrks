import { ContextualPopupTrigger } from "@/components/popups/ContextualPopupTrigger";
import { Container } from "@/components/ui/Container";
import { getHomepageData } from "@/lib/homepage";
import type { LocaleProps } from "@/lib/locale-props";

export function HomeStrategicPartner({ locale = "he" }: LocaleProps) {
  const { HOMEPAGE_PARTNERS } = getHomepageData(locale);
  return (
    <section className="home-strategic-partner" aria-labelledby="home-partner-heading">
      <Container narrow>
        <div className="home-strategic-partner-inner reveal">
          <p className="home-section-label">{HOMEPAGE_PARTNERS.label}</p>
          <h2 id="home-partner-heading" className="home-strategic-partner-title">
            {HOMEPAGE_PARTNERS.title}
          </h2>
          <p className="home-strategic-partner-body">{HOMEPAGE_PARTNERS.body}</p>
          <ContextualPopupTrigger className="btn btn-secondary btn-lg">
            {HOMEPAGE_PARTNERS.cta}
          </ContextualPopupTrigger>
        </div>
      </Container>
    </section>
  );
}
