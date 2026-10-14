import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { HUB_EN_PATH, HUB_HE_PATH } from "@/lib/pages/locations/paths";

type ServiceAreasNoteProps = {
  locale?: Locale;
};

/** A quiet return path from a service page to the service-area hub. */
export function ServiceAreasNote({ locale = "he" }: ServiceAreasNoteProps) {
  const href = locale === "en" ? HUB_EN_PATH : HUB_HE_PATH;

  return (
    <p className="sp-areas-note">
      {locale === "en"
        ? "We work with businesses nationwide — north, center, Sharon, Jerusalem, and the south. "
        : "אנחנו מלווים עסקים בפריסה ארצית — צפון, מרכז, שרון, ירושלים ודרום. "}
      <Link href={href}>{locale === "en" ? "All service areas" : "לכל אזורי השירות"}</Link>
    </p>
  );
}
