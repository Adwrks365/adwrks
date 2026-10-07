const CONSULT_SERVICES = [
  { label: "Google Ads", short: "Ads" },
  { label: "SEO", short: "SEO" },
  { label: "Social", short: "Social" },
  { label: "Websites", short: "Web" },
] as const;

import type { Locale } from "@/i18n/routing";

type ContactHeroVisualProps = {
  locale?: Locale;
};

export function ContactHeroVisual({ locale = "he" }: ContactHeroVisualProps) {
  const tagline = locale === "en" ? "Digital marketing consultation" : "ייעוץ שיווק דיגיטלי";
  return (
    <div className="cp-hero-visual" aria-hidden="true">
      <div className="cp-consult-card">
        <div className="cp-consult-icon-wrap">
          <svg className="cp-consult-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="10" width="40" height="28" rx="8" stroke="currentColor" strokeWidth="2.5" />
            <path
              d="M14 22h20M14 28h12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="38" cy="14" r="6" fill="currentColor" opacity="0.15" />
            <path
              d="M36 14l1.5 1.5L41 12"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="cp-consult-brand">Adwrks 365</p>
        <p className="cp-consult-tagline">{tagline}</p>
        <ul className="cp-consult-services">
          {CONSULT_SERVICES.map((service) => (
            <li key={service.label} className="cp-consult-service">
              <span className="cp-consult-service-mark" aria-hidden="true">
                {service.short}
              </span>
              <span className="cp-consult-service-label">{service.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
