"use client";

import type { HomepageCounter } from "@/lib/homepage/data";
import { useEffect, useRef, useState } from "react";

type StatCountersProps = {
  items: readonly HomepageCounter[];
};

const DURATION_MS = 1400;
const STAGGER_MS = 90;
const INTERSECTION_THRESHOLD = 0.25;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function isKCounter(item: HomepageCounter): boolean {
  return item.suffix.startsWith("K");
}

function formatNum(item: HomepageCounter, value: number): number {
  const n = Math.round(value);
  if (item.target === 500) {
    return Math.min(500, Math.max(0, n));
  }
  if (item.target === 185) {
    return Math.min(185, Math.max(0, n));
  }
  if (item.target === 8) {
    return Math.min(8, Math.max(0, n));
  }
  if (item.target === 6) {
    return Math.min(6, Math.max(0, n));
  }
  return Math.min(item.target, Math.max(0, n));
}

function CounterItem({
  item,
  displayNum,
  isAnimating,
}: {
  item: HomepageCounter;
  displayNum: number;
  isAnimating: boolean;
}) {
  const num = formatNum(item, displayNum);
  const numText = isKCounter(item) ? `${num}K` : String(num);

  return (
    <div className="stat-card stat-card-premium">
      <p className="stat-value" aria-label={item.ariaValue}>
        <span className="stat-value-ltr" dir="ltr" aria-hidden={isAnimating ? true : undefined}>
          <span className="stat-value-num">{numText}</span>
          <span className="stat-value-suffix">{isKCounter(item) ? "+" : item.suffix}</span>
        </span>
      </p>
      <p className="stat-label">{item.label}</p>
    </div>
  );
}

export function StatCounters({ items }: StatCountersProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const [displayValues, setDisplayValues] = useState(() => items.map((item) => item.target));
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const runAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      setIsAnimating(true);
      setDisplayValues(items.map(() => 0));

      items.forEach((item, index) => {
        const delayMs = index * STAGGER_MS;
        const startAt = performance.now() + delayMs;

        const tick = (now: number) => {
          if (now < startAt) {
            requestAnimationFrame(tick);
            return;
          }

          const elapsed = now - startAt;
          const t = Math.min(1, elapsed / DURATION_MS);
          const eased = easeOutCubic(t);
          const current = t >= 1 ? item.target : eased * item.target;

          setDisplayValues((prev) => {
            const next = [...prev];
            next[index] = current;
            return next;
          });

          if (t >= 1) {
            setDisplayValues((prev) => {
              const next = [...prev];
              next[index] = item.target;
              return next;
            });
            if (index === items.length - 1) {
              setIsAnimating(false);
            }
            return;
          }

          requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && entry.intersectionRatio >= INTERSECTION_THRESHOLD) {
          observer.disconnect();
          runAnimation();
        }
      },
      { threshold: [0, INTERSECTION_THRESHOLD] },
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, [items]);

  return (
    <div ref={gridRef} className="stat-grid">
      {items.map((item, index) => (
        <CounterItem
          key={item.label}
          item={item}
          displayNum={displayValues[index] ?? item.target}
          isAnimating={isAnimating}
        />
      ))}
    </div>
  );
}
