import Image from "next/image";
import Link from "next/link";
import { HOMEPAGE_TESTIMONIALS } from "@/lib/homepage/data";
import { SITE } from "@/lib/site";

export function ArticleFacebookSocialProof() {
  const items = HOMEPAGE_TESTIMONIALS.slice(0, 2);
  if (items.length === 0) return null;

  return (
    <div className="article-sidebar-card article-fb-proof">
      <h2 className="article-sidebar-title">המלצות מ-Facebook</h2>
      <ul className="article-fb-proof-list">
        {items.map((item) => (
          <li key={item.name} className="article-fb-proof-item">
            <blockquote className="article-fb-proof-quote">
              <p>{item.content.split("\n")[0]}</p>
              <footer className="article-fb-proof-footer">
                {item.image && (
                  <Image
                    src={item.image}
                    alt=""
                    width={32}
                    height={32}
                    className="article-fb-proof-avatar"
                  />
                )}
                <cite>
                  <span className="article-fb-proof-name">{item.name}</span>
                  {item.title && <span className="article-fb-proof-role">{item.title}</span>}
                </cite>
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
      <Link
        href={SITE.social.facebook}
        className="article-fb-proof-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        צפו בכל ההמלצות ב-Facebook
      </Link>
    </div>
  );
}
