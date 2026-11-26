"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PrivacyConsent } from "@/components/forms/PrivacyConsent";
import { pushLeadSubmitEvent } from "@/components/GoogleTags";
import type { Locale } from "@/i18n/routing";
import { measureOpenAiLeadCreated } from "@/lib/openai-pixel";
import { submitContactForm } from "@/lib/forms/submit-contact-form";
import type { SiteCheckCopy } from "@/lib/pages/site-check/copy";
import { normalizePageSpeedTargetUrl } from "@/lib/pagespeed/validate-url";
import type { FetchFailureReason } from "@/lib/site-check/fetch-page";
import { displayHostReadable } from "@/lib/site-check/display-url";
import type { BusinessInsight, SiteCheckAuditMetric, SiteCheckReport } from "@/lib/site-check/types";
import { SiteCheckVisibilitySection } from "@/components/tools/SiteCheckVisibilitySection";

export function SiteCheckTitle({
  defaultTitle,
  seoTitle,
}: {
  defaultTitle: string;
  seoTitle: string;
}) {
  const focus = useSearchParams().get("focus");
  return <h1 className="site-check-title">{focus === "seo" ? seoTitle : defaultTitle}</h1>;
}

type SiteCheckToolProps = {
  locale: Locale;
  copy: SiteCheckCopy;
  phoneTel: string;
  phoneDisplay: string;
  defaultTitle: string;
  seoTitle: string;
};

type ToolStatus = "idle" | "running" | "ready" | "error";

function displayHost(raw: string): string {
  return displayHostReadable(raw);
}

