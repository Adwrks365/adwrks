import { ContextualPopupTrigger } from "@/components/popups/ContextualPopupTrigger";
import { Container } from "@/components/ui/Container";
import { getHomepageData } from "@/lib/homepage";
import type { LocaleProps } from "@/lib/locale-props";

export function HomeEnvelope360({ locale = "he" }: LocaleProps) {
  const { HOMEPAGE_VISION, HOMEPAGE_ENVELOPE } = getHomepageData(locale);
  return (
    <section className="home-envelope-360" aria-labelledby="home-envelope-heading">
      <Container narrow>
        <header className="home-section-header reveal">
          <p className="home-section-label">{HOMEPAGE_ENVELOPE.label}</p>
          <h2 id="home-envelope-heading" className="home-section-title">
            {HOMEPAGE_ENVELOPE.title}
          </h2>
        </header>
        <div className="home-envelope-body reveal">
          <p>{HOMEPAGE_VISION.envelope}</p>
          <ContextualPopupTrigger className="home-cta home-cta-primary">
            {HOMEPAGE_ENVELOPE.cta}
          </ContextualPopupTrigger>
        </div>
      </Container>
    </section>
  );
}
