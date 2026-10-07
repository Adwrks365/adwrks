"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { localeFromPath } from "@/i18n/locale";

const STORAGE_KEY = "adwrks_cookie_consent";

export function CookieConsentBanner() {
  const t = useTranslations("CookieConsent");
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const privacyHref = locale === "en" ? "/en/privacy-policy/" : "/privacy-policy/";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  function accept(value: "accepted" | "declined") {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite">
      <p className="cookie-consent-message">
        {t("message")}{" "}
        <Link href={privacyHref} className="cookie-consent-link">
          {t("learnMore")}
        </Link>
      </p>
      <div className="cookie-consent-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => accept("accepted")}>
          {t("accept")}
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => accept("declined")}>
          {t("decline")}
        </button>
      </div>
    </div>
  );
}
