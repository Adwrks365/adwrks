import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getHomepageData } from "@/lib/homepage";
import type { LocaleProps } from "@/lib/locale-props";

export function HomeVision({ locale = "he" }: LocaleProps) {
  const { HOMEPAGE_VISION } = getHomepageData(locale);
  return (
    <section className="home-vision-v2" aria-labelledby="home-vision-heading">
      <Container narrow>
        <div className="home-vision-card-v2 reveal">
          <p className="home-approach-kicker">{HOMEPAGE_VISION.kicker}</p>
          <h2 id="home-vision-heading" className="home-section-title">
            {HOMEPAGE_VISION.title}
          </h2>
          <p className="home-vision-body">{HOMEPAGE_VISION.body}</p>
          <Link href="#recommendations" className="home-cta home-cta-secondary">
            לקוחות ממליצים
          </Link>
        </div>
      </Container>
    </section>
  );
}
