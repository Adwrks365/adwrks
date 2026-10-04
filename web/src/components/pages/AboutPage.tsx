import Image from "next/image";
import Link from "next/link";
import { ServiceFaq } from "@/components/services/shared/ServiceFaq";
import { ServicePhoneLink } from "@/components/services/shared/ServiceCtas";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  ABOUT_CAPABILITIES,
  ABOUT_FAQ,
  ABOUT_FINAL_CTA,
  ABOUT_FIT,
  ABOUT_HERO,
  ABOUT_METHODOLOGY,
  ABOUT_SINCE,
  ABOUT_STORY,
  ABOUT_TRUST,
  ABOUT_WHY,
} from "@/lib/pages/about-content";
import { SITE } from "@/lib/site";
import { AboutHeroVisual } from "./AboutHeroVisual";

export function AboutPage() {
  return (
    <article className="ab-page structured-page">
      <header className="ab-hero">
        <div className="ab-hero-bg" aria-hidden="true" />
        <Container>
          <div className="ab-hero-shell">
            <div className="ab-hero-copy">
              <p className="ab-hero-eyebrow">{ABOUT_HERO.eyebrow}</p>
              <h1 className="ab-hero-title">{ABOUT_HERO.h1}</h1>
              <p className="ab-hero-lead">{ABOUT_HERO.lead}</p>
              <p className="ab-hero-intro">{ABOUT_HERO.intro}</p>
              <div className="ab-hero-actions">
                <Button href="/contact-us/" size="lg">
                  {ABOUT_HERO.primaryCta}
                </Button>
                <Button href="#story" variant="outline" size="lg">
                  {ABOUT_HERO.secondaryCta}
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
          <p className="ab-since-badge">{ABOUT_SINCE.label}</p>
          <h2 className="ab-section-title">{ABOUT_SINCE.title}</h2>
          <div className="ab-editorial-body">
            {ABOUT_SINCE.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="ab-body-text">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section
        tone="muted"
        title={ABOUT_CAPABILITIES.title}
        subtitle={ABOUT_CAPABILITIES.intro}
        align="start"
        className="ab-section-capabilities"
      >
        <ul className="ab-capabilities-grid">
          {ABOUT_CAPABILITIES.services.map((service) => (
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
        title={ABOUT_METHODOLOGY.title}
        subtitle={ABOUT_METHODOLOGY.intro}
        align="start"
        className="ab-section-methodology"
      >
        <ol className="ab-methodology-steps">
          {ABOUT_METHODOLOGY.steps.map((step, index) => (
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
          <div className="ab-trust-badges">
            <Image
              src={ABOUT_TRUST.googleBadge}
              alt="Google Partner"
              width={120}
              height={115}
              className="ab-trust-google"
              loading="lazy"
            />
            <Image
              src={ABOUT_TRUST.partnersImage}
              alt="Google ו-Meta Partners"
              width={200}
              height={150}
              className="ab-trust-partners"
              loading="lazy"
            />
          </div>
          <div className="ab-trust-copy">
            <p className="ab-trust-label">{ABOUT_TRUST.label}</p>
            <h2 className="ab-trust-title">{ABOUT_TRUST.title}</h2>
            <p className="ab-trust-intro">{ABOUT_TRUST.intro}</p>
            <p className="ab-trust-supporting">{ABOUT_TRUST.supporting}</p>
          </div>
        </div>
      </Section>

      <Section tone="white" title={ABOUT_WHY.title} subtitle={ABOUT_WHY.intro} align="start" className="ab-section-why">
        <div className="ab-why-grid">
          {ABOUT_WHY.points.map((point) => (
            <article key={point.title} className="ab-why-point">
              <h3 className="ab-why-point-title">{point.title}</h3>
              <p className="ab-why-point-text">{point.text}</p>
            </article>
          ))}
        </div>
        <blockquote className="ab-quote">{ABOUT_WHY.quote}</blockquote>
        <p className="ab-body-text ab-editorial-body">{ABOUT_WHY.authorityNote}</p>
      </Section>

      <Section
        id="story"
        tone="muted"
        title={ABOUT_STORY.title}
        align="start"
        className="ab-section-story"
      >
        <div className="ab-editorial-body ab-story-prose">
          {ABOUT_STORY.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="ab-body-text">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section
        tone="white"
        label={ABOUT_FIT.label}
        title={ABOUT_FIT.title}
        align="start"
        className="ab-section-fit"
      >
        <div className="ab-fit-grid">
          <div className="ab-fit-panel ab-fit-panel--yes">
            <h3 className="ab-fit-panel-title">הליווי שלנו מתאים ל:</h3>
            <ul className="ab-fit-list">
              {ABOUT_FIT.suitable.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ab-fit-panel ab-fit-panel--no">
            <h3 className="ab-fit-panel-title">הליווי שלנו פחות מתאים ל:</h3>
            <ul className="ab-fit-list">
              {ABOUT_FIT.lessSuitable.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <blockquote className="ab-quote ab-fit-quote">{ABOUT_FIT.closingQuote}</blockquote>
      </Section>

      <Section tone="sky" title="שאלות נפוצות" align="start" className="ab-section-faq">
        <ServiceFaq items={ABOUT_FAQ} className="ab-faq-list" />
      </Section>

      <Section tone="dark" align="center" className="ab-section-final-cta">
        <h2 className="ab-final-cta-title">{ABOUT_FINAL_CTA.title}</h2>
        <p className="ab-final-cta-text">{ABOUT_FINAL_CTA.text}</p>
        <div className="ab-final-cta-actions">
          <Button href="/contact-us/" variant="primary" size="lg">
            {ABOUT_FINAL_CTA.contactLabel}
          </Button>
          <Button href={SITE.phoneTel} variant="outline" size="lg">
            {SITE.phoneDisplay}
          </Button>
        </div>
        <p className="ab-final-cta-email">
          או כתבו לנו ב-
          <Link href={`mailto:${SITE.email}`}>{SITE.email}</Link>
        </p>
      </Section>
    </article>
  );
}
