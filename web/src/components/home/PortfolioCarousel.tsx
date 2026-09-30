"use client";

import Image from "next/image";
import { Carousel } from "@/components/ui/Carousel";

type PortfolioCarouselProps = {
  images: readonly string[];
};

export function PortfolioCarousel({ images }: PortfolioCarouselProps) {
  return (
    <Carousel ariaLabel="דוגמאות לאתרים" itemCount={images.length} className="carousel-portfolio">
      {images.map((src) => (
        <div key={src} className="portfolio-carousel-item">
          <div className="portfolio-browser-frame">
            <div className="portfolio-browser-bar" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="portfolio-browser-screen">
              <Image
                src={src}
                alt="דוגמת אתר מעוצב על ידי Adwrks 365"
                width={400}
                height={500}
                loading="lazy"
                sizes="(max-width: 768px) 85vw, (max-width: 1280px) 45vw, 320px"
                className="portfolio-carousel-image"
              />
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}
