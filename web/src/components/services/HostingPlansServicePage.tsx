import Link from "next/link";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { Section } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/content/loader";
import {
  HOSTING_FINAL_CTA,
  HOSTING_GUIDE_PATHS,
  HOSTING_HERO,
  HOSTING_MAINTENANCE,
  HOSTING_MODERN_INFRA,
  HOSTING_PATH,
  HOSTING_PLANS,
  HOSTING_RELATED_SERVICES,
  HOSTING_WEBSITE_LINK,
  HOSTING_WORDPRESS_SECTION,
} from "@/lib/pages/services/hosting-content";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "./shared/ServiceCtas";
import { ServiceHero } from "./shared/ServiceHero";
import { ServiceRelatedGuides } from "./shared/ServiceRelatedGuides";
import { ServiceRelatedServices } from "./shared/ServiceRelatedServices";
import { HostingHeroVisual, ModernStackVisual } from "./shared/ServiceVisualCompositions";

export function HostingPlansServicePage() {
  const popupConfig = getServicePopupConfig(HOSTING_PATH, HOSTING_HERO.title);
  const guides = HOSTING_GUIDE_PATHS.flatMap((path) => {
    const post = getAllPosts().find((p) => p.path === path);
    return post ? [post] : [];
  });

  return (
    <article className="sp-page structured-page service-page sp-page--hosting">
      <ServiceHero
        badge={HOSTING_HERO.badge}
        title={HOSTING_HERO.title}
        lead={HOSTING_HERO.lead}
        visual={<HostingHeroVisual />}
        actions={
          <ServiceCtaRow
            primaryLabel={HOSTING_HERO.ctaLabel}
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        }
      />

      <Section tone="white" title={HOSTING_WORDPRESS_SECTION.title} align="start" className="sp-section-plans sp-section-fade-in">
        <p className="sp-body-lead sp-body-lead--narrow">{HOSTING_WORDPRESS_SECTION.intro}</p>
        <div className="sp-plans-grid">
          {HOSTING_PLANS.map((plan) => (
            <article key={plan.id} className="sp-plan-card">
              <h3 className="sp-plan-title">{plan.title}</h3>
              <p className="sp-plan-audience">{plan.audience}</p>
              <div className="sp-plan-price-row">
                <span className="sp-plan-price">{plan.price}</span>
                <span className="sp-plan-period">{plan.period}</span>
              </div>
              {"wasPrice" in plan && plan.wasPrice && (
                <p className="sp-plan-was">במקום {plan.wasPrice}</p>
              )}
              <ul className="sp-plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section
        tone="muted"
        label={HOSTING_MODERN_INFRA.label}
        title={HOSTING_MODERN_INFRA.title}
        align="start"
        className="sp-section-modern-infra sp-section-signature"
      >
        <div className="sp-modern-infra">
          <div className="sp-modern-infra-copy">
            <p className="sp-body-lead">{HOSTING_MODERN_INFRA.intro}</p>
            <ul className="sp-modern-infra-stack">
              {HOSTING_MODERN_INFRA.points.map((point) => (
                <li key={point.name}>
                  <strong>{point.name}</strong> – {point.text}
                </li>
              ))}
            </ul>
            <p className="sp-modern-infra-pricing">{HOSTING_MODERN_INFRA.pricingNote}</p>
            <ServiceCtaRow
              primaryLabel={HOSTING_MODERN_INFRA.ctaLabel}
              secondary={<ServicePhoneLink tone="light" />}
            />
          </div>
          <ModernStackVisual />
        </div>
      </Section>

      <Section tone="sky" label={HOSTING_MAINTENANCE.label} title={HOSTING_MAINTENANCE.title} align="start">
        <p className="sp-body-lead">{HOSTING_MAINTENANCE.intro}</p>
        <ul className="sp-check-list">
          {HOSTING_MAINTENANCE.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section tone="white" label={HOSTING_WEBSITE_LINK.label} title={HOSTING_WEBSITE_LINK.title} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{HOSTING_WEBSITE_LINK.body}</p>
        <Link href={HOSTING_WEBSITE_LINK.href} className="sp-text-link">
          לעמוד בניית אתרים ←
        </Link>
      </Section>

      {guides.length > 0 && (
        <Section tone="muted" label="מדריכים" title="מדריכים לאחסון ותחזוקה" align="start">
          <ServiceRelatedGuides posts={guides} />
        </Section>
      )}

      <Section tone="white" title="שירותים משלימים" align="start">
        <ServiceRelatedServices services={HOSTING_RELATED_SERVICES} />
      </Section>

      <Section tone="gradient" label={HOSTING_FINAL_CTA.eyebrow} title={HOSTING_FINAL_CTA.title} className="sp-final-cta-section">
        <div className="sp-final-cta">
          <p className="sp-final-cta-body">{HOSTING_FINAL_CTA.body}</p>
          <ServiceCtaRow
            primaryLabel="ייעוץ לבחירת חבילת אחסון"
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        </div>
      </Section>

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
