import Link from "next/link";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { Section } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/content/loader";
import {
  SEO_AI,
  SEO_AUDIENCE,
  SEO_BENEFITS,
  SEO_FAQ,
  SEO_FINAL_CTA,
  SEO_GUIDE_PATHS,
  SEO_HERO,
  SEO_IMAGES,
  SEO_MID_CTA,
  SEO_PARTNER_BADGE,
  SEO_PATH,
  SEO_PROCESS,
  SEO_RELATED_SERVICES,
  SEO_TODAY,
} from "@/lib/pages/services/seo-content";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "./shared/ServiceCtas";
import { ServiceEditorialImage } from "./shared/ServiceEditorialImage";
import { ServiceFaq } from "./shared/ServiceFaq";
import { ServiceHero } from "./shared/ServiceHero";
import { ServiceProcessTimeline } from "./shared/ServiceProcessTimeline";
import { ServiceRelatedGuides } from "./shared/ServiceRelatedGuides";
import { ServiceRelatedServices } from "./shared/ServiceRelatedServices";
import { SeoAeoAccent, SeoHeroVisual } from "./shared/ServiceVisualCompositions";

export function SeoServicePage() {
  const popupConfig = getServicePopupConfig(SEO_PATH, SEO_HERO.title);
  const guides = SEO_GUIDE_PATHS.flatMap((path) => {
    const post = getAllPosts().find((p) => p.path === path);
    return post ? [post] : [];
  });
  const aiGuides = SEO_AI.guidePaths.flatMap((path) => {
    const post = getAllPosts().find((p) => p.path === path);
    return post ? [post] : [];
  });

  return (
    <article className="sp-page structured-page service-page sp-page--seo">
      <ServiceHero
        badge={SEO_HERO.badge}
        title={SEO_HERO.title}
        lead={SEO_HERO.lead}
        proofImage={SEO_PARTNER_BADGE}
        visual={<SeoHeroVisual />}
        actions={
          <ServiceCtaRow
            primaryLabel="ייעוץ SEO"
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        }
      />

      <Section tone="white" label={SEO_TODAY.label} title={SEO_TODAY.title} align="start" className="sp-section-fade-in">
        <div className="sp-editorial-grid sp-editorial-grid--media">
          <div className="sp-editorial-copy">
            <p className="sp-body-lead">{SEO_TODAY.intro}</p>
            <ul className="sp-check-list sp-check-list--inline">
              {SEO_TODAY.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <ServiceEditorialImage
            src={SEO_IMAGES.intro.src}
            alt={SEO_IMAGES.intro.alt}
            width={SEO_IMAGES.intro.width}
            height={SEO_IMAGES.intro.height}
          />
        </div>
      </Section>

      <Section tone="sky" label={SEO_AUDIENCE.label} title={SEO_AUDIENCE.title} align="start">
        <ul className="sp-audience-list">
          {SEO_AUDIENCE.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section tone="white" label={SEO_PROCESS.label} title={SEO_PROCESS.title} align="start" className="sp-section-process sp-section-signature">
        <div className="sp-process-split">
          <ServiceProcessTimeline steps={SEO_PROCESS.steps} variant="seo" />
          <ServiceEditorialImage
            src={SEO_IMAGES.process.src}
            alt={SEO_IMAGES.process.alt}
            width={SEO_IMAGES.process.width}
            height={SEO_IMAGES.process.height}
            className="sp-process-media"
          />
        </div>
      </Section>

      <Section tone="muted" label={SEO_AI.label} title={SEO_AI.title} align="start" className="sp-section-aeo">
        <SeoAeoAccent />
        <div className="sp-aeo-content">
          <p className="sp-body-lead sp-body-lead--narrow">{SEO_AI.intro}</p>
          <ul className="sp-check-list sp-check-list--compact">
            {SEO_AI.points.map((point) => (
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

      <Section tone="sky" label={SEO_BENEFITS.label} title={SEO_BENEFITS.title} align="start">
        <div className="sp-benefits-editorial">
          {SEO_BENEFITS.items.map((item) => (
            <article key={item.title} className="sp-benefit-editorial">
              <h3 className="sp-benefit-title">{item.title}</h3>
              <p className="sp-benefit-text">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="dark" label={SEO_MID_CTA.eyebrow} title={SEO_MID_CTA.title} align="start" className="sp-mid-cta-section">
        <p className="sp-mid-cta-text">{SEO_MID_CTA.body}</p>
        <ServiceCtaRow primaryLabel="ייעוץ SEO" tone="dark" secondary={<ServicePhoneLink tone="dark" />} />
      </Section>

      {guides.length > 0 && (
        <Section tone="white" label="מדריכים" title="מדריכים לקידום אתרים" align="start">
          <ServiceRelatedGuides posts={guides} />
        </Section>
      )}

      <Section tone="sky" title="שאלות נפוצות על קידום אתרים" align="start" className="sp-section-faq">
        <ServiceFaq items={SEO_FAQ} />
      </Section>

      <Section tone="white" title="שירותים משלימים" align="start">
        <ServiceRelatedServices services={SEO_RELATED_SERVICES} />
      </Section>

      <Section tone="gradient" label={SEO_FINAL_CTA.eyebrow} title={SEO_FINAL_CTA.title} className="sp-final-cta-section">
        <div className="sp-final-cta">
          <p className="sp-final-cta-body">{SEO_FINAL_CTA.body}</p>
          <ServiceCtaRow
            primaryLabel="ייעוץ SEO"
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        </div>
      </Section>

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
