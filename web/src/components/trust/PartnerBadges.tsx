import Image from "next/image";
import Link from "next/link";
import { GOOGLE_PARTNER_BADGE, META_PARTNER_BADGE } from "@/lib/partner-badges";
import { SITE } from "@/lib/site";

type PartnerBadgesProps = {
  variant?: "standard" | "compact";
  className?: string;
  /** When true, badges link to official partner pages (Footer). */
  linked?: boolean;
  /** Google-only mode for platform-specific contexts. */
  googleOnly?: boolean;
};

const META_PARTNER_URL = "https://www.facebook.com/business/partner-directory/search";

export function PartnerBadges({
  variant = "standard",
  className = "",
  linked = false,
  googleOnly = false,
}: PartnerBadgesProps) {
  const badges = [
    {
      key: "google",
      ...GOOGLE_PARTNER_BADGE,
      href: SITE.googlePartnerUrl,
    },
    ...(googleOnly
      ? []
      : [
          {
            key: "meta",
            ...META_PARTNER_BADGE,
            href: META_PARTNER_URL,
          },
        ]),
  ];

  return (
    <div
      className={`partner-badges partner-badges--${variant} ${className}`.trim()}
      role="list"
      aria-label="שותפויות מוסמכות"
    >
      {badges.map((badge) => {
        const img = (
          <Image
            src={badge.src}
            alt={badge.alt}
            width={badge.width}
            height={badge.height}
            loading="lazy"
            className={`partner-badge-img partner-badge-img--${badge.key}`}
          />
        );

        return (
          <div key={badge.key} className="partner-badge-item" role="listitem">
            {linked ? (
              <Link
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-badge-link"
                aria-label={badge.alt}
              >
                {img}
              </Link>
            ) : (
              img
            )}
          </div>
        );
      })}
    </div>
  );
}
