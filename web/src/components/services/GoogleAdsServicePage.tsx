import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { CommercialMidCta } from "@/components/commercial/CommercialMidCta";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { Section } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/content/loader";
import { getGoogleAdsPageContent } from "@/lib/pages/services/get-locale-content";
import type { LocaleProps } from "@/lib/locale-props";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import { ServiceCampaignIcon } from "./shared/ServiceCampaignIcon";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "./shared/ServiceCtas";
import { ServiceEditorialImage } from "./shared/ServiceEditorialImage";
import { ServiceFaq } from "./shared/ServiceFaq";
import { ServiceHero } from "./shared/ServiceHero";
import { ServiceLifecycleRail } from "./shared/ServiceLifecycleRail";
import { ServiceRelatedGuides } from "./shared/ServiceRelatedGuides";
import { ServiceRelatedServices } from "./shared/ServiceRelatedServices";
import { GoogleAdsHeroVisual } from "./shared/ServiceVisualCompositions";

export function GoogleAdsServicePage({ locale = "he" }: LocaleProps) {
  const c = getGoogleAdsPageContent(locale);
  const popupConfig = getServicePopupConfig(c.GOOGLE_ADS_PATH, c.GOOGLE_ADS_HERO.title);
  const guides = c.GOOGLE_ADS_GUIDE_PATHS.flatMap((path) => {
    const post = getAllPosts(locale).find((p) => p.path === path);
    return post ? [post] : [];
  });
  const primaryCta = locale === "en" ? "Google Ads consultation" : "ייעוץ Google Ads";

  return (
    <article className="sp-page structured-page service-page sp-page--google-ads">
      <ServiceHero
        badge={c.GOOGLE_ADS_HERO.badge}
        title={c.GOOGLE_ADS_HERO.title}
        lead={c.GOOGLE_ADS_HERO.lead}
        visual={
          <GoogleAdsHeroVisual
            image={c.GOOGLE_ADS_IMAGES.hero}
            partnerBadge={c.GOOGLE_ADS_PARTNER_BADGE}
            campaigns={c.GOOGLE_ADS_HERO_CAMPAIGNS}
          />
        }
        actions={
          <ServiceCtaRow
            primaryLabel={primaryCta}
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        }
      />

      <Section tone="white" label={c.GOOGLE_ADS_INTRO.label} title={c.GOOGLE_ADS_INTRO.title} align="start" className="sp-section-fade-in">
        <div className="sp-editorial-grid sp-editorial-grid--media">
          <div className="sp-editorial-copy">
            <p className="sp-body-lead">{c.GOOGLE_ADS_INTRO.intro}</p>
            <p className="sp-body-highlight">{c.GOOGLE_ADS_INTRO.highlight}</p>
          </div>
          <ServiceEditorialImage
            src={c.GOOGLE_ADS_IMAGES.intro.src}
            alt={c.GOOGLE_ADS_IMAGES.intro.alt}
            width={c.GOOGLE_ADS_IMAGES.intro.width}
            height={c.GOOGLE_ADS_IMAGES.intro.height}
          />
        </div>
      </Section>

      <Section tone="muted" label={c.GOOGLE_ADS_CAMPAIGNS.label} title={c.GOOGLE_ADS_CAMPAIGNS.title} align="start">
        <div className="sp-campaign-grid sp-campaign-grid--enriched">
          {c.GOOGLE_ADS_CAMPAIGNS.items.map((item) => (
            <article key={item.title} className="sp-campaign-item sp-campaign-item--enriched">
              <ServiceCampaignIcon kind={item.icon} />
              <h3 className="sp-campaign-title">{item.title}</h3>
              <p className="sp-campaign-text">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="sky" label={c.GOOGLE_ADS_AUDIENCE.label} title={c.GOOGLE_ADS_AUDIENCE.title} align="start">
        <div className="sp-editorial-grid sp-editorial-grid--media sp-editorial-grid--reverse">
          <div className="sp-editorial-copy">
            <p className="sp-body-lead">{c.GOOGLE_ADS_AUDIENCE.intro}</p>
            <p className="sp-body-text">{c.GOOGLE_ADS_AUDIENCE.detail}</p>
          </div>
          <ServiceEditorialImage
            src={c.GOOGLE_ADS_IMAGES.audience.src}
            alt={c.GOOGLE_ADS_IMAGES.audience.alt}
            width={c.GOOGLE_ADS_IMAGES.audience.width}
            height={c.GOOGLE_ADS_IMAGES.audience.height}
          />
        </div>
      </Section>

      <Section
        tone="white"
        label={c.GOOGLE_ADS_LIFECYCLE.label}
        title={c.GOOGLE_ADS_LIFECYCLE.title}
        align="start"
        className="sp-section-lifecycle sp-section-signature"
      >
        <ServiceLifecycleRail steps={c.GOOGLE_ADS_LIFECYCLE.steps} />
      </Section>

      <Section tone="sky" label={c.GOOGLE_ADS_LANDING.label} title={c.GOOGLE_ADS_LANDING.title} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{c.GOOGLE_ADS_LANDING.body}</p>
      </Section>

      <Section tone="white" label={c.GOOGLE_ADS_BENEFITS.label} title={c.GOOGLE_ADS_BENEFITS.title} align="start">
        <div className="sp-benefits-editorial sp-benefits-editorial--two">
          {c.GOOGLE_ADS_BENEFITS.items.map((item) => (
            <article key={item.title} className="sp-benefit-editorial">
              <h3 className="sp-benefit-title">{item.title}</h3>
              <p className="sp-benefit-text">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <CommercialMidCta
        eyebrow={c.GOOGLE_ADS_MID_CTA.eyebrow}
        title={c.GOOGLE_ADS_MID_CTA.title}
        body={c.GOOGLE_ADS_MID_CTA.body}
      >
        <ServiceCtaRow primaryLabel={primaryCta} secondary={<ServicePhoneLink tone="light" />} />
      </CommercialMidCta>

      {guides.length > 0 && (
        <Section
          tone="white"
          label={locale === "en" ? "Guides" : "מדריכים"}
          title={locale === "en" ? "Google Ads guides" : "מדריכים לפרסום בגוגל"}
          align="start"
        >
          <ServiceRelatedGuides posts={guides} />
        </Section>
      )}

      <Section
        tone="sky"
        title={locale === "en" ? "Google Ads FAQ" : "שאלות נפוצות על Google Ads"}
        align="start"
        className="sp-section-faq"
      >
        <ServiceFaq items={c.GOOGLE_ADS_FAQ} />
      </Section>

      <Section tone="white" title={locale === "en" ? "Related services" : "שירותים משלימים"} align="start">
        <ServiceRelatedServices services={c.GOOGLE_ADS_RELATED_SERVICES} />
      </Section>

      <CommercialFinalCta
        eyebrow={c.GOOGLE_ADS_FINAL_CTA.eyebrow}
        title={c.GOOGLE_ADS_FINAL_CTA.title}
        body={c.GOOGLE_ADS_FINAL_CTA.body}
        primaryLabel={c.GOOGLE_ADS_FINAL_CTA.eyebrow}
      />

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
