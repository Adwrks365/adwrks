import Link from "next/link";

type PrivacyConsentProps = {
  id: string;
};

export function PrivacyConsent({ id }: PrivacyConsentProps) {
  return (
    <label className="privacy-consent" htmlFor={id}>
      <input id={id} name="privacyConsent" type="checkbox" value="on" required />
      <span>
        אני מאשר/ת את{" "}
        <Link href="/privacy-policy/" className="privacy-consent-link">
          מדיניות הפרטיות
        </Link>{" "}
        ומסכים/ה לשימוש בפרטים שמסרתי לצורך יצירת קשר.
      </span>
    </label>
  );
}
