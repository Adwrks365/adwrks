import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { getHomepageData } from "@/lib/homepage";
import type { LocaleProps } from "@/lib/locale-props";

function platformLogoClass(alt: string) {
  if (alt === "Facebook" || alt === "Instagram" || alt === "YouTube" || alt === "Gemini") {
    return "platform-marquee-logo is-icon";
  }
  if (alt === "WordPress") return "platform-marquee-logo is-wide";
  return "platform-marquee-logo is-word";
}

export function HomePlatformMarquee({ locale = "he" }: LocaleProps) {
  const { HOMEPAGE_PLATFORM_LOGOS } = getHomepageData(locale);
  return (
    <section className="home-platform-marquee" aria-labelledby="home-platform-heading">
      <Container>
        <header className="home-section-header reveal">
          <h2 id="home-platform-heading" className="home-section-title">
            עובדים עם הכלים והפלטפורמות המובילים בדיגיטל
          </h2>
          <p className="home-section-lead">
            ערוצי שיווק, מערכות ניהול תוכן וכלי AI — במעטפת אחת מותאמת לעסק
          </p>
        </header>
        <div className="platform-marquee reveal" aria-label="כלים ופלטפורמות">
          <div className="platform-marquee-track">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="platform-marquee-set"
                aria-hidden={copy === 1 ? true : undefined}
              >
                {HOMEPAGE_PLATFORM_LOGOS.map((logo) => (
                  <li key={`${copy}-${logo.src}`} className="platform-marquee-item">
                    <Image
                      src={logo.src}
                      alt={copy === 0 ? logo.alt : ""}
                      width={140}
                      height={56}
                      loading="lazy"
                      sizes="140px"
                      className={platformLogoClass(logo.alt)}
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
