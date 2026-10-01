import { ContextualPopupTrigger } from "@/components/popups/ContextualPopupTrigger";
import { Container } from "@/components/ui/Container";
import { HOMEPAGE_VISION } from "@/lib/homepage/data";

export function HomeEnvelope360() {
  return (
    <section className="home-envelope-360" aria-labelledby="home-envelope-heading">
      <Container narrow>
        <header className="home-section-header reveal">
          <p className="home-section-label">מעטפת אסטרטגית מקצה לקצה</p>
          <h2 id="home-envelope-heading" className="home-section-title">
            מעטפת שיווק 360° מותאמת אישית
          </h2>
        </header>
        <div className="home-envelope-body reveal">
          <p>{HOMEPAGE_VISION.envelope}</p>
          <ContextualPopupTrigger className="btn btn-primary">
            תיאום שיחת אבחון אסטרטגית
          </ContextualPopupTrigger>
        </div>
      </Container>
    </section>
  );
}
