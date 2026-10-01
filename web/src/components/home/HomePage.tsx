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
import { HOMEPAGE_FAQ, HOMEPAGE_FAQ_AUTHORITY } from "@/lib/homepage/data";
import { getHomepagePopupConfig } from "@/lib/popups/homepage";
import { SITE } from "@/lib/site";

export function HomePage() {
  return (
    <div className="homepage homepage-v2">
      <ContextualPopupRegistrar config={getHomepagePopupConfig()} />

      <HomeHero />
      <HomeAiSearch />
      <HomeStats />
      <HomePlatformMarquee />
      <HomeVision />
      <HomeAbout />
      <HomeEnvelope360 />
      <HomeServiceOverview />
      <HomeMidCta />
      <HomeStrategicPartner />
      <HomeSocialProof />

      <Section
        id="portfolio"
        tone="muted"
        label="אתרים שבנינו ומקדמים"
        title="דוגמאות מהשטח — לא רק הבטחות"
        subtitle="פרויקטים אמיתיים שאנחנו בונים ומקדמים — מקומי, מקצועי ומערכות."
      >
        <div className="reveal">
          <PortfolioShowcase variant="compact" />
        </div>
      </Section>

      <Section id="faq" tone="muted" label="כל מה שרצית לדעת" title="שאלות ותשובות נפוצות" narrow>
        <div className="faq-list reveal">
          {HOMEPAGE_FAQ.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>{item.question}</summary>
              <div className="faq-answer">{item.answer}</div>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">{HOMEPAGE_FAQ_AUTHORITY}</p>
      </Section>

      <HomeSeoAuthority />
      <HomeKnowledgeHub />

      <section className="section section-tone-accent home-final-contact" aria-labelledby="home-contact-heading">
        <Container narrow>
          <header className="home-section-header reveal">
            <p className="home-section-label">יצירת קשר</p>
            <h2 id="home-contact-heading" className="home-section-title">
              מוכנים להתחיל?
            </h2>
            <p className="home-section-lead">השאירו פרטים ומומחה יחזור אליכם בהקדם.</p>
          </header>
          <div className="home-final-contact-grid reveal">
            <ul className="home-contact-facts">
              <li>
                <a href={SITE.phoneTel}>{SITE.phoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
            </ul>
            <div className="home-contact-card">
              <ContactForm
                variant="compact"
                formId="homepage-contact"
                pageTitle="סוכנות שיווק דיגיטלי"
                pagePath="/"
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
