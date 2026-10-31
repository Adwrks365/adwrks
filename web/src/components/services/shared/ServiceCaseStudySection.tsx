import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/i18n/routing";
import { getPublishedCaseStudies, type CaseStudyCategory } from "@/lib/case-studies/registry";
import { t, type CaseStudyRecord } from "@/lib/case-studies/types";
import { CaseStudyMetricValue } from "./case-study-metric-value";

type ServiceCaseStudySectionProps = {
  category: CaseStudyCategory;
  locale?: Locale;
};

const COPY = {
  he: {
    label: "מקרי בוחן",
    title: "הוכחות מהשטח",
    pendingTitle: "מקרי בוחן — בקרוב",
    pendingBody:
      "אנחנו מכינים מקרי בוחן עם נתונים מאומתים ואישור לקוח. עד לפרסום — נשמח לשתף דוגמאות רלוונטיות בשיחת ייעוץ.",
    sectionLead: "דוגמאות אמיתיות עם נתונים מאומתים — בלי הבטחות לתוצאות עתידיות.",
    detailsToggle: "לנתונים המלאים",
    challenge: "אתגר",
    approach: "מה נעשה",
    outcome: "תוצאה והקשר",
    keywords: "ביטויים נבחרים (דוח מעקב)",
    period: "טווח מדידה",
    source: "מקור הנתונים",
    cta: "רוצים תוצאות לעסק שלכם? קבלו הצעה",
    testimony: "עדות לקוח",
    adSets: "פירוט לפי סט מודעות",
    moreMetrics: "נתונים נוספים מהדוח",
    badgeLabel: "מקרה מאומת",
  },
  en: {
    label: "Case studies",
    title: "Proof from the field",
    pendingTitle: "Case studies — coming soon",
    pendingBody:
      "We are preparing case studies with verified data and client approval. Until publication, we can share relevant examples on a consultation call.",
    sectionLead: "Real examples with verified figures — no promise of future results.",
    detailsToggle: "Full data",
    challenge: "Challenge",
    approach: "What we did",
    outcome: "Outcome & context",
    keywords: "Selected queries (tracking report)",
    period: "Measurement period",
    source: "Data source",
    cta: "Want results for your business? Get a proposal",
    testimony: "Client testimony",
    adSets: "Breakdown by ad set",
    moreMetrics: "Additional report metrics",
    badgeLabel: "Verified case",
  },
} as const;

function CaseStudyBadge({ locale }: { locale: Locale }) {
  const label = COPY[locale === "en" ? "en" : "he"].badgeLabel;
  return (
    <span className="sp-case-study-badge" title={label} aria-label={label}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CaseStudyCard({ study, locale }: { study: CaseStudyRecord; locale: Locale }) {
  const copy = COPY[locale === "en" ? "en" : "he"];
  const contactHref = locale === "en" ? "/en/contact-us/" : "/contact-us/";
  const cardMetrics = study.cardMetrics.length > 0 ? study.cardMetrics : study.highlightMetrics.slice(0, 3);

  return (
    <article className="sp-case-study-card sp-case-study-card--compact">
      <div className="sp-case-study-card-head">
        <CaseStudyBadge locale={locale} />
        <div className="sp-case-study-card-intro">
          <h3 className="sp-case-study-title">{t(study.clientLabel, locale)}</h3>
          <p className="sp-case-study-services">{t(study.services, locale)}</p>
          <p className="sp-case-study-teaser">{t(study.cardTeaser, locale)}</p>
        </div>
      </div>

      <div className="sp-case-study-card-body">
        {cardMetrics.length > 0 ? (
          <dl className="sp-case-study-metrics sp-case-study-metrics--card">
            {cardMetrics.map((m) => (
              <div key={t(m.label, locale)} className="sp-case-study-metric">
                <dt>{t(m.label, locale)}</dt>
                <dd>
                  <CaseStudyMetricValue value={t(m.value, locale)} />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <p className="sp-case-study-source-note">{t(study.sourceNoteShort, locale)}</p>

        <details className="sp-case-study-details">
          <summary>
            <span className="sp-case-study-details-chevron" aria-hidden="true" />
            {copy.detailsToggle}
          </summary>
          <div className="sp-case-study-details-body">
            <p className="sp-case-study-details-meta">
              <strong>{copy.period}:</strong> {t(study.measurementPeriod, locale)}
              <br />
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

            {(() => {
              const cardLabels = new Set(cardMetrics.map((m) => t(m.label, locale)));
              const extra = study.highlightMetrics.filter((m) => !cardLabels.has(t(m.label, locale)));
              if (extra.length === 0) return null;
              return (
                <div className="sp-case-study-more-metrics">
                  <p className="sp-case-study-keywords-title">{copy.moreMetrics}</p>
                  <dl className="sp-case-study-metrics sp-case-study-metrics--compact">
                    {extra.map((m) => (
                      <div key={`full-${t(m.label, locale)}`} className="sp-case-study-metric">
                        <dt>{t(m.label, locale)}</dt>
                        <dd>
                          <CaseStudyMetricValue value={t(m.value, locale)} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })()}

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
                      <dd>
                        <CaseStudyMetricValue value={t(m.value, locale)} />
                      </dd>
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
                            <strong>{t(m.label, locale)}:</strong>{" "}
                            <CaseStudyMetricValue value={t(m.value, locale)} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <p className="sp-case-study-disclaimer">{t(study.limitations, locale)}</p>
          </div>
        </details>
      </div>

      <footer className="sp-case-study-actions">
        <Button href={contactHref} size="md">
          {copy.cta}
        </Button>
        {study.clientSiteUrl ? (
          <a href={study.clientSiteUrl} target="_blank" rel="noopener noreferrer" className="sp-text-link sp-case-study-secondary-link">
            {study.clientSiteUrl.replace(/^https:\/\//, "")}
          </a>
        ) : null}
      </footer>
    </article>
  );
}

export function ServiceCaseStudySection({ category, locale = "he" }: ServiceCaseStudySectionProps) {
  const published = getPublishedCaseStudies(category);
  const copy = COPY[locale === "en" ? "en" : "he"];
  const gridMulti = published.length > 1;

  if (published.length === 0) {
    return (
      <Section tone="muted" label={copy.label} title={copy.pendingTitle} align="start">
        <p className="sp-body-text sp-body-text--narrow">{copy.pendingBody}</p>
      </Section>
    );
  }

  return (
    <Section
      tone="muted"
      label={copy.label}
      title={copy.title}
      align="center"
      className="sp-section-case-studies"
    >
      <p className="sp-body-text sp-case-study-section-lead">{copy.sectionLead}</p>
      <div className={`sp-case-study-list${gridMulti ? " sp-case-study-list--grid" : ""}`}>
        {published.map((study) => (
          <CaseStudyCard key={study.id} study={study} locale={locale} />
        ))}
      </div>
    </Section>
  );
}
