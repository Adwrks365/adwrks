import Link from "next/link";
import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { Section } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/content/loader";
import { getHostingPageContent } from "@/lib/pages/services/get-locale-content";
import type { LocaleProps } from "@/lib/locale-props";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "./shared/ServiceCtas";
import { ServiceHero } from "./shared/ServiceHero";
import { ServiceRelatedGuides } from "./shared/ServiceRelatedGuides";
import { ServiceRelatedServices } from "./shared/ServiceRelatedServices";
import { HostingHeroVisual, ModernStackVisual } from "./shared/ServiceVisualCompositions";

export function HostingPlansServicePage({ locale = "he" }: LocaleProps) {
  const c = getHostingPageContent(locale);
  const popupConfig = getServicePopupConfig(c.HOSTING_PATH, c.HOSTING_HERO.title, locale);
  const guides = c.HOSTING_GUIDE_PATHS.flatMap((path) => {
    const post = getAllPosts(locale).find((p) => p.path === path);
    return post ? [post] : [];
  });

  return (
    <article className="sp-page structured-page service-page sp-page--hosting">
      <ServiceHero
        badge={c.HOSTING_HERO.badge}
        title={c.HOSTING_HERO.title}
        lead={c.HOSTING_HERO.lead}
        visual={<HostingHeroVisual />}
        actions={
          <ServiceCtaRow
            primaryLabel={c.HOSTING_HERO.ctaLabel}
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        }
      />

      <Section tone="white" title={c.HOSTING_WORDPRESS_SECTION.title} align="start" className="sp-section-plans sp-section-fade-in">
        <p className="sp-body-lead sp-body-lead--narrow">{c.HOSTING_WORDPRESS_SECTION.intro}</p>
        <div className="sp-plans-grid">
          {c.HOSTING_PLANS.map((plan) => (
            <article key={plan.id} className="sp-plan-card">
              <h3 className="sp-plan-title">{plan.title}</h3>
              <p className="sp-plan-audience">{plan.audience}</p>
              <div className="sp-plan-price-row">
                <span className="sp-plan-price">{plan.price}</span>
                <span className="sp-plan-period">{plan.period}</span>
              </div>
              {"wasPrice" in plan && plan.wasPrice && (
                <p className="sp-plan-was">
                  {locale === "en" ? `Was ${plan.wasPrice}` : `במקום ${plan.wasPrice}`}
                </p>
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
        label={c.HOSTING_MODERN_INFRA.label}
        title={c.HOSTING_MODERN_INFRA.title}
        align="start"
        className="sp-section-modern-infra sp-section-signature"
      >
        <div className="sp-modern-infra">
          <div className="sp-modern-infra-copy">
            <p className="sp-body-lead">{c.HOSTING_MODERN_INFRA.intro}</p>
            <ul className="sp-modern-infra-stack">
              {c.HOSTING_MODERN_INFRA.points.map((point) => (
                <li key={point.name}>
                  <strong>{point.name}</strong> – {point.text}
                </li>
              ))}
            </ul>
            <p className="sp-modern-infra-pricing">{c.HOSTING_MODERN_INFRA.pricingNote}</p>
            <ServiceCtaRow
              primaryLabel={c.HOSTING_MODERN_INFRA.ctaLabel}
              secondary={<ServicePhoneLink tone="light" />}
            />
          </div>
          <ModernStackVisual />
        </div>
      </Section>

      <Section tone="sky" label={c.HOSTING_MAINTENANCE.label} title={c.HOSTING_MAINTENANCE.title} align="start">
        <p className="sp-body-lead">{c.HOSTING_MAINTENANCE.intro}</p>
        <ul className="sp-check-list">
          {c.HOSTING_MAINTENANCE.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section tone="white" label={c.HOSTING_WEBSITE_LINK.label} title={c.HOSTING_WEBSITE_LINK.title} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{c.HOSTING_WEBSITE_LINK.body}</p>
        <Link href={c.HOSTING_WEBSITE_LINK.href} className="sp-text-link">
          {locale === "en" ? "Website building page →" : "לעמוד בניית אתרים ←"}
        </Link>
      </Section>

      {guides.length > 0 && (
        <Section
          tone="muted"
          label={locale === "en" ? "Guides" : "מדריכים"}
          title={locale === "en" ? "Hosting & maintenance guides" : "מדריכים לאחסון ותחזוקה"}
          align="start"
        >
          <ServiceRelatedGuides posts={guides} locale={locale} />
        </Section>
      )}

      <Section tone="white" title={locale === "en" ? "Related services" : "שירותים משלימים"} align="start">
        <ServiceRelatedServices services={c.HOSTING_RELATED_SERVICES} locale={locale} />
      </Section>

      <CommercialFinalCta
        eyebrow={c.HOSTING_FINAL_CTA.eyebrow}
        title={c.HOSTING_FINAL_CTA.title}
        body={c.HOSTING_FINAL_CTA.body}
        primaryLabel={c.HOSTING_FINAL_CTA.eyebrow}
      />

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
