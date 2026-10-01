import { ContextualPopupRegistrar } from "@/components/popups/ContextualPopupRegistrar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { getServicePopupConfig } from "@/lib/popups/service-pages";
import type { ServicePageContent, ServiceSection } from "@/lib/pages/services/types";
import { sectionHasContent } from "@/lib/pages/services/types";
import { PageImage } from "./PageImage";
import { RichText } from "./RichText";

type VerifiedServicePageProps = {
  content: ServicePageContent;
};

const TONES = ["white", "sky", "muted", "gradient"] as const;

function splitRatio(section: ServiceSection) {
  const text = [
    ...(section.paragraphs ?? []),
    section.html?.replace(/<[^>]+>/g, " ") ?? "",
    ...(section.list ?? []),
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length < 240) return "split-modest";
  if (text.length > 520) return "split-copy-wide";
  return "split-balanced";
}

function ServiceSectionView({
  section,
  index,
  usedImages,
}: {
  section: ServiceSection;
  index: number;
  usedImages: Set<string>;
}) {
  if (!sectionHasContent(section)) return null;

  const tone = TONES[index % TONES.length];
  const image =
    section.image && !usedImages.has(section.image.src)
      ? section.image
      : undefined;

  if (image) usedImages.add(image.src);

  const layout = section.layout ?? (image ? "split" : "default");
  const showSplit = Boolean(image) && layout !== "cards" && layout !== "list-only" && layout !== "steps";
  const reverseSplit = showSplit && index % 2 === 1;
  const ratio = splitRatio(section);
  const wideStack = Boolean(section.cards?.length || section.steps?.length || (section.list && section.list.length > 3));

  return (
    <Section tone={tone} label={section.eyebrow} title={section.heading}>
      <div
        className={
          showSplit
            ? `service-split-grid ${ratio} ${reverseSplit ? "service-split-grid-reverse" : ""}`
            : ""
        }
      >
        <div className={showSplit ? "service-split-content" : wideStack ? "service-stack-wide" : "service-stack"}>
          {section.html && <RichText html={section.html} />}
          {section.paragraphs?.map((p) => (
            <p key={p.slice(0, 40)} className="about-lead mb-4">
              {p}
            </p>
          ))}
          {section.list && (
            <ul className="service-check-list">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.steps && (
            <ol className="service-steps-list">
              {section.steps.map((step) => (
                <li key={step.title} className="service-step-item">
                  <h3 className="service-step-title">{step.title}</h3>
                  <p className="service-step-text">{step.text}</p>
                </li>
              ))}
            </ol>
          )}
          {section.cards && (
            <div className="service-cards-grid">
              {section.cards.map((card) => (
                <Card key={card.title} className="service-benefit-card">
                  <h3 className="service-benefit-title">{card.title}</h3>
                  <p className="service-benefit-text">{card.text}</p>
                </Card>
              ))}
            </div>
          )}
          {section.faq && (
            <div className="service-faq-list">
              {section.faq.map((item) => (
                <details key={item.q} className="faq-item service-faq-item">
                  <summary className="service-faq-q">{item.q}</summary>
                  <div className="faq-answer service-faq-a">{item.a}</div>
                </details>
              ))}
            </div>
          )}
          {section.cta && (
            <div className="mt-6">
              <Button href={section.cta.href} variant={section.cta.variant ?? "outline"}>
                {section.cta.text}
              </Button>
            </div>
          )}
        </div>
        {showSplit && image && (
          <div className="service-media-card">
            <PageImage src={image.src} alt={image.alt} width={560} height={420} />
          </div>
        )}
      </div>
      {layout === "steps" && image && (
        <div className="service-media-card mt-8 max-w-xl">
          <PageImage src={image.src} alt={image.alt} width={520} height={400} />
        </div>
      )}
    </Section>
  );
}

export function VerifiedServicePage({ content }: VerifiedServicePageProps) {
  const usedImages = new Set<string>();
  if (content.hero.image) usedImages.add(content.hero.image.src);

  const sections = content.sections.filter(sectionHasContent);
  const popupConfig = getServicePopupConfig(content.path, content.title);

  return (
    <article className="structured-page service-page verified-service-page">
      <PageHero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        image={content.hero.image?.src}
        imageAlt={content.hero.image?.alt ?? content.hero.title}
      >
        {content.hero.ctas && content.hero.ctas.length > 0 && (
          <div className="page-hero-actions mt-6 flex flex-wrap gap-3">
            {content.hero.ctas.map((cta) => (
              <Button
                key={cta.text}
                href={cta.href}
                size="lg"
                variant={cta.variant ?? "primary"}
              >
                {cta.text}
              </Button>
            ))}
          </div>
        )}
      </PageHero>

      {sections.map((section, index) => (
        <ServiceSectionView
          key={`${section.heading}-${index}`}
          section={section}
          index={index}
          usedImages={usedImages}
        />
      ))}

      {content.finalCta && (
        <Section tone="gradient" label={content.finalCta.eyebrow} title={content.finalCta.heading}>
          <div className="service-cta-panel text-center">
            {content.finalCta.html && <RichText html={content.finalCta.html} />}
            {content.finalCta.paragraphs?.map((p) => (
              <p key={p.slice(0, 40)} className="text-lg text-slate-700">
                {p}
              </p>
            ))}
            {content.finalCta.ctas && (
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {content.finalCta.ctas.map((cta) => (
                  <Button key={cta.text} href={cta.href} size="lg" variant={cta.variant ?? "primary"}>
                    {cta.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Section>
      )}

      {popupConfig && <ContextualPopupRegistrar config={popupConfig} />}
    </article>
  );
}
