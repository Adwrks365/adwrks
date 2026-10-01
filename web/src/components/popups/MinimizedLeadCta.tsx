"use client";

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 10h8M8 14h5M6 4h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-4 3V6a2 2 0 012-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type MinimizedLeadCtaProps = {
  onClick: () => void;
};

export function MinimizedLeadCta({ onClick }: MinimizedLeadCtaProps) {
  return (
    <button
      type="button"
      className="popup-minimized-cta"
      onClick={onClick}
      aria-label="בואו נדבר — פתיחת טופס ייעוץ"
    >
      <span className="popup-minimized-cta-icon" aria-hidden="true">
        <ChatIcon />
      </span>
      <span className="popup-minimized-cta-text">
        <span className="popup-minimized-cta-title">בואו נדבר</span>
        <span className="popup-minimized-cta-sub">ייעוץ ראשוני ללא התחייבות</span>
      </span>
    </button>
  );
}
