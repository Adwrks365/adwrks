import Link from "next/link";
import { ContextualPopupTrigger } from "@/components/popups/ContextualPopupTrigger";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/site";

export function HomeMidCta() {
  return (
    <section className="home-mid-cta" aria-labelledby="home-mid-cta-heading">
      <Container>
        <div className="home-mid-cta-inner reveal">
          <div className="home-mid-cta-copy">
            <h2 id="home-mid-cta-heading" className="home-mid-cta-title">
              מוכנים לדבר על השיווק הדיגיטלי שלכם?
            </h2>
            <p className="home-mid-cta-lead">
              ייעוץ ראשוני ללא התחייבות — נבין את היעדים ונציע כיוון מותאם.
            </p>
          </div>
          <div className="home-mid-cta-actions">
            <ContextualPopupTrigger className="btn btn-primary btn-lg">
              ייעוץ ללא התחייבות
            </ContextualPopupTrigger>
            <Link href={`tel:${SITE.phoneTel}`} className="btn btn-outline btn-lg">
              {SITE.phoneDisplay}
            </Link>
            <Link
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-lg"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
