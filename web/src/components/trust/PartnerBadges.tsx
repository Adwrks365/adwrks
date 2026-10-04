import Image from "next/image";
import Link from "next/link";
import { GOOGLE_PARTNER_BADGE, META_PARTNER_BADGE } from "@/lib/partner-badges";
import { SITE } from "@/lib/site";

type PartnerBadgesProps = {
  variant?: "standard" | "compact";
  className?: string;
  /** Google-only mode for platform-specific contexts. */
  googleOnly?: boolean;
};

export function PartnerBadges({
  variant = "standard",
  className = "",
  googleOnly = false,
}: PartnerBadgesProps) {
  return (
    <div
      className={`partner-badges partner-badges--${variant} ${className}`.trim()}
      role="list"
      aria-label="שותפויות מוסמכות"
    >
      <div className="partner-badge-item partner-badge-item--google" role="listitem">
        <Link
          href={SITE.googlePartnerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="partner-badge-link partner-badge-link--google"
          aria-label="Google Partner"
        >
          <Image
            src={GOOGLE_PARTNER_BADGE.src}
            alt="Google Partner"
            width={GOOGLE_PARTNER_BADGE.width}
            height={GOOGLE_PARTNER_BADGE.height}
            loading="lazy"
            className="partner-badge-img partner-badge-img--google"
          />
        </Link>
      </div>
      {!googleOnly && (
        <div className="partner-badge-item partner-badge-item--meta" role="listitem">
          <Image
            src={META_PARTNER_BADGE.src}
            alt="Meta Business Partner"
            width={META_PARTNER_BADGE.width}
            height={META_PARTNER_BADGE.height}
            loading="lazy"
            className="partner-badge-img partner-badge-img--meta"
          />
        </div>
      )}
    </div>
  );
}
