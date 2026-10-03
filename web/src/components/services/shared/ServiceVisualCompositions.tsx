import Image from "next/image";
import type { CSSProperties } from "react";

/** Abstract SERP/search composition — no fake rankings or metrics */
export function SeoHeroVisual() {
  return (
    <div className="sp-compose sp-compose--seo" aria-hidden="true">
      <div className="sp-compose-seo-panel">
        <div className="sp-compose-search-bar">
          <span className="sp-compose-search-icon" />
          <span className="sp-compose-search-placeholder">חיפוש אורגני • כוונת משתמש</span>
        </div>
        <ul className="sp-compose-serp-list">
          <li className="sp-compose-serp-item sp-compose-serp-item--primary">
            <span className="sp-compose-serp-title" />
            <span className="sp-compose-serp-line" />
            <span className="sp-compose-serp-line sp-compose-serp-line--short" />
          </li>
          <li className="sp-compose-serp-item">
            <span className="sp-compose-serp-title sp-compose-serp-title--muted" />
            <span className="sp-compose-serp-line" />
          </li>
          <li className="sp-compose-serp-item">
            <span className="sp-compose-serp-title sp-compose-serp-title--muted" />
            <span className="sp-compose-serp-line sp-compose-serp-line--short" />
          </li>
        </ul>
        <div className="sp-compose-seo-tags">
          <span>תוכן</span>
          <span>טכני</span>
          <span>AEO</span>
        </div>
      </div>
    </div>
  );
}

/** Campaign ecosystem chips — no fake dashboard data */
export function GoogleAdsHeroVisual() {
  const chips = ["Search", "Display", "YouTube", "Shopping", "Local"];
  return (
    <div className="sp-compose sp-compose--gads" aria-hidden="true">
      <div className="sp-compose-gads-orbit">
        {chips.map((chip, i) => (
          <span key={chip} className="sp-compose-gads-chip" style={{ "--chip-i": i } as CSSProperties}>
            {chip}
          </span>
        ))}
        <div className="sp-compose-gads-core">
          <span className="sp-compose-gads-core-label">קמפיין</span>
          <span className="sp-compose-gads-core-sub">מדידה ← אופטימיזציה</span>
        </div>
      </div>
    </div>
  );
}

type SocialHeroImageProps = {
  src: string;
  alt: string;
};

export function SocialHeroVisual({ src, alt }: SocialHeroImageProps) {
  return (
    <div className="sp-compose sp-compose--social">
      <div className="sp-compose-social-frame">
        <Image
          src={src}
          alt={alt}
          width={640}
          height={480}
          className="sp-compose-social-image"
          sizes="(min-width: 768px) 44vw, 100vw"
          priority
        />
        <div className="sp-compose-social-accent sp-compose-social-accent--fb" aria-hidden="true" />
        <div className="sp-compose-social-accent sp-compose-social-accent--ig" aria-hidden="true" />
      </div>
    </div>
  );
}

const HUB_NODES = [
  { label: "Google Ads", className: "sp-hub-node--gads" },
  { label: "SEO", className: "sp-hub-node--seo" },
  { label: "סושיאל", className: "sp-hub-node--social" },
  { label: "בניית אתרים", className: "sp-hub-node--web" },
  { label: "אחסון", className: "sp-hub-node--hosting" },
] as const;

/** Hub signature: connected service ecosystem */
export function HubEcosystemVisual() {
  return (
    <div className="sp-hub-ecosystem" aria-hidden="true">
      <div className="sp-hub-ecosystem-core">
        <span className="sp-hub-ecosystem-brand">Adwrks</span>
        <span className="sp-hub-ecosystem-sub">שיווק דיגיטלי 360°</span>
      </div>
      <ul className="sp-hub-ecosystem-nodes">
        {HUB_NODES.map((node) => (
          <li key={node.label} className={`sp-hub-ecosystem-node ${node.className}`}>
            {node.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Hosting hero: infrastructure grid motif */
export function HostingHeroVisual() {
  return (
    <div className="sp-compose sp-compose--hosting" aria-hidden="true">
      <div className="sp-compose-hosting-grid">
        <div className="sp-compose-hosting-node sp-compose-hosting-node--wp">WordPress</div>
        <div className="sp-compose-hosting-node sp-compose-hosting-node--app">אתר מודרני</div>
        <div className="sp-compose-hosting-lines" />
        <div className="sp-compose-hosting-pulse" />
      </div>
    </div>
  );
}

/** Modern stack architecture — conceptual, not every project */
export function ModernStackVisual() {
  return (
    <div className="sp-modern-stack" aria-hidden="true">
      <div className="sp-modern-stack-row sp-modern-stack-row--user">
        <span className="sp-modern-stack-label">משתמשים</span>
      </div>
      <div className="sp-modern-stack-arrow">↓</div>
      <div className="sp-modern-stack-row sp-modern-stack-row--vercel">
        <span className="sp-modern-stack-vendor">Vercel</span>
        <span className="sp-modern-stack-desc">CDN • פריסה • אחסון אפליקציה</span>
      </div>
      <div className="sp-modern-stack-arrow">↓</div>
      <div className="sp-modern-stack-row sp-modern-stack-row--next">
        <span className="sp-modern-stack-vendor">Next.js</span>
        <span className="sp-modern-stack-desc">אפליקציית האתר</span>
      </div>
      <div className="sp-modern-stack-bridge">
        <span className="sp-modern-stack-bridge-line" />
        <span className="sp-modern-stack-bridge-label">↔</span>
        <span className="sp-modern-stack-bridge-line" />
      </div>
      <div className="sp-modern-stack-row sp-modern-stack-row--supabase">
        <span className="sp-modern-stack-vendor">Supabase</span>
        <span className="sp-modern-stack-desc">DB • Auth • Storage — לפי צורך</span>
      </div>
    </div>
  );
}

/** Social signature: strategy → content → paid → measurement */
export function SocialWorkflowVisual() {
  const steps = ["אסטרטגיה", "תוכן וקריאייטיב", "קמפיינים ממומנים", "מדידה"];
  return (
    <ol className="sp-social-workflow" aria-hidden="true">
      {steps.map((step, i) => (
        <li key={step} className="sp-social-workflow-step">
          <span className="sp-social-workflow-index">{i + 1}</span>
          <span className="sp-social-workflow-label">{step}</span>
        </li>
      ))}
    </ol>
  );
}

/** Decorative AEO band accent */
export function SeoAeoAccent() {
  return (
    <div className="sp-aeo-accent" aria-hidden="true">
      <div className="sp-aeo-accent-orbit">
        <span className="sp-aeo-accent-chip">AI Search</span>
        <span className="sp-aeo-accent-chip">AEO</span>
        <span className="sp-aeo-accent-chip">סמנטי</span>
      </div>
    </div>
  );
}
