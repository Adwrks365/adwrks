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
};

export function TestimonialCarousel({ items }: TestimonialCarouselProps) {
  return (
    <Carousel ariaLabel="המלצות לקוחות" itemCount={items.length} className="carousel-testimonials">
      {items.map((item) => (
        <Card key={item.name} hover className="testimonial-card testimonial-card-premium">
          <div className="testimonial-stars" aria-hidden="true">
            ★★★★★
          </div>
          <p className="testimonial-quote">{item.content}</p>
          <div className="testimonial-author">
            <Image
              src={item.image}
              alt=""
              width={48}
              height={48}
              sizes="48px"
              className="testimonial-avatar"
            />
            <div>
              <p className="font-semibold text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500">{item.title}</p>
            </div>
          </div>
        </Card>
      ))}
    </Carousel>
  );
}
