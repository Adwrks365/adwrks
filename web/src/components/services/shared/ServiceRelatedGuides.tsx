import Link from "next/link";
import type { ContentItem } from "@/lib/content/types";

type ServiceRelatedGuidesProps = {
  posts: ContentItem[];
  kicker?: string;
};

export function ServiceRelatedGuides({ posts, kicker = "מדריך" }: ServiceRelatedGuidesProps) {
  if (posts.length === 0) return null;

  return (
    <ul className="sp-guides-grid">
      {posts.map((post) => (
        <li key={post.path}>
          <Link href={post.path} className="sp-guide-card">
            <span className="sp-guide-kicker">{kicker}</span>
            <span className="sp-guide-title">{post.title.replace(/&#8211;|&amp;#8211;/g, "–")}</span>
            <span className="sp-guide-arrow" aria-hidden="true">
              ←
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
