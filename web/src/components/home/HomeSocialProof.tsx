import Link from "next/link";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { Container } from "@/components/ui/Container";
import { getHomepageData } from "@/lib/homepage";
import type { LocaleProps } from "@/lib/locale-props";
import { getSiteConfig } from "@/lib/site";

export function HomeSocialProof({ locale = "he" }: LocaleProps) {
  const { HOMEPAGE_RESULT_QUOTES, HOMEPAGE_TESTIMONIALS, HOMEPAGE_SOCIAL_PROOF } =
    getHomepageData(locale);
  const site = getSiteConfig(locale);
  return (
    <section id="recommendations" className="home-social-proof" aria-labelledby="home-proof-heading">
      <Container>
        <header className="home-section-header reveal">
          <p className="home-section-label">{HOMEPAGE_SOCIAL_PROOF.label}</p>
          <h2 id="home-proof-heading" className="home-section-title">
            {HOMEPAGE_SOCIAL_PROOF.title}
          </h2>
          <p className="home-section-lead">
            <Link
              href={site.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="home-proof-reviews-link"
            >
              {HOMEPAGE_SOCIAL_PROOF.googleReviews}
            </Link>
          </p>
        </header>

        <div className="reveal">
          <TestimonialCarousel items={HOMEPAGE_TESTIMONIALS} ariaLabel={HOMEPAGE_SOCIAL_PROOF.carouselLabel} />
        </div>

        <p className="home-result-intro reveal">{HOMEPAGE_SOCIAL_PROOF.resultIntro}</p>
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
