import Link from "next/link";
import { PartnerBadges } from "@/components/trust/PartnerBadges";
import type { ReactNode } from "react";
import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { ServiceFaq } from "@/components/services/shared/ServiceFaq";
import { ServiceRelatedServices } from "@/components/services/shared/ServiceRelatedServices";
import { ServiceCtaRow, ServicePhoneLink } from "@/components/services/shared/ServiceCtas";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  PRICING_CALCULATOR,
  PRICING_CHANNELS,
  PRICING_FACTORS,
  PRICING_FINAL_CTA,
  PRICING_HERO,
  PRICING_INTRO,
  PRICING_MARKETING_CARDS,
  PRICING_PACKAGES_INTRO,
  PRICING_PATH,
  PRICING_RELATED_SERVICES,
  PRICING_FAQ,
  PRICING_TRANSPARENCY,
  PRICING_TRUST,
  PRICING_WEBSITE_CARDS,
  PRICING_WHY_INVEST,
} from "@/lib/pages/pricing-content";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import { PricingCalculatorSection } from "./PricingCalculatorSection";
import { PricingCard } from "./PricingCard";
import { PricingHeroVisual } from "./PricingHeroVisual";

function EditorialPoint({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="pp-editorial-point">
      <h3 className="pp-editorial-point-title">{title}</h3>
      <p className="pp-editorial-point-text">{children}</p>
    </article>
  );
}

export function PricingPage() {
  const popupConfig = getServicePopupConfig(PRICING_PATH, PRICING_HERO.seoPageTitle);

  return (
    <article className="pp-page structured-page">
      <header className="pp-hero">
        <div className="pp-hero-bg" aria-hidden="true" />
        <Container>
          <div className="pp-hero-shell">
            <div className="pp-hero-copy">
              <p className="pp-hero-eyebrow">{PRICING_HERO.eyebrow}</p>
              <h1 className="pp-hero-title">{PRICING_HERO.h1}</h1>
              <p className="pp-hero-lead">{PRICING_HERO.lead}</p>
              <ServiceCtaRow
                primaryLabel={PRICING_HERO.primaryCta}
                secondary={<ServicePhoneLink tone="light" />}
                tertiary={
                  <Button href="#pricing-cards" variant="outline" size="lg" className="sp-cta-tertiary">
                    למחירי התחלה
                  </Button>
                }
              />
            </div>
            <PricingHeroVisual />
          </div>
        </Container>
      </header>

      <Section tone="white" align="start" className="pp-section-intro">
        <div className="pp-editorial-body">
          <p className="pp-body-lead">{PRICING_INTRO.text}</p>
          <p className="pp-disclaimer">{PRICING_INTRO.disclaimer}</p>
        </div>
      </Section>

      <Section
        id="pricing-cards"
        tone="muted"
        title={PRICING_PACKAGES_INTRO.title}
        subtitle={PRICING_PACKAGES_INTRO.text}
        align="start"
        className="pp-section-cards"
      >
        <div className="pp-cards-grid pp-cards-grid--marketing">
          {PRICING_MARKETING_CARDS.map((card) => (
            <PricingCard key={card.id} card={card} />
          ))}
        </div>

        <h2 className="pp-subsection-title">{PRICING_PACKAGES_INTRO.websiteSectionTitle}</h2>
        <div className="pp-cards-grid pp-cards-grid--website">
          {PRICING_WEBSITE_CARDS.map((card) => (
            <PricingCard key={card.id} card={card} />
          ))}
        </div>
      </Section>

      <Section
        tone="white"
        title={PRICING_FACTORS.title}
        subtitle={PRICING_FACTORS.intro}
        align="start"
        className="pp-section-editorial pp-section-factors"
      >
        <div className="pp-editorial-grid pp-editorial-grid--two">
          {PRICING_FACTORS.items.map((item) => (
            <EditorialPoint key={item.title} title={item.title}>
              {item.text}
            </EditorialPoint>
          ))}
        </div>
        <div className="pp-highlight-box">
          <p>
            {PRICING_TRANSPARENCY.text}{" "}
            <Link href={PRICING_TRANSPARENCY.checkFitHref}>{PRICING_TRANSPARENCY.checkFitLabel} ←</Link>
          </p>
        </div>
      </Section>

      <Section
        tone="muted"
        title={PRICING_WHY_INVEST.title}
        subtitle={PRICING_WHY_INVEST.intro}
        align="start"
        className="pp-section-editorial pp-section-invest"
      >
        <div className="pp-editorial-grid pp-editorial-grid--benefits">
          {PRICING_WHY_INVEST.benefits.map((item) => (
            <EditorialPoint key={item.title} title={item.title}>
              {item.text}
            </EditorialPoint>
          ))}
        </div>
        <p className="pp-body-text pp-editorial-body">
          {PRICING_WHY_INVEST.roiNote}{" "}
          <Link href={PRICING_WHY_INVEST.roiCalculatorHref}>{PRICING_WHY_INVEST.roiCalculatorLabel} ←</Link>
        </p>
      </Section>

      <Section
        tone="white"
        title={PRICING_CHANNELS.title}
        subtitle={PRICING_CHANNELS.intro}
        align="start"
        className="pp-section-editorial pp-section-channels"
      >
        <div className="pp-editorial-grid pp-editorial-grid--channels">
          {PRICING_CHANNELS.items.map((item) => (
            <EditorialPoint key={item.title} title={item.title}>
              {item.text}
              {"href" in item && item.href && item.linkLabel && (
                <>
                  {" "}
                  <Link href={item.href}>{item.linkLabel}</Link>
                </>
              )}
            </EditorialPoint>
          ))}
        </div>
      </Section>

      <Section
        id="calculator"
        tone="muted"
        title={PRICING_CALCULATOR.sectionTitle}
        subtitle={PRICING_CALCULATOR.sectionIntro}
        align="start"
        className="pp-section-calculator"
      >
        <PricingCalculatorSection />
      </Section>

      <Section tone="sky" align="start" className="pp-section-trust">
        <div className="pp-trust-strip">
          <PartnerBadges variant="standard" />
          <div className="pp-trust-strip-copy">
            <p className="pp-trust-strip-label">{PRICING_TRUST.badge}</p>
            <p className="pp-trust-strip-since">{PRICING_TRUST.since}</p>
            <p className="pp-trust-strip-text">{PRICING_TRUST.supporting}</p>
          </div>
        </div>
      </Section>

      <Section tone="white" title="שאלות ותשובות נפוצות על מחירי שיווק" align="start" className="pp-section-faq">
        <ServiceFaq items={PRICING_FAQ} className="pp-faq-list" />
      </Section>

      <Section tone="muted" title="שירותים קשורים" align="start">
        <ServiceRelatedServices services={PRICING_RELATED_SERVICES} />
      </Section>

      <CommercialFinalCta
        title={PRICING_FINAL_CTA.title}
        body={PRICING_FINAL_CTA.text}
        primaryLabel={PRICING_FINAL_CTA.contactLabel}
        showWhatsApp
        whatsappLabel={PRICING_FINAL_CTA.whatsappLabel}
        footer={<p className="commercial-final-cta-footer">* {PRICING_INTRO.disclaimer}</p>}
      />

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
