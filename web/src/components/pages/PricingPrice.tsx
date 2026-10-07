import type { Locale } from "@/i18n/routing";

type PricingPriceProps = {
  amount: number;
  prefix?: string;
  period?: string;
  className?: string;
  locale?: Locale;
};

/** RTL-safe price display — currency and digits stay LTR inside Hebrew flow */
export function PricingPrice({
  amount,
  prefix,
  period,
  className = "",
  locale = "he",
}: PricingPriceProps) {
  const resolvedPrefix = prefix ?? (locale === "en" ? "From " : "החל מ־");
  const formatted = amount.toLocaleString(locale === "en" ? "en-US" : "he-IL");

  return (
    <div className={`pp-price-block ${className}`.trim()}>
      <p className="pp-price" dir={locale === "en" ? "ltr" : "rtl"}>
        {resolvedPrefix && <span className="pp-price-prefix">{resolvedPrefix}</span>}
        <bdi className="pp-price-amount" dir="ltr">
          {formatted} ₪
        </bdi>
        {period && <span className="pp-price-period"> / {period}</span>}
      </p>
    </div>
  );
}
