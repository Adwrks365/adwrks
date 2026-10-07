import type { Locale } from "@/i18n/routing";

const ECOSYSTEM_NODES_HE = [
  { id: "gads", label: "Google Ads", accent: "ab-node--gads" },
  { id: "seo", label: "SEO", accent: "ab-node--seo" },
  { id: "social", label: "Social", accent: "ab-node--social" },
  { id: "web", label: "אתרים", accent: "ab-node--web" },
  { id: "hosting", label: "אחסון", accent: "ab-node--hosting" },
] as const;

const ECOSYSTEM_NODES_EN = [
  { id: "gads", label: "Google Ads", accent: "ab-node--gads" },
  { id: "seo", label: "SEO", accent: "ab-node--seo" },
  { id: "social", label: "Social", accent: "ab-node--social" },
  { id: "web", label: "Websites", accent: "ab-node--web" },
  { id: "hosting", label: "Hosting", accent: "ab-node--hosting" },
] as const;

type AboutHeroVisualProps = {
  locale?: Locale;
};

export function AboutHeroVisual({ locale = "he" }: AboutHeroVisualProps) {
  const nodes = locale === "en" ? ECOSYSTEM_NODES_EN : ECOSYSTEM_NODES_HE;
  const label = locale === "en" ? "Digital marketing suite" : "מעטפת שיווק דיגיטלי";
  const coreTitle = locale === "en" ? "Strategy" : "אסטרטגיה";
  const coreSub = locale === "en" ? "+ Execution + Measurement" : "+ ביצוע + מדידה";
  const foot =
    locale === "en" ? "Channels that work together — not separately" : "ערוצים שעובדים יחד — לא בנפרד";

  return (
    <div className="ab-hero-visual" aria-hidden="true">
      <div className="ab-hero-visual-panel">
        <p className="ab-hero-visual-label">{label}</p>
        <div className="ab-ecosystem">
          <div className="ab-ecosystem-core">
            <span className="ab-ecosystem-core-title">{coreTitle}</span>
            <span className="ab-ecosystem-core-sub">{coreSub}</span>
          </div>
          <ul className="ab-ecosystem-nodes">
            {nodes.map((node) => (
              <li key={node.id} className={`ab-ecosystem-node ${node.accent}`}>
                {node.label}
              </li>
            ))}
          </ul>
        </div>
        <p className="ab-hero-visual-foot">{foot}</p>
      </div>
    </div>
  );
}
