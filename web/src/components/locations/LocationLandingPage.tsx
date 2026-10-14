import Link from "next/link";
import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { CommercialMidCta } from "@/components/commercial/CommercialMidCta";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "@/components/services/shared/ServiceCtas";
import { ServiceEditorialImage } from "@/components/services/shared/ServiceEditorialImage";
import { ServiceFaq } from "@/components/services/shared/ServiceFaq";
import { ServiceHero } from "@/components/services/shared/ServiceHero";
import { ServiceRelatedServices } from "@/components/services/shared/ServiceRelatedServices";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/i18n/routing";
import { locationPopupConfig } from "@/lib/pages/locations/popup";
import type { LocationView } from "@/lib/pages/locations/registry";

const EDITORIAL = {
  src: "https://adwrks.co.il/wp-content/uploads/seo-1.jpg",
  width: 800,
  height: 600,
} as const;

type LocationLandingPageProps = {
  view: LocationView;
  locale: Locale;
};

export function LocationLandingPage({ view, locale }: LocationLandingPageProps) {
  const c = view.copy;
  const popupConfig = locationPopupConfig(view, locale);
  const primaryCta = locale === "en" ? "Marketing consultation" : "ייעוץ שיווק";
  const hubLabel = locale === "en" ? "All service areas" : "כל אזורי הפעילות";

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

      <Section tone="white" label={c.marketLabel} title={c.marketTitle} align="start" className="sp-section-fade-in">
        <div className="sp-editorial-grid sp-editorial-grid--media">
          <div className="sp-editorial-copy">
            <p className="sp-body-lead">{c.marketIntro}</p>
            <ul className="sp-check-list sp-check-list--inline">
              {c.marketPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <ServiceEditorialImage
            src={EDITORIAL.src}
            alt={c.imageAlt}
            width={EDITORIAL.width}
            height={EDITORIAL.height}
          />
        </div>
      </Section>

      <Section tone="sky" label={c.audienceLabel} title={c.audienceTitle} align="start">
        <ul className="sp-audience-list">
          {c.audienceItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section tone="muted" label={c.studioLabel} title={c.studioTitle} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{c.studioIntro}</p>
        <ul className="sp-check-list sp-check-list--compact">
          {c.studioPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </Section>

      <CommercialMidCta eyebrow={c.midCtaEyebrow} title={c.midCtaTitle} body={c.midCtaBody}>
        <ServiceCtaRow primaryLabel={primaryCta} secondary={<ServicePhoneLink tone="light" />} />
      </CommercialMidCta>

      <Section tone="white" label={c.servicesLabel} title={c.servicesTitle} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{c.servicesIntro}</p>
        <ServiceRelatedServices services={view.services} locale={locale} />
      </Section>

      <Section tone="sky" title={c.faqTitle} align="start" className="sp-section-faq">
        <ServiceFaq items={c.faq} />
      </Section>

      <Section tone="white" title={c.nearbyTitle} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{c.nearbyIntro}</p>
        <ServiceRelatedServices services={view.nearby} locale={locale} />
        <p className="sp-areas-note">
          <Link href={view.hubHref}>{hubLabel}</Link>
        </p>
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
