"use client";

import { ContextualPopupTrigger } from "@/components/popups/ContextualPopupTrigger";
import { Button } from "@/components/ui/Button";

export function WebsiteBuildingHeroCtas() {
  return (
    <div className="wb-hero-actions">
      <ContextualPopupTrigger className="btn btn-primary btn-lg">
        ייעוץ לבניית אתר
      </ContextualPopupTrigger>
      <Button href="#portfolio" variant="outline" size="lg">
        צפו באתרים שבנינו
      </Button>
    </div>
  );
}

export function WebsiteBuildingMidCta() {
  return (
    <div className="wb-cta-row wb-cta-row--dark">
      <ContextualPopupTrigger className="btn btn-primary btn-lg wb-cta-primary">
        ייעוץ לבניית אתר
      </ContextualPopupTrigger>
      <a href="tel:0795599449" className="wb-phone-link wb-phone-link--on-dark">
        079-559-9449
      </a>
    </div>
  );
}

export function WebsiteBuildingFinalCtas() {
  return (
    <div className="wb-cta-row wb-cta-row--light">
      <ContextualPopupTrigger className="btn btn-primary btn-lg wb-cta-primary">
        ייעוץ לבניית אתר
      </ContextualPopupTrigger>
      <a href="tel:0795599449" className="wb-phone-link wb-phone-link--on-light">
        079-559-9449
      </a>
      <Button href="/contact-us/" variant="outline" size="lg" className="wb-cta-tertiary">
        צרו קשר
      </Button>
    </div>
  );
}
