"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { SiteCheckCopy } from "@/lib/pages/site-check/copy";
import type { SearchVisibilityReport, VisibilityRow } from "@/lib/search-visibility/types";
import type { SiteCheckReport } from "@/lib/site-check/types";

type Props = {
  locale: "he" | "en";
  copy: SiteCheckCopy;
  report: SiteCheckReport;
  onLeadNoteAppend: (extra: string) => void;
};

function aiLabel(row: VisibilityRow, locale: "he" | "en"): string {
  if (locale === "en") {
    if (row.aiStatus === "not_shown") return "AI overview not shown";
    if (row.aiStatus === "shown_site_cited") return "AI overview — site in sources";
    if (row.aiStatus === "shown_site_not_cited") return "AI overview — site not in sources checked";
    return "AI overview — could not verify";
  }
  if (row.aiStatus === "not_shown") return "לא הוצגה סקירת AI";
  if (row.aiStatus === "shown_site_cited") return "סקירת AI — האתר הופיע במקורות";
  if (row.aiStatus === "shown_site_not_cited") return "סקירת AI — האתר לא הופיע במקורות שנבדקו";
  return "סקירת AI — לא ניתן לאמת";
}

function positionLabel(row: VisibilityRow, locale: "he" | "en"): string {
  if (row.organicPosition != null) return String(row.organicPosition);
  return locale === "en"
    ? `Not in top ${row.organicDepthChecked} organic results checked`
    : `לא נמצא ב־${row.organicDepthChecked} התוצאות האורגניות שנבדקו`;
}

