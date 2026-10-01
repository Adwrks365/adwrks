import Link from "next/link";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Container } from "@/components/ui/Container";
import { getAllPosts } from "@/lib/content/loader";
import { HOMEPAGE_CURATED_GUIDE_PATHS } from "@/lib/homepage/data";

export function HomeKnowledgeHub() {
  const allPosts = getAllPosts();
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
