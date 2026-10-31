import type { Locale } from "@/i18n/routing";
import { Section } from "@/components/ui/Section";
import {
  caseStudiesForCategory,
  type CaseStudyCategory,
} from "@/lib/case-studies/registry";

type ServiceCaseStudySectionProps = {
  category: CaseStudyCategory;
  locale?: Locale;
};

const COPY = {
  he: {
    label: "מקרי בוחן",
    pendingTitle: "מקרי בוחן — בקרוב",
    pendingBody:
      "אנחנו מכינים מקרי בוחן עם נתונים מאומתים ואישור לקוח. עד לפרסום — נשמח לשתף דוגמאות רלוונטיות בשיחת ייעוץ.",
  },
  en: {
    label: "Case studies",
    pendingTitle: "Case studies — coming soon",
    pendingBody:
      "We are preparing case studies with verified data and client approval. Until publication, we can share relevant examples on a consultation call.",
  },
} as const;

export function ServiceCaseStudySection({ category, locale = "he" }: ServiceCaseStudySectionProps) {
  const records = caseStudiesForCategory(category);
  const published = records.filter((r) => r.status === "published" && r.title);
  const copy = COPY[locale === "en" ? "en" : "he"];

  if (published.length === 0) {
    return (
      <Section tone="muted" label={copy.label} title={copy.pendingTitle} align="start">
        <p className="sp-body-text sp-body-text--narrow">{copy.pendingBody}</p>
      </Section>
    );
  }

  return (
    <Section tone="muted" label={copy.label} title={published[0]!.title!} align="start">
      <div className="sp-benefits-editorial sp-benefits-editorial--two">
        {published.map((study) => (
          <article key={study.id} className="sp-benefit-editorial">
            {study.summary ? <p className="sp-benefit-text">{study.summary}</p> : null}
            {study.metrics?.length ? (
              <ul className="sp-check-list sp-check-list--compact">
                {study.metrics.map((m) => (
                  <li key={m.label}>
                    <strong>{m.label}:</strong> {m.value}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}
