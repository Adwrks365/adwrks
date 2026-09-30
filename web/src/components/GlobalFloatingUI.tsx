"use client";

import { useCallback, useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const A11Y_KEY = "adwrks-a11y-prefs";

type A11yPrefs = {
  fontScale: number;
  highContrast: boolean;
  underlineLinks: boolean;
  readableFont: boolean;
  reduceMotion: boolean;
};

const DEFAULT_PREFS: A11yPrefs = {
  fontScale: 1,
  highContrast: false,
  underlineLinks: false,
  readableFont: false,
  reduceMotion: false,
};

function loadPrefs(): A11yPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(A11Y_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function applyPrefs(prefs: A11yPrefs) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--a11y-font-scale", String(prefs.fontScale));
  root.classList.toggle("a11y-high-contrast", prefs.highContrast);
  root.classList.toggle("a11y-underline-links", prefs.underlineLinks);
  root.classList.toggle("a11y-readable-font", prefs.readableFont);
  root.classList.toggle("a11y-reduce-motion", prefs.reduceMotion);
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/** Universal accessibility figure — person with outstretched arms. */
function AccessibilityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="4.2" r="2.1" />
      <path d="M3.2 9.2h17.6v2.1H13.2V13l2.7 6.6h-2.3L12 15.2l-1.6 4.4H8.1L10.8 13V11.3H3.2V9.2z" />
    </svg>
  );
}

function ScrollTopIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GlobalFloatingUI() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yPrefs>(() =>
    typeof window === "undefined" ? DEFAULT_PREFS : loadPrefs(),
  );

  useEffect(() => {
    applyPrefs(prefs);
  }, [prefs]);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 280);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const savePrefs = useCallback((next: A11yPrefs) => {
    setPrefs(next);
    localStorage.setItem(A11Y_KEY, JSON.stringify(next));
  }, []);

  const scrollToTop = () => {
    const reduce =
      prefs.reduceMotion ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      <div className="floating-contact-rail" aria-label="יצירת קשר מהירה">
        <a
          href={SITE.whatsapp}
          className="floating-action floating-action-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          title="WhatsApp"
        >
          <WhatsAppIcon />
          <span className="floating-action-label">WhatsApp</span>
        </a>
        <a
          href={SITE.phoneTel}
          className="floating-action floating-action-phone"
          aria-label={`טלפון ${SITE.phoneDisplay}`}
          title={SITE.phoneDisplay}
        >
          <PhoneIcon />
          <span className="floating-action-label">טלפון</span>
        </a>
      </div>

      <div className="floating-left-rail" aria-label="כלי עזר">
        <div className={`floating-util-group ${showScrollTop ? "has-scroll-top" : ""}`}>
          {a11yOpen && (
            <div className="a11y-panel" role="dialog" aria-label="הגדרות נגישות">
              <p className="a11y-panel-title">נגישות</p>
              <p className="a11y-panel-note">כלי עזר — לא מהווה הצהרת נגישות מלאה.</p>
              <div className="a11y-panel-actions">
                <button type="button" onClick={() => savePrefs({ ...prefs, fontScale: Math.min(1.25, prefs.fontScale + 0.05) })}>
                  הגדלת טקסט
                </button>
                <button type="button" onClick={() => savePrefs({ ...prefs, fontScale: Math.max(0.9, prefs.fontScale - 0.05) })}>
                  הקטנת טקסט
                </button>
                <button type="button" onClick={() => savePrefs({ ...prefs, fontScale: 1 })}>
                  איפוס גודל
                </button>
                <button type="button" onClick={() => savePrefs({ ...prefs, highContrast: !prefs.highContrast })}>
                  {prefs.highContrast ? "✓ " : ""}ניגודיות גבוהה
                </button>
                <button type="button" onClick={() => savePrefs({ ...prefs, underlineLinks: !prefs.underlineLinks })}>
                  {prefs.underlineLinks ? "✓ " : ""}קו תחתון לקישורים
                </button>
                <button type="button" onClick={() => savePrefs({ ...prefs, readableFont: !prefs.readableFont })}>
                  {prefs.readableFont ? "✓ " : ""}גופן קריא
                </button>
                <button type="button" onClick={() => savePrefs({ ...prefs, reduceMotion: !prefs.reduceMotion })}>
                  {prefs.reduceMotion ? "✓ " : ""}הפחתת תנועה
                </button>
                <button type="button" className="a11y-reset" onClick={() => savePrefs(DEFAULT_PREFS)}>
                  איפוס הכל
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            className="floating-util-btn floating-util-btn-a11y"
            aria-label="נגישות"
            aria-expanded={a11yOpen}
            onClick={() => setA11yOpen(!a11yOpen)}
            title="נגישות"
          >
            <AccessibilityIcon />
          </button>

          {showScrollTop && (
            <button
              type="button"
              className="floating-util-btn floating-util-btn-top is-visible"
              aria-label="חזרה לראש העמוד"
              onClick={scrollToTop}
              title="חזרה לראש העמוד"
            >
              <ScrollTopIcon />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
