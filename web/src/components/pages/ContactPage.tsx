import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ContactIcon } from "@/components/ui/ContactIcon";
import type { ExtractedPage } from "@/lib/content/elementor-extract";
import { getHeroFromBlocks } from "@/lib/content/elementor-extract";
import {
  CONTACT_CLOSING,
  CONTACT_FORM,
  CONTACT_HERO,
  CONTACT_PROCESS,
  CONTACT_SERVICES,
  CONTACT_TRUST,
} from "@/lib/pages/contact-content";
import { FOLLOW_SOCIAL, SITE } from "@/lib/site";
import { ContactHeroVisual } from "./ContactHeroVisual";

const ContactForm = dynamic(
  () => import("@/components/ContactForm").then((m) => m.ContactForm),
  { loading: () => <p className="cp-form-loading">טוען טופס...</p> },
);

type ContactPageProps = {
  data: ExtractedPage;
};

const HOURS_HE: Record<string, string> = {
  Sunday: "ראשון",
  Monday: "שני",
  Tuesday: "שלישי",
  Wednesday: "רביעי",
  Thursday: "חמישי",
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
            <div className="cp-hero-intro">
              <p className="cp-hero-eyebrow">{CONTACT_HERO.eyebrow}</p>
              <h1 className="cp-hero-title">{hero.title}</h1>
              <p className="cp-hero-lead">{CONTACT_HERO.lead}</p>
            </div>

            <div className="cp-form-card">
              <h2 className="cp-form-title">{CONTACT_FORM.title}</h2>
              <p className="cp-form-intro">{CONTACT_FORM.intro}</p>
              <ContactForm
                formId="contact-page"
                pageTitle={hero.title || "צור קשר"}
                pagePath="/contact-us/"
                submitLabel={CONTACT_FORM.submitLabel}
              />
              {privacyNote?.type === "text" && (
                <p className="cp-form-privacy">{privacyNote.text.replace("🔒 ", "")}</p>
              )}
            </div>

            <div className="cp-hero-details">
              <ul className="cp-hero-points">
                {CONTACT_HERO.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              <div className="cp-direct-row">
                <a href={SITE.phoneTel} className="cp-direct-item cp-direct-item--primary">
                  <ContactIcon type="phone" />
                  <span className="cp-direct-label">טלפון</span>
                  <span className="cp-direct-value" dir="ltr">
                    {SITE.phoneDisplay}
                  </span>
                </a>
                <a
                  href={SITE.whatsapp}
                  className="cp-direct-item"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ContactIcon type="whatsapp" />
                  <span className="cp-direct-label">WhatsApp</span>
                  <span className="cp-direct-value">שלחו הודעה</span>
                </a>
                <a href={`mailto:${SITE.email}`} className="cp-direct-item cp-direct-item--tertiary">
                  <ContactIcon type="email" />
                  <span className="cp-direct-label">אימייל</span>
                  <span className="cp-direct-value" dir="ltr">
                    {SITE.email}
                  </span>
                </a>
              </div>

              <ContactHeroVisual />

              <div className="cp-trust-inline">
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
            </div>
          </div>
        </Container>
      </header>

      <Section tone="white" align="start" className="cp-section-process">
        <h2 className="cp-section-title">{CONTACT_PROCESS.title}</h2>
        <ol className="cp-process-steps">
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

      <Section tone="muted" align="start" className="cp-section-services">
        <h2 className="cp-section-title">{CONTACT_SERVICES.title}</h2>
        <p className="cp-section-intro">{CONTACT_SERVICES.intro}</p>
        <div className="cp-service-chips">
          {CONTACT_SERVICES.items.map((service) => (
            <Link key={service.href} href={service.href} className="cp-service-chip">
              {service.label}
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="gradient" align="start" className="cp-section-business">
        <div className="cp-business-grid">
          <div className="cp-business-block">
            <h2 className="cp-section-title">פרטי העסק</h2>
            <p className="cp-business-line">
              <ContactIcon type="location" />
              <span>
                {SITE.address.street}, {SITE.address.locality}
                <br />
                {SITE.address.region}, {SITE.address.country}
              </span>
            </p>
            <p className="cp-business-line">
              <ContactIcon type="email" />
              <a href={`mailto:${SITE.email}`} dir="ltr">
                {SITE.email}
              </a>
            </p>
          </div>
          <div className="cp-business-block">
            <h3 className="cp-business-subtitle">שעות פעילות</h3>
            <ul className="cp-hours-list">
              {SITE.openingHours.map(({ day, hours }) => (
                <li key={day}>
                  <span>{HOURS_HE[day] ?? day}</span>
                  <span dir="ltr">{hours.replace("-", " – ")}</span>
                </li>
              ))}
            </ul>
            <p className="cp-hours-note">שישי–שבת: סגור</p>
          </div>
        </div>
      </Section>

      <Section tone="white" align="center" className="cp-section-closing">
        <div className="cp-closing">
          <h2 className="cp-closing-title">{CONTACT_CLOSING.title}</h2>
          <p className="cp-closing-text">{CONTACT_CLOSING.body}</p>
          <div className="cp-social-links">
            {FOLLOW_SOCIAL.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="cp-social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </Section>
    </article>
  );
}
