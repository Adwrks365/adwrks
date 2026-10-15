import Link from "next/link";
import { ContextualPopupTrigger } from "@/components/popups/ContextualPopupTrigger";
import { Container } from "@/components/ui/Container";
import { getHomepageData } from "@/lib/homepage";
import type { LocaleProps } from "@/lib/locale-props";
import { getSiteConfig } from "@/lib/site";

export function HomeHero({ locale = "he" }: LocaleProps) {
  const site = getSiteConfig(locale);
  const hp = getHomepageData(locale);
  const heroLcpSrc = hp.HOMEPAGE_IMAGES.heroPhotoLcp;

  return (
    <section
      className="home-hero-v2 home-hero-v2--text-led home-hero-v2-lcp"
      aria-labelledby="home-hero-heading"
    >
      <Container>
        <div className="home-hero-v2-shell">
          <div className="home-hero-v2-visual">
            <img
              src={heroLcpSrc}
              alt={hp.HOMEPAGE_IMAGES.heroPhotoAlt}
              width={560}
              height={560}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="home-hero-v2-image"
            />
          </div>
          <div className="home-hero-v2-inner">
            <p className="home-hero-badge">
              {site.tagline} • {site.foundedNote}
            </p>
            <h1 id="home-hero-heading" className="home-hero-title text-slate-900">
              <span className="home-hero-highlight">{site.tagline}</span>
            </h1>
            <p className="home-hero-lead">
              {locale === "en" ? (
                <>
                  360° digital marketing —{" "}
                  <strong className="text-sky-700">SEO, Google Ads, social & websites</strong> — for
                  measurable ROI, leads, and growth.
                </>
              ) : (
                <>
                  מעטפת 360° של שיווק דיגיטלי —{" "}
                  <strong className="text-sky-700">SEO, Google Ads, סושיאל ובניית אתרים</strong> — לתוצאות
                  מדידות ו-ROI שמביאות פניות וצמיחה.
                </>
              )}
            </p>
            <ul className="home-hero-capabilities" aria-label={locale === "en" ? "Core capabilities" : "יכולות מרכזיות"}>
              {hp.HOMEPAGE_CAPABILITY_CHIPS.map((chip) => (
                <li key={chip.href}>
                  <Link href={chip.href} className="home-hero-capability-chip">
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="home-hero-actions justify-center lg:justify-start">
              <ContextualPopupTrigger className="btn btn-primary btn-lg">
                {locale === "en" ? "Free consultation" : "ייעוץ ללא התחייבות"}
              </ContextualPopupTrigger>
              <Link href="#portfolio" className="btn btn-outline btn-lg">
                {locale === "en" ? "View our work" : "צפו בעבודות שלנו"}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
