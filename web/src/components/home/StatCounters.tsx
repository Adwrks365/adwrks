"use client";

import { useEffect, useRef, useState } from "react";
import type { HomepageCounter } from "@/lib/homepage/data";

type StatCountersProps = {
  items: readonly HomepageCounter[];
};

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("a11y-reduce-motion")
  );
}

function CounterItem({ item, animate }: { item: HomepageCounter; animate: boolean }) {
  const [display, setDisplay] = useState(() =>
    typeof window !== "undefined" && prefersReducedMotion() ? item.target : 0,
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animate || prefersReducedMotion()) return;

    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(progress);
      setDisplay(Math.round(item.target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, item.target]);

  return (
    <div className="stat-card stat-card-premium">
      <p className="stat-value" aria-label={item.ariaValue}>
        <span className="stat-value-ltr" dir="ltr" aria-hidden="true">
          <span className="stat-value-num">{display}</span>
          <span className="stat-value-suffix">{item.suffix}</span>
        </span>
      </p>
      <p className="stat-label">{item.label}</p>
    </div>
  );
}

export function StatCounters({ items }: StatCountersProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(
    () => typeof window !== "undefined" && prefersReducedMotion(),
  );
  const triggered = useRef(false);

  useEffect(() => {
    if (animate) return;

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <div ref={sectionRef} className="stat-grid reveal">
      {items.map((item) => (
        <CounterItem key={item.label} item={item} animate={animate} />
      ))}
    </div>
  );
}
