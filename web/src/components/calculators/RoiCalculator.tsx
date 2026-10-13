"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/routing";
import {
  calculateRoi,
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

/** Interactive ROI calculator for paid campaigns (CPL funnel). */
export function RoiCalculator({ locale = "he" }: RoiCalculatorProps) {
  const data = getRoiCalculatorData(locale);
  const { labels } = data;

  const [adSpend, setAdSpend] = useState("5000");
  const [cpl, setCpl] = useState("45");
  const [conversionRate, setConversionRate] = useState("8");
  const [orderValue, setOrderValue] = useState("1200");

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

  return (
    <div className="roi-calculator-root" dir={data.dir}>
      <div className="rcalc-shell">
        <h3 className="rcalc-title">{labels.title}</h3>
        <p className="rcalc-intro">{labels.intro}</p>

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
            </dl>
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
