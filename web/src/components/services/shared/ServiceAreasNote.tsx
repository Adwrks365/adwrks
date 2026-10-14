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
        ? "The Karmiel studio also works with businesses in the north, the Krayot, and central Israel. "
        : "הסטודיו בכרמיאל מלווה עסקים גם בצפון, בקריות ובמרכז. "}
      <Link href={href}>{locale === "en" ? "Service areas" : "אזורי הפעילות"}</Link>
    </p>
  );
}
