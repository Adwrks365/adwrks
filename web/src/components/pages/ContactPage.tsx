import Image from "next/image";
import { ServicePhoneLink } from "@/components/services/shared/ServiceCtas";
import { PartnerBadges } from "@/components/trust/PartnerBadges";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { ExtractedPage } from "@/lib/content/elementor-extract";
import { getHeroFromBlocks } from "@/lib/content/elementor-extract";
import type { LocaleProps } from "@/lib/locale-props";
import { getContactPageContent } from "@/lib/pages/get-contact-content";
import { ContactConversionSection } from "./ContactConversionSection";
import { ContactHeroVisual } from "./ContactHeroVisual";

type ContactPageProps = {
  data: ExtractedPage;
};

export function ContactPage({ data, locale = "he" }: ContactPageProps & LocaleProps) {
  const c = getContactPageContent(locale);
  const hero = getHeroFromBlocks(data.blocks);
  const privacyBlock = data.blocks.find(
    (b) => b.type === "text" && b.text.includes("פרטים נשמרים"),
  );
  const privacyNote =
    locale === "en"
      ? "Your details are kept confidential and are not shared with third parties."
      : privacyBlock?.type === "text"
        ? privacyBlock.text.replace("🔒 ", "")
        : undefined;

  return (
    <article className="structured-page contact-page">
      <header className="cp-hero">
        <div className="cp-hero-bg" aria-hidden="true" />
        <Container>
          <div className="cp-hero-shell">
            <div className="cp-hero-copy">
              <p className="cp-hero-eyebrow">{c.CONTACT_HERO.eyebrow}</p>
              <h1 className="cp-hero-title">{hero.title}</h1>
              <p className="cp-hero-lead">{c.CONTACT_HERO.lead}</p>
              <div className="cp-hero-actions">
                <Button href="#contact-form" size="lg">
                  {c.CONTACT_HERO.primaryCta}
                </Button>
                <ServicePhoneLink tone="light" />
              </div>
            </div>
            <ContactHeroVisual locale={locale} />
          </div>
        </Container>
      </header>

      <ContactConversionSection
        locale={locale}
        pageTitle={hero.title || (locale === "en" ? "Contact Us" : "צור קשר")}
        privacyNote={privacyNote}
      />

      <Section tone="white" align="start" className="cp-section-process">
        <h2 className="cp-section-title">{c.CONTACT_PROCESS.title}</h2>
        <ol className="cp-process-steps cp-process-steps--compact">
          {c.CONTACT_PROCESS.steps.map((step, index) => (
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
        <h2 className="cp-section-title">{c.CONTACT_TESTIMONIALS.title}</h2>
        <div className="cp-testimonials">
          {c.CONTACT_TESTIMONIALS.items.map((item) => (
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
          <span className="cp-trust-since">{c.CONTACT_TRUST.since}</span>
          <PartnerBadges variant="compact" />
        </div>
      </Section>
    </article>
  );
}
