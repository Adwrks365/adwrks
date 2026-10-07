import Link from "next/link";
import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { Section } from "@/components/ui/Section";
import { linkWithArrow } from "@/i18n/ui-arrows";
import { getAllPosts } from "@/lib/content/loader";
import { getServiceHubContent } from "@/lib/pages/services/get-locale-content";
import type { LocaleProps } from "@/lib/locale-props";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "./shared/ServiceCtas";
import { ServiceHero } from "./shared/ServiceHero";
import { ServiceRelatedGuides } from "./shared/ServiceRelatedGuides";
import { HubEcosystemVisual } from "./shared/ServiceVisualCompositions";

export function ServiceHubPage({ locale = "he" }: LocaleProps) {
  const c = getServiceHubContent(locale);
  const popupConfig = getServicePopupConfig(c.HUB_PATH, c.HUB_HERO.title, locale);
  const guides = c.HUB_GUIDE_PATHS.flatMap((path) => {
    const post = getAllPosts(locale).find((p) => p.path === path);
    return post ? [post] : [];
  });
  const primaryCta =
    locale === "en" ? "Let's talk about your business marketing" : "בואו נדבר על השיווק של העסק";

  return (
    <article className="sp-page structured-page service-page sp-page--hub">
      <ServiceHero
        badge={c.HUB_HERO.badge}
        title={c.HUB_HERO.title}
        lead={c.HUB_HERO.lead}
        actions={
          <ServiceCtaRow
            primaryLabel={primaryCta}
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        }
      />

      <Section
        tone="white"
        label={locale === "en" ? "Agency services" : "שירותי הסוכנות"}
        title={locale === "en" ? "Choose the service that fits you" : "בחרו את השירות שמתאים לכם"}
        align="start"
      >
        <ul className="sp-hub-grid">
          {c.HUB_SERVICES.map((service) => (
            <li key={service.href}>
              <Link href={service.href} className={`sp-hub-card sp-hub-card--${service.accent}`}>
                <span className="sp-hub-intent">{service.intent}</span>
                <h3 className="sp-hub-title">{service.title}</h3>
                <p className="sp-hub-text">{service.text}</p>
                <span className="sp-hub-cta">{linkWithArrow(locale, service.cta)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tone="sky"
        label={c.HUB_INTEGRATION.label}
        title={c.HUB_INTEGRATION.title}
        align="start"
        className="sp-section-ecosystem sp-section-signature"
      >
        <div className="sp-hub-integration">
          <div className="sp-hub-integration-copy">
            <p className="sp-body-lead">{c.HUB_INTEGRATION.body}</p>
            <ul className="sp-check-list sp-check-list--compact">
              {c.HUB_INTEGRATION.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <HubEcosystemVisual locale={locale} />
        </div>
      </Section>

      <Section tone="muted" label={c.HUB_PRICING.label} title={c.HUB_PRICING.title} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{c.HUB_PRICING.body}</p>
        <Link href={c.HUB_PRICING.href} className="sp-text-link">
          {linkWithArrow(locale, c.HUB_PRICING.cta)}
        </Link>
      </Section>

      {guides.length > 0 && (
        <Section
          tone="white"
          label={locale === "en" ? "Knowledge & guides" : "ידע ומדריכים"}
          title={locale === "en" ? "Digital marketing guides" : "מדריכים לשיווק דיגיטלי"}
          align="start"
        >
          <ServiceRelatedGuides posts={guides} locale={locale} />
        </Section>
      )}

      <CommercialFinalCta
        eyebrow={c.HUB_FINAL_CTA.eyebrow}
        title={c.HUB_FINAL_CTA.title}
        body={c.HUB_FINAL_CTA.body}
        primaryLabel={c.HUB_FINAL_CTA.eyebrow}
      />

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
