import type { HomepageCounter } from "@/lib/homepage/data";

type StatCountersProps = {
  items: readonly HomepageCounter[];
};

/** Verified counters — static display (no count-up) to preserve exact production values. */
function CounterItem({ item }: { item: HomepageCounter }) {
  return (
    <div className="stat-card stat-card-premium">
      <p className="stat-value" aria-label={item.ariaValue}>
        <span className="stat-value-ltr" dir="ltr" aria-hidden="true">
          <span className="stat-value-num">{item.target}</span>
          <span className="stat-value-suffix">{item.suffix}</span>
        </span>
      </p>
      <p className="stat-label">{item.label}</p>
    </div>
  );
}

export function StatCounters({ items }: StatCountersProps) {
  return (
    <div className="stat-grid reveal">
      {items.map((item) => (
        <CounterItem key={item.label} item={item} />
      ))}
    </div>
  );
}
