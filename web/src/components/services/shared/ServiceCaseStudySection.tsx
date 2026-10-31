import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/i18n/routing";
import { linkWithArrow } from "@/i18n/ui-arrows";
import { getPublishedCaseStudies, type CaseStudyCategory } from "@/lib/case-studies/registry";
import { t, type CaseStudyRecord } from "@/lib/case-studies/types";

type ServiceCaseStudySectionProps = {
  category: CaseStudyCategory;
  locale?: Locale;
};

const COPY = {
  he: {
    label: "מקרי בוחן",
    title: "דוגמאות מהשטח — נתונים מאומתים",
    pendingTitle: "מקרי בוחן — בקרוב",
    pendingBody:
      "אנחנו מכינים מקרי בוחן עם נתונים מאומתים ואישור לקוח. עד לפרסום — נשמח לשתף דוגמאות רלוונטיות בשיחת ייעוץ.",
    challenge: "אתגר",
    approach: "מה נעשה (בהתאם למידע מאומת)",
    outcome: "תוצאה והקשר",
    keywords: "ביטויים נבחרים (דוח מעקב)",
    limitations: "מגבלות המדידה",
    period: "טווח מדידה",
    source: "מקור הנתונים",
    cta: "הצעת מחיר",
    serviceLink: "לעמוד השירות",
    testimony: "עדות לקוח",
    adsData: "נתוני מערכת פרסום",
    adSets: "פירוט לפי סט מודעות",
  },
  en: {
    label: "Case studies",
    title: "Field examples — verified data",
    pendingTitle: "Case studies — coming soon",
    pendingBody:
      "We are preparing case studies with verified data and client approval. Until publication, we can share relevant examples on a consultation call.",
    challenge: "Challenge",
    approach: "What we did (verified scope)",
    outcome: "Outcome & context",
    keywords: "Selected queries (tracking report)",
    limitations: "Measurement limits",
    period: "Measurement period",
    source: "Data source",
    cta: "Get a quote",
    serviceLink: "Service page",
    testimony: "Client testimony",
    adsData: "Ad platform metrics",
    adSets: "Breakdown by ad set",
  },
} as const;

