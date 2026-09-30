import Image from "next/image";
import { ARTICLE_SIDEBAR_TESTIMONIALS } from "@/lib/content/article-testimonials";

export function ArticleTestimonialSnippet() {
  const item = ARTICLE_SIDEBAR_TESTIMONIALS[0];
  if (!item) return null;

  return (
    <div className="article-sidebar-card">
      <h2 className="article-sidebar-title">מה הלקוחות אומרים</h2>
      <blockquote className="article-testimonial-snippet">
        <p>{item.content.split("\n")[0]}</p>
        <footer className="article-testimonial-footer">
          {item.image && (
            <Image
              src={item.image}
              alt=""
              width={36}
              height={36}
              className="article-testimonial-avatar"
            />
          )}
          <cite>
            <span className="article-testimonial-name">{item.name}</span>
            {item.title && <span className="article-testimonial-role">{item.title}</span>}
          </cite>
        </footer>
      </blockquote>
    </div>
  );
}
