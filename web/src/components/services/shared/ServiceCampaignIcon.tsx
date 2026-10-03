type CampaignIconKind = "search" | "display" | "youtube" | "shopping" | "local" | "optimize";

type ServiceCampaignIconProps = {
  kind: CampaignIconKind;
};

export function ServiceCampaignIcon({ kind }: ServiceCampaignIconProps) {
  return (
    <span className={`sp-campaign-icon sp-campaign-icon--${kind}`} aria-hidden="true">
      {kind === "search" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      )}
      {kind === "display" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M8 21h8" />
        </svg>
      )}
      {kind === "youtube" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="6" width="18" height="12" rx="3" />
          <path d="M10 9.5v5l5-2.5-5-2.5z" fill="currentColor" stroke="none" />
        </svg>
      )}
      {kind === "shopping" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6h15l-1.5 9H7.5L6 6z" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="17" cy="19" r="1.5" />
        </svg>
      )}
      {kind === "local" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" />
          <circle cx="12" cy="11" r="2.5" />
        </svg>
      )}
      {kind === "optimize" && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 14l4-4 4 4 6-8" />
          <path d="M4 20h16" />
        </svg>
      )}
    </span>
  );
}
