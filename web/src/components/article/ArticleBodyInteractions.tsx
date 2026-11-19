"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useContextualPopup } from "@/components/popups/ContextualPopupProvider";

type ArticleBodyInteractionsProps = {
  children: ReactNode;
};

/** Delegates clicks on repaired legacy CTAs to the contextual lead popup. */
export function ArticleBodyInteractions({ children }: ArticleBodyInteractionsProps) {
  const { openContextualPopup } = useContextualPopup();
  const rootRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest(
        '[data-open-contextual-popup="true"]',
      );
      if (!target) return;

      event.preventDefault();
      event.stopPropagation();
      openContextualPopup("in_article_cta");
    },
    [openContextualPopup],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onToggle = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLDetailsElement) || !target.open) return;
      const group = target.closest('[data-adwrks-faq-accordion="exclusive"]');
      if (!group) return;
      group.querySelectorAll("details[open]").forEach((item) => {
        if (item !== target) {
          (item as HTMLDetailsElement).open = false;
        }
      });
    };

    root.addEventListener("click", handleClick);
    root.addEventListener("toggle", onToggle, true);
    return () => {
      root.removeEventListener("click", handleClick);
      root.removeEventListener("toggle", onToggle, true);
    };
  }, [handleClick]);

  return (
    <div ref={rootRef} className="article-body-interactions">
      {children}
    </div>
  );
}
