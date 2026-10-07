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
import { linkWithArrow } from "@/i18n/ui-arrows";
import type { LocaleProps } from "@/lib/locale-props";
import { getPricingPageContent } from "@/lib/pages/get-pricing-content";
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

export function PricingPage({ locale = "he" }: LocaleProps) {
  const c = getPricingPageContent(locale);
  const popupConfig = getServicePopupConfig(c.PRICING_PATH, c.PRICING_HERO.seoPageTitle, locale);

  return (
    <article className="pp-page structured-page">
      <header className="pp-hero">
        <div className="pp-hero-bg" aria-hidden="true" />
        <Container>
          <div className="pp-hero-shell">
            <div className="pp-hero-copy">
              <p className="pp-hero-eyebrow">{c.PRICING_HERO.eyebrow}</p>
              <h1 className="pp-hero-title">{c.PRICING_HERO.h1}</h1>
              <p className="pp-hero-lead">{c.PRICING_HERO.lead}</p>
              <ServiceCtaRow
                primaryLabel={c.PRICING_HERO.primaryCta}
                secondary={<ServicePhoneLink tone="light" />}
                tertiary={
                  <Button href="#pricing-cards" variant="outline" size="lg" className="sp-cta-tertiary">
                    {locale === "en" ? "Starting prices" : "למחירי התחלה"}
                  </Button>
                }
              />
            </div>
            <PricingHeroVisual locale={locale} />
          </div>
        </Container>
      </header>

      <Section tone="white" align="start" className="pp-section-intro">
        <div className="pp-editorial-body">
          <p className="pp-body-lead">{c.PRICING_INTRO.text}</p>
          <p className="pp-disclaimer">{c.PRICING_INTRO.disclaimer}</p>
        </div>
      </Section>

      <Section
        id="pricing-cards"
        tone="muted"
        title={c.PRICING_PACKAGES_INTRO.title}
        subtitle={c.PRICING_PACKAGES_INTRO.text}
        align="start"
        className="pp-section-cards"
      >
        <div className="pp-cards-grid pp-cards-grid--marketing">
          {c.PRICING_MARKETING_CARDS.map((card) => (
            <PricingCard key={card.id} card={card} locale={locale} />
          ))}
        </div>

        <h2 className="pp-subsection-title">{c.PRICING_PACKAGES_INTRO.websiteSectionTitle}</h2>
        <div className="pp-cards-grid pp-cards-grid--website">
          {c.PRICING_WEBSITE_CARDS.map((card) => (
            <PricingCard key={card.id} card={card} locale={locale} />
          ))}
        </div>
      </Section>

      <Section
        tone="white"
        title={c.PRICING_FACTORS.title}
        subtitle={c.PRICING_FACTORS.intro}
        align="start"
        className="pp-section-editorial pp-section-factors"
      >
        <div className="pp-editorial-grid pp-editorial-grid--two">
          {c.PRICING_FACTORS.items.map((item) => (
            <EditorialPoint key={item.title} title={item.title}>
              {item.text}
            </EditorialPoint>
          ))}
        </div>
        <div className="pp-highlight-box">
          <p>
            {c.PRICING_TRANSPARENCY.text}{" "}
            <Link href={c.PRICING_TRANSPARENCY.checkFitHref}>
              {linkWithArrow(locale, c.PRICING_TRANSPARENCY.checkFitLabel)}
            </Link>
          </p>
        </div>
      </Section>

      <Section
        tone="muted"
        title={c.PRICING_WHY_INVEST.title}
        subtitle={c.PRICING_WHY_INVEST.intro}
        align="start"
        className="pp-section-editorial pp-section-invest"
      >
        <div className="pp-editorial-grid pp-editorial-grid--benefits">
          {c.PRICING_WHY_INVEST.benefits.map((item) => (
            <EditorialPoint key={item.title} title={item.title}>
              {item.text}
            </EditorialPoint>
          ))}
        </div>
        <p className="pp-body-text pp-editorial-body">
          {c.PRICING_WHY_INVEST.roiNote}{" "}
          <Link href={c.PRICING_WHY_INVEST.roiCalculatorHref}>
            {linkWithArrow(locale, c.PRICING_WHY_INVEST.roiCalculatorLabel)}
          </Link>
        </p>
      </Section>

      <Section
        tone="white"
        title={c.PRICING_CHANNELS.title}
        subtitle={c.PRICING_CHANNELS.intro}
        align="start"
        className="pp-section-editorial pp-section-channels"
      >
        <div className="pp-editorial-grid pp-editorial-grid--channels">
          {c.PRICING_CHANNELS.items.map((item) => (
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
        title={c.PRICING_CALCULATOR.sectionTitle}
        subtitle={c.PRICING_CALCULATOR.sectionIntro}
        align="start"
        className="pp-section-calculator"
      >
        <PricingCalculatorSection locale={locale} />
      </Section>

      <Section tone="sky" align="start" className="pp-section-trust">
        <div className="pp-trust-strip">
          <PartnerBadges variant="standard" />
          <div className="pp-trust-strip-copy">
            <p className="pp-trust-strip-label">{c.PRICING_TRUST.badge}</p>
            <p className="pp-trust-strip-since">{c.PRICING_TRUST.since}</p>
            <p className="pp-trust-strip-text">{c.PRICING_TRUST.supporting}</p>
          </div>
        </div>
      </Section>

      <Section
        tone="white"
        title={
          locale === "en"
            ? "Frequently asked questions about marketing pricing"
            : "שאלות ותשובות נפוצות על מחירי שיווק"
        }
        align="start"
        className="pp-section-faq"
      >
        <ServiceFaq items={c.PRICING_FAQ} className="pp-faq-list" />
      </Section>

      <Section tone="muted" title={locale === "en" ? "Related services" : "שירותים קשורים"} align="start">
        <ServiceRelatedServices services={c.PRICING_RELATED_SERVICES} locale={locale} />
      </Section>

      <CommercialFinalCta
        title={c.PRICING_FINAL_CTA.title}
        body={c.PRICING_FINAL_CTA.text}
        primaryLabel={c.PRICING_FINAL_CTA.contactLabel}
        showWhatsApp
        whatsappLabel={c.PRICING_FINAL_CTA.whatsappLabel}
        footer={<p className="commercial-final-cta-footer">* {c.PRICING_INTRO.disclaimer}</p>}
      />

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
