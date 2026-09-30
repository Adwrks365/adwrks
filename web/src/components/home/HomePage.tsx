import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PortfolioCarousel } from "@/components/home/PortfolioCarousel";
import { StatCounters } from "@/components/home/StatCounters";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { getAllPosts } from "@/lib/content/loader";
import {
  HOMEPAGE_COUNTERS,
  HOMEPAGE_FAQ,
  HOMEPAGE_FAQ_AUTHORITY,
  HOMEPAGE_IMAGES,
  HOMEPAGE_PLATFORM_LOGOS,
  HOMEPAGE_PORTFOLIO,
  HOMEPAGE_RESULT_QUOTES,
  HOMEPAGE_SERVICE_LIST,
  HOMEPAGE_TESTIMONIALS,
  HOMEPAGE_VALUE_CARDS,
} from "@/lib/homepage/data";
import { SITE } from "@/lib/site";

function platformLogoClass(alt: string) {
  if (alt === "Facebook" || alt === "Instagram" || alt === "YouTube" || alt === "Gemini") {
    return "platform-marquee-logo is-icon";
  }
  if (alt === "WordPress") return "platform-marquee-logo is-wide";
  return "platform-marquee-logo is-word";
}

function CheckList({
  items,
}: {
  items: readonly { text: string; href?: string }[];
}) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.text} className="flex items-start gap-2 text-sm md:text-base">
          <span className="mt-0.5 shrink-0 font-bold text-sky-600" aria-hidden="true">
            ✓
          </span>
          {item.href ? (
            <Link href={item.href} className="text-slate-700 hover:text-sky-700 hover:underline">
              {item.text}
            </Link>
          ) : (
            <span className="text-slate-700">{item.text}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="homepage">
      {/* Premium light hero */}
      <section className="home-hero-premium reveal">
        <Container>
          <div className="home-hero-grid">
            <div className="text-center lg:text-start">
              <p className="home-hero-badge">סוכנות שיווק דיגיטלי • מאז 2018</p>
              <h1 className="home-hero-title text-slate-900">
                <span className="home-hero-highlight">סוכנות שיווק דיגיטלי</span>
              </h1>
              <p className="home-hero-lead">
                בונים לכם נוכחות דיגיטלית שמביאה{" "}
                <strong className="text-sky-700">תוצאות</strong>. סוכנות שיווק (מעטפת 360°)
                המתמחה בביסוס סמכות דיגיטלית מבוססת AI ו-ROI.
              </p>
              <p className="mt-3 text-base text-slate-600">
                מומחים בבניית אתרים, ניהול קמפיינים ממומנים (PPC) וקידום אורגני (SEO/AIO).
              </p>
              <div className="home-hero-actions justify-center lg:justify-start">
                <Button href={SITE.phoneTel} size="lg">
                  דברו עם מומחה עכשיו
                </Button>
                <Button href="#we-offer" variant="outline" size="lg">
                  מדברים בתוצאות
                </Button>
              </div>
            </div>
            <div className="home-hero-visual">
              <div className="home-hero-visual-glow" aria-hidden="true" />
              <Image
                src={HOMEPAGE_IMAGES.heroPhoto}
                alt={HOMEPAGE_IMAGES.heroPhotoAlt}
                width={560}
                height={560}
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="mx-auto max-w-md lg:max-w-none"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* AI Search banner */}
      <Section tone="gradient" narrow className="!py-10 md:!py-12">
        <div className="reveal text-center">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            אנחנו מכינים את העסק שלך לעידן ה-AI Search
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            האם האתר שלך יופיע בתשובות של גוגל ב-2026? הצטרפו למהפכת ה-AIO (אופטימיזציה לבינה
            מלאכותית) עם Adwrks 365
          </p>
        </div>
      </Section>

      {/* Statistics */}
      <Section tone="muted" className="!py-10 md:!py-12">
        <StatCounters items={HOMEPAGE_COUNTERS} />
      </Section>

      {/* Digital ecosystem / tools & platforms */}
      <Section
        tone="white"
        className="!py-10 md:!py-12"
        title="עובדים עם הכלים והפלטפורמות המובילים בדיגיטל"
        subtitle="ערוצי שיווק, מערכות ניהול תוכן וכלי AI — במעטפת אחת מותאמת לעסק"
      >
        <div className="platform-marquee reveal" aria-label="כלים ופלטפורמות">
          <div className="platform-marquee-track">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="platform-marquee-set"
                aria-hidden={copy === 1 ? true : undefined}
              >
                {HOMEPAGE_PLATFORM_LOGOS.map((logo) => (
                  <li key={`${copy}-${logo.src}`} className="platform-marquee-item">
                    <Image
                      src={logo.src}
                      alt={copy === 0 ? logo.alt : ""}
                      width={140}
                      height={56}
                      loading="lazy"
                      sizes="140px"
                      className={platformLogoClass(logo.alt)}
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Section>

      {/* Vision */}
      <Section tone="gradient">
        <Card className="home-vision-card reveal border-sky-100 bg-gradient-to-l from-sky-50/80 to-white">
          <p className="home-vision-kicker">AIO · SEO · PPC</p>
          <h2 className="text-lg font-bold text-slate-900 md:text-xl">החזון הטכנולוגי שלנו ל-2026</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            כסוכנות בוטיק לאסטרטגיה דיגיטלית, <strong>Adwrks 365</strong> מתווה את הדרך בתחום
            ה-<strong>AIO (AI Optimization)</strong>. אנו משלבים כלי בינה מלאכותית מתקדמים
            באסטרטגיות <strong>SEO</strong> ו-<strong>PPC</strong> כדי להעניק ללקוחותינו יתרון
            תחרותי ממשי. המומחיות שלנו היא הנגשת עסקים לחיפוש סמנטי ובניית סמכות דיגיטלית מבוססת{" "}
            <strong>E-E-A-T</strong>, המותאמת במדויק למנועי החיפוש וה-AI של שנת 2026.
          </p>
          <div className="mt-6">
            <Button href="#recommendations" variant="outline">
              לקוחות ממליצים
            </Button>
          </div>
        </Card>
      </Section>

      {/* Authority / services */}
      <Section
        id="about"
        tone="muted"
        label="שותפים מוסמכים של Facebook & Google"
        title="סוכנות בוטיק לאסטרטגיה וצמיחה דיגיטלית"
        subtitle="מבססים את הסמכות הדיגיטלית שלך בעידן ה-AI"
      >
        <div className="home-split reveal-group">
          <div className="reveal">
            <p className="leading-relaxed text-slate-600">
              סוכנות <strong>Adwrks 365</strong> מלווה עסקים וחברות מאז 2018 בדרך להצלחה דיגיטלית
              מדידה. אנו מתמחים ביצירת נוכחות עוצמתית המשלבת אסטרטגיה חכמה, טכנולוגיה מתקדמת
              וקריאייטיב מנצח. אנו מחויבים למקצוענות ללא פשרות ולליווי אישי, תוך התאמת פתרונות
              שיווק מתקדמים הממוקדים ב-<strong>ROI</strong> ובצמיחה עסקית ארוכת טווח.
            </p>
            <div className="mt-6">
              <CheckList items={HOMEPAGE_SERVICE_LIST} />
            </div>
            <p className="home-trust-line">
              <a href={SITE.googlePartnerUrl} target="_blank" rel="noopener noreferrer">
                Google Partner
              </a>
              <span aria-hidden="true">·</span>
              <span>עובדים עם Google ו-Meta</span>
            </p>
          </div>
          <div className="home-split-media reveal">
            <Image
              src={HOMEPAGE_IMAGES.authorityPhoto}
              alt="צוות Adwrks 365 – סוכנות שיווק דיגיטלי"
              width={480}
              height={480}
              loading="lazy"
              sizes="(max-width: 768px) 90vw, 40vw"
              className="home-split-image"
            />
          </div>
        </div>
      </Section>

      {/* 360° envelope */}
      <Section
        tone="white"
        label="מעטפת אסטרטגית מקצה לקצה"
        title="מעטפת שיווק 360° מותאמת אישית"
      >
        <div className="home-split home-split-media-lead">
          <div className="home-split-media reveal">
            <Image
              src={HOMEPAGE_IMAGES.envelopePhoto}
              alt="מעטפת שיווק דיגיטלי 360 מעלות"
              width={480}
              height={480}
              loading="lazy"
              sizes="(max-width: 768px) 90vw, 40vw"
              className="home-split-image"
            />
          </div>
          <div className="reveal">
            <p className="leading-relaxed text-slate-600">
              אנו מאמינים שצמיחה אמיתית בישראל דורשת יותר מסתם &apos;קידום&apos; - היא דורשת הבנה
              עמוקה של הצרכן הישראלי. אנו משלבים טכנולוגיות פרסום מתקדמות עם מומחיות ייחודית
              בפנייה לקהלים מגוונים, כולל שליטה מלאה בשוק דוברי הרוסית והאנגלית בארץ. השילוב בין
              ליווי אישי צמוד לבין אופטימיזציה מבוססת תוצאות, מבטיח שהעסק שלכם יבלוט מעל כולם
              ויהפוך למותג מוביל, מבוקש ורווחי בכל קנה מידה.
            </p>
            <div className="mt-6">
              <Button href="/contact-us/">תיאום שיחת אבחון אסטרטגית</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Value cards / services */}
      <Section
        id="we-offer"
        tone="gradient"
        label="מבססים את השליטה שלכם בשוק הדיגיטלי"
        title="הערך האסטרטגי שמוביל את הלקוחות שלנו קדימה"
      >
        <div className="service-grid">
          {HOMEPAGE_VALUE_CARDS.map((card, i) => (
            <Card key={card.title} hover className="reveal">
              <span className="service-card-icon" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="service-card-title">{card.title}</h3>
              <p className="service-card-desc">{card.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <section className="section section-tone-muted home-contact-section">
        <Container>
          <div className="home-contact-grid">
            <div className="home-contact-copy">
              <p className="section-label">יצירת קשר</p>
              <h2 className="section-title home-contact-title">יש לכם שאלות?</h2>
              <p className="home-contact-lead">השאירו פרטים ומומחה יחזור אליכם</p>
              <ul className="home-contact-notes">
                <li>השאירו פרטים ומבטיחים לחזור אליכם בהקדם.</li>
                <li>המידע שלכם בטוח אצלנו ולא עובר הלאה.</li>
              </ul>
              <ul className="home-contact-facts">
                <li>
                  <a href={SITE.phoneTel}>{SITE.phoneDisplay}</a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </li>
              </ul>
            </div>
            <div className="home-contact-card">
              <ContactForm variant="compact" />
            </div>
          </div>
        </Container>
      </section>

      {/* Partners CTA – strategic dark section */}
      <Section
        tone="dark"
        label="השותפים שלכם לשלב הבא של העסק"
        title="Adwrks 365 המנוע מאחורי הסמכות הדיגיטלית שלכם"
        className="relative overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${HOMEPAGE_IMAGES.partnersOverlay})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
        <div className="relative reveal text-center">
          <p className="mx-auto max-w-2xl leading-relaxed text-slate-300">
            אנו לא רק סוכנות שיווק דיגיטלית, אנחנו לא רק סוכנות שיווק, אנו שותפים אסטרטגיים
            לצמיחה. השילוב הייחודי שלנו בין ניסיון מוכח מאז 2018 לבין טכנולוגיות ה-AI המתקדמות
            ביותר, מאפשר לנו לבנות עבורכם נוכחות דומיננטית שממירה גולשים ללקוחות.
          </p>
          <div className="mt-8">
            <Button href="/contact-us/" variant="secondary">
              תיאום שיחת אפיון אסטרטגית
            </Button>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section
        id="recommendations"
        tone="white"
        label="תקשיבו להם"
        title="מה הלקוחות אומרים עלינו"
      >
        <div className="reveal">
          <TestimonialCarousel items={HOMEPAGE_TESTIMONIALS} />
        </div>
        <p className="mt-6 text-center">
          <a
            href={SITE.googleReviewsUrl}
            className="home-reviews-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            צפו בכל הביקורות בגוגל
          </a>
        </p>
      </Section>

      <Section
        tone="muted"
        title="התוצאות מדברות בעד עצמן"
        subtitle="צמיחה אמיתית, עבודה מדויקת, שותפות לטווח ארוך."
      >
        <p className="mb-6 text-center text-sm text-slate-500">
          אנחנו לא מודדים הצלחה בלייקים – אלא בצמיחה אמיתית בעסק.
        </p>
        <div className="home-results-grid reveal">
          {HOMEPAGE_RESULT_QUOTES.map((quote) => (
            <blockquote key={quote.name} className="home-result-card">
              {"highlight" in quote && quote.highlight ? (
                <span className="home-result-badge">{quote.highlight}</span>
              ) : null}
              <p>{quote.content}</p>
              <footer>{quote.name}</footer>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* Portfolio */}
      <Section
        id="portfolio"
        tone="muted"
        label="אתרים מעוצבים להצלחה"
        title="דוגמאות לאתרים"
      >
        <div className="reveal">
          <PortfolioCarousel images={HOMEPAGE_PORTFOLIO} />
        </div>
        <div className="mt-10 text-center">
          <Button href="/contact-us/" variant="secondary">
            ייעוץ חינם ללא התחייבות
          </Button>
        </div>
      </Section>

      {/* FAQ */}
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

      {/* Results */}
      <Section
        tone="accent"
        label="Adwrks 365 - מאז 2018"
        title="שיווק דיגיטלי עם תוצאות"
        narrow
      >
        <div className="reveal space-y-4 text-start leading-relaxed text-slate-600">
          <p>
            מאז שנת 2018, אנחנו בחברת <strong>Adwrks 365</strong> מעניקים מעטפת{" "}
            <Link href="/שיווק-דיגיטלי-לעסקים/" className="text-sky-700 hover:underline">
              שיווק דיגיטלי
            </Link>{" "}
            מקיפה המשלבת חדשנות טכנולוגית עם ליווי אישי וצמוד. אנו מתמחים בבניית אסטרטגיה
            מותאמת אישית הכוללת בניית אתרים, קידום אורגני (SEO) ו
            <Link href="/google-ads/" className="text-sky-700 hover:underline">
              {" "}
              ניהול קמפיינים ממומנים
            </Link>{" "}
            ממוקדי ROI.
          </p>
          <p>
            הצוות שלנו גאה להעניק שירות מקצועי <strong>לעסקים בכל רחבי הארץ</strong> – מחברות
            וארגונים גדולים ועד לעסקים קטנים ובעלי מקצוע בכל תחום – תוך התאמת הפתרונות
            הדיגיטליים למטרות העסקיות של כל לקוח. אנו מספקים מעטפת שיווקית רחבה הכוללת בניית
            אתרים ודפי נחיתה אפקטיביים,{" "}
            <Link href="/seo/" className="text-sky-700 hover:underline">
              <strong>קידום אורגני (SEO)</strong>
            </Link>
            ,{" "}
            <Link href="/google-ads/" className="text-sky-700 hover:underline">
              <strong>ניהול קמפיינים ממומנים (PPC/SEM)</strong>
            </Link>{" "}
            בגוגל וברשתות החברתיות, וקידום ממוקד בגוגל מפות. לצד התמחותנו הייחודית בשיווק
            למגזר הרוסי, אנו מציעים שירותי תוכן וקריאייטיב בשפות{" "}
            <strong>עברית, רוסית ואנגלית</strong>, במטרה להפוך כל תקציב שיווק למנוע צמיחה
            רווחי – בשקיפות מלאה ובכל נקודה על המפה.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Button href={SITE.phoneTel}>התייעצו עם מומחה עכשיו</Button>
        </div>
      </Section>

      {/* Recent posts */}
      <Section id="blog" tone="white" label="הבלוג שלנו" title="מאמרים אחרונים">
        <div className="article-grid">
          {recentPosts.map((post) => (
            <ArticleCard key={post.path} post={post} />
          ))}
        </div>
      </Section>
    </div>
  );
}
