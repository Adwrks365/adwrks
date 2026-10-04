import Image from "next/image";
import { ServicePhoneLink } from "@/components/services/shared/ServiceCtas";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { ExtractedPage } from "@/lib/content/elementor-extract";
import { getHeroFromBlocks } from "@/lib/content/elementor-extract";
import {
  CONTACT_HERO,
  CONTACT_PROCESS,
  CONTACT_TESTIMONIALS,
  CONTACT_TRUST,
} from "@/lib/pages/contact-content";
import { ContactConversionSection } from "./ContactConversionSection";
import { ContactHeroVisual } from "./ContactHeroVisual";

type ContactPageProps = {
  data: ExtractedPage;
};

export function ContactPage({ data }: ContactPageProps) {
  const hero = getHeroFromBlocks(data.blocks);
  const privacyNote = data.blocks.find(
    (b) => b.type === "text" && b.text.includes("פרטים נשמרים"),
  );

  return (
    <article className="structured-page contact-page">
      <header className="cp-hero">
        <div className="cp-hero-bg" aria-hidden="true" />
        <Container>
          <div className="cp-hero-shell">
            <div className="cp-hero-copy">
              <p className="cp-hero-eyebrow">{CONTACT_HERO.eyebrow}</p>
              <h1 className="cp-hero-title">{hero.title}</h1>
              <p className="cp-hero-lead">{CONTACT_HERO.lead}</p>
              <div className="cp-hero-actions">
                <Button href="#contact-form" size="lg">
                  {CONTACT_HERO.primaryCta}
                </Button>
                <ServicePhoneLink tone="light" />
              </div>
            </div>
            <ContactHeroVisual />
          </div>
        </Container>
      </header>

      <ContactConversionSection
        pageTitle={hero.title || "צור קשר"}
        privacyNote={
          privacyNote?.type === "text" ? privacyNote.text.replace("🔒 ", "") : undefined
        }
      />

      <Section tone="white" align="start" className="cp-section-process">
        <h2 className="cp-section-title">{CONTACT_PROCESS.title}</h2>
        <ol className="cp-process-steps cp-process-steps--compact">
          {CONTACT_PROCESS.steps.map((step, index) => (
            <li key={step.title} className="cp-process-step">
              <span className="cp-process-num">{index + 1}</span>
              <div className="cp-process-copy">
                <h3 className="cp-process-step-title">{step.title}</h3>
                <p className="cp-process-step-text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted" align="start" className="cp-section-testimonials">
        <h2 className="cp-section-title">{CONTACT_TESTIMONIALS.title}</h2>
        <div className="cp-testimonials">
          {CONTACT_TESTIMONIALS.items.map((item) => (
            <figure key={item.name} className="cp-testimonial-card">
              <blockquote className="cp-testimonial-quote">{item.content}</blockquote>
              <figcaption className="cp-testimonial-author">
                <Image
                  src={item.image}
                  alt=""
                  width={44}
                  height={44}
                  className="cp-testimonial-avatar"
                  loading="lazy"
                />
                <span>
                  <span className="cp-testimonial-name">{item.name}</span>
                  <span className="cp-testimonial-role">{item.title}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section tone="gradient" align="center" className="cp-section-trust">
        <div className="cp-trust-strip">
          <span className="cp-trust-since">{CONTACT_TRUST.since}</span>
          <Image
            src={CONTACT_TRUST.googleBadge}
            alt="Google Partner"
            width={56}
            height={54}
            className="cp-trust-badge"
            loading="lazy"
          />
          <Image
            src={CONTACT_TRUST.partnersImage}
            alt="Google ו-Meta Partners"
            width={88}
            height={66}
            className="cp-trust-badge cp-trust-badge--wide"
            loading="lazy"
          />
        </div>
      </Section>
    </article>
  );
}
