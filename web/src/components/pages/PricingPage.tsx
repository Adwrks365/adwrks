import Image from "next/image";
import Link from "next/link";
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
import { SITE } from "@/lib/site";
import { PricingCalculatorSection } from "./PricingCalculatorSection";
import { PricingCard } from "./PricingCard";
import { PricingHeroVisual } from "./PricingHeroVisual";

export function PricingPage() {
  const popupConfig = getServicePopupConfig(PRICING_PATH, PRICING_HERO.title);

  return (
    <article className="pp-page structured-page">
      <header className="pp-hero">
        <div className="pp-hero-bg" aria-hidden="true" />
        <Container>
          <div className="pp-hero-shell">
            <div className="pp-hero-copy">
              <p className="pp-hero-eyebrow">{PRICING_HERO.eyebrow}</p>
              <h1 className="pp-hero-title">{PRICING_HERO.title}</h1>
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
        <p className="pp-body-lead">{PRICING_INTRO.text}</p>
        <p className="pp-disclaimer">{PRICING_INTRO.disclaimer}</p>
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

      <Section tone="white" title={PRICING_FACTORS.title} subtitle={PRICING_FACTORS.intro} align="start">
        <ul className="pp-factors-list">
          {PRICING_FACTORS.items.map((item) => (
            <li key={item.title}>
              <strong>{item.title}:</strong> {item.text}
            </li>
          ))}
        </ul>
        <div className="pp-highlight-box">
          <p>
            {PRICING_TRANSPARENCY.text}{" "}
            <Link href={PRICING_TRANSPARENCY.checkFitHref}>{PRICING_TRANSPARENCY.checkFitLabel} ←</Link>
          </p>
        </div>
      </Section>

      <Section tone="sky" title={PRICING_WHY_INVEST.title} subtitle={PRICING_WHY_INVEST.intro} align="start">
        <ul className="pp-benefits-list">
          {PRICING_WHY_INVEST.benefits.map((item) => (
            <li key={item.title}>
              <strong>{item.title}:</strong> {item.text}
            </li>
          ))}
        </ul>
        <p className="pp-body-text">
          {PRICING_WHY_INVEST.roiNote}{" "}
          <Link href={PRICING_WHY_INVEST.roiCalculatorHref}>{PRICING_WHY_INVEST.roiCalculatorLabel} ←</Link>
        </p>
      </Section>

      <Section tone="white" title={PRICING_CHANNELS.title} subtitle={PRICING_CHANNELS.intro} align="start">
        <ul className="pp-channels-list">
          {PRICING_CHANNELS.items.map((item) => (
            <li key={item.title}>
              <strong>{item.title}:</strong> {item.text}
              {"href" in item && item.href && item.linkLabel && (
                <>
                  {" "}
                  <Link href={item.href}>{item.linkLabel}</Link>
                </>
              )}
            </li>
          ))}
        </ul>
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

      <Section tone="white" align="start" className="pp-section-trust">
        <div className="pp-trust-row">
          <div className="pp-trust-copy">
            <p className="pp-trust-badge">{PRICING_TRUST.badge}</p>
            <p className="pp-trust-since">{PRICING_TRUST.since}</p>
            <p className="pp-trust-text">
              ליווי אישי, שקיפות מלאה ומחירי התחלה ברורים — כדי שתדעו מה מצפה לכם לפני שמתחילים.
            </p>
          </div>
          <Image
            src={PRICING_TRUST.partnerImage}
            alt=""
            width={160}
            height={153}
            className="pp-trust-partner"
            loading="lazy"
          />
        </div>
      </Section>

      <Section tone="sky" title="שאלות ותשובות נפוצות על מחירי שיווק" align="start" className="pp-section-faq">
        <ServiceFaq items={PRICING_FAQ} className="pp-faq-list" />
      </Section>

      <Section tone="white" title="שירותים קשורים" align="start">
        <ServiceRelatedServices services={PRICING_RELATED_SERVICES} />
      </Section>

      <Section tone="dark" align="center" className="pp-section-final-cta">
        <h2 className="pp-final-cta-title">{PRICING_FINAL_CTA.title}</h2>
        <p className="pp-final-cta-text">{PRICING_FINAL_CTA.text}</p>
        <div className="pp-final-cta-actions">
          <Button href="/contact-us/" variant="primary" size="lg">
            {PRICING_FINAL_CTA.contactLabel}
          </Button>
          <Button href={SITE.whatsapp} variant="outline" size="lg" className="pp-whatsapp-btn">
            {PRICING_FINAL_CTA.whatsappLabel}
          </Button>
        </div>
        <p className="pp-footer-disclaimer">* {PRICING_INTRO.disclaimer}</p>
      </Section>

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
