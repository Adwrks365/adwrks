"use client";

import { useEffect } from "react";
import { useContextualPopupRegistrar } from "@/components/popups/ContextualPopupProvider";
import type { PopupConfig } from "@/lib/popups/types";

type ContextualPopupRegistrarProps = {
  config: PopupConfig;
};

/** Registers the current page popup config with the global provider (no duplicate timers). */
export function ContextualPopupRegistrar({ config }: ContextualPopupRegistrarProps) {
  const { registerConfig } = useContextualPopupRegistrar();

  useEffect(() => {
    registerConfig(config);
    return () => registerConfig(null);
  }, [config.pagePath, config.popupId, config, registerConfig]);

  return null;
}
