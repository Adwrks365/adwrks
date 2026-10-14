import Link from "next/link";
import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "@/components/services/shared/ServiceCtas";
import { ServiceFaq } from "@/components/services/shared/ServiceFaq";
import { ServiceHero } from "@/components/services/shared/ServiceHero";
import { ServiceProcessTimeline } from "@/components/services/shared/ServiceProcessTimeline";
import { ServiceRelatedServices } from "@/components/services/shared/ServiceRelatedServices";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/i18n/routing";
import { serviceAreaGroups } from "@/lib/pages/locations/nav";
import { hubPopupConfig } from "@/lib/pages/locations/popup";
import type { HubView } from "@/lib/pages/locations/registry";
import { LocationPageContactForm } from "./LocationPageContactForm";

type LocationsHubPageProps = {
  view: HubView;
  locale: Locale;
};

export function LocationsHubPage({ view, locale }: LocationsHubPageProps) {
  const c = view.copy;
  const popupConfig = hubPopupConfig(view, locale);
  const primaryCta = locale === "en" ? "Marketing consultation" : "ייעוץ שיווק";
  const groups = serviceAreaGroups(locale);
  const practiceLabel = locale === "en" ? "The practice" : "המעטפת";

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

      <Section tone="white" label={c.workLabel} title={c.workTitle} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{c.workIntro}</p>
        <ServiceProcessTimeline steps={c.workSteps} />
      </Section>

      <Section tone="sky" title={c.regionsTitle} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{c.regionsIntro}</p>
        <div className="loc-hub-regions">
          {groups.map((group) => (
            <div key={group.id} className="loc-hub-region">
              <h3 className="loc-hub-region-title">{group.label}</h3>
              <ul className="loc-hub-region-links">
                {group.regionHref && (
                  <li>
                    <Link href={group.regionHref} prefetch={false}>
                      {locale === "en" ? `All ${group.label}` : `כל ${group.label}`}
                    </Link>
                  </li>
                )}
                {group.cities.map((city) => (
                  <li key={city.href}>
                    <Link href={city.href} prefetch={false}>
                      {city.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <ServiceRelatedServices services={[...view.regions, ...view.cities]} locale={locale} />
      </Section>

      <Section tone="white" title={practiceLabel} align="start">
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