function scrollToLiveArea() {
  if (typeof window === "undefined") return;
  document.getElementById("site-check-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

type ScanErrorPayload = {
  message?: string;
  normalizedUrl?: string;
  finalUrl?: string;
  fetchReason?: FetchFailureReason;
  httpStatus?: number;
};

function scanErrorMessage(copy: SiteCheckCopy, data: ScanErrorPayload): string {
  if (data.message === "invalid_url") return copy.errorInvalid;
  if (data.message === "daily_limit") return copy.errorLimit;
  if (data.message === "service_unavailable" || data.message === "unavailable") return copy.errorService;
  if (data.fetchReason === "http" && data.httpStatus === 429) return copy.errorRateLimited;
  if (data.message === "home_unreadable") {
    /* fall through to fetch-specific copy */
  } else if (data.message && data.message !== "home_unreadable") {
    return copy.errorGeneric;
  }
  const byFetch: Partial<Record<FetchFailureReason, string>> = {
    dns: copy.errorDns,
    timeout: copy.errorTimeout,
    blocked: copy.errorBlocked,
    not_html: copy.errorNotHtml,
    empty: copy.errorEmpty,
    http: copy.errorHttp,
  };
  const base = data.fetchReason ? byFetch[data.fetchReason] ?? copy.errorUnread : copy.errorUnread;
  if (data.fetchReason === "http" && data.httpStatus) {
    return `${base} (${data.httpStatus})`;
  }
  return base;
}

function failureLeadNote(
  locale: Locale,
  submitted: string,
  data: ScanErrorPayload,
  errorLine: string,
): string {
  const normalized = data.normalizedUrl ?? normalizePageSpeedTargetUrl(submitted) ?? submitted.trim();
  const redirect =
    data.finalUrl && data.finalUrl !== normalized
      ? locale === "en"
        ? `URL we tried: ${data.finalUrl}\n`
        : `כתובת שניסינו לפתוח: ${data.finalUrl}\n`
      : "";
  const apiReason =
    data.message && data.message !== "home_unreadable"
      ? `${locale === "en" ? "API" : "API"}: ${data.message}\n`
      : data.fetchReason
        ? `${locale === "en" ? "Fetch reason" : "סיבת טעינה"}: ${data.fetchReason}${data.httpStatus ? ` (${data.httpStatus})` : ""}\n`
        : "";
  const head =
    locale === "en"
      ? `Website address: ${normalized}\nScan did not complete.\n${redirect}${apiReason}\nUser-facing message: ${errorLine}`
      : `כתובת האתר: ${normalized}\nהסריקה לא הושלמה.\n${redirect}${apiReason}\nהודעה למשתמש: ${errorLine}`;
  return head;
}

function AuditMetrics({
  metrics,
  labels,
}: {
  metrics: SiteCheckAuditMetric[];
  labels: SiteCheckCopy["auditMetricLabels"];
}) {
  if (metrics.length === 0) return null;
  return (
    <dl className="site-check-audit-metrics">
      {metrics.map((metric) => (
        <div key={metric.id}>
          <dt>{labels[metric.id]}</dt>
          <dd dir="ltr">{metric.passed} / {metric.verified}</dd>
        </div>
      ))}
    </dl>
  );
}

function InsightContent({
  insight,
  copy,
}: {
  insight: Omit<BusinessInsight, "pointFix">;
  copy: SiteCheckCopy;
}) {
  return (
    <>
      {insight.detail && <p className="site-check-finding-kicker">{insight.detail}</p>}
      <p className="site-check-finding-headline">{insight.headline}</p>
      {insight.exampleUrl && (
        <div className="site-check-evidence-links">
          <a href={insight.exampleUrl} className="site-check-finding-example">{copy.findingExampleLabel}</a>
          {insight.relatedPageUrl && (
            <a href={insight.relatedPageUrl} className="site-check-finding-example">{copy.findingRelatedLabel}</a>
          )}
        </div>
      )}
      <p className="site-check-recommended-step">
        <strong className="site-check-recommended-step-label">{copy.recommendedStepLabel}</strong>
        {insight.recommendedStep}
      </p>
      <p className="site-check-finding-why">{insight.why}</p>
    </>
  );
}

export function SiteCheckTool({
  locale,
  copy,
  phoneTel,
  phoneDisplay,
  defaultTitle,
  seoTitle,
}: SiteCheckToolProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ToolStatus>("idle");
  const [error, setError] = useState("");
  const [report, setReport] = useState<SiteCheckReport | null>(null);
  const [leadNote, setLeadNote] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [scanIncomplete, setScanIncomplete] = useState(false);
  const [speedStatus, setSpeedStatus] = useState<"idle" | "running" | "ready" | "error">("idle");
  const [speedError, setSpeedError] = useState("");
  const [speedScore, setSpeedScore] = useState<number | null>(null);
  const [speedPageLabel, setSpeedPageLabel] = useState("");
  const [visibilityDone, setVisibilityDone] = useState(false);

  function appendLeadNote(extra: string) {
    setLeadNote((prev) => (prev ? `${prev}\n${extra}` : extra));
    setVisibilityDone(true);
  }

  const activeHost = useMemo(() => displayHost(url), [url]);
  const showForm = (Boolean(leadNote) || scanIncomplete) && formStatus !== "success";
  const showLive = status !== "idle" || formStatus === "success";
  const embedLeadInReport = Boolean(report && status === "ready" && formStatus !== "success");
  const showStandaloneOffer = showForm && !embedLeadInReport;

  async function onCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = url.trim();
    if (!normalizePageSpeedTargetUrl(trimmed)) {
      setError(copy.errorInvalid);
      setStatus("error");
      setReport(null);
      setLeadNote("");
      setScanIncomplete(false);
      setFormStatus("idle");
      scrollToLiveArea();
      return;
    }
    setStatus("running");
    setError("");
    setReport(null);
    setLeadNote("");
    setScanIncomplete(false);
    setFormStatus("idle");
    setSpeedStatus("idle");
    setSpeedError("");
    setSpeedScore(null);
    setSpeedPageLabel("");
    setVisibilityDone(false);
    scrollToLiveArea();

    try {
      const res = await fetch("/api/site-check/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed, locale }),
      });
      const data = (await res.json()) as SiteCheckReport & ScanErrorPayload & { ok?: boolean };
      if (!res.ok || !data.ok) {
        const message = scanErrorMessage(copy, data);
        setError(message);
        if (data.message !== "invalid_url") {
          setScanIncomplete(true);
          setLeadNote(failureLeadNote(locale, trimmed, data, message));
        } else {
          setScanIncomplete(false);
          setLeadNote("");
        }
        setStatus("error");
        scrollToLiveArea();
        return;
      }
      setReport(data);
      setLeadNote(data.leadNote);
      setScanIncomplete(false);
      setStatus("ready");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "site_check_complete", page_locale: locale });
      window.gtag?.("event", "site_check_complete", { page_locale: locale });
      scrollToLiveArea();
    } catch {
      setError(copy.errorGeneric);
      setStatus("error");
      scrollToLiveArea();
    }
  }

  async function onLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("submitting");
    setFormError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const result = await submitContactForm({
        ...data,
        message: leadNote,
        formId: "site-check",
        pageTitle: copy.title,
        pagePath: copy.path,
      });
      if (!result.ok) {
        setFormStatus("error");
        setFormError(result.message);
        return;
      }
      setFormStatus("success");
      try {
        pushLeadSubmitEvent(locale, "site-check");
      } catch {
        /* Tag failure must not block confirmation. */
      }
      measureOpenAiLeadCreated();
      form.reset();
    } catch {
      setFormStatus("error");
      setFormError(copy.errorGeneric);
    }
  }

  const okPages = report?.pages.filter((page) => page.status !== "failed") ?? [];
  const failedPages = report?.pages.filter((page) => page.status === "failed") ?? [];
  const hasFindings = Boolean(report && report.findings.length > 0);
  const isClearSuccess = Boolean(report && report.clearTitle);
  const primaryInsight = report?.businessInsights[0] ?? null;
  const moreInsights = report?.businessInsights.slice(1) ?? [];
  const auditScore = report?.auditScore;
  const keyMetrics = auditScore?.metrics.filter(({ id }) =>
    id === "title" || id === "h1" || id === "purchase" || id === "contact",
  ) ?? [];
  const extraMetrics = auditScore?.metrics.filter((metric) => !keyMetrics.includes(metric)) ?? [];
  const primaryFinding = report?.findings[0] ?? null;
  const showPromoteCta = Boolean(report && (hasFindings || isClearSuccess));
  const formTitle = scanIncomplete
    ? copy.formTitleFailure
    : visibilityDone
      ? copy.formTitleAfterVisibility
      : showPromoteCta
        ? copy.formTitlePromote
        : copy.formTitle;
  const formBodyText = scanIncomplete
    ? copy.formBody
    : hasFindings
      ? copy.formBodyFindings
      : showPromoteCta
        ? copy.formBodyPromote
        : copy.formBody;

  async function onSpeedCheck() {
    if (!report?.homeUrl) return;
    setSpeedStatus("running");
    setSpeedError("");
    setSpeedScore(null);
    setSpeedPageLabel("");
    try {
      const res = await fetch("/api/pagespeed/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: report.homeUrl, strategy: "mobile" }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        detail?: string;
        finalUrl?: string;
        url?: string;
        scores?: { performance: number | null };
      };
      if (!res.ok || !data.ok) {
        const msg =
          data.message === "daily_limit"
            ? copy.speedLimit
            : data.message === "unavailable"
              ? copy.speedUnavailableConfig
              : data.message === "upstream_error"
                ? copy.speedUpstreamError
                : copy.speedError;
        setSpeedError(msg);
        setSpeedStatus("error");
        return;
      }
      const measured = data.finalUrl ?? data.url ?? report.homeUrl;
      setSpeedPageLabel(displayHostReadable(measured));
      setSpeedScore(data.scores?.performance ?? null);
      setSpeedStatus("ready");
    } catch {
      setSpeedError(copy.speedError);
      setSpeedStatus("error");
    }
  }

  return (
    <div className="site-check-workspace">
      <header className="site-check-hero-copy">
        <Suspense fallback={<h1 className="site-check-title">{defaultTitle}</h1>}>
          <SiteCheckTitle defaultTitle={defaultTitle} seoTitle={seoTitle} />
        </Suspense>
        <p className="site-check-lead">{copy.lead}</p>
      </header>

      <div className="site-check-panel">
        <form className="site-check-url-form" onSubmit={onCheck}>
          <label htmlFor="site-check-url" className="site-check-url-label">
            {copy.urlLabel}
          </label>
          <div className="site-check-url-bar">
            <input
              id="site-check-url"
              name="url"
              type="text"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              dir="ltr"
              required
              placeholder={copy.urlPlaceholder}
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="site-check-url-input"
            />
            <button
              type="submit"
              className="btn btn-primary btn-lg site-check-url-btn"
              disabled={status === "running"}
            >
              {status === "running" ? copy.runningActive : copy.submit}
            </button>
          </div>
        </form>

        <div
          id="site-check-results"
          className={`site-check-live site-check-live--${status}${showLive ? "" : " site-check-live--hidden"}`}
          aria-live="polite"
        >
          {status === "running" && (
            <div className="site-check-running" role="status">
              <span className="site-check-spinner" aria-hidden="true" />
              <div>
                <p className="site-check-running-text">{copy.runningActive}</p>
                {activeHost && (
                  <p className="site-check-running-host" dir="ltr">
                    {activeHost}
                  </p>
                )}
              </div>
            </div>
          )}

          {status === "error" && error && (
            <div className="site-check-error-block">
              <p className="site-check-alert site-check-alert--error" role="alert">
                {error}
              </p>
              {scanIncomplete && (
                <button
                  type="button"
                  className="btn btn-secondary site-check-retry-btn"
                  onClick={() => {
                    const form = document.querySelector<HTMLFormElement>(".site-check-url-form");
                    form?.requestSubmit();
                  }}
                >
                  {copy.retryScan}
                </button>
              )}
            </div>
          )}

          {report && status === "ready" && (
            <div className="site-check-report-body site-check-fade-in">
              <p className="site-check-results-kicker">{copy.resultsNowTitle}</p>
              {(report.partialScan || report.partialHeadline) && (
                <>
                  {report.partialHeadline && (
                    <p className="site-check-partial-headline" role="status">
                      {report.partialHeadline}
                    </p>
                  )}
                  <p className="site-check-scope">{report.scopeLine}</p>
                </>
              )}
              {!report.partialScan && !report.partialHeadline && report.inputLabel && (
                <p className="site-check-domain">
                  <a href={report.inputUrl} dir="ltr" className="site-check-domain-link">
                    {report.inputLabel}
                  </a>
                </p>
              )}

              {auditScore && (
                <section className="site-check-score" aria-labelledby="site-check-score-title">
                  <h3 id="site-check-score-title">{copy.auditScoreTitle}</h3>
                  <p className="site-check-score-value" dir="ltr">
                    <strong>{auditScore.score}</strong><span> / 100</span>
                  </p>
                  <p className="site-check-score-note">{copy.auditScoreNote}</p>
                  {!report.partialScan && (
                    <p className="site-check-score-note">{report.scopeLine}</p>
                  )}
                  <AuditMetrics metrics={keyMetrics} labels={copy.auditMetricLabels} />
                </section>
              )}

              <div
                className={`site-check-now-answer${hasFindings ? " site-check-now-answer--findings" : " site-check-now-answer--clear"}`}
              >
                {primaryInsight ? (
                  <InsightContent insight={primaryInsight} copy={copy} />
                ) : primaryFinding ? (
                  <InsightContent
                    insight={{
                      headline: primaryFinding.observation,
                      detail: primaryFinding.pageLabel,
                      exampleUrl: primaryFinding.pageUrl,
                      recommendedStep: primaryFinding.recommendedStep,
                      why: primaryFinding.why,
                    }}
                    copy={copy}
                  />
                ) : (
                  <>
                    <p className="site-check-outcome-clear" role="status">{copy.noFindingsTitle}</p>
                    <p className="site-check-now-summary">{copy.clearBusinessSummary}</p>
                  </>
                )}
              </div>

              {moreInsights.length > 0 && (
                <section aria-labelledby="site-check-insights-title">
                  <h3 id="site-check-insights-title" className="site-check-subhead">
                    {copy.businessInsightsHeading}
                  </h3>
                  <ul className="site-check-findings site-check-findings--more">
                    {moreInsights.map((insight) => (
                      <li key={insight.headline}><InsightContent insight={insight} copy={copy} /></li>
                    ))}
                  </ul>
                </section>
              )}

              <details className="site-check-what-checked">
                <summary>
                  {copy.whatWeCheckedHeading} ({report.pagesScanned} {copy.pagesScannedUnit})
                </summary>
                <AuditMetrics metrics={extraMetrics} labels={copy.auditMetricLabels} />
                {report.imageProbeStats.imagesProbed > 0 && !extraMetrics.some(({ id }) => id === "images") && (
                  <p className="site-check-limit">{copy.unverifiedImages}</p>
                )}
                {report.partialNote && <p className="site-check-partial">{report.partialNote}</p>}
                <p className="site-check-limit">{report.limitNote}</p>
                {(okPages.length > 0 || failedPages.length > 0) && (
                  <>
                    <p className="site-check-subhead">{copy.checkedHeading}</p>
                    {okPages.length > 0 && (
                      <ul className="site-check-pages">
                        {okPages.map((page) => (
                          <li key={`${page.status}-${page.url}`}>
                            <span>{page.label}</span>
                            <span dir="ltr">{page.url}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {failedPages.length > 0 && (
                      <>
                        <p className="site-check-subhead site-check-subhead--muted">{copy.pagesFailedLabel}</p>
                        <ul className="site-check-pages site-check-pages--failed">
                          {failedPages.map((page) => (
                            <li key={page.url}>
                              <span dir="ltr">{page.url}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </details>

              <div className="site-check-speed-card">
                <div className="site-check-speed-card-head">
                  <h3 className="site-check-speed-card-title">{copy.speedCardTitle}</h3>
                </div>
                {speedStatus === "idle" && (
                  <button type="button" className="btn btn-secondary site-check-speed-btn" onClick={onSpeedCheck}>
                    {copy.speedButton}
                  </button>
                )}
                {speedStatus === "running" && (
                  <p className="site-check-speed-running" role="status">
                    {copy.speedRunning}
                  </p>
                )}
                {speedStatus === "error" && speedError && (
                  <div className="site-check-speed-fallback">
                    <p className="site-check-alert site-check-alert--error" role="alert">
                      {speedError}
                    </p>
                    <button type="button" className="btn btn-secondary site-check-speed-btn" onClick={onSpeedCheck}>
                      {copy.speedRetry}
                    </button>
                  </div>
                )}
                {speedStatus === "ready" && speedScore != null && (
                  <div className="site-check-speed-result">
                    <p className="site-check-speed-score">
                      <span>{copy.speedScoreLabel}: </span>
                      <strong dir="ltr">{speedScore} / 100</strong>
                    </p>
                    {speedPageLabel && (
                      <p className="site-check-speed-page">
                        <span>{locale === "en" ? "Page measured: " : "עמוד שנמדד: "}</span>
                        <span dir="ltr">{speedPageLabel}</span>
                      </p>
                    )}
                    <p className="site-check-speed-lab">{copy.speedLabNote}</p>
                  </div>
                )}
                {speedStatus === "ready" && speedScore == null && (
                  <div className="site-check-speed-fallback">
                    <p className="site-check-speed-no-score" role="status">
                      {copy.speedNoScore}
                    </p>
                    {speedPageLabel && (
                      <p className="site-check-speed-page">
                        <span>{locale === "en" ? "Page measured: " : "עמוד שנמדד: "}</span>
                        <span dir="ltr">{speedPageLabel}</span>
                      </p>
                    )}
                    <button type="button" className="btn btn-secondary site-check-speed-btn" onClick={onSpeedCheck}>
                      {copy.speedRetry}
                    </button>
                  </div>
                )}
              </div>

              <SiteCheckVisibilitySection
                locale={locale}
                copy={copy}
                report={report}
                onLeadNoteAppend={appendLeadNote}
              />

              {embedLeadInReport && (
                <section className="site-check-offer site-check-offer--in-report" aria-labelledby="site-check-offer-title">
                  <h2 id="site-check-offer-title">{formTitle}</h2>
                  {formBodyText ? <p className="site-check-offer-lead">{formBodyText}</p> : null}
                  <form onSubmit={onLead} noValidate>
                    <div className="site-check-form-grid">
                      <div>
                        <label htmlFor="site-check-name-in">{copy.nameLabel}</label>
                        <input id="site-check-name-in" name="name" type="text" required autoComplete="name" />
                      </div>
                      <div>
                        <label htmlFor="site-check-phone-in">{copy.phoneLabel}</label>
                        <input id="site-check-phone-in" name="phone" type="tel" required autoComplete="tel" dir="ltr" />
                      </div>
                    </div>
                    <input type="hidden" name="message" value={leadNote} />
                    <PrivacyConsent id="site-check-privacy-in" locale={locale} />
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="site-check-website-in">Website</label>
                      <input id="site-check-website-in" name="website" type="text" tabIndex={-1} autoComplete="off" />
                    </div>
                    {formStatus === "error" && (
                      <p className="site-check-alert site-check-alert--error" role="alert">
                        {formError}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg site-check-offer-submit"
                      disabled={formStatus === "submitting"}
                    >
                      {formStatus === "submitting" ? "…" : copy.formSubmit}
                    </button>
                    <p className="site-check-hint">{copy.formNote}</p>
                    <p className="site-check-call">
                      <span>{copy.callLabel} </span>
                      <a href={phoneTel} dir="ltr">
                        {phoneDisplay}
                      </a>
                    </p>
                  </form>
                </section>
              )}



            </div>
          )}
        </div>

        {showStandaloneOffer && (
          <section className="site-check-offer" aria-labelledby="site-check-offer-title">
            <h2 id="site-check-offer-title">{formTitle}</h2>
            {formBodyText ? <p className="site-check-offer-lead">{formBodyText}</p> : null}
            <form onSubmit={onLead} noValidate>
              <div className="site-check-form-grid">
                <div>
                  <label htmlFor="site-check-name">{copy.nameLabel}</label>
                  <input id="site-check-name" name="name" type="text" required autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="site-check-phone">{copy.phoneLabel}</label>
                  <input id="site-check-phone" name="phone" type="tel" required autoComplete="tel" dir="ltr" />
                </div>
              </div>
              <input type="hidden" name="message" value={leadNote} />
              <PrivacyConsent id="site-check-privacy" locale={locale} />
              <div className="hidden" aria-hidden="true">
                <label htmlFor="site-check-website">Website</label>
                <input id="site-check-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              {formStatus === "error" && (
                <p className="site-check-alert site-check-alert--error" role="alert">
                  {formError}
                </p>
              )}
              <button
                type="submit"
                className="btn btn-primary btn-lg site-check-offer-submit"
                disabled={formStatus === "submitting"}
              >
                {formStatus === "submitting" ? "…" : copy.formSubmit}
              </button>
              <p className="site-check-hint">{copy.formNote}</p>
              <p className="site-check-call">
                <span>{copy.callLabel} </span>
                <a href={phoneTel} dir="ltr">
                  {phoneDisplay}
                </a>
              </p>
            </form>
          </section>
        )}

        {formStatus === "success" && (
          <p className="site-check-success" role="status">
            {copy.success}
          </p>
        )}
      </div>
    </div>
  );
}