function CaseStudyCard({ study, locale }: { study: CaseStudyRecord; locale: Locale }) {
  const copy = COPY[locale === "en" ? "en" : "he"];
  const contactHref = locale === "en" ? "/en/contact-us/" : "/contact-us/";
  const serviceHref = t(study.serviceHref, locale);

  return (
    <article className="sp-case-study-card">
      <header className="sp-case-study-header">
        <p className="sp-case-study-kicker">{t(study.clientLabel, locale)}</p>
        <h3 className="sp-case-study-title">{t(study.title, locale)}</h3>
        <p className="sp-case-study-meta">
          <span>{t(study.industry, locale)}</span>
          {study.clientSiteUrl ? (
            <>
              {" · "}
              <a href={study.clientSiteUrl} target="_blank" rel="noopener noreferrer" className="sp-text-link">
                {study.clientSiteUrl.replace(/^https:\/\//, "")}
              </a>
            </>
          ) : null}
        </p>
        <p className="sp-case-study-services">{t(study.services, locale)}</p>
      </header>

      {study.portfolioImage ? (
        <figure className="sp-case-study-media">
          <Image
            src={study.portfolioImage}
            alt={study.portfolioImageAlt ? t(study.portfolioImageAlt, locale) : ""}
            width={960}
            height={540}
            className="sp-case-study-img"
            loading="lazy"
          />
        </figure>
      ) : null}

      {study.highlightMetrics.length > 0 ? (
        <dl className="sp-case-study-metrics">
          {study.highlightMetrics.map((m) => (
            <div key={t(m.label, locale)} className="sp-case-study-metric">
              <dt>{t(m.label, locale)}</dt>
              <dd>{t(m.value, locale)}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="sp-case-study-body">
        <p>
          <strong>{copy.period}:</strong> {t(study.measurementPeriod, locale)}
        </p>
        <p>
          <strong>{copy.source}:</strong> {t(study.dataSource, locale)}
        </p>
        <p>
          <strong>{copy.challenge}:</strong> {t(study.challenge, locale)}
        </p>
        <p>
          <strong>{copy.approach}:</strong> {t(study.approach, locale)}
        </p>
        <p>
          <strong>{copy.outcome}:</strong> {t(study.outcome, locale)}
        </p>

        {study.keywordRanks?.length ? (
          <div className="sp-case-study-keywords">
            <p className="sp-case-study-keywords-title">{copy.keywords}</p>
            <ul className="sp-case-study-kw-list">
              {study.keywordRanks.map((kw) => (
                <li key={kw.phrase}>
                  «{kw.phrase}» — {locale === "en" ? "position" : "מקום"} {kw.rank}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {study.testimony ? (
          <blockquote className="sp-case-study-testimony">
            <p className="sp-case-study-testimony-label">{copy.testimony}</p>
            <p className="sp-case-study-quote">{t(study.testimony.quote, locale)}</p>
            <footer>{t(study.testimony.attribution, locale)}</footer>
          </blockquote>
        ) : null}

        {study.adsSnapshot ? (
          <div className="sp-case-study-ads">
            <p className="sp-case-study-ads-title">{t(study.adsSnapshot.title, locale)}</p>
            <p className="sp-case-study-ads-period">
              {t(study.adsSnapshot.period, locale)} · {t(study.adsSnapshot.sourceLabel, locale)}
            </p>
            <dl className="sp-case-study-metrics sp-case-study-metrics--compact">
              {study.adsSnapshot.metrics.map((m) => (
                <div key={t(m.label, locale)} className="sp-case-study-metric">
                  <dt>{t(m.label, locale)}</dt>
                  <dd>{t(m.value, locale)}</dd>
                </div>
              ))}
            </dl>
            <p className="sp-case-study-disclaimer">{t(study.adsSnapshot.disclaimer, locale)}</p>
          </div>
        ) : null}

        {study.metaAdSets?.length ? (
          <div className="sp-case-study-adsets">
            <p className="sp-case-study-adsets-title">{copy.adSets}</p>
            <div className="sp-case-study-adsets-grid">
              {study.metaAdSets.map((set) => (
                <div key={t(set.label, locale)} className="sp-case-study-adset">
                  <p className="sp-case-study-adset-label">{t(set.label, locale)}</p>
                  <ul className="sp-check-list sp-check-list--compact">
                    {set.metrics.map((m) => (
                      <li key={t(m.label, locale)}>
                        <strong>{t(m.label, locale)}:</strong> {t(m.value, locale)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <p className="sp-case-study-limitations">
          <strong>{copy.limitations}:</strong> {t(study.limitations, locale)}
        </p>
      </div>

      <div className="sp-case-study-actions">
        <Button href={contactHref} size="md">
          {copy.cta}
        </Button>
        <Link href={serviceHref} className="sp-text-link">
          {linkWithArrow(locale, copy.serviceLink)}
        </Link>
      </div>
    </article>
  );
}

export function ServiceCaseStudySection({ category, locale = "he" }: ServiceCaseStudySectionProps) {
  const published = getPublishedCaseStudies(category);
  const copy = COPY[locale === "en" ? "en" : "he"];

  if (published.length === 0) {
    return (
      <Section tone="muted" label={copy.label} title={copy.pendingTitle} align="start">
        <p className="sp-body-text sp-body-text--narrow">{copy.pendingBody}</p>
      </Section>
    );
  }

  return (
    <Section tone="muted" label={copy.label} title={copy.title} align="start" className="sp-section-case-studies">
      <div className="sp-case-study-list">
        {published.map((study) => (
          <CaseStudyCard key={study.id} study={study} locale={locale} />
        ))}
      </div>
    </Section>
  );
}
