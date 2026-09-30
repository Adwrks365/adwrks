"use client";

import { useEffect, useState } from "react";
import type { ArticleHeading } from "@/lib/content/article";

type ArticleTocProps = {
  headings: ArticleHeading[];
  className?: string;
};

export function ArticleToc({ headings, className = "" }: ArticleTocProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <details
      className={`article-toc-disclosure ${className}`.trim()}
      open={open}
      onToggle={(event) => setOpen((event.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="article-toc-summary">תוכן עניינים</summary>
      <nav aria-label="תוכן עניינים" className="article-toc-panel">
        <ul className="article-toc-list">
          {headings.map((h) => (
            <li
              key={h.id}
              className={`article-toc-item article-toc-level-${h.level} ${activeId === h.id ? "is-active" : ""}`}
            >
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(h.id);
                }}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
