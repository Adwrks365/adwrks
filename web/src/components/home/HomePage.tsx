import { ContactForm } from "@/components/ContactForm";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeAiSearch } from "@/components/home/HomeAiSearch";
import { HomeEnvelope360 } from "@/components/home/HomeEnvelope360";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeKnowledgeHub } from "@/components/home/HomeKnowledgeHub";
import { HomeMidCta } from "@/components/home/HomeMidCta";
import { HomePlatformMarquee } from "@/components/home/HomePlatformMarquee";
import { HomeSeoAuthority } from "@/components/home/HomeSeoAuthority";
import { HomeServiceOverview } from "@/components/home/HomeServiceOverview";
import { HomeSocialProof } from "@/components/home/HomeSocialProof";
import { HomeStats } from "@/components/home/HomeStats";
import { HomeStrategicPartner } from "@/components/home/HomeStrategicPartner";
import { HomeVision } from "@/components/home/HomeVision";
import { PortfolioShowcase } from "@/components/portfolio/PortfolioShowcase";
import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getHomepageData } from "@/lib/homepage";
import { getHomepagePopupConfig } from "@/lib/popups/homepage";
import type { LocaleProps } from "@/lib/locale-props";
import { getSiteConfig } from "@/lib/site";

export function HomePage({ locale = "he" }: LocaleProps) {
  const site = getSiteConfig(locale);
  const hp = getHomepageData(locale);
  const homePath = locale === "en" ? "/en/" : "/";

  return (
    <div className="homepage homepage-v2">
      <ContextualPopupRegistrar config={getHomepagePopupConfig(locale)} />

      <HomeHero locale={locale} />
      <HomeAiSearch locale={locale} />
      <HomeStats locale={locale} />
      <HomePlatformMarquee locale={locale} />
      <HomeVision locale={locale} />
      <HomeAbout locale={locale} />
      <HomeEnvelope360 locale={locale} />
      <HomeServiceOverview locale={locale} />
      <HomeMidCta locale={locale} />
      <HomeStrategicPartner locale={locale} />
      <HomeSocialProof locale={locale} />

      <Section
        id="portfolio"
        tone="muted"
        label={locale === "en" ? "Sites we build & promote" : "אתרים שבנינו ומקדמים"}
        title={locale === "en" ? "Real projects — not just promises" : "דוגמאות מהשטח — לא רק הבטחות"}
        subtitle={
          locale === "en"
            ? "Real client projects we build and market."
            : "פרויקטים אמיתיים שאנחנו בונים ומקדמים — מקומי, מקצועי ומערכות."
        }
      >
        <div className="reveal">
          <PortfolioShowcase variant="compact" locale={locale} />
        </div>
      </Section>

      <Section
        id="faq"
        tone="muted"
        label={locale === "en" ? "FAQ" : "כל מה שרצית לדעת"}
        title={locale === "en" ? "Frequently asked questions" : "שאלות ותשובות נפוצות"}
        narrow
      >
        <div className="faq-list reveal">
          {hp.HOMEPAGE_FAQ.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <div className="faq-answer">{item.answer}</div>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">{hp.HOMEPAGE_FAQ_AUTHORITY}</p>
      </Section>

      <HomeSeoAuthority locale={locale} />
      <HomeKnowledgeHub locale={locale} />

      <section className="section section-tone-accent home-final-contact" aria-labelledby="home-contact-heading">
        <Container narrow>
          <header className="home-section-header reveal">
            <p className="home-section-label">{locale === "en" ? "Contact" : "יצירת קשר"}</p>
            <h2 id="home-contact-heading" className="home-section-title">
              {locale === "en" ? "Ready to get started?" : "מוכנים להתחיל?"}
            </h2>
            <p className="home-section-lead">
              {locale === "en"
                ? "Leave your details and an expert will get back to you soon."
                : "השאירו פרטים ומומחה יחזור אליכם בהקדם."}
            </p>
          </header>
          <div className="home-final-contact-grid reveal">
            <ul className="home-contact-facts">
              <li>
                <a href={site.phoneTel}>{site.phoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            </ul>
            <div className="home-contact-card">
              <ContactForm
                variant="compact"
                formId="homepage-contact"
                pageTitle={site.tagline}
                pagePath={homePath}
                locale={locale}
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
