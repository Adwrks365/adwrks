/** Keep numeric ranges readable in RTL (e.g. 52 → 23.52). */
export function CaseStudyMetricValue({ value }: { value: string }) {
  const needsLtr = /[\d→←]|→/.test(value);
  if (!needsLtr) return <>{value}</>;
  return (
    <span dir="ltr" className="sp-case-study-metric-value">
      {value}
    </span>
  );
}
