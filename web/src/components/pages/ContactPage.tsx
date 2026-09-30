import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import type { ExtractedPage } from "@/lib/content/elementor-extract";
import { getHeroFromBlocks } from "@/lib/content/elementor-extract";
import { FOLLOW_SOCIAL, SITE } from "@/lib/site";
import { ContactIcon } from "@/components/ui/ContactIcon";
import { RichText } from "./RichText";

const ContactForm = dynamic(
  () => import("@/components/ContactForm").then((m) => m.ContactForm),
  { loading: () => <p className="text-sm text-slate-500">טוען טופס...</p> },
);

type ContactPageProps = {
  data: ExtractedPage;
};

const HOURS_HE: Record<string, string> = {
  Sunday: "ראשון",
  Monday: "שני",
  Tuesday: "שלישי",
  Wednesday: "רביעי",
  Thursday: "חמישי",
};

export function ContactPage({ data }: ContactPageProps) {
  const hero = getHeroFromBlocks(data.blocks);
  const detailBlocks = data.blocks.filter(
    (b) => b.type === "text" && b.text.length > 40 && !b.text.startsWith("יש לך שאלה"),
  );
  const privacyNote = data.blocks.find(
    (b) => b.type === "text" && b.text.includes("פרטים נשמרים"),
  );

  return (
    <article className="structured-page contact-page">
      <PageHero
        variant="centered"
        eyebrow="יצירת קשר"
        title={hero.title}
        subtitle="ספרו לנו על העסק, המטרות והאתגרים — ונחזור אליכם עם כיוון מקצועי מתאים."
        compact
      />

      <Section tone="muted">
        <div className="contact-grid">
          <div className="contact-methods">
            <h2 className="contact-section-title">דרכי יצירת קשר</h2>
            <div className="contact-cards">
              <Card className="contact-card card-hover">
                <ContactIcon type="phone" />
                <span className="contact-card-label">טלפון</span>
                <a href={SITE.phoneTel} className="contact-card-value">
                  {SITE.phoneDisplay}
                </a>
                <Button href={SITE.phoneTel} size="sm" className="mt-3">
                  התקשרו עכשיו
                </Button>
              </Card>

              <Card className="contact-card card-hover">
                <ContactIcon type="whatsapp" />
                <span className="contact-card-label">WhatsApp</span>
                <a href={SITE.whatsapp} className="contact-card-value" target="_blank" rel="noopener noreferrer">
                  שלחו הודעה
                </a>
                <Button href={SITE.whatsapp} size="sm" variant="outline" className="mt-3" external>
                  פתיחת WhatsApp
                </Button>
              </Card>

              <Card className="contact-card card-hover">
                <ContactIcon type="email" />
                <span className="contact-card-label">אימייל</span>
                <a href={`mailto:${SITE.email}`} className="contact-card-value">
                  {SITE.email}
                </a>
              </Card>

              <Card className="contact-card card-hover">
                <ContactIcon type="location" />
                <span className="contact-card-label">כתובת</span>
                <p className="contact-card-value">
                  {SITE.address.street}, {SITE.address.locality}
                  <br />
                  {SITE.address.region}, {SITE.address.country}
                </p>
              </Card>
            </div>

            <div className="contact-hours mt-8">
              <h3 className="contact-hours-title">שעות פעילות</h3>
              <ul className="contact-hours-list">
                {SITE.openingHours.map(({ day, hours }) => (
                  <li key={day}>
                    <span>{HOURS_HE[day] ?? day}</span>
                    <span>{hours.replace("-", " – ")}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="contact-social mt-8">
              <h3 className="contact-hours-title">עקבו אחרינו</h3>
              <div className="contact-social-links">
                {FOLLOW_SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="contact-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-form-panel">
            <h2 className="contact-section-title">טופס יצירת קשר</h2>
            <p className="mb-4 text-slate-600">
              יש לך שאלה / זקוק לייעוץ? אנו מצפים לשמוע ממך!
            </p>
            <ContactForm />
            {privacyNote?.type === "text" && (
              <p className="mt-4 text-sm text-slate-500">{privacyNote.text}</p>
            )}
          </div>
        </div>
      </Section>

      {detailBlocks.length > 0 && (
        <Section tone="white" title="מה תקבלו בשיחת הייעוץ הראשונה?">
          {detailBlocks.map((block) =>
            block.type === "text" ? (
              <RichText key={block.text.slice(0, 40)} html={block.html} />
            ) : null,
          )}
          <div className="mt-8 text-center">
            <Button href={SITE.phoneTel} size="lg">
              דברו עם מומחה עכשיו
            </Button>
          </div>
        </Section>
      )}

      <Section tone="gradient" narrow>
        <div className="contact-cta-banner text-center">
          <h2 className="text-2xl font-bold text-slate-900">מוכנים להתחיל?</h2>
          <p className="mt-3 text-slate-600">
            השיחה ללא התחייבות וללא עלות – המטרה היא להבין האם יש חיבור ומה הדרך הנכונה לקדם אתכם בדיגיטל.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href={SITE.phoneTel} size="lg">
              {SITE.phoneDisplay}
            </Button>
            <Button href={SITE.whatsapp} variant="outline" size="lg" external>
              WhatsApp
            </Button>
          </div>
          <p className="mt-4 text-sm">
            <Link href="/about-us/" className="text-sky-700 hover:underline">
              קראו עוד עלינו
            </Link>
          </p>
        </div>
      </Section>
    </article>
  );
}
