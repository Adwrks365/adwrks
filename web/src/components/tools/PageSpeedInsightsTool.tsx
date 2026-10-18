"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/i18n/routing";
import {
  getPageSpeedInsightsData,
  performanceRecommendation,
  scoreColor,
} from "@/lib/pagespeed/get-pagespeed-insights-data";
import type {
  PageSpeedCategoryKey,
  PageSpeedStrategy,
} from "@/lib/pagespeed/pagespeed-insights-data";

type Scores = Record<PageSpeedCategoryKey, number | null>;

type PageSpeedInsightsToolProps = {
  locale?: Locale;
};

const CATEGORY_ORDER: PageSpeedCategoryKey[] = [
  "performance",
  "accessibility",
  "bestPractices",
  "seo",
];

export function PageSpeedInsightsTool({ locale = "he" }: PageSpeedInsightsToolProps) {
  const { labels, dir } = getPageSpeedInsightsData(locale);
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<PageSpeedStrategy>("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState<Scores | null>(null);
  const [scoresByStrategy, setScoresByStrategy] = useState<
    Partial<Record<PageSpeedStrategy, Scores>>
  >({});
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState(3);
  const [showResults, setShowResults] = useState(false);
  const [resultStrategy, setResultStrategy] = useState<PageSpeedStrategy | null>(null);

  const refreshQuota = useCallback(async () => {
    try {
      const res = await fetch("/api/pagespeed/", { method: "GET" });
      if (!res.ok) {
        if (res.status === 503) setError(labels.errorUnavailable);
        return;
      }
      const data = (await res.json()) as {
        ok: boolean;
        remaining: number;
        limit: number;
      };
      if (data.ok) {
        setRemaining(data.remaining);
        setLimit(data.limit);
      }
    } catch {
      /* Quota display is best-effort on load. */
    }
  }, [labels.errorUnavailable]);

  useEffect(() => {
    void refreshQuota();
  }, [refreshQuota]);

  const remainingText =
    remaining === null
      ? ""
      : labels.remaining.replace("{count}", String(remaining)).replace("{limit}", String(limit));

  const canRun = (remaining ?? limit) > 0 && !loading;

  async function runTest(targetUrl: string, nextStrategy: PageSpeedStrategy) {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/pagespeed/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, strategy: nextStrategy }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        message?: string;
        scores?: Scores;
        strategy?: PageSpeedStrategy;
        remaining?: number;
        limit?: number;
      };

      if (data.limit != null) setLimit(data.limit);
      if (data.remaining != null) setRemaining(data.remaining);

      if (!res.ok || !data.ok) {
        if (data.message === "invalid_url") {
          setError(labels.errorInvalidUrl);
        } else if (data.message === "daily_limit") {
          setError(labels.limitReached.replace("{limit}", String(data.limit ?? limit)));
          setRemaining(0);
        } else if (data.message === "unavailable") {
          setError(labels.errorUnavailable);
        } else {
          setError(labels.errorGeneric);
        }
        return false;
      }

      if (data.scores) {
        const resolvedStrategy = data.strategy ?? nextStrategy;
        setScoresByStrategy((prev) => ({ ...prev, [resolvedStrategy]: data.scores! }));
        setScores(data.scores);
        setResultStrategy(resolvedStrategy);
        setStrategy(resolvedStrategy);
        setShowResults(true);
        return true;
      }
      return false;
    } catch {
      setError(labels.errorGeneric);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowResults(false);
    setResultStrategy(null);
    await runTest(url, strategy);
  }

  async function onStrategySelect(next: PageSpeedStrategy) {
    setStrategy(next);
    setError(null);

    const cached = scoresByStrategy[next];
    if (cached) {
      setScores(cached);
      setResultStrategy(next);
      setShowResults(true);
      return;
    }

    if (!url.trim()) return;

    if ((remaining ?? 0) <= 0) {
      const strategyLabel = next === "mobile" ? labels.strategyMobile : labels.strategyDesktop;
      setError(
        labels.switchStrategyHint
          .replace("{strategy}", strategyLabel)
          .replace("{count}", "0"),
      );
      return;
    }

    await runTest(url, next);
  }

  function onRetry() {
    setUrl("");
    setScores(null);
    setScoresByStrategy({});
    setShowResults(false);
    setResultStrategy(null);
    setError(null);
  }

  const performanceScore = scores?.performance ?? null;
  const perfHint =
    performanceScore != null ? performanceRecommendation(performanceScore, locale) : "";

  const showForm = canRun || loading || showResults;

  return (
    <div className="pagespeed-insights-root" dir={dir}>
      <div className="psi-shell">
        <h2 className="psi-title">{labels.title}</h2>
        <p className="psi-intro">{labels.intro}</p>
        <p className="psi-meta">{labels.poweredBy}</p>
        {remainingText ? <p className="psi-quota">{remainingText}</p> : null}

        {showForm ? (
          <form className="psi-form" onSubmit={onSubmit} aria-busy={loading}>
            <label className="psi-field">
              <span className="psi-label">{labels.urlLabel}</span>
              <input
                className="psi-input"
                type="url"
                name="url"
                required
                placeholder={labels.urlPlaceholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading || (remaining === 0 && !showResults)}
                readOnly={remaining === 0 && showResults}
                dir="ltr"
                autoComplete="url"
                inputMode="url"
              />
            </label>

            <div className="psi-strategy">
              <span className="psi-label">{labels.strategy}</span>
              <div className="psi-segmented" role="group" aria-label={labels.strategy}>
                <button
                  type="button"
                  className={`psi-segment${strategy === "mobile" ? " is-active" : ""}`}
                  aria-pressed={strategy === "mobile"}
                  onClick={() => void onStrategySelect("mobile")}
                  disabled={loading}
                >
                  {labels.strategyMobile}
                </button>
                <button
                  type="button"
                  className={`psi-segment${strategy === "desktop" ? " is-active" : ""}`}
                  aria-pressed={strategy === "desktop"}
                  onClick={() => void onStrategySelect("desktop")}
                  disabled={loading}
                >
                  {labels.strategyDesktop}
                </button>
              </div>
            </div>

            {canRun ? (
              <button className="psi-submit" type="submit" disabled={!canRun}>
                {labels.submit}
              </button>
            ) : null}
          </form>
        ) : null}

        {loading ? (
          <div className="psi-loading" role="status" aria-live="polite">
            <span className="psi-spinner" aria-hidden="true" />
            <p className="psi-waiting">{labels.running}</p>
          </div>
        ) : null}
        {error ? <p className="psi-error">{error}</p> : null}

        {showResults && scores ? (
          <div className="psi-results">
            {resultStrategy ? (
              <p className="psi-results-heading">
                {labels.resultsHeading.replace(
                  "{strategy}",
                  resultStrategy === "mobile" ? labels.strategyMobile : labels.strategyDesktop,
                )}
              </p>
            ) : null}
            <div className="psi-score-grid">
              {CATEGORY_ORDER.map((key) => {
                const value = scores[key];
                if (value == null) return null;
                return (
                  <div key={key} className="psi-score-card">
                    <div
                      className="psi-gauge"
                      style={
                        {
                          "--psi-score": value,
                          "--psi-color": scoreColor(value),
                        } as React.CSSProperties
                      }
                      aria-label={`${labels.categories[key]} ${value}`}
                    >
                      <span className="psi-gauge-value">{value}</span>
                    </div>
                    <span className="psi-score-label">{labels.categories[key]}</span>
                  </div>
                );
              })}
            </div>
            {perfHint ? (
              <p className="psi-hint">
                <strong>{labels.performanceHint}:</strong> {perfHint}
              </p>
            ) : null}
            <p className="psi-note">{labels.psiNote}</p>
            {(remaining ?? 0) > 0 ? (
              <button type="button" className="psi-retry" onClick={onRetry}>
                {labels.retry}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
