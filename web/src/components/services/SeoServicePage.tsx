import Link from "next/link";
import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { CommercialMidCta } from "@/components/commercial/CommercialMidCta";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { Section } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/content/loader";
import { getSeoPageContent } from "@/lib/pages/services/get-locale-content";
import type { LocaleProps } from "@/lib/locale-props";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "./shared/ServiceCtas";
import { ServiceEditorialImage } from "./shared/ServiceEditorialImage";
import { ServiceFaq } from "./shared/ServiceFaq";
import { ServiceHero } from "./shared/ServiceHero";
import { ServiceProcessTimeline } from "./shared/ServiceProcessTimeline";
import { ServiceRelatedGuides } from "./shared/ServiceRelatedGuides";
import { ServiceRelatedServices } from "./shared/ServiceRelatedServices";
import { SeoAeoAccent, SeoHeroVisual } from "./shared/ServiceVisualCompositions";

export function SeoServicePage({ locale = "he" }: LocaleProps) {
  const c = getSeoPageContent(locale);
  const popupConfig = getServicePopupConfig(c.SEO_PATH, c.SEO_HERO.title);
  const guides = c.SEO_GUIDE_PATHS.flatMap((path) => {
    const post = getAllPosts(locale).find((p) => p.path === path);
    return post ? [post] : [];
  });
  const aiGuides = c.SEO_AI.guidePaths.flatMap((path) => {
    const post = getAllPosts(locale).find((p) => p.path === path);
    return post ? [post] : [];
  });
  const primaryCta = locale === "en" ? "SEO consultation" : "ייעוץ SEO";

  return (
    <article className="sp-page structured-page service-page sp-page--seo">
      <ServiceHero
        badge={c.SEO_HERO.badge}
        title={c.SEO_HERO.title}
        lead={c.SEO_HERO.lead}
        proofImage={c.SEO_PARTNER_BADGE}
        visual={<SeoHeroVisual />}
        actions={
          <ServiceCtaRow
            primaryLabel={primaryCta}
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        }
      />

      <Section tone="white" label={c.SEO_TODAY.label} title={c.SEO_TODAY.title} align="start" className="sp-section-fade-in">
        <div className="sp-editorial-grid sp-editorial-grid--media">
          <div className="sp-editorial-copy">
            <p className="sp-body-lead">{c.SEO_TODAY.intro}</p>
            <ul className="sp-check-list sp-check-list--inline">
              {c.SEO_TODAY.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <ServiceEditorialImage
            src={c.SEO_IMAGES.intro.src}
            alt={c.SEO_IMAGES.intro.alt}
            width={c.SEO_IMAGES.intro.width}
            height={c.SEO_IMAGES.intro.height}
          />
        </div>
      </Section>

      <Section tone="sky" label={c.SEO_AUDIENCE.label} title={c.SEO_AUDIENCE.title} align="start">
        <ul className="sp-audience-list">
          {c.SEO_AUDIENCE.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section tone="white" label={c.SEO_PROCESS.label} title={c.SEO_PROCESS.title} align="start" className="sp-section-process sp-section-signature">
        <div className="sp-process-split">
          <ServiceProcessTimeline steps={c.SEO_PROCESS.steps} variant="seo" />
          <ServiceEditorialImage
            src={c.SEO_IMAGES.process.src}
            alt={c.SEO_IMAGES.process.alt}
            width={c.SEO_IMAGES.process.width}
            height={c.SEO_IMAGES.process.height}
            className="sp-process-media"
          />
        </div>
      </Section>

      <Section tone="muted" label={c.SEO_AI.label} title={c.SEO_AI.title} align="start" className="sp-section-aeo">
        <SeoAeoAccent />
        <div className="sp-aeo-content">
          <p className="sp-body-lead sp-body-lead--narrow">{c.SEO_AI.intro}</p>
          <ul className="sp-check-list sp-check-list--compact">
            {c.SEO_AI.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {aiGuides.length > 0 && (
            <div className="sp-inline-guides">
              {aiGuides.map((post) => (
                <Link key={post.path} href={post.path} className="sp-inline-guide-link">
                  {post.title.replace(/&#8211;|&amp;#8211;/g, "–")} ←
                </Link>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section tone="sky" label={c.SEO_BENEFITS.label} title={c.SEO_BENEFITS.title} align="start">
        <div className="sp-benefits-editorial">
          {c.SEO_BENEFITS.items.map((item) => (
            <article key={item.title} className="sp-benefit-editorial">
              <h3 className="sp-benefit-title">{item.title}</h3>
              <p className="sp-benefit-text">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <CommercialMidCta eyebrow={c.SEO_MID_CTA.eyebrow} title={c.SEO_MID_CTA.title} body={c.SEO_MID_CTA.body}>
        <ServiceCtaRow primaryLabel={primaryCta} secondary={<ServicePhoneLink tone="light" />} />
      </CommercialMidCta>

      {guides.length > 0 && (
        <Section
          tone="white"
          label={locale === "en" ? "Guides" : "מדריכים"}
          title={locale === "en" ? "SEO guides" : "מדריכים לקידום אתרים"}
          align="start"
        >
          <ServiceRelatedGuides posts={guides} />
        </Section>
      )}

      <Section
        tone="sky"
        title={locale === "en" ? "SEO FAQ" : "שאלות נפוצות על קידום אתרים"}
        align="start"
        className="sp-section-faq"
      >
        <ServiceFaq items={c.SEO_FAQ} />
      </Section>

      <Section tone="white" title={locale === "en" ? "Related services" : "שירותים משלימים"} align="start">
        <ServiceRelatedServices services={c.SEO_RELATED_SERVICES} />
      </Section>

      <CommercialFinalCta
        eyebrow={c.SEO_FINAL_CTA.eyebrow}
        title={c.SEO_FINAL_CTA.title}
        body={c.SEO_FINAL_CTA.body}
        primaryLabel={c.SEO_FINAL_CTA.eyebrow}
      />

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
