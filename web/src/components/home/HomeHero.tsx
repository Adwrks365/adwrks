import Image from "next/image";
import Link from "next/link";
import { ContextualPopupTrigger } from "@/components/popups/ContextualPopupTrigger";
import { Container } from "@/components/ui/Container";
import { HOMEPAGE_CAPABILITY_CHIPS, HOMEPAGE_IMAGES } from "@/lib/homepage/data";
import { SITE } from "@/lib/site";

function HeroPattern() {
  return (
    <svg
      className="home-hero-v2-pattern home-hero-v2-pattern--mobile"
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-pattern-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(37, 124, 255, 0.14)" />
          <stop offset="100%" stopColor="rgba(244, 90, 42, 0.06)" />
        </linearGradient>
      </defs>
      <circle cx="680" cy="80" r="120" fill="url(#hero-pattern-grad)" />
      <circle cx="120" cy="320" r="90" fill="rgba(37, 124, 255, 0.06)" />
      <path
        d="M0 280 Q200 220 400 260 T800 240"
        fill="none"
        stroke="rgba(2, 132, 199, 0.12)"
        strokeWidth="1.5"
      />
      <path
        d="M0 320 Q250 280 500 310 T800 290"
        fill="none"
        stroke="rgba(244, 90, 42, 0.08)"
        strokeWidth="1"
      />
    </svg>
  );
}

export function HomeHero() {
  return (
    <section className="home-hero-v2 home-hero-v2--text-led" aria-labelledby="home-hero-heading">
      <HeroPattern />
      <Container>
        <div className="home-hero-v2-shell">
          <div className="home-hero-v2-inner">
            <p className="home-hero-badge">סוכנות שיווק דיגיטלי • {SITE.foundedNote}</p>
            <h1 id="home-hero-heading" className="home-hero-title text-slate-900">
              <span className="home-hero-highlight">סוכנות שיווק דיגיטלי</span>
            </h1>
            <p className="home-hero-lead">
              מעטפת 360° של שיווק דיגיטלי —{" "}
              <strong className="text-sky-700">SEO, Google Ads, סושיאל ובניית אתרים</strong> — לתוצאות
              מדידות ו-ROI שמביאות פניות וצמיחה.
            </p>
            <ul className="home-hero-capabilities" aria-label="יכולות מרכזיות">
              {HOMEPAGE_CAPABILITY_CHIPS.map((chip) => (
                <li key={chip.href}>
                  <Link href={chip.href} className="home-hero-capability-chip">
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="home-hero-actions justify-center lg:justify-start">
              <ContextualPopupTrigger className="btn btn-primary btn-lg">
                ייעוץ ללא התחייבות
              </ContextualPopupTrigger>
              <Link href="#portfolio" className="btn btn-outline btn-lg">
                צפו בעבודות שלנו
              </Link>
            </div>
          </div>
          <div className="home-hero-v2-visual">
            <div className="home-hero-visual-glow" aria-hidden="true" />
            <Image
              src={HOMEPAGE_IMAGES.heroPhoto}
              alt={HOMEPAGE_IMAGES.heroPhotoAlt}
              width={560}
              height={560}
              loading="lazy"
              sizes="(min-width: 1024px) 420px, 0px"
              className="home-hero-v2-image"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
