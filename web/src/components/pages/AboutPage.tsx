import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import type { ExtractedPage } from "@/lib/content/elementor-extract";
import { getHeroFromBlocks } from "@/lib/content/elementor-extract";
import { HOMEPAGE_RESULT_QUOTES } from "@/lib/homepage/data";
import { SITE } from "@/lib/site";
import { PageImage } from "./PageImage";
import { RichText } from "./RichText";

/** Image-box copy from the live About Elementor page, dropped by the earlier extract. */
const ABOUT_GROWTH_POINTS = [
  {
    title: "מה אנחנו עושים בפועל",
    text: "אנחנו מעניקים מעטפת דיגיטלית מלאה הכוללת בניית אתרים, קידום אורגני (SEO), פרסום ממומן בגוגל וברשתות החברתיות, קידום מבוסס AI וניהול סושיאל. כל שירות נבנה כחלק מאסטרטגיה כוללת שמטרתה להגדיל לידים, מכירות ונוכחות מותגית.",
  },
  {
    title: "למי השירותים שלנו מתאימים",
    text: "שירותי שיווק דיגיטלי של Adwrks 365 מתאימים לעסקים קטנים, בינוניים וגדולים מכל התחומים – נותני שירותים, חנויות אונליין, חברות וארגונים. אנחנו לא עובדים לפי תבנית קבועה, אלא מתאימים את הפתרון לפי תחום, תקציב ומטרות העסק.",
  },
  {
    title: "איך אנחנו עובדים",
    text: "התהליך שלנו מבוסס על אבחון מדויק, בניית אסטרטגיה, ביצוע מקצועי ומדידה מתמדת. כל לקוח מקבל תכנית עבודה ברורה, שקיפות מלאה ופעולות שמבוססות על נתונים ולא על ניחושים.",
  },
  {
    title: "למה לבחור ב-Adwrks 365",
    text: "אנחנו משלבים ניסיון מעשי, חשיבה שיווקית והבנה טכנולוגית עמוקה. היתרון שלנו הוא ביכולת לחבר בין SEO, פרסום ממומן, תוכן ו-AI תחת קורת גג אחת – ולתרגם אותם לתוצאות עסקיות.",
  },
] as const;

function splitLessFit(html: string) {
  const marker = "הליווי שלנו פחות מתאים ל:";
  const idx = html.indexOf(marker);
  if (idx < 0) return null;
  const headingStart = html.lastIndexOf("<h3", idx);
  if (headingStart < 0) return null;
  const suitable = html.slice(0, headingStart);
  const rest = html.slice(headingStart);
  const quoteStart = rest.indexOf("<blockquote");
  if (quoteStart < 0) return { suitable, less: rest, close: "" };
  return { suitable, less: rest.slice(0, quoteStart), close: rest.slice(quoteStart) };
}

type AboutPageProps = {
  data: ExtractedPage;
};

function findBlockText(data: ExtractedPage, includes: string) {
  return data.blocks.find((b) => b.type === "text" && b.text.includes(includes));
}

function findBlockHeading(data: ExtractedPage, includes: string) {
  return data.blocks.find((b) => b.type === "heading" && b.text.includes(includes));
}

function findList(data: ExtractedPage) {
  return data.blocks.find((b) => b.type === "list");
}

function findImage(data: ExtractedPage, includes: string): Extract<ExtractedPage["blocks"][number], { type: "image" }> | undefined {
  const block = data.blocks.find((b) => b.type === "image" && b.url.includes(includes));
  return block?.type === "image" ? block : undefined;
}

