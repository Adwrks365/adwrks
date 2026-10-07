import Image from "next/image";
import { ServiceCampaignIcon } from "./ServiceCampaignIcon";

import type { Locale } from "@/i18n/routing";

/** Abstract SERP/search composition — no fake rankings or metrics */
export function SeoHeroVisual({ locale = "he" }: { locale?: Locale }) {
  const searchPlaceholder =
    locale === "en" ? "Organic search • User intent" : "חיפוש אורגני • כוונת משתמש";
  const tags =
    locale === "en"
      ? (["Content", "Technical", "AEO"] as const)
      : (["תוכן", "טכני", "AEO"] as const);

  return (
    <div className="sp-compose sp-compose--seo" aria-hidden="true">
      <div className="sp-compose-seo-panel">
        <div className="sp-compose-search-bar">
          <span className="sp-compose-search-icon" />
          <span className="sp-compose-search-placeholder">{searchPlaceholder}</span>
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
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

type GoogleAdsHeroVisualProps = {
  image: { src: string; alt: string; width: number; height: number };
  partnerBadge: { src: string; alt: string };
  campaigns: readonly { label: string; icon: "search" | "display" | "youtube" | "shopping" | "local" }[];
};

/** Campaign ecosystem card — real asset focal point + structured campaign rail */
export function GoogleAdsHeroVisual({ image, partnerBadge, campaigns }: GoogleAdsHeroVisualProps) {
  return (
    <div className="sp-gads-hero-visual">
      <div className="sp-gads-hero-card">
        <div className="sp-gads-hero-glow" aria-hidden="true" />
        <div className="sp-gads-hero-frame">
          <div className="sp-gads-hero-frame-bar" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="sp-gads-hero-image"
            sizes="(min-width: 768px) 42vw, 100vw"
            priority
          />
        </div>
        <ul className="sp-gads-hero-rail" aria-hidden="true">
          {campaigns.map((item) => (
            <li key={item.label} className="sp-gads-hero-rail-item">
              <ServiceCampaignIcon kind={item.icon} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="sp-gads-hero-partner">
          <Image
            src={partnerBadge.src}
            alt={partnerBadge.alt}
            width={72}
            height={72}
            className="sp-gads-hero-partner-badge"
            sizes="72px"
          />
          <span className="sp-gads-hero-partner-text">Google Partner • מאז 2018</span>
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

const HUB_NODES_HE = [
  { label: "Google Ads", className: "sp-hub-node--gads" },
  { label: "SEO", className: "sp-hub-node--seo" },
  { label: "סושיאל", className: "sp-hub-node--social" },
  { label: "בניית אתרים", className: "sp-hub-node--web" },
  { label: "אחסון", className: "sp-hub-node--hosting" },
] as const;

const HUB_NODES_EN = [
  { label: "Google Ads", className: "sp-hub-node--gads" },
  { label: "SEO", className: "sp-hub-node--seo" },
  { label: "Social", className: "sp-hub-node--social" },
  { label: "Websites", className: "sp-hub-node--web" },
  { label: "Hosting", className: "sp-hub-node--hosting" },
] as const;

/** Hub signature: connected service ecosystem */
export function HubEcosystemVisual({ locale = "he" }: { locale?: Locale }) {
  const nodes = locale === "en" ? HUB_NODES_EN : HUB_NODES_HE;
  const sub = locale === "en" ? "360° digital marketing" : "שיווק דיגיטלי 360°";
  return (
    <div className="sp-hub-ecosystem" aria-hidden="true">
      <svg className="sp-hub-ecosystem-lines" viewBox="0 0 200 200" preserveAspectRatio="none">
        <line x1="100" y1="100" x2="100" y2="24" />
        <line x1="100" y1="100" x2="172" y2="68" />
        <line x1="100" y1="100" x2="156" y2="156" />
        <line x1="100" y1="100" x2="44" y2="156" />
        <line x1="100" y1="100" x2="28" y2="68" />
      </svg>
      <div className="sp-hub-ecosystem-core">
        <span className="sp-hub-ecosystem-brand">Adwrks</span>
        <span className="sp-hub-ecosystem-sub">{sub}</span>
      </div>
      <ul className="sp-hub-ecosystem-nodes">
        {nodes.map((node) => (
          <li key={node.label} className={`sp-hub-ecosystem-node ${node.className}`}>
            {node.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Hosting hero: two-path infrastructure — WordPress + modern stack */
export function HostingHeroVisual() {
  return (
    <div className="sp-hosting-hero-visual" aria-hidden="true">
      <div className="sp-hosting-hero-diagram">
        <div className="sp-hosting-hero-site">
          <span className="sp-hosting-hero-site-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <rect x="3" y="4" width="18" height="14" rx="2" />
              <path d="M8 21h8M12 18v3" />
            </svg>
          </span>
          <span className="sp-hosting-hero-site-label">האתר שלכם</span>
        </div>
        <div className="sp-hosting-hero-trunk" />
        <div className="sp-hosting-hero-paths">
          <div className="sp-hosting-hero-path sp-hosting-hero-path--wp">
            <span className="sp-hosting-hero-path-badge">WordPress</span>
            <ul className="sp-hosting-hero-path-points">
              <li>אחסון מנוהל</li>
              <li>תחזוקה</li>
              <li>גיבויים + SSL</li>
            </ul>
          </div>
          <div className="sp-hosting-hero-path sp-hosting-hero-path--modern">
            <span className="sp-hosting-hero-path-badge">אתר מודרני</span>
            <ul className="sp-hosting-hero-path-points">
              <li>תשתית מותאמת</li>
              <li>
                <span className="sp-hosting-hero-vendors">
                  <span>Next.js</span>
                  <span>Vercel</span>
                  <span>Supabase</span>
                </span>
              </li>
            </ul>
            <span className="sp-hosting-hero-path-note">לפי ארכיטקטורת הפרויקט</span>
          </div>
        </div>
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
