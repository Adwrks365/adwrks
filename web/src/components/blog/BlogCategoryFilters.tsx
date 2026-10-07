import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { getCategories } from "@/lib/content/loader";

type BlogCategoryFiltersProps = {
  activePath?: string;
  locale?: Locale;
};

export function BlogCategoryFilters({ activePath, locale = "he" }: BlogCategoryFiltersProps) {
  const defaultBlogPath = locale === "en" ? "/en/blog/" : "/blog/";
  const resolvedActive = activePath ?? defaultBlogPath;
  const categories = [...getCategories(locale).values()]
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <nav
      className="blog-category-filters"
      aria-label={locale === "en" ? "Filter by topic" : "סינון לפי נושא"}
    >
      <ul className="blog-category-list">
        <li>
          <Link
            href={defaultBlogPath}
            className={`blog-category-chip ${resolvedActive === defaultBlogPath ? "is-active" : ""}`.trim()}
            aria-current={resolvedActive === defaultBlogPath ? "page" : undefined}
          >
            {locale === "en" ? "All" : "הכל"}
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={cat.path}
              className={`blog-category-chip ${resolvedActive === cat.path ? "is-active" : ""}`.trim()}
              aria-current={resolvedActive === cat.path ? "page" : undefined}
            >
              {cat.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
