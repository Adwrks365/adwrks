"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

type CarouselProps = {
  children: ReactNode;
  ariaLabel: string;
  itemCount: number;
  className?: string;
};

/** Physical arrow icons: left ← and right → (outward from center). */
function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

export function Carousel({ children, ariaLabel, itemCount, className = "" }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updateActiveFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let closest = 0;
    let minDist = Infinity;
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const dist = Math.abs(slideCenter - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      () => updateActiveFromScroll(),
      { root: track, threshold: 0.55 },
    );
    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });
    track.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", updateActiveFromScroll);
    };
  }, [itemCount, updateActiveFromScroll]);

  const scrollToIndex = useCallback((index: number) => {
    const slide = slideRefs.current[index];
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveIndex(index);
  }, []);

  const goPrevious = useCallback(() => {
    const next = Math.max(0, activeIndex - 1);
    scrollToIndex(next);
  }, [activeIndex, scrollToIndex]);

  const goNext = useCallback(() => {
    const next = Math.min(itemCount - 1, activeIndex + 1);
    scrollToIndex(next);
  }, [activeIndex, itemCount, scrollToIndex]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrevious();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollToIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      scrollToIndex(itemCount - 1);
    }
  };

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div className={`carousel ${className}`.trim()}>
      <button
        type="button"
        className="carousel-btn carousel-btn-left"
        aria-label="הקודם"
        onClick={goPrevious}
        disabled={activeIndex === 0}
      >
        <ArrowIcon direction="left" />
      </button>

      <div
        ref={trackRef}
        className="carousel-track"
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {childArray.map((child, i) => (
          <div
            key={i}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="carousel-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} מתוך ${itemCount}`}
          >
            {child}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="carousel-btn carousel-btn-right"
        aria-label="הבא"
        onClick={goNext}
        disabled={activeIndex >= itemCount - 1}
      >
        <ArrowIcon direction="right" />
      </button>

      {itemCount > 1 && (
        <div className="carousel-dots" role="tablist" aria-label="בחירת שקופית">
          {Array.from({ length: itemCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              className={`carousel-dot ${i === activeIndex ? "is-active" : ""}`}
              aria-label={`שקופית ${i + 1}`}
              aria-selected={i === activeIndex}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
