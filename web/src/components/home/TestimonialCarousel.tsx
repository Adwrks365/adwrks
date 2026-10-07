"use client";

import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Carousel } from "@/components/ui/Carousel";

export type TestimonialItem = {
  name: string;
  title: string;
  content: string;
  image: string;
};

type TestimonialCarouselProps = {
  items: readonly TestimonialItem[];
  ariaLabel?: string;
};

export function TestimonialCarousel({
  items,
  ariaLabel = "המלצות לקוחות",
}: TestimonialCarouselProps) {
  return (
    <Carousel ariaLabel={ariaLabel} itemCount={items.length} className="carousel-testimonials">
      {items.map((item) => (
        <Card key={item.name} hover className="testimonial-card testimonial-card-premium">
          <div className="testimonial-stars" aria-hidden="true">
            ★★★★★
          </div>
          <p className="testimonial-quote">{item.content}</p>
          <footer className="testimonial-footer">
            {item.image && (
              <Image
                src={item.image}
                alt=""
                width={48}
                height={48}
                className="testimonial-avatar"
              />
            )}
            <div>
              <cite className="testimonial-name">{item.name}</cite>
              {item.title && <span className="testimonial-role">{item.title}</span>}
            </div>
          </footer>
        </Card>
      ))}
    </Carousel>
  );
}
