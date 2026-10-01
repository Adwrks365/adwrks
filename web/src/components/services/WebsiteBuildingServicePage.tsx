import Link from "next/link";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { PortfolioShowcaseProgressive } from "@/components/portfolio/PortfolioShowcaseProgressive";
import { Section } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/content/loader";
import {
  WEBSITE_BUILDING_DELIVERABLES,
  WEBSITE_BUILDING_FAQ,
  WEBSITE_BUILDING_FINAL_CTA,
  WEBSITE_BUILDING_FOUNDATIONS,
  WEBSITE_BUILDING_GUIDE_PATHS,
  WEBSITE_BUILDING_OUTCOMES,
  WEBSITE_BUILDING_PATH,
  WEBSITE_BUILDING_PLANNING,
  WEBSITE_BUILDING_PROCESS,
  WEBSITE_BUILDING_RELATED_SERVICES,
} from "@/lib/pages/services/website-building-content";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import { WebsiteBuildingHero } from "./WebsiteBuildingHero";
import { WebsiteBuildingFinalCtas, WebsiteBuildingMidCta } from "./WebsiteBuildingHeroCtas";

export function WebsiteBuildingServicePage() {
  const popupConfig = getServicePopupConfig(WEBSITE_BUILDING_PATH, "בניית אתרים לעסקים");
  const allPosts = getAllPosts();
  const guides = WEBSITE_BUILDING_GUIDE_PATHS.flatMap((path) => {
    const post = allPosts.find((p) => p.path === path);
    return post ? [post] : [];
  });

  return (
    <article className="wb-page structured-page service-page">
      <WebsiteBuildingHero />

      <Section
        tone="white"
        className="wb-section-outcomes"
        label={WEBSITE_BUILDING_OUTCOMES.label}
        title={WEBSITE_BUILDING_OUTCOMES.title}
        align="start"
      >
        <div className="wb-outcomes-grid">
          <div className="wb-outcomes-copy">
            <p className="wb-body-lead">{WEBSITE_BUILDING_OUTCOMES.intro}</p>
            <p className="wb-body-text">{WEBSITE_BUILDING_OUTCOMES.closing}</p>
          </div>
          <aside className="wb-outcomes-panel">
            <h3 className="wb-panel-title wb-panel-title--compact">מה אתר מקצועי חייב לכלול</h3>
            <ul className="wb-check-list wb-check-list--panel">
              {WEBSITE_BUILDING_OUTCOMES.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      <Section
        tone="sky"
        className="wb-section-planning"
        label={WEBSITE_BUILDING_PLANNING.label}
        title={WEBSITE_BUILDING_PLANNING.title}
        align="start"
      >
        <div className="wb-planning-grid">
          <div className="wb-planning-main">
            <p className="wb-body-lead">{WEBSITE_BUILDING_PLANNING.intro}</p>
            <ul className="wb-check-list">
              {WEBSITE_BUILDING_PLANNING.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <aside className="wb-audience-panel">
            <h3 className="wb-panel-title">{WEBSITE_BUILDING_PLANNING.audienceLabel}</h3>
            <ul className="wb-audience-list">
              {WEBSITE_BUILDING_PLANNING.audience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      <Section
        id="portfolio"
        tone="muted"
        className="wb-section-portfolio"
        label="תיק עבודות"
        title="אתרים שבנינו לעסקים בישראל"
        subtitle="דוגמאות אמיתיות מתוך העבודות של Adwrks 365 — גללו לצפייה בכל הפרויקטים."
        align="start"
      >
        <PortfolioShowcaseProgressive />
      </Section>

      <Section
        tone="white"
        className="wb-section-process"
        label={WEBSITE_BUILDING_PROCESS.label}
        title={WEBSITE_BUILDING_PROCESS.title}
        align="start"
      >
        <ol className="wb-process-list">
          {WEBSITE_BUILDING_PROCESS.steps.map((step, index) => (
            <li key={step.title} className="wb-process-item">
              <span className="wb-process-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="wb-process-body">
                <h3 className="wb-process-title">{step.title}</h3>
                <p className="wb-process-text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        tone="sky"
        className="wb-section-deliverables"
        label={WEBSITE_BUILDING_DELIVERABLES.label}
        title={WEBSITE_BUILDING_DELIVERABLES.title}
        align="start"
      >
        <div className="wb-deliverables">
          {WEBSITE_BUILDING_DELIVERABLES.items.map((item) => (
            <article key={item.title} className="wb-deliverable-item">
              <h3 className="wb-deliverable-title">{item.title}</h3>
              <p className="wb-deliverable-text">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        tone="muted"
        className="wb-section-foundations"
        label={WEBSITE_BUILDING_FOUNDATIONS.label}
        title={WEBSITE_BUILDING_FOUNDATIONS.title}
        align="start"
      >
        <p className="wb-body-lead wb-body-lead--narrow">{WEBSITE_BUILDING_FOUNDATIONS.intro}</p>
        <div className="wb-pillars">
          {WEBSITE_BUILDING_FOUNDATIONS.pillars.map((pillar) => (
            <article key={pillar.title} className="wb-pillar">
              <p className="wb-pillar-label">{pillar.title}</p>
              <p className="wb-pillar-text">{pillar.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        tone="dark"
        className="wb-mid-cta-section"
        label="לפני שממשיכים"
        title="רוצים לבדוק אם האתר הנוכחי שלכם משרת את העסק?"
        align="start"
      >
        <div className="wb-mid-cta-panel">
          <p className="wb-mid-cta-text">
            נשמח לשמוע על המטרות, להבין את המצב הקיים ולהציע כיוון ברור — ללא התחייבות.
          </p>
          <WebsiteBuildingMidCta />
        </div>
      </Section>

      {guides.length > 0 && (
        <Section tone="white" className="wb-section-guides" label="מדריכים" title="מדריכים לבניית אתר" align="start">
          <ul className="wb-guides-grid">
            {guides.map((post) => (
              <li key={post.path}>
                <Link href={post.path} className="wb-guide-card">
                  <span className="wb-guide-kicker">מדריך</span>
                  <span className="wb-guide-title">{post.title.replace(/&#8211;|&amp;#8211;/g, "–")}</span>
                  <span className="wb-guide-arrow" aria-hidden="true">
                    ←
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section tone="sky" className="wb-section-faq" title="שאלות נפוצות על בניית אתרים" align="start">
        <div className="wb-faq-list">
          {WEBSITE_BUILDING_FAQ.map((item) => (
            <details key={item.q} className="faq-item wb-faq-item">
              <summary className="wb-faq-q">{item.q}</summary>
              <div className="faq-answer wb-faq-a">{item.a}</div>
            </details>
          ))}
        </div>
      </Section>

      <Section tone="white" className="wb-section-related" title="שירותים משלימים" align="start">
        <ul className="wb-related-services">
          {WEBSITE_BUILDING_RELATED_SERVICES.map((service) => (
            <li key={service.href}>
              <Link href={service.href} className="wb-related-service-link">
                <span className="wb-related-service-title">{service.title}</span>
                <span className="wb-related-service-text">{service.text}</span>
                <span className="wb-related-service-arrow" aria-hidden="true">
                  ←
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tone="gradient"
        className="wb-final-cta-section"
        label={WEBSITE_BUILDING_FINAL_CTA.eyebrow}
        title={WEBSITE_BUILDING_FINAL_CTA.title}
      >
        <div className="wb-final-cta">
          <p className="wb-final-cta-body">{WEBSITE_BUILDING_FINAL_CTA.body}</p>
          <p className="wb-final-cta-note">
            <em>{WEBSITE_BUILDING_FINAL_CTA.note}</em>
          </p>
          <WebsiteBuildingFinalCtas />
        </div>
      </Section>

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
