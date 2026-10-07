import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { CommercialMidCta } from "@/components/commercial/CommercialMidCta";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { Section } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/content/loader";
import { getSocialMediaPageContent } from "@/lib/pages/services/get-locale-content";
import type { LocaleProps } from "@/lib/locale-props";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "./shared/ServiceCtas";
import { ServiceFaq } from "./shared/ServiceFaq";
import { ServiceHero } from "./shared/ServiceHero";
import { ServiceRelatedGuides } from "./shared/ServiceRelatedGuides";
import { ServiceRelatedServices } from "./shared/ServiceRelatedServices";
import { SocialHeroVisual, SocialWorkflowVisual } from "./shared/ServiceVisualCompositions";

export function SocialMediaServicePage({ locale = "he" }: LocaleProps) {
  const c = getSocialMediaPageContent(locale);
  const popupConfig = getServicePopupConfig(c.SOCIAL_PATH, c.SOCIAL_HERO.title);
  const guides = c.SOCIAL_GUIDE_PATHS.flatMap((path) => {
    const post = getAllPosts(locale).find((p) => p.path === path);
    return post ? [post] : [];
  });
  const primaryCta =
    locale === "en" ? "Social media consultation" : "ייעוץ לניהול ושיווק ברשתות";

  return (
    <article className="sp-page structured-page service-page sp-page--social">
      <ServiceHero
        badge={c.SOCIAL_HERO.badge}
        title={c.SOCIAL_HERO.title}
        lead={c.SOCIAL_HERO.lead}
        visual={<SocialHeroVisual src={c.SOCIAL_HERO_IMAGE.src} alt={c.SOCIAL_HERO_IMAGE.alt} />}
        actions={
          <ServiceCtaRow
            primaryLabel={primaryCta}
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        }
      />

      <Section tone="white" label={c.SOCIAL_INTRO.label} title={c.SOCIAL_INTRO.title} align="start" className="sp-section-fade-in">
        <div className="sp-intro-stack">
          {c.SOCIAL_INTRO.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="sp-body-lead">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section tone="sky" label={c.SOCIAL_CHANNELS.label} title={c.SOCIAL_CHANNELS.title} align="start" className="sp-section-platforms">
        <div className="sp-social-platforms">
          <div className="sp-social-platform sp-social-platform--fb">
            <span className="sp-social-platform-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </span>
            <h3 className="sp-social-platform-title">{locale === "en" ? "Facebook" : "פייסבוק"}</h3>
            <p className="sp-social-platform-text">
              {locale === "en"
                ? "Content, community, and paid campaigns for businesses."
                : "תוכן, קהילה וקמפיינים ממומנים לעסקים."}
            </p>
          </div>
          <div className="sp-social-platform sp-social-platform--ig">
            <span className="sp-social-platform-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </span>
            <h3 className="sp-social-platform-title">{locale === "en" ? "Instagram" : "אינסטגרם"}</h3>
            <p className="sp-social-platform-text">
              {locale === "en"
                ? "Visual content, Stories, and Reels with on-brand messaging."
                : "ויזואל, סטוריז ו-Reels עם מסר מותגי."}
            </p>
          </div>
        </div>
        <ul className="sp-check-list sp-check-list--compact sp-social-channel-list">
          {c.SOCIAL_CHANNELS.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section
        tone="muted"
        label={c.SOCIAL_INCLUDES.label}
        title={c.SOCIAL_INCLUDES.title}
        align="start"
        className="sp-section-workflow sp-section-signature"
      >
        <SocialWorkflowVisual />
        <div className="sp-includes-editorial">
          {c.SOCIAL_INCLUDES.items.map((item) => (
            <article key={item.title} className="sp-include-item">
              <h3 className="sp-benefit-title">{item.title}</h3>
              <p className="sp-benefit-text">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <CommercialMidCta eyebrow={c.SOCIAL_MID_CTA.eyebrow} title={c.SOCIAL_MID_CTA.title} body={c.SOCIAL_MID_CTA.body}>
        <ServiceCtaRow primaryLabel={primaryCta} secondary={<ServicePhoneLink tone="light" />} />
      </CommercialMidCta>

      {guides.length > 0 && (
        <Section
          tone="white"
          label={locale === "en" ? "Guides" : "מדריכים"}
          title={locale === "en" ? "Social media marketing guides" : "מדריכים לשיווק ברשתות"}
          align="start"
        >
          <ServiceRelatedGuides posts={guides} locale={locale} />
        </Section>
      )}

      <Section
        tone="sky"
        title={locale === "en" ? "Social media FAQ" : "שאלות נפוצות על ניהול רשתות חברתיות"}
        align="start"
        className="sp-section-faq"
      >
        <ServiceFaq items={c.SOCIAL_FAQ} />
      </Section>

      <Section tone="white" title={locale === "en" ? "Related services" : "שירותים משלימים"} align="start">
        <ServiceRelatedServices services={c.SOCIAL_RELATED_SERVICES} locale={locale} />
      </Section>

      <CommercialFinalCta
        eyebrow={c.SOCIAL_FINAL_CTA.eyebrow}
        title={c.SOCIAL_FINAL_CTA.title}
        body={c.SOCIAL_FINAL_CTA.body}
        primaryLabel={c.SOCIAL_FINAL_CTA.eyebrow}
      />

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
