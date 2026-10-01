"use client";

import type { ReactNode } from "react";
import { useContextualPopup } from "@/components/popups/ContextualPopupProvider";

type ContextualPopupTriggerProps = {
  children: ReactNode;
  className?: string;
};

/** Opens the active page contextual lead popup (homepage / service / article). */
export function ContextualPopupTrigger({ children, className = "" }: ContextualPopupTriggerProps) {
  const { openContextualPopup } = useContextualPopup();

  return (
    <button
      type="button"
      className={className}
      onClick={() => openContextualPopup("minimized_cta")}
    >
      {children}
    </button>
  );
}
