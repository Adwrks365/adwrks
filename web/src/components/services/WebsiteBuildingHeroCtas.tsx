"use client";

import { ContextualPopupTrigger } from "@/components/popups/ContextualPopupTrigger";
import { Button } from "@/components/ui/Button";
import type { LocaleProps } from "@/lib/locale-props";

export function WebsiteBuildingHeroCtas({ locale = "he" }: LocaleProps) {
  const primaryCta = locale === "en" ? "Website consultation" : "ייעוץ לבניית אתר";
  const portfolioCta = locale === "en" ? "View our websites" : "צפו באתרים שבנינו";

  return (
    <div className="wb-hero-actions">
      <ContextualPopupTrigger className="btn btn-primary btn-lg">
        {primaryCta}
      </ContextualPopupTrigger>
      <Button href="#portfolio" variant="outline" size="lg">
        {portfolioCta}
      </Button>
    </div>
  );
}

export function WebsiteBuildingMidCta({ locale = "he" }: LocaleProps) {
  const primaryCta = locale === "en" ? "Website consultation" : "ייעוץ לבניית אתר";

  return (
    <div className="wb-cta-row wb-cta-row--light">
      <ContextualPopupTrigger className="btn btn-primary btn-lg wb-cta-primary">
        {primaryCta}
      </ContextualPopupTrigger>
      <a href="tel:0795599449" className="wb-phone-link wb-phone-link--on-light">
        079-559-9449
      </a>
    </div>
  );
}

export function WebsiteBuildingFinalCtas({ locale = "he" }: LocaleProps) {
  const primaryCta = locale === "en" ? "Website consultation" : "ייעוץ לבניית אתר";
  const contactCta = locale === "en" ? "Contact us" : "צרו קשר";
  const contactHref = locale === "en" ? "/en/contact-us/" : "/contact-us/";

  return (
    <div className="wb-cta-row wb-cta-row--light">
      <ContextualPopupTrigger className="btn btn-primary btn-lg wb-cta-primary">
        {primaryCta}
      </ContextualPopupTrigger>
      <a href="tel:0795599449" className="wb-phone-link wb-phone-link--on-light">
        079-559-9449
      </a>
      <Button href={contactHref} variant="outline" size="lg" className="wb-cta-tertiary">
        {contactCta}
      </Button>
    </div>
  );
}
