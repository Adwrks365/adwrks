import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "@/components/services/shared/ServiceCtas";
import { ServiceFaq } from "@/components/services/shared/ServiceFaq";
import { ServiceHero } from "@/components/services/shared/ServiceHero";
import { ServiceRelatedServices } from "@/components/services/shared/ServiceRelatedServices";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/i18n/routing";
import { hubPopupConfig } from "@/lib/pages/locations/popup";
import type { HubView } from "@/lib/pages/locations/registry";

type LocationsHubPageProps = {
  view: HubView;
  locale: Locale;
};

export function LocationsHubPage({ view, locale }: LocationsHubPageProps) {
  const c = view.copy;
  const popupConfig = hubPopupConfig(view, locale);
  const primaryCta = locale === "en" ? "Marketing consultation" : "ייעוץ שיווק";

  return (
    <article className="sp-page structured-page service-page sp-page--location">
      <ServiceHero
        badge={c.badge}
        title={c.h1}
        lead={c.lead}
        actions={
          <ServiceCtaRow
            primaryLabel={primaryCta}
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        }
      />

      <Section tone="white" label={c.modelLabel} title={c.modelTitle} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{c.modelIntro}</p>
        <ul className="sp-check-list sp-check-list--compact">
          {c.modelPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </Section>

      <Section tone="sky" title={c.regionsTitle} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{c.regionsIntro}</p>
        <ServiceRelatedServices services={view.regions} locale={locale} />
      </Section>

      <Section tone="white" title={c.citiesTitle} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{c.citiesIntro}</p>
        <ServiceRelatedServices services={view.cities} locale={locale} />
      </Section>

      <Section
        tone="muted"
        title={locale === "en" ? "The practice" : "המעטפת"}
        align="start"
      >
        <ServiceRelatedServices services={view.services} locale={locale} />
      </Section>

      <Section tone="sky" title={c.faqTitle} align="start" className="sp-section-faq">
        <ServiceFaq items={c.faq} />
      </Section>

      <CommercialFinalCta
        eyebrow={c.finalCtaEyebrow}
        title={c.finalCtaTitle}
        body={c.finalCtaBody}
        primaryLabel={c.finalCtaEyebrow}
      />

      <ContextualPopupRegistrar config={popupConfig} />
    </article>
  );
}
