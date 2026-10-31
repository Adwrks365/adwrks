import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "@/components/services/shared/ServiceCtas";
import { ServiceFaq } from "@/components/services/shared/ServiceFaq";
import { ServiceHero } from "@/components/services/shared/ServiceHero";
import { ServiceProcessTimeline } from "@/components/services/shared/ServiceProcessTimeline";
import { ServiceRelatedServices } from "@/components/services/shared/ServiceRelatedServices";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/i18n/routing";
import { hubPopupConfig } from "@/lib/pages/locations/popup";
import type { HubView } from "@/lib/pages/locations/registry";
import { LocationPageContactForm } from "./LocationPageContactForm";
import { LocationsHubRegions } from "./LocationsHubRegions";

type LocationsHubPageProps = {
  view: HubView;
  locale: Locale;
};

export function LocationsHubPage({ view, locale }: LocationsHubPageProps) {
  const c = view.copy;
  const popupConfig = hubPopupConfig(view, locale);
  const primaryCta = locale === "en" ? "Marketing consultation" : "ייעוץ שיווק";
  const practiceLabel = locale === "en" ? "The practice" : "המעטפת";

  return (
    <article className="sp-page structured-page service-page sp-page--location sp-page--locations-hub">
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

      <Section tone="white" label={c.workLabel} title={c.workTitle} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{c.workIntro}</p>
        <ServiceProcessTimeline steps={c.workSteps} />
      </Section>

      <Section tone="sky" title={c.regionsTitle} align="center" className="sp-section-loc-hub-regions">
        <LocationsHubRegions locale={locale} intro={c.regionsIntro} />
      </Section>

      <Section tone="white" title={practiceLabel} align="center" className="sp-section-loc-hub-services">
        <p className="loc-hub-services-lead">
          {locale === "en"
            ? "The same agency services — tailored to your market, wherever you operate."
            : "אותם שירותי סוכנות — מותאמים לשוק שלכם, בכל אזור."}
        </p>
        <ServiceRelatedServices services={view.services} locale={locale} />
      </Section>

      <Section tone="sky" title={c.faqTitle} align="start" className="sp-section-faq">
        <ServiceFaq items={c.faq} />
      </Section>

      <Section tone="white" title={c.contactTitle} align="start" className="sp-section-contact">
        <p className="sp-body-lead sp-body-lead--narrow">{c.contactIntro}</p>
        <LocationPageContactForm locale={locale} pageTitle={c.h1} pagePath={view.path} />
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
