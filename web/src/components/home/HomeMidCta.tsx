import Link from "next/link";
import { ContextualPopupTrigger } from "@/components/popups/ContextualPopupTrigger";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/site";

function WhatsAppIcon() {
  return (
    <svg className="home-cta-whatsapp-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 17.5 5 20l2.6-1.2A8 8 0 1 0 6.5 17.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 10.2c.2 1.6 1.8 3.2 3.4 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

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
            <ContextualPopupTrigger className="home-cta home-cta-primary home-cta-lg">
              ייעוץ ללא התחייבות
            </ContextualPopupTrigger>
            <Link href={`tel:${SITE.phoneTel}`} className="home-cta home-cta-phone home-cta-lg" dir="ltr">
              {SITE.phoneDisplay}
            </Link>
            <Link
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="home-cta home-cta-whatsapp home-cta-lg"
            >
              <WhatsAppIcon />
              WhatsApp
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
