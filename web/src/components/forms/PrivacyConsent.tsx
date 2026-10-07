import Link from "next/link";
import type { Locale } from "@/i18n/routing";

type PrivacyConsentProps = {
  id: string;
  locale?: Locale;
};

export function PrivacyConsent({ id, locale = "he" }: PrivacyConsentProps) {
  const policyHref = locale === "en" ? "/en/privacy-policy/" : "/privacy-policy/";

  if (locale === "en") {
    return (
      <label className="privacy-consent" htmlFor={id}>
        <input id={id} name="privacyConsent" type="checkbox" value="on" required />
        <span>
          I agree to the{" "}
          <Link href={policyHref} className="privacy-consent-link">
            privacy policy
          </Link>{" "}
          and consent to being contacted using the details I provided.
        </span>
      </label>
    );
  }

  return (
    <label className="privacy-consent" htmlFor={id}>
      <input id={id} name="privacyConsent" type="checkbox" value="on" required />
      <span>
        אני מאשר/ת את{" "}
        <Link href={policyHref} className="privacy-consent-link">
          מדיניות הפרטיות
        </Link>{" "}
        ומסכים/ה לשימוש בפרטים שמסרתי לצורך יצירת קשר.
      </span>
    </label>
  );
}
