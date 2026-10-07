import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import type { ArticleAuthor } from "@/lib/content/article";
import { getArticleUi } from "@/lib/i18n/article-ui";
import { SITE, FOLLOW_SOCIAL } from "@/lib/site";

type ArticleAuthorCardProps = {
  author: ArticleAuthor;
  locale?: Locale;
};

export function ArticleAuthorCard({ author, locale = "he" }: ArticleAuthorCardProps) {
  const ui = getArticleUi(locale);

  return (
    <div className="article-end-module article-author-card article-author-card--rich">
      <h2 className="article-end-module-title">{ui.aboutAuthor}</h2>
      <div className="article-author">
        {author.avatarUrl && (
          <div className="article-author-avatar-wrap article-author-avatar-wrap--rich">
            <Image
              src={author.avatarUrl}
              alt=""
              width={56}
              height={56}
              className="article-author-avatar article-author-avatar--rich"
            />
          </div>
        )}
        <div className="article-author-content">
          <p className="article-author-name">{author.name}</p>
          {author.role && <p className="article-author-role">{author.role}</p>}
          <p className="article-author-bio">{author.bio}</p>
          <div className="article-author-links">
            <Link href={ui.contactHref} className="article-author-link">
              {ui.contactAuthor}
            </Link>
            {FOLLOW_SOCIAL.map((social) => (
              <a
                key={social.href}
                href={social.href}
                className="article-author-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.label}
              </a>
            ))}
            <a href={SITE.phoneTel} className="article-author-link">
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
