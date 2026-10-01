import Link from "next/link";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { Section } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/content/loader";
import {
  HUB_FINAL_CTA,
  HUB_GUIDE_PATHS,
  HUB_HERO,
  HUB_INTEGRATION,
  HUB_PATH,
  HUB_PRICING,
  HUB_SERVICES,
} from "@/lib/pages/services/hub-content";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import { ServiceCtaRow, ServiceContactButton, ServicePhoneLink } from "./shared/ServiceCtas";
import { ServiceHero } from "./shared/ServiceHero";
import { ServiceRelatedGuides } from "./shared/ServiceRelatedGuides";

export function ServiceHubPage() {
  const popupConfig = getServicePopupConfig(HUB_PATH, HUB_HERO.title);
  const guides = HUB_GUIDE_PATHS.flatMap((path) => {
    const post = getAllPosts().find((p) => p.path === path);
    return post ? [post] : [];
  });

  return (
    <article className="sp-page structured-page service-page sp-page--hub">
      <ServiceHero
        badge={HUB_HERO.badge}
        title={HUB_HERO.title}
        lead={HUB_HERO.lead}
        actions={
          <ServiceCtaRow
            primaryLabel="בואו נדבר על השיווק של העסק"
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        }
      />

      <Section tone="white" label="שירותי הסוכנות" title="בחרו את השירות שמתאים לכם" align="start">
        <ul className="sp-hub-grid">
          {HUB_SERVICES.map((service) => (
            <li key={service.href}>
              <Link href={service.href} className="sp-hub-card">
                <span className="sp-hub-intent">{service.intent}</span>
                <h3 className="sp-hub-title">{service.title}</h3>
                <p className="sp-hub-text">{service.text}</p>
                <span className="sp-hub-cta">{service.cta} ←</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sky" label={HUB_INTEGRATION.label} title={HUB_INTEGRATION.title} align="start">
        <p className="sp-body-lead">{HUB_INTEGRATION.body}</p>
        <ul className="sp-check-list sp-check-list--compact">
          {HUB_INTEGRATION.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </Section>

      <Section tone="muted" label={HUB_PRICING.label} title={HUB_PRICING.title} align="start">
        <p className="sp-body-lead sp-body-lead--narrow">{HUB_PRICING.body}</p>
        <Link href={HUB_PRICING.href} className="sp-text-link">
          {HUB_PRICING.cta} ←
        </Link>
      </Section>

      {guides.length > 0 && (
        <Section tone="white" label="ידע ומדריכים" title="מדריכים לשיווק דיגיטלי" align="start">
          <ServiceRelatedGuides posts={guides} />
        </Section>
      )}

      <Section tone="gradient" label={HUB_FINAL_CTA.eyebrow} title={HUB_FINAL_CTA.title} className="sp-final-cta-section">
        <div className="sp-final-cta">
          <p className="sp-final-cta-body">{HUB_FINAL_CTA.body}</p>
          <ServiceCtaRow
            primaryLabel="בואו נדבר על השיווק של העסק"
            secondary={<ServicePhoneLink tone="light" />}
            tertiary={<ServiceContactButton />}
          />
        </div>
      </Section>

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
