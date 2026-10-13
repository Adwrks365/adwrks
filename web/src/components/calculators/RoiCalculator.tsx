"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/i18n/routing";
import type { RoiBusinessType, RoiPlatform } from "@/lib/calculators/roi-calculator-data";
import {
  calculateRoi,
  compareRoiToBenchmark,
  getIndustryPreset,
  getRoiCalculatorData,
} from "@/lib/calculators/get-roi-calculator-data";

type RoiCalculatorProps = {
  locale?: Locale;
};

function parseNumber(value: string): number {
  const n = Number.parseFloat(value.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value: number, locale: string): string {
  return `₪${Math.round(value).toLocaleString(locale)}`;
}

/** Interactive ROI calculator for paid campaigns (CPL funnel + platform benchmarks). */
export function RoiCalculator({ locale = "he" }: RoiCalculatorProps) {
  const data = getRoiCalculatorData(locale);
  const { labels } = data;

  const [platform, setPlatform] = useState<RoiPlatform>("google");
  const [businessType, setBusinessType] = useState<RoiBusinessType>("store");
  const [adSpend, setAdSpend] = useState("5000");
  const [cpl, setCpl] = useState("45");
  const [conversionRate, setConversionRate] = useState("8");
  const [orderValue, setOrderValue] = useState("1200");

  const preset = useMemo(
    () => getIndustryPreset(data, businessType, platform),
    [data, businessType, platform],
  );

  useEffect(() => {
    setCpl(String(preset.cpl));
  }, [preset.cpl]);

  const result = useMemo(
    () =>
      calculateRoi({
        adSpend: parseNumber(adSpend),
        cpl: parseNumber(cpl),
        conversionRate: parseNumber(conversionRate),
        orderValue: parseNumber(orderValue),
      }),
    [adSpend, cpl, conversionRate, orderValue],
  );

  const benchmark = result ? compareRoiToBenchmark(result.roiPercent, preset) : null;

  const benchmarkMessage =
    benchmark === "below"
      ? labels.benchmarkBelow
      : benchmark === "above"
        ? labels.benchmarkAbove
        : labels.benchmarkWithin;

  const benchmarkRangeText = labels.benchmarkRange
    .replace("{min}", String(preset.roiMin))
    .replace("{max}", String(preset.roiMax));

  return (
    <div className="roi-calculator-root" dir={data.dir}>
      <div className="rcalc-shell">
        <h3 className="rcalc-title">{labels.title}</h3>
        <p className="rcalc-intro">{labels.intro}</p>

        <div className="rcalc-presets">
          <div className="rcalc-preset-block">
            <span className="rcalc-label">{labels.platform}</span>
            <div className="rcalc-segmented" role="group" aria-label={labels.platform}>
              <button
                type="button"
                className={`rcalc-segment${platform === "google" ? " is-active" : ""}`}
                aria-pressed={platform === "google"}
                onClick={() => setPlatform("google")}
              >
                {labels.platformGoogle}
              </button>
              <button
                type="button"
                className={`rcalc-segment${platform === "meta" ? " is-active" : ""}`}
                aria-pressed={platform === "meta"}
                onClick={() => setPlatform("meta")}
              >
                {labels.platformMeta}
              </button>
            </div>
          </div>

          <label className="rcalc-preset-block">
            <span className="rcalc-label">{labels.businessType}</span>
            <select
              className="rcalc-select"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as RoiBusinessType)}
            >
              <option value="store">{labels.businessStore}</option>
              <option value="professional">{labels.businessProfessional}</option>
              <option value="b2b">{labels.businessB2b}</option>
            </select>
          </label>
        </div>

        <p className="rcalc-preset-note">{labels.presetHint} · {benchmarkRangeText}</p>

        <div className="rcalc-grid">
          <label className="rcalc-field">
            <span className="rcalc-label">{labels.adSpend}</span>
            <span className="rcalc-hint">{labels.adSpendHint}</span>
            <input
              className="rcalc-input"
              type="number"
              min={0}
              inputMode="decimal"
              value={adSpend}
              onChange={(e) => setAdSpend(e.target.value)}
            />
          </label>
          <label className="rcalc-field">
            <span className="rcalc-label">{labels.cpl}</span>
            <span className="rcalc-hint">{labels.cplHint}</span>
            <input
              className="rcalc-input"
              type="number"
              min={0}
              inputMode="decimal"
              value={cpl}
              onChange={(e) => setCpl(e.target.value)}
            />
          </label>
          <label className="rcalc-field">
            <span className="rcalc-label">{labels.conversionRate}</span>
            <span className="rcalc-hint">{labels.conversionHint}</span>
            <input
              className="rcalc-input"
              type="number"
              min={0}
              max={100}
              inputMode="decimal"
              value={conversionRate}
              onChange={(e) => setConversionRate(e.target.value)}
            />
          </label>
          <label className="rcalc-field">
            <span className="rcalc-label">{labels.orderValue}</span>
            <span className="rcalc-hint">{labels.orderValueHint}</span>
            <input
              className="rcalc-input"
              type="number"
              min={0}
              inputMode="decimal"
              value={orderValue}
              onChange={(e) => setOrderValue(e.target.value)}
            />
          </label>
        </div>

        <section className="rcalc-results" aria-live="polite">
          <h4 className="rcalc-results-title">{labels.resultsTitle}</h4>
          {result ? (
            <>
              <p
                className={`rcalc-benchmark rcalc-benchmark--${benchmark}`}
                role="status"
              >
                {benchmarkMessage}
              </p>
              <dl className="rcalc-metrics">
                <div className="rcalc-metric">
                  <dt>{labels.leads}</dt>
                  <dd>{result.leads.toFixed(1)}</dd>
                </div>
                <div className="rcalc-metric">
                  <dt>{labels.customers}</dt>
                  <dd>{result.customers.toFixed(1)}</dd>
                </div>
                <div className="rcalc-metric">
                  <dt>{labels.revenue}</dt>
                  <dd>{formatMoney(result.revenue, data.numberLocale)}</dd>
                </div>
                <div className="rcalc-metric">
                  <dt>{labels.profit}</dt>
                  <dd>{formatMoney(result.profit, data.numberLocale)}</dd>
                </div>
                <div className="rcalc-metric rcalc-metric--highlight">
                  <dt>{labels.roi}</dt>
                  <dd>
                    {result.roiPercent >= 0 ? "+" : ""}
                    {result.roiPercent.toFixed(0)}%
                  </dd>
                </div>
                <div className="rcalc-metric">
                  <dt>{labels.roas}</dt>
                  <dd>{result.roasPercent.toFixed(0)}%</dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="rcalc-results-empty">{labels.formulaNote}</p>
          )}
          <p className="rcalc-formula">{labels.formulaNote}</p>
        </section>

        <p className="rcalc-disclaimer">{labels.disclaimer}</p>
      </div>
    </div>
  );
}
