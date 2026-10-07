import Link from "next/link";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { Container } from "@/components/ui/Container";
import { getHomepageData } from "@/lib/homepage";
import type { LocaleProps } from "@/lib/locale-props";
import { getSiteConfig } from "@/lib/site";

export function HomeSocialProof({ locale = "he" }: LocaleProps) {
  const { HOMEPAGE_RESULT_QUOTES, HOMEPAGE_TESTIMONIALS } = getHomepageData(locale);
  const site = getSiteConfig(locale);
  return (
    <section id="recommendations" className="home-social-proof" aria-labelledby="home-proof-heading">
      <Container>
        <header className="home-section-header reveal">
          <p className="home-section-label">המלצות ותוצאות</p>
          <h2 id="home-proof-heading" className="home-section-title">
            מה הלקוחות אומרים
          </h2>
          <p className="home-section-lead">
            <Link
              href={site.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="home-proof-reviews-link"
            >
              קראו את כל הביקורות ב-Google ←
            </Link>
          </p>
        </header>

        <div className="reveal">
          <TestimonialCarousel items={HOMEPAGE_TESTIMONIALS} />
        </div>

        <p className="home-result-intro reveal">
          אנחנו לא מודדים הצלחה בלייקים – אלא בצמיחה אמיתית בעסק.
        </p>
        <div className="home-results-grid reveal">
          {HOMEPAGE_RESULT_QUOTES.map((quote) => (
            <blockquote key={quote.name} className="home-result-card">
              {"highlight" in quote && quote.highlight ? (
                <span className="home-result-badge">{quote.highlight}</span>
              ) : null}
              <p>{quote.content}</p>
              <footer>{quote.name}</footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
