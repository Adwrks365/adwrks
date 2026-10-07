import Link from "next/link";
import { CommercialFinalCta } from "@/components/commercial/CommercialFinalCta";
import { CommercialMidCta } from "@/components/commercial/CommercialMidCta";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { PortfolioShowcaseProgressive } from "@/components/portfolio/PortfolioShowcaseProgressive";
import { Section } from "@/components/ui/Section";
import { getAllPosts } from "@/lib/content/loader";
import { getWebsiteBuildingPageContent } from "@/lib/pages/services/get-locale-content";
import type { LocaleProps } from "@/lib/locale-props";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import { WebsiteBuildingHero } from "./WebsiteBuildingHero";
import { WebsiteBuildingMidCta } from "./WebsiteBuildingHeroCtas";

export function WebsiteBuildingServicePage({ locale = "he" }: LocaleProps) {
  const c = getWebsiteBuildingPageContent(locale);
  const popupConfig = getServicePopupConfig(c.WEBSITE_BUILDING_PATH, c.WEBSITE_BUILDING_HERO.title);
  const guides = c.WEBSITE_BUILDING_GUIDE_PATHS.flatMap((path) => {
    const post = getAllPosts(locale).find((p) => p.path === path);
    return post ? [post] : [];
  });
  const primaryCta = locale === "en" ? "Website consultation" : "ייעוץ לבניית אתר";

  return (
    <article className="wb-page structured-page service-page">
      <WebsiteBuildingHero locale={locale} />

      <Section
        tone="white"
        className="wb-section-outcomes"
        label={c.WEBSITE_BUILDING_OUTCOMES.label}
        title={c.WEBSITE_BUILDING_OUTCOMES.title}
        align="start"
      >
        <div className="wb-outcomes-grid">
          <div className="wb-outcomes-copy">
            <p className="wb-body-lead">{c.WEBSITE_BUILDING_OUTCOMES.intro}</p>
            <p className="wb-body-text">{c.WEBSITE_BUILDING_OUTCOMES.closing}</p>
          </div>
          <aside className="wb-outcomes-panel">
            <h3 className="wb-panel-title wb-panel-title--compact">
              {locale === "en" ? "What a professional site must include" : "מה אתר מקצועי חייב לכלול"}
            </h3>
            <ul className="wb-check-list wb-check-list--panel">
              {c.WEBSITE_BUILDING_OUTCOMES.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      <Section
        tone="sky"
        className="wb-section-planning"
        label={c.WEBSITE_BUILDING_PLANNING.label}
        title={c.WEBSITE_BUILDING_PLANNING.title}
        align="start"
      >
        <div className="wb-planning-grid">
          <div className="wb-planning-main">
            <p className="wb-body-lead">{c.WEBSITE_BUILDING_PLANNING.intro}</p>
            <ul className="wb-check-list">
              {c.WEBSITE_BUILDING_PLANNING.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <aside className="wb-audience-panel">
            <h3 className="wb-panel-title">{c.WEBSITE_BUILDING_PLANNING.audienceLabel}</h3>
            <ul className="wb-audience-list">
              {c.WEBSITE_BUILDING_PLANNING.audience.map((item) => (
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
        label={locale === "en" ? "Portfolio" : "תיק עבודות"}
        title={locale === "en" ? "Websites we built for businesses in Israel" : "אתרים שבנינו לעסקים בישראל"}
        subtitle={
          locale === "en"
            ? "Real examples from Adwrks 365 work — scroll to view all projects."
            : "דוגמאות אמיתיות מתוך העבודות של Adwrks 365 — גללו לצפייה בכל הפרויקטים."
        }
        align="start"
      >
        <PortfolioShowcaseProgressive />
      </Section>

      <Section
        tone="white"
        className="wb-section-process"
        label={c.WEBSITE_BUILDING_PROCESS.label}
        title={c.WEBSITE_BUILDING_PROCESS.title}
        align="start"
      >
        <ol className="wb-process-list">
          {c.WEBSITE_BUILDING_PROCESS.steps.map((step, index) => (
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
        label={c.WEBSITE_BUILDING_DELIVERABLES.label}
        title={c.WEBSITE_BUILDING_DELIVERABLES.title}
        align="start"
      >
        <div className="wb-deliverables">
          {c.WEBSITE_BUILDING_DELIVERABLES.items.map((item) => (
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
        label={c.WEBSITE_BUILDING_FOUNDATIONS.label}
        title={c.WEBSITE_BUILDING_FOUNDATIONS.title}
        align="start"
      >
        <p className="wb-body-lead wb-body-lead--narrow">{c.WEBSITE_BUILDING_FOUNDATIONS.intro}</p>
        <div className="wb-pillars">
          {c.WEBSITE_BUILDING_FOUNDATIONS.pillars.map((pillar) => (
            <article key={pillar.title} className="wb-pillar">
              <p className="wb-pillar-label">{pillar.title}</p>
              <p className="wb-pillar-text">{pillar.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <CommercialMidCta
        eyebrow={locale === "en" ? "Before you continue" : "לפני שממשיכים"}
        title={
          locale === "en"
            ? "Want to check if your current site serves the business?"
            : "רוצים לבדוק אם האתר הנוכחי שלכם משרת את העסק?"
        }
        body={
          locale === "en"
            ? "We'd love to hear your goals, understand the current state, and suggest a clear direction — no commitment."
            : "נשמח לשמוע על המטרות, להבין את המצב הקיים ולהציע כיוון ברור — ללא התחייבות."
        }
      >
        <WebsiteBuildingMidCta locale={locale} />
      </CommercialMidCta>

      {guides.length > 0 && (
        <Section
          tone="white"
          className="wb-section-guides"
          label={locale === "en" ? "Guides" : "מדריכים"}
          title={locale === "en" ? "Website building guides" : "מדריכים לבניית אתר"}
          align="start"
        >
          <ul className="wb-guides-grid">
            {guides.map((post) => (
              <li key={post.path}>
                <Link href={post.path} className="wb-guide-card">
                  <span className="wb-guide-kicker">{locale === "en" ? "Guide" : "מדריך"}</span>
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

      <Section
        tone="sky"
        className="wb-section-faq"
        title={locale === "en" ? "Website building FAQ" : "שאלות נפוצות על בניית אתרים"}
        align="start"
      >
        <div className="wb-faq-list">
          {c.WEBSITE_BUILDING_FAQ.map((item) => (
            <details key={item.q} className="faq-item wb-faq-item">
              <summary className="wb-faq-q">{item.q}</summary>
              <div className="faq-answer wb-faq-a">{item.a}</div>
            </details>
          ))}
        </div>
      </Section>

      <Section
        tone="white"
        className="wb-section-related"
        title={locale === "en" ? "Related services" : "שירותים משלימים"}
        align="start"
      >
        <ul className="wb-related-services">
          {c.WEBSITE_BUILDING_RELATED_SERVICES.map((service) => (
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

      <CommercialFinalCta
        eyebrow={c.WEBSITE_BUILDING_FINAL_CTA.eyebrow}
        title={c.WEBSITE_BUILDING_FINAL_CTA.title}
        body={c.WEBSITE_BUILDING_FINAL_CTA.body}
        note={c.WEBSITE_BUILDING_FINAL_CTA.note}
        primaryLabel={primaryCta}
      />

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
