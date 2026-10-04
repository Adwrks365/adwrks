import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { Section } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/content/loader";
import {
  GOOGLE_ADS_AUDIENCE,
  GOOGLE_ADS_BENEFITS,
  GOOGLE_ADS_CAMPAIGNS,
  GOOGLE_ADS_FAQ,
  GOOGLE_ADS_FINAL_CTA,
  GOOGLE_ADS_GUIDE_PATHS,
  GOOGLE_ADS_HERO,
  GOOGLE_ADS_HERO_CAMPAIGNS,
  GOOGLE_ADS_IMAGES,
  GOOGLE_ADS_INTRO,
  GOOGLE_ADS_LANDING,
  GOOGLE_ADS_LIFECYCLE,
  GOOGLE_ADS_MID_CTA,
  GOOGLE_ADS_PARTNER_BADGE,
  GOOGLE_ADS_PATH,
  GOOGLE_ADS_RELATED_SERVICES,
} from "@/lib/pages/services/google-ads-content";
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

export function GoogleAdsServicePage() {
  const popupConfig = getServicePopupConfig(GOOGLE_ADS_PATH, GOOGLE_ADS_HERO.title);
  const guides = GOOGLE_ADS_GUIDE_PATHS.flatMap((path) => {
    const post = getAllPosts().find((p) => p.path === path);
    return post ? [post] : [];
  });

  return (
    <article className="sp-page structured-page service-page sp-page--google-ads">
      <ServiceHero
        badge={GOOGLE_ADS_HERO.badge}
        title={GOOGLE_ADS_HERO.title}
        lead={GOOGLE_ADS_HERO.lead}
        visual={
          <GoogleAdsHeroVisual
            image={GOOGLE_ADS_IMAGES.hero}
            partnerBadge={GOOGLE_ADS_PARTNER_BADGE}
            campaigns={GOOGLE_ADS_HERO_CAMPAIGNS}
          />
        }
        actions={
          <ServiceCtaRow
            primaryLabel="ייעוץ Google Ads"
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        }
      />

      <Section tone="white" label={GOOGLE_ADS_INTRO.label} title={GOOGLE_ADS_INTRO.title} align="start" className="sp-section-fade-in">
        <div className="sp-editorial-grid sp-editorial-grid--media">
          <div className="sp-editorial-copy">
            <p className="sp-body-lead">{GOOGLE_ADS_INTRO.intro}</p>
            <p className="sp-body-highlight">{GOOGLE_ADS_INTRO.highlight}</p>
          </div>
          <ServiceEditorialImage
            src={GOOGLE_ADS_IMAGES.intro.src}
            alt={GOOGLE_ADS_IMAGES.intro.alt}
            width={GOOGLE_ADS_IMAGES.intro.width}
            height={GOOGLE_ADS_IMAGES.intro.height}
          />
        </div>
      </Section>

      <Section tone="muted" label={GOOGLE_ADS_CAMPAIGNS.label} title={GOOGLE_ADS_CAMPAIGNS.title} align="start">
        <div className="sp-campaign-grid sp-campaign-grid--enriched">
          {GOOGLE_ADS_CAMPAIGNS.items.map((item) => (
            <article key={item.title} className="sp-campaign-item sp-campaign-item--enriched">
              <ServiceCampaignIcon kind={item.icon} />
              <h3 className="sp-campaign-title">{item.title}</h3>
              <p className="sp-campaign-text">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="sky" label={GOOGLE_ADS_AUDIENCE.label} title={GOOGLE_ADS_AUDIENCE.title} align="start">
        <div className="sp-editorial-grid sp-editorial-grid--media sp-editorial-grid--reverse">
          <div className="sp-editorial-copy">
            <p className="sp-body-lead">{GOOGLE_ADS_AUDIENCE.intro}</p>
            <p className="sp-body-text">{GOOGLE_ADS_AUDIENCE.detail}</p>
          </div>
          <ServiceEditorialImage
            src={GOOGLE_ADS_IMAGES.audience.src}
            alt={GOOGLE_ADS_IMAGES.audience.alt}
            width={GOOGLE_ADS_IMAGES.audience.width}
            height={GOOGLE_ADS_IMAGES.audience.height}
          />
        </div>
      </Section>

      <Section
        tone="white"
        label={GOOGLE_ADS_LIFECYCLE.label}
        title={GOOGLE_ADS_LIFECYCLE.title}
        align="start"
        className="sp-section-lifecycle sp-section-signature"
      >
        <ServiceLifecycleRail steps={GOOGLE_ADS_LIFECYCLE.steps} />
      </Section>

      <Section tone="sky" label={GOOGLE_ADS_LANDING.label} title={GOOGLE_ADS_LANDING.title} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{GOOGLE_ADS_LANDING.body}</p>
      </Section>

      <Section tone="white" label={GOOGLE_ADS_BENEFITS.label} title={GOOGLE_ADS_BENEFITS.title} align="start">
        <div className="sp-benefits-editorial sp-benefits-editorial--two">
          {GOOGLE_ADS_BENEFITS.items.map((item) => (
            <article key={item.title} className="sp-benefit-editorial">
              <h3 className="sp-benefit-title">{item.title}</h3>
              <p className="sp-benefit-text">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="dark" label={GOOGLE_ADS_MID_CTA.eyebrow} title={GOOGLE_ADS_MID_CTA.title} align="start" className="sp-mid-cta-section">
        <p className="sp-mid-cta-text">{GOOGLE_ADS_MID_CTA.body}</p>
        <ServiceCtaRow primaryLabel="ייעוץ Google Ads" tone="dark" secondary={<ServicePhoneLink tone="dark" />} />
      </Section>

      {guides.length > 0 && (
        <Section tone="white" label="מדריכים" title="מדריכים לפרסום בגוגל" align="start">
          <ServiceRelatedGuides posts={guides} />
        </Section>
      )}

      <Section tone="sky" title="שאלות נפוצות על Google Ads" align="start" className="sp-section-faq">
        <ServiceFaq items={GOOGLE_ADS_FAQ} />
      </Section>

      <Section tone="white" title="שירותים משלימים" align="start">
        <ServiceRelatedServices services={GOOGLE_ADS_RELATED_SERVICES} />
      </Section>

      <CommercialFinalCta
        eyebrow={GOOGLE_ADS_FINAL_CTA.eyebrow}
        title={GOOGLE_ADS_FINAL_CTA.title}
        body={GOOGLE_ADS_FINAL_CTA.body}
        primaryLabel={GOOGLE_ADS_FINAL_CTA.eyebrow}
      />

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
