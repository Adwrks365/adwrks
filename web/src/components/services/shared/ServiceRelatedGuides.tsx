import Link from "next/link";
import { forwardArrow } from "@/i18n/ui-arrows";
import type { Locale } from "@/i18n/routing";
import type { ContentItem } from "@/lib/content/types";

type ServiceRelatedGuidesProps = {
  posts: ContentItem[];
  locale?: Locale;
  kicker?: string;
};

export function ServiceRelatedGuides({
  posts,
  locale = "he",
  kicker,
}: ServiceRelatedGuidesProps) {
  const guideKicker = kicker ?? (locale === "en" ? "Guide" : "מדריך");
  if (posts.length === 0) return null;

  return (
    <ul className="sp-guides-grid">
      {posts.map((post) => (
        <li key={post.path}>
          <Link href={post.path} className="sp-guide-card">
            <span className="sp-guide-kicker">{guideKicker}</span>
            <span className="sp-guide-title">{post.title.replace(/&#8211;|&amp;#8211;/g, "–")}</span>
            <span className="sp-guide-arrow" aria-hidden="true">
              {forwardArrow(locale)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
