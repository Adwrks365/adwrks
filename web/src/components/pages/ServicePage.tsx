import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import type { ExtractedPage, PageSection } from "@/lib/content/elementor-extract";
import { getHeroFromBlocks, groupBlocksIntoSections } from "@/lib/content/elementor-extract";
import { SITE } from "@/lib/site";
import { PageImage } from "./PageImage";
import { RichText } from "./RichText";

type ServicePageProps = {
  data: ExtractedPage;
};

function normalizeButtonUrl(url: string): string {
  if (!url) return "/contact-us/";
  if (url.startsWith("tel:") || url.startsWith("mailto:")) return url;
  if (url.startsWith("#")) return url;
  try {
    const u = new URL(url);
    return u.pathname.endsWith("/") ? u.pathname : `${u.pathname}/`;
  } catch {
    return url;
  }
}

function ServiceSectionBlock({
  section,
  index,
}: {
  section: PageSection;
  index: number;
}) {
  const tone = index % 2 === 0 ? "white" : "muted";
  const primaryImage = section.images[0];
  const hasImage = Boolean(primaryImage);
  const textLength = [...section.htmlParagraphs, ...section.lists.flat()]
    .join(" ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;
  const ratio = textLength < 240 ? "split-modest" : textLength > 520 ? "split-copy-wide" : "split-balanced";
  const wideStack = section.lists.some((items) => items.length > 3) || section.faq.length > 0;

  return (
    <Section
      id={section.title ? undefined : undefined}
      tone={tone as "white" | "muted"}
      label={section.label}
      title={section.title}
    >
      <div className={hasImage ? `service-split-grid ${ratio} ${index % 2 === 1 ? "service-split-grid-reverse" : ""}` : ""}>
        <div className={hasImage ? "service-split-content" : wideStack ? "service-stack-wide" : "service-stack"}>
          {section.htmlParagraphs.map((html) => (
            <RichText key={html.slice(0, 48)} html={html} />
          ))}
          {section.lists.map((items, i) => (
            <ul key={i} className="service-check-list">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ))}
          {section.buttons.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {section.buttons.map((btn) => (
                <Button
                  key={btn.text}
                  href={normalizeButtonUrl(btn.url)}
                  variant={btn.url.startsWith("tel:") ? "primary" : "outline"}
                  external={btn.url.startsWith("http") && !btn.url.includes("adwrks.co.il")}
                >
                  {btn.text}
                </Button>
              ))}
            </div>
          )}
        </div>
        {primaryImage && (
          <div className="service-media-card">
            <PageImage
              src={primaryImage.url}
              alt={primaryImage.alt || section.title || ""}
              width={560}
              height={420}
            />
          </div>
        )}
      </div>

      {section.faq.length > 0 && (
        <div className="service-faq mt-10">
          <h3 className="service-faq-title">שאלות נפוצות</h3>
          <div className="service-faq-list">
            {section.faq.map((item) => (
              <Card key={item.q} className="service-faq-item">
                <h4 className="service-faq-q">{item.q}</h4>
                <p className="service-faq-a">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

export function ServicePage({ data }: ServicePageProps) {
  const hero = getHeroFromBlocks(data.blocks);
  const sections = groupBlocksIntoSections(data.blocks);

  return (
    <article className="structured-page service-page">
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        image={hero.image?.url}
        imageAlt={hero.title}
      >
        {hero.introHtml && <RichText html={hero.introHtml} className="page-hero-intro" />}
        {hero.buttons.length > 0 && (
          <div className="page-hero-actions mt-6 flex flex-wrap gap-3">
            {hero.buttons.slice(0, 2).map((btn) => (
              <Button
                key={btn.text}
                href={normalizeButtonUrl(btn.url)}
                size="lg"
                variant={btn.url.startsWith("tel:") ? "primary" : "outline"}
              >
                {btn.text}
              </Button>
            ))}
          </div>
        )}
      </PageHero>

      {sections.map((section, index) => (
        <ServiceSectionBlock key={`${section.title}-${index}`} section={section} index={index} />
      ))}

      <Section tone="accent" title="מוכנים להתקדם?" subtitle="שיחת ייעוץ קצרה, ללא התחייבות">
        <div className="service-cta-panel text-center">
          <p className="text-lg text-slate-700">
            נשמח לבדוק יחד את הצרכים שלכם ולהציע את הדרך הנכונה לקידום העסק בדיגיטל.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/contact-us/" size="lg">
              צרו קשר לייעוץ חינם
            </Button>
            <Button href={SITE.phoneTel} variant="outline" size="lg">
              {SITE.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </article>
  );
}
