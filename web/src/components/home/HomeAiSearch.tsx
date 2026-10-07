import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getHomepageData } from "@/lib/homepage";
import type { LocaleProps } from "@/lib/locale-props";

export function HomeAiSearch({ locale = "he" }: LocaleProps) {
  const { HOMEPAGE_AI_SEARCH } = getHomepageData(locale);
  return (
    <section className="home-ai-search" aria-labelledby="home-ai-search-heading">
      <Container narrow>
        <div className="home-ai-search-inner">
          <h2 id="home-ai-search-heading" className="home-ai-search-title">
            {HOMEPAGE_AI_SEARCH.title}
          </h2>
          <p className="home-ai-search-body">{HOMEPAGE_AI_SEARCH.body}</p>
          <Link href={HOMEPAGE_AI_SEARCH.ctaHref} className="home-ai-search-link">
            {HOMEPAGE_AI_SEARCH.ctaLabel} ←
          </Link>
        </div>
      </Container>
    </section>
  );
}
