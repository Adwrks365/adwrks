const ECOSYSTEM_NODES = [
  { id: "gads", label: "Google Ads", accent: "ab-node--gads" },
  { id: "seo", label: "SEO", accent: "ab-node--seo" },
  { id: "social", label: "Social", accent: "ab-node--social" },
  { id: "web", label: "אתרים", accent: "ab-node--web" },
  { id: "hosting", label: "אחסון", accent: "ab-node--hosting" },
] as const;

export function AboutHeroVisual() {
  return (
    <div className="ab-hero-visual" aria-hidden="true">
      <div className="ab-hero-visual-panel">
        <p className="ab-hero-visual-label">מעטפת שיווק דיגיטלי</p>
        <div className="ab-ecosystem">
          <div className="ab-ecosystem-core">
            <span className="ab-ecosystem-core-title">אסטרטגיה</span>
            <span className="ab-ecosystem-core-sub">+ ביצוע + מדידה</span>
          </div>
          <ul className="ab-ecosystem-nodes">
            {ECOSYSTEM_NODES.map((node) => (
              <li key={node.id} className={`ab-ecosystem-node ${node.accent}`}>
                {node.label}
              </li>
            ))}
          </ul>
        </div>
        <p className="ab-hero-visual-foot">ערוצים שעובדים יחד — לא בנפרד</p>
      </div>
    </div>
  );
}
