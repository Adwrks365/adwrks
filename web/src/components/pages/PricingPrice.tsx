type PricingPriceProps = {
  amount: number;
  prefix?: string;
  period?: string;
  className?: string;
};

/** RTL-safe price display — currency and digits stay LTR inside Hebrew flow */
export function PricingPrice({ amount, prefix = "החל מ־", period, className = "" }: PricingPriceProps) {
  const formatted = amount.toLocaleString("he-IL");

  return (
    <div className={`pp-price-block ${className}`.trim()}>
      <p className="pp-price" dir="rtl">
        {prefix && <span className="pp-price-prefix">{prefix}</span>}
        <bdi className="pp-price-amount" dir="ltr">
          {formatted} ₪
        </bdi>
        {period && <span className="pp-price-period"> / {period}</span>}
      </p>
    </div>
  );
}
