import Link from "next/link";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Container } from "@/components/ui/Container";
import { getAllPosts } from "@/lib/content/loader";
import { getHomepageData } from "@/lib/homepage";
import type { LocaleProps } from "@/lib/locale-props";

export function HomeKnowledgeHub({ locale = "he" }: LocaleProps) {
  const { HOMEPAGE_CURATED_GUIDE_PATHS } = getHomepageData(locale);
  const allPosts = getAllPosts(locale);
  const guides = HOMEPAGE_CURATED_GUIDE_PATHS.map((path) =>
    allPosts.find((post) => post.path === path),
  ).filter((post): post is NonNullable<(typeof allPosts)[number]> => post != null);

  if (guides.length === 0) return null;

  return (
    <section className="home-knowledge-hub" aria-labelledby="home-knowledge-heading">
      <Container>
        <header className="home-section-header reveal">
          <p className="home-section-label">מרכז ידע</p>
          <h2 id="home-knowledge-heading" className="home-section-title">
            מדריכים שימושיים
          </h2>
          <p className="home-section-lead">
            <Link href="/blog/" className="home-knowledge-all-link">
              כל המאמרים ←
            </Link>
          </p>
        </header>

        <ul className="home-knowledge-grid reveal">
          {guides.map((post) => (
            <li key={post.path}>
              <ArticleCard post={post} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
