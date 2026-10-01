import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { Section } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/content/loader";
import {
  SOCIAL_CHANNELS,
  SOCIAL_FAQ,
  SOCIAL_FINAL_CTA,
  SOCIAL_GUIDE_PATHS,
  SOCIAL_HERO,
  SOCIAL_INCLUDES,
  SOCIAL_INTRO,
  SOCIAL_MID_CTA,
  SOCIAL_PATH,
  SOCIAL_RELATED_SERVICES,
} from "@/lib/pages/services/social-media-content";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "./shared/ServiceCtas";
import { ServiceFaq } from "./shared/ServiceFaq";
import { ServiceHero } from "./shared/ServiceHero";
import { ServiceRelatedGuides } from "./shared/ServiceRelatedGuides";
import { ServiceRelatedServices } from "./shared/ServiceRelatedServices";

export function SocialMediaServicePage() {
  const popupConfig = getServicePopupConfig(SOCIAL_PATH, SOCIAL_HERO.title);
  const guides = SOCIAL_GUIDE_PATHS.flatMap((path) => {
    const post = getAllPosts().find((p) => p.path === path);
    return post ? [post] : [];
  });

  return (
    <article className="sp-page structured-page service-page sp-page--social">
      <ServiceHero
        badge={SOCIAL_HERO.badge}
        title={SOCIAL_HERO.title}
        lead={SOCIAL_HERO.lead}
        actions={
          <ServiceCtaRow
            primaryLabel="ייעוץ לניהול ושיווק ברשתות"
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        }
      />

      <Section tone="white" label={SOCIAL_INTRO.label} title={SOCIAL_INTRO.title} align="start">
        {SOCIAL_INTRO.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="sp-body-lead">
            {paragraph}
          </p>
        ))}
      </Section>

      <Section tone="sky" label={SOCIAL_CHANNELS.label} title={SOCIAL_CHANNELS.title} align="start">
        <ul className="sp-check-list">
          {SOCIAL_CHANNELS.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section tone="muted" label={SOCIAL_INCLUDES.label} title={SOCIAL_INCLUDES.title} align="start">
        <div className="sp-benefits-grid sp-benefits-grid--two">
          {SOCIAL_INCLUDES.items.map((item) => (
            <article key={item.title} className="sp-benefit-item">
              <h3 className="sp-benefit-title">{item.title}</h3>
              <p className="sp-benefit-text">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="dark" label={SOCIAL_MID_CTA.eyebrow} title={SOCIAL_MID_CTA.title} align="start" className="sp-mid-cta-section">
        <p className="sp-mid-cta-text">{SOCIAL_MID_CTA.body}</p>
        <ServiceCtaRow
          primaryLabel="ייעוץ לניהול ושיווק ברשתות"
          tone="dark"
          secondary={<ServicePhoneLink tone="dark" />}
        />
      </Section>

      {guides.length > 0 && (
        <Section tone="white" label="מדריכים" title="מדריכים לשיווק ברשתות" align="start">
          <ServiceRelatedGuides posts={guides} />
        </Section>
      )}

      <Section tone="sky" title="שאלות נפוצות על ניהול רשתות חברתיות" align="start" className="sp-section-faq">
        <ServiceFaq items={SOCIAL_FAQ} />
      </Section>

      <Section tone="white" title="שירותים משלימים" align="start">
        <ServiceRelatedServices services={SOCIAL_RELATED_SERVICES} />
      </Section>

      <Section tone="gradient" label={SOCIAL_FINAL_CTA.eyebrow} title={SOCIAL_FINAL_CTA.title} className="sp-final-cta-section">
        <div className="sp-final-cta">
          <p className="sp-final-cta-body">{SOCIAL_FINAL_CTA.body}</p>
          <ServiceCtaRow
            primaryLabel="ייעוץ לניהול ושיווק ברשתות"
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        </div>
      </Section>

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
