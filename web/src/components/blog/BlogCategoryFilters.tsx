import Link from "next/link";
import { getCategories } from "@/lib/content/loader";

type BlogCategoryFiltersProps = {
  activePath?: string;
};

export function BlogCategoryFilters({ activePath = "/blog/" }: BlogCategoryFiltersProps) {
  const categories = [...getCategories().values()]
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <nav className="blog-category-filters" aria-label="סינון לפי נושא">
      <ul className="blog-category-list">
        <li>
          <Link
            href="/blog/"
            className={`blog-category-chip ${activePath === "/blog/" ? "is-active" : ""}`.trim()}
            aria-current={activePath === "/blog/" ? "page" : undefined}
          >
            הכל
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={cat.path}
              className={`blog-category-chip ${activePath === cat.path ? "is-active" : ""}`.trim()}
              aria-current={activePath === cat.path ? "page" : undefined}
            >
              {cat.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
