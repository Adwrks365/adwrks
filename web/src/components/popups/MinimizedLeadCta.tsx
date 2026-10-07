"use client";

import { usePathname } from "next/navigation";
import { localeFromPath } from "@/i18n/locale";

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
  onDismiss: () => void;
};

export function MinimizedLeadCta({ onClick, onDismiss }: MinimizedLeadCtaProps) {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const isEn = locale === "en";

  return (
    <div className="popup-minimized-cta-wrap">
      <button
        type="button"
        className="popup-minimized-cta"
        onClick={onClick}
        aria-label={
          isEn ? "Let's talk — open consultation form" : "בואו נדבר — פתיחת טופס ייעוץ"
        }
      >
        <span className="popup-minimized-cta-icon" aria-hidden="true">
          <ChatIcon />
        </span>
        <span className="popup-minimized-cta-text">
          <span className="popup-minimized-cta-title">{isEn ? "Let's talk" : "בואו נדבר"}</span>
          <span className="popup-minimized-cta-sub">
            {isEn ? "Free initial consultation" : "ייעוץ ראשוני ללא התחייבות"}
          </span>
        </span>
      </button>
      <button
        type="button"
        className="popup-minimized-cta-close"
        aria-label={isEn ? "Dismiss contact button" : "סגירת כפתור יצירת קשר"}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onDismiss();
        }}
      >
        ×
      </button>
    </div>
  );
}
