import Link from "next/link";
import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { PartnerBadges } from "@/components/trust/PartnerBadges";
import { ServiceFaq } from "@/components/services/shared/ServiceFaq";
import { ServicePhoneLink } from "@/components/services/shared/ServiceCtas";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { LocaleProps } from "@/lib/locale-props";
import { getAboutPageContent } from "@/lib/pages/get-about-content";
import { AboutHeroVisual } from "./AboutHeroVisual";

export function AboutPage({ locale = "he" }: LocaleProps) {
  const c = getAboutPageContent(locale);
  const contactHref = locale === "en" ? "/en/contact-us/" : "/contact-us/";

  return (
    <article className="ab-page structured-page">
      <header className="ab-hero">
        <div className="ab-hero-bg" aria-hidden="true" />
        <Container>
          <div className="ab-hero-shell">
            <div className="ab-hero-copy">
              <p className="ab-hero-eyebrow">{c.ABOUT_HERO.eyebrow}</p>
              <h1 className="ab-hero-title">{c.ABOUT_HERO.h1}</h1>
              <p className="ab-hero-lead">{c.ABOUT_HERO.lead}</p>
              <p className="ab-hero-intro">{c.ABOUT_HERO.intro}</p>
              <div className="ab-hero-actions">
                <Button href={contactHref} size="lg">
                  {c.ABOUT_HERO.primaryCta}
                </Button>
                <Button href="#story" variant="outline" size="lg">
                  {c.ABOUT_HERO.secondaryCta}
                </Button>
                <ServicePhoneLink tone="light" />
              </div>
            </div>
            <AboutHeroVisual />
          </div>
        </Container>
      </header>

      <Section tone="white" align="start" className="ab-section-since">
        <div className="ab-since-block">
          <p className="ab-since-badge">{c.ABOUT_SINCE.label}</p>
          <h2 className="ab-section-title">{c.ABOUT_SINCE.title}</h2>
          <div className="ab-editorial-body">
            {c.ABOUT_SINCE.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="ab-body-text">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section
        tone="muted"
        title={c.ABOUT_CAPABILITIES.title}
        subtitle={c.ABOUT_CAPABILITIES.intro}
        align="start"
        className="ab-section-capabilities"
      >
        <ul className="ab-capabilities-grid">
          {c.ABOUT_CAPABILITIES.services.map((service) => (
            <li key={service.href}>
              <Link href={service.href} className="ab-capability-link">
                <span className="ab-capability-title">{service.title}</span>
                <span className="ab-capability-text">{service.text}</span>
                <span className="ab-capability-arrow" aria-hidden="true">
                  ←
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tone="white"
        title={c.ABOUT_METHODOLOGY.title}
        subtitle={c.ABOUT_METHODOLOGY.intro}
        align="start"
        className="ab-section-methodology"
      >
        <ol className="ab-methodology-steps">
          {c.ABOUT_METHODOLOGY.steps.map((step, index) => (
            <li key={step.title} className="ab-methodology-step">
              <span className="ab-methodology-index" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <h3 className="ab-methodology-step-title">{step.title}</h3>
                <p className="ab-methodology-step-text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="sky" align="start" className="ab-section-trust">
        <div className="ab-trust-strip">
          <PartnerBadges variant="standard" className="ab-trust-badges" />
          <div className="ab-trust-copy">
            <p className="ab-trust-label">{c.ABOUT_TRUST.label}</p>
            <h2 className="ab-trust-title">{c.ABOUT_TRUST.title}</h2>
            <p className="ab-trust-intro">{c.ABOUT_TRUST.intro}</p>
            <p className="ab-trust-supporting">{c.ABOUT_TRUST.supporting}</p>
          </div>
        </div>
      </Section>

      <Section tone="white" title={c.ABOUT_WHY.title} subtitle={c.ABOUT_WHY.intro} align="start" className="ab-section-why">
        <div className="ab-why-grid">
          {c.ABOUT_WHY.points.map((point) => (
            <article key={point.title} className="ab-why-point">
              <h3 className="ab-why-point-title">{point.title}</h3>
              <p className="ab-why-point-text">{point.text}</p>
            </article>
          ))}
        </div>
        <blockquote className="ab-quote">{c.ABOUT_WHY.quote}</blockquote>
        <p className="ab-body-text ab-editorial-body">{c.ABOUT_WHY.authorityNote}</p>
      </Section>

      <Section
        id="story"
        tone="muted"
        title={c.ABOUT_STORY.title}
        align="start"
        className="ab-section-story"
      >
        <div className="ab-editorial-body ab-story-prose">
          {c.ABOUT_STORY.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="ab-body-text">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section
        tone="white"
        label={c.ABOUT_FIT.label}
        title={c.ABOUT_FIT.title}
        align="start"
        className="ab-section-fit"
      >
        <div className="ab-fit-grid">
          <div className="ab-fit-panel ab-fit-panel--yes">
            <h3 className="ab-fit-panel-title">
              {locale === "en" ? "Our guidance is a good fit for:" : "הליווי שלנו מתאים ל:"}
            </h3>
            <ul className="ab-fit-list">
              {c.ABOUT_FIT.suitable.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ab-fit-panel ab-fit-panel--no">
            <h3 className="ab-fit-panel-title">
              {locale === "en" ? "Less suited for:" : "הליווי שלנו פחות מתאים ל:"}
            </h3>
            <ul className="ab-fit-list">
              {c.ABOUT_FIT.lessSuitable.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <blockquote className="ab-quote ab-fit-quote">{c.ABOUT_FIT.closingQuote}</blockquote>
      </Section>

      <Section
        tone="sky"
        title={locale === "en" ? "FAQ" : "שאלות נפוצות"}
        align="start"
        className="ab-section-faq"
      >
        <ServiceFaq items={c.ABOUT_FAQ} className="ab-faq-list" />
      </Section>

      <CommercialFinalCta
        title={c.ABOUT_FINAL_CTA.title}
        body={c.ABOUT_FINAL_CTA.text}
        primaryLabel={c.ABOUT_FINAL_CTA.contactLabel}
        showEmail
      />
    </article>
  );
}