export function AboutPage({ data }: AboutPageProps) {
  const hero = getHeroFromBlocks(data.blocks);
  const heroImage = hero.image ?? findImage(data, "31d94b57");
  const partnersImage = findImage(data, "google-meta-partners") ?? findImage(data, "meta-parners");
  const sideImage = findImage(data, "6-3.png");
  const servicesList = findList(data);
  const storyBlock = findBlockText(data, "מיכאל וינר");
  const fitBlock = findBlockText(data, "הליווי שלנו מתאים");
  const growthBlock = findBlockText(data, "מעטפת 360");
  const authorityBlock = findBlockText(data, "מעל ל-8 שנים");

  return (
    <article className="structured-page about-page">
      <PageHero
        eyebrow="מי אנחנו"
        title={hero.title}
        subtitle={hero.subtitle}
        image={heroImage ? heroImage.url : undefined}
        imageAlt="Adwrks 365 – סוכנות שיווק דיגיטלי"
      >
        {hero.introHtml && <RichText html={hero.introHtml} className="page-hero-intro" />}
        <div className="page-hero-actions mt-6 flex flex-wrap gap-3">
          <Button href="/contact-us/" size="lg">
            לתיאום שיחה קצרה
          </Button>
          <Button href="#story" variant="outline" size="lg">
            הסיפור שלנו
          </Button>
        </div>
      </PageHero>

      <Section tone="muted" label="שותפים מוסמכים של Google ו-Meta" title="סוכנות בוטיק לשיווק דיגיטלי">
        <div className="about-split-grid split-copy-wide">
          <div>
            <h3 className="about-subtitle">ליווי דיגיטלי מלא, במקום אחד</h3>
            <p className="about-lead">
              מאז 2018 אנחנו מלווים עסקים מכל הגדלים עם שיווק דיגיטלי מבוסס תהליך, נתונים ושקיפות.
              המודל הדיגיטלי המלא שלנו מאפשר עבודה יעילה, שירות אישי ומחירים אטרקטיביים – בלי פגישות
              פיזיות ובלי גורמי תיווך מיותרים.
            </p>
            {servicesList?.type === "list" && (
              <ul className="about-check-list about-check-list-grid">
                {servicesList.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
          {partnersImage && (
            <div className="about-media-card">
              <PageImage src={partnersImage.url} alt="Google ו-Meta Partners" width={480} height={360} />
            </div>
          )}
        </div>
      </Section>

      <Section tone="white" label="שירות אישי. תהליך מתמשך. תוצאות מדידות." title="ליווי שיווק דיגיטלי מלא לעסק">
        <div className="about-split-grid about-split-grid-reverse split-modest">
          <div>
            <p className="about-lead">
              ב-Adwrks 365 אנחנו מלווים עסקים משלב הבנת הצרכים ועד ניהול שוטף של הפעילות הדיגיטלית.
              העבודה מתבצעת במודל דיגיטלי מלא, עם חשיבה אסטרטגית, ניתוח נתונים והתאמות שוטפות – כדי
              לייצר צמיחה יציבה ולא רק תוצאות נקודתיות.
            </p>
            <Button href="/contact-us/" className="mt-5">
              לתיאום שיחה קצרה
            </Button>
          </div>
          {sideImage && (
            <div className="about-media-card">
              <PageImage src={sideImage.url} alt="ליווי שיווק דיגיטלי" width={480} height={360} />
            </div>
          )}
        </div>
      </Section>

      {storyBlock?.type === "text" && (
        <Section
          id="story"
          tone="gradient"
          label="המסע שלנו"
          title={
            (() => {
              const h = findBlockHeading(data, "מתוכן ויזואלי");
              return h?.type === "heading" ? h.text : "המסע שלנו – מתוכן ויזואלי למעטפת שיווקית מנצחת";
            })()
          }
        >
          <RichText html={storyBlock.html} className="about-prose" />
        </Section>
      )}

      <Section
        tone="white"
        title="התוצאות מדברות בעד עצמן"
        subtitle="צמיחה אמיתית, עבודה מדויקת, שותפות לטווח ארוך."
      >
        <p className="about-results-note">אנחנו לא מודדים הצלחה בלייקים – אלא בצמיחה אמיתית בעסק.</p>
        <div className="home-results-grid">
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
        <p className="about-results-cta">
          <a href={SITE.googleReviewsUrl} className="home-reviews-link" target="_blank" rel="noopener noreferrer">
            צפו בכל הביקורות בגוגל
          </a>
        </p>
      </Section>

      {fitBlock?.type === "text" && (
        <Section
          tone="sky"
          label="אנחנו עובדים עם עסקים בשלבים שונים — אבל לא עם כל אחד."
          title="למי הליווי שלנו מתאים (ולמי פחות)"
        >
          {(() => {
            const parts = splitLessFit(fitBlock.html);
            if (!parts) return <RichText html={fitBlock.html} />;
            return (
              <>
                <div className="about-fit-grid">
                  <div className="about-fit-panel">
                    <RichText html={parts.suitable} />
                  </div>
                  <div className="about-fit-panel about-fit-panel-muted">
                    <RichText html={parts.less} />
                  </div>
                </div>
                {parts.close ? <RichText html={parts.close} className="about-fit-close" /> : null}
              </>
            );
          })()}
          <div className="mt-6 text-center">
            <Button href="/contact-us/" size="lg">
              לתיאום שיחה קצרה
            </Button>
          </div>
        </Section>
      )}

      {(growthBlock?.type === "text" || authorityBlock?.type === "text") && (
        <Section
          tone="muted"
          label="ליווי שיווקי אסטרטגי לעסקים שרוצים לצמוח"
          title="כך אנחנו בונים מנוע צמיחה דיגיטלי לעסק"
        >
          <div className="about-growth-grid">
            {ABOUT_GROWTH_POINTS.map((point) => (
              <div key={point.title} className="about-growth-card">
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </div>
            ))}
          </div>
          {growthBlock?.type === "text" && <RichText html={growthBlock.html} className="about-growth-copy" />}
          {authorityBlock?.type === "text" && (
            <RichText html={authorityBlock.html} className="about-growth-copy" />
          )}
        </Section>
      )}

      <Section tone="accent" title="רוצה לבדוק אם אנחנו מתאימים?" subtitle="שיחה קצרה, בלי התחייבות">
        <div className="about-cta-panel">
          <p className="text-lg text-slate-700">
            נשמח לשמוע על העסק שלכם ולבדוק יחד אם יש התאמה לליווי של {SITE.name}.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/contact-us/" size="lg">
              צרו קשר
            </Button>
            <Button href={SITE.phoneTel} variant="outline" size="lg">
              {SITE.phoneDisplay}
            </Button>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            או כתבו לנו ב-
            <Link href={`mailto:${SITE.email}`} className="text-sky-700 hover:underline">
              {SITE.email}
            </Link>
          </p>
        </div>
      </Section>
    </article>
  );
}