export function SiteCheckVisibilitySection({ locale, copy, report, onLeadNoteAppend }: Props) {
  const seeds = report.suggestedSearchPhrases;
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [country, setCountry] = useState("IL");
  const [language, setLanguage] = useState(locale === "en" ? "en" : "he");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [status, setStatus] = useState<"idle" | "running" | "ready" | "error" | "off">("idle");
  const [error, setError] = useState("");
  const [visibility, setVisibility] = useState<SearchVisibilityReport | null>(null);
  const [providerMode, setProviderMode] = useState<string>("mock");

  useEffect(() => {
    setQ1(seeds[0]?.text ?? "");
    setQ2(seeds[1]?.text ?? "");
    setQ3(seeds[2]?.text ?? "");
    setVisibility(null);
    setStatus("idle");
    setError("");
  }, [report.inputUrl, seeds]);

  useEffect(() => {
    fetch("/api/search-visibility/")
      .then((r) => r.json())
      .then((d: { mode?: string }) => {
        if (d.mode === "off") setStatus("off");
        if (d.mode) setProviderMode(d.mode);
      })
      .catch(() => undefined);
  }, []);

  const serviceUrl = useMemo(() => {
    const row = report.pages.find(
      (p) => p.status === "ok" && /שירות|service/i.test(`${p.url} ${p.label}`),
    );
    return row?.url ?? null;
  }, [report.pages]);

  const domain = useMemo(() => {
    try {
      return new URL(report.homeUrl).hostname.replace(/^www\./, "");
    } catch {
      return report.inputLabel;
    }
  }, [report.homeUrl, report.inputLabel]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const queries = [q1, q2, q3].map((q) => q.trim()).filter(Boolean);
    if (queries.length === 0) {
      setError(copy.visibilityNeedQuery);
      return;
    }
    setStatus("running");
    setError("");
    try {
      const res = await fetch("/api/search-visibility/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          domain,
          homeUrl: report.homeUrl,
          serviceUrl,
          siteKind: report.siteKind,
          queries,
          country,
          language,
          device,
          partialScan: report.partialScan,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        const msg =
          data.message === "daily_limit"
            ? copy.visibilityLimit
            : data.message === "unavailable"
              ? copy.visibilityUnavailable
              : copy.visibilityError;
        setError(msg);
        setStatus("error");
        return;
      }
      setVisibility(data as SearchVisibilityReport);
      onLeadNoteAppend(data.leadAppendix ?? "");
      setStatus("ready");
    } catch {
      setError(copy.visibilityError);
      setStatus("error");
    }
  }

  if (status === "off") return null;

  return (
    <section className="site-check-visibility-card" aria-labelledby="site-check-visibility-title">
      <div className="site-check-visibility-head">
        <h3 id="site-check-visibility-title">{copy.visibilityCardTitle}</h3>
        <p className="site-check-visibility-lead">{copy.visibilityCardLead}</p>
      </div>
      <form className="site-check-visibility-form" onSubmit={onSubmit}>
        <div className="site-check-visibility-queries">
          {[copy.visibilityQueryLabel1, copy.visibilityQueryLabel2, copy.visibilityQueryLabel3].map(
            (label, index) => {
              const value = index === 0 ? q1 : index === 1 ? q2 : q3;
              const set = index === 0 ? setQ1 : index === 1 ? setQ2 : setQ3;
              const required = index < 2 || Boolean(seeds[2]);
              return (
                <label key={label} className="site-check-visibility-field">
                  <span>{label}</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    placeholder={index === 2 ? copy.visibilityQueryOptional : undefined}
                    required={required && index < 2}
                    maxLength={80}
                  />
                  {seeds[index]?.source ? (
                    <span className="site-check-visibility-source">{seeds[index]!.source}</span>
                  ) : index === 2 ? (
                    <span className="site-check-visibility-source">{copy.visibilityQueryOptional}</span>
                  ) : null}
                </label>
              );
            },
          )}
        </div>
        <div className="site-check-visibility-meta">
          <label>
            <span>{copy.visibilityCountryLabel}</span>
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="IL">{copy.visibilityCountryIl}</option>
              <option value="US">United States</option>
            </select>
          </label>
          <label>
            <span>{copy.visibilityLanguageLabel}</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="he">{copy.visibilityLangHe}</option>
              <option value="en">{copy.visibilityLangEn}</option>
            </select>
          </label>
          <label>
            <span>{copy.visibilityDeviceLabel}</span>
            <select value={device} onChange={(e) => setDevice(e.target.value as "mobile" | "desktop")}>
              <option value="mobile">{copy.visibilityDeviceMobile}</option>
              <option value="desktop">{copy.visibilityDeviceDesktop}</option>
            </select>
          </label>
        </div>
        {providerMode === "mock" && <p className="site-check-visibility-demo">{copy.visibilityDemoNote}</p>}
        <button type="submit" className="btn btn-secondary site-check-visibility-btn" disabled={status === "running"}>
          {status === "running" ? copy.visibilityRunning : copy.visibilityButton}
        </button>
        {error ? (
          <p className="site-check-alert site-check-alert--error" role="alert">
            {error}
          </p>
        ) : null}
      </form>
      {visibility ? (
        <div className="site-check-visibility-results">
          <p className="site-check-visibility-meta-line">
            {copy.visibilityCheckedAt}: {new Date(visibility.checkedAt).toLocaleString(locale === "en" ? "en-IL" : "he-IL")} ·{" "}
            {visibility.country} · {visibility.language} · {visibility.device}
            {visibility.isDemoData ? ` · ${copy.visibilityDemoNote}` : ""}
            {visibility.partial ? ` · ${copy.visibilityPartialNote}` : ""}
          </p>
          <ul className="site-check-visibility-rows">
            {visibility.rows.map((row) => (
              <li key={row.query}>
                <p className="site-check-visibility-row-query">«{row.query}»</p>
                <p>
                  <strong>{copy.visibilityColOrganic}:</strong> {positionLabel(row, locale)}
                  {row.organicUrl ? (
                    <>
                      {" · "}
                      <a href={row.organicUrl} dir="ltr" className="site-check-finding-example">
                        {row.organicUrl}
                      </a>
                    </>
                  ) : null}
                </p>
                <p>
                  <strong>{copy.visibilityColAi}:</strong> {aiLabel(row, locale)}
                  {row.partialError ? ` (${copy.visibilityPartialNote})` : null}
                </p>
              </li>
            ))}
          </ul>
          <div className="site-check-visibility-insight">
            <h4>{visibility.insight.headline}</h4>
            <p>{visibility.insight.detail}</p>
            <p className="site-check-recommended-step">
              <span className="site-check-recommended-step-label">{copy.recommendedStepLabel}: </span>
              {visibility.insight.recommendedStep}
            </p>
            <p className="site-check-visibility-cta-bridge">{copy.visibilityConsultBridge}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}