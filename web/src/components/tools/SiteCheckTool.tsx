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
import type { SiteCheckReport, SiteCheckTopicId } from "@/lib/site-check/types";

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

  const activeHost = useMemo(() => displayHost(url), [url]);
  const showForm = (Boolean(leadNote) || scanIncomplete) && formStatus !== "success";
  const showLive = status !== "idle" || formStatus === "success";
  const embedLeadInReport = Boolean(report && status === "ready" && formStatus !== "success");
  const showStandaloneOffer = showForm && !embedLeadInReport;

  function topicTitle(id: SiteCheckTopicId): string {
    if (id === "seo") return copy.topicSeoTitle;
    if (id === "links") return copy.topicLinksTitle;
    return copy.topicImagesTitle;
  }

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
  const moreInsights =
    report && report.businessInsights.length > 1 ? report.businessInsights.slice(1) : [];
  const primaryFinding = report?.findings[0] ?? null;
  const moreFindings = report && report.findings.length > 1 ? report.findings.slice(1) : [];
  const showPromoteCta = Boolean(report && (hasFindings || isClearSuccess));
  const formTitle = scanIncomplete
    ? copy.formTitleFailure
    : showPromoteCta
      ? copy.formTitlePromote
      : copy.formTitle;
  const formBodyText = scanIncomplete
    ? copy.formBody
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

              <div
                className={`site-check-now-answer${hasFindings ? " site-check-now-answer--findings" : " site-check-now-answer--clear"}`}
              >
                {primaryInsight ? (
                  <>
                    {report.pageTypeSummary ? (
                      <p className="site-check-page-types">{report.pageTypeSummary}</p>
                    ) : null}
                    {primaryInsight.pointFix && primaryFinding ? (
                      <p className="site-check-finding-kicker">{primaryFinding.pageLabel}</p>
                    ) : null}
                    <h3 className="site-check-finding-headline">{primaryInsight.headline}</h3>
                    <p className="site-check-insight-detail">{primaryInsight.detail}</p>
                    {primaryInsight.exampleUrl ? (
                      <a href={primaryInsight.exampleUrl} className="site-check-finding-example" dir="ltr">
                        {primaryInsight.exampleUrl}
                      </a>
                    ) : null}
                    <p className="site-check-recommended-step">
                      <span className="site-check-recommended-step-label">{copy.recommendedStepLabel}: </span>
                      {primaryInsight.recommendedStep}
                    </p>
                    <p className="site-check-finding-why">
                      <span>{copy.impactLabel}: </span>
                      {primaryInsight.why}
                    </p>
                    <p className="site-check-consult-bridge">{copy.findingConsultBridge}</p>
                  </>
                ) : primaryFinding ? (
                  <>
                    <p className="site-check-finding-kicker">{primaryFinding.pageLabel}</p>
                    <h3 className="site-check-finding-headline">{primaryFinding.observation}</h3>
                    <a href={primaryFinding.pageUrl} className="site-check-finding-example" dir="ltr">
                      {primaryFinding.pageUrl}
                    </a>
                    <p className="site-check-recommended-step">
                      <span className="site-check-recommended-step-label">{copy.recommendedStepLabel}: </span>
                      {primaryFinding.recommendedStep}
                    </p>
                    <p className="site-check-finding-why">
                      <span>{copy.impactLabel}: </span>
                      {primaryFinding.why}
                    </p>
                    <p className="site-check-consult-bridge">{copy.findingConsultBridge}</p>
                  </>
                ) : (
                  <>
                    {report.pageTypeSummary ? (
                      <p className="site-check-page-types">{report.pageTypeSummary}</p>
                    ) : null}
                    <p className="site-check-outcome-clear" role="status">
                      {copy.noFindingsTitle}
                    </p>
                    <p className="site-check-now-summary">{copy.clearBusinessSummary}</p>
                  </>
                )}
              </div>

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

              <div className="site-check-speed-card site-check-speed-card--after-form">
                <div className="site-check-speed-card-head">
                  <h3 className="site-check-speed-card-title">{copy.speedCardTitle}</h3>
                  <p className="site-check-speed-card-sub" dir="ltr">
                    {report.homeUrl}
                  </p>
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
                  <p className="site-check-alert site-check-alert--error" role="alert">
                    {speedError}
                  </p>
                )}
                {speedStatus === "ready" && (
                  <div className="site-check-speed-result">
                    <p className="site-check-speed-score">
                      <span>{copy.speedScoreLabel}: </span>
                      <strong>{speedScore ?? "—"}</strong>
                    </p>
                    {speedPageLabel && (
                      <p className="site-check-speed-page">
                        <span>{locale === "en" ? "Page measured: " : "עמוד שנמדד: "}</span>
                        <span dir="ltr">{speedPageLabel}</span>
                      </p>
                    )}
                    <p className="site-check-speed-tip">{copy.speedTipGeneric}</p>
                    <p className="site-check-speed-lab">{copy.speedLabNote}</p>
                  </div>
                )}
              </div>

              <details className="site-check-tech-details">
                <summary>
                  {moreFindings.length > 0
                    ? copy.moreFindingsDetailsLabel
                    : copy.techDetailsHeading}
                </summary>
                {!report.partialScan && (
                  <p className="site-check-scope site-check-scope--detail">{report.scopeLine}</p>
                )}
                {report.inputLabel && (
                  <p className="site-check-domain">
                    <a href={report.inputUrl} dir="ltr" className="site-check-domain-link">
                      {report.inputLabel}
                    </a>
                  </p>
                )}
                <section className="site-check-topics" aria-labelledby="site-check-topics-title">
                  <h3 id="site-check-topics-title" className="site-check-topics-title">
                    {copy.scopeHeading}
                  </h3>
                  <ul className="site-check-topic-grid">
                    {report.topicSummaries.map((topic) => (
                      <li
                        key={topic.id}
                        className={`site-check-topic-card site-check-topic-card--${topic.tone}`}
                      >
                        <p className="site-check-topic-card-title">{topicTitle(topic.id)}</p>
                        <p className="site-check-topic-card-detail">{topic.detail}</p>
                      </li>
                    ))}
                  </ul>
                </section>
                {report.pageTypeSummary && (
                  <p className="site-check-page-types site-check-page-types--detail">
                    <strong>{copy.pageTypeHeading}: </strong>
                    {report.pageTypeSummary}
                  </p>
                )}
                {moreInsights.length > 0 && (
                  <section className="site-check-business-insights" aria-labelledby="site-check-insights-title">
                    <h3 id="site-check-insights-title" className="site-check-subhead">
                      {copy.businessInsightsHeading}
                    </h3>
                    <ol className="site-check-findings site-check-findings--more">
                      {moreInsights.map((insight) => (
                        <li key={insight.headline}>
                          <h4 className="site-check-finding-headline">{insight.headline}</h4>
                          <p className="site-check-insight-detail">{insight.detail}</p>
                          {insight.exampleUrl ? (
                            <a href={insight.exampleUrl} className="site-check-finding-example" dir="ltr">
                              {insight.exampleUrl}
                            </a>
                          ) : null}
                          <p className="site-check-recommended-step site-check-recommended-step--compact">
                            <span className="site-check-recommended-step-label">{copy.recommendedStepLabel}: </span>
                            {insight.recommendedStep}
                          </p>
                          <p className="site-check-finding-impact">
                            {copy.impactLabel}: {insight.why}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}
                {report.checksLine && <p className="site-check-checks">{report.checksLine}</p>}
                {report.partialNote && <p className="site-check-partial">{report.partialNote}</p>}
                <p className="site-check-limit">{report.limitNote}</p>
                {report.positiveObservations.length > 0 && (
                  <>
                    <p className="site-check-positive-kicker">{copy.positiveHeading}</p>
                    <ul className="site-check-positives">
                      {report.positiveObservations.map((item) => (
                        <li key={item.text}>{item.text}</li>
                      ))}
                    </ul>
                  </>
                )}
                {moreFindings.length > 0 && (
                  <ol className="site-check-findings site-check-findings--more">
                    {moreFindings.map((finding) => (
                      <li key={`more-${finding.pageUrl}-${finding.observation}`}>
                        <p className="site-check-finding-kicker">{finding.pageLabel}</p>
                        <h4 className="site-check-finding-headline">{finding.observation}</h4>
                        <a href={finding.pageUrl} className="site-check-finding-example" dir="ltr">
                          {finding.pageUrl}
                        </a>
                        <p className="site-check-recommended-step site-check-recommended-step--compact">
                          <span className="site-check-recommended-step-label">{copy.recommendedStepLabel}: </span>
                          {finding.recommendedStep}
                        </p>
                        <p className="site-check-finding-impact">
                          {copy.impactLabel}: {finding.why}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
                {hasFindings && (
                  <ul className="site-check-finding-impacts">
                    {report.findings.map((finding) => (
                      <li key={`impact-${finding.pageUrl}-${finding.observation}`}>
                        <strong>{finding.observation}</strong>
                        <span> — </span>
                        <span>
                          {copy.impactLabel}: {finding.why}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
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