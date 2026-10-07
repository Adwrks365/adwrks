import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { LocaleProps } from "@/lib/locale-props";
import { getWebsiteBuildingPageContent } from "@/lib/pages/services/get-locale-content";
import { PORTFOLIO_PROJECTS } from "@/lib/portfolio/projects";
import { WebsiteBuildingHeroCtas } from "./WebsiteBuildingHeroCtas";

export function WebsiteBuildingHero({ locale = "he" }: LocaleProps) {
  const c = getWebsiteBuildingPageContent(locale);
  const preview = PORTFOLIO_PROJECTS.find((p) => p.id === c.WEBSITE_BUILDING_HERO_PROJECT_ID);

  return (
    <header className="wb-hero">
      <div className="wb-hero-bg" aria-hidden="true" />
      <Container>
        <div className="wb-hero-shell">
          <div className="wb-hero-copy">
            <p className="wb-hero-badge">{c.WEBSITE_BUILDING_HERO.badge}</p>
            <h1 className="wb-hero-title">{c.WEBSITE_BUILDING_HERO.title}</h1>
            <p className="wb-hero-lead">{c.WEBSITE_BUILDING_HERO.lead}</p>
            <ul
              className="wb-hero-cues"
              aria-label={locale === "en" ? "What's included in the service" : "מה כולל השירות"}
            >
              {c.WEBSITE_BUILDING_HERO.cues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
            <WebsiteBuildingHeroCtas locale={locale} />
          </div>
          {preview && (
            <div className="wb-hero-visual" aria-hidden="true">
              <div className="wb-hero-frame">
                <div className="wb-hero-frame-chrome">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="wb-hero-frame-screen">
                  <Image
                    src={preview.screenshot}
                    alt=""
                    width={540}
                    height={338}
                    className="wb-hero-frame-image"
                    sizes="(min-width: 1024px) 430px, 0px"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
