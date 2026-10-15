"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import type { Locale } from "@/i18n/routing";
import { GA4_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

const ANALYTICS_DEFER_MS = 2500;
const GOOGLE_TAGS_READY = "google-tags-ready";

function scheduleDeferredAnalytics(load: () => void) {
  let started = false;
  const run = () => {
    if (started) return;
    started = true;
    cleanup();
    load();
  };

  const interactionOptions = { capture: true, once: true, passive: true } as const;
  const onInteraction = () => run();

  window.addEventListener("pointerdown", onInteraction, interactionOptions);
  window.addEventListener("keydown", onInteraction, interactionOptions);
  window.addEventListener("touchstart", onInteraction, interactionOptions);
  window.addEventListener("scroll", onInteraction, interactionOptions);

  const timeoutId = window.setTimeout(run, ANALYTICS_DEFER_MS);

  let idleId: number | undefined;
  if ("requestIdleCallback" in window) {
    idleId = window.requestIdleCallback(() => run(), { timeout: ANALYTICS_DEFER_MS + 1500 });
  }

  function cleanup() {
    window.clearTimeout(timeoutId);
    if (idleId !== undefined && "cancelIdleCallback" in window) {
      window.cancelIdleCallback(idleId);
    }
    window.removeEventListener("pointerdown", onInteraction, interactionOptions);
    window.removeEventListener("keydown", onInteraction, interactionOptions);
    window.removeEventListener("touchstart", onInteraction, interactionOptions);
    window.removeEventListener("scroll", onInteraction, interactionOptions);
  }

  return cleanup;
}

function injectGoogleTags() {
  if (document.querySelector('script[data-google-tags="gtag-js"]')) return;

  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    (window.dataLayer as unknown[]).push(args);
  };
  window.gtag = gtag;
  gtag("js", new Date());

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  script.dataset.googleTags = "gtag-js";
  script.onload = () => {
    gtag("config", GA4_MEASUREMENT_ID);
    gtag("config", GOOGLE_ADS_ID);
    window.dispatchEvent(new Event(GOOGLE_TAGS_READY));
  };
  document.body.appendChild(script);
}

function GoogleTagsLoader() {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    return scheduleDeferredAnalytics(injectGoogleTags);
  }, []);

  return null;
}

function PageViewTracker({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    const sendPageView = () => {
      if (cancelled || !window.gtag) return false;
      window.gtag("config", GA4_MEASUREMENT_ID, {
        page_path: pagePath,
        page_locale: locale,
      });
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view",
        page_locale: locale,
        page_path: pagePath,
      });
      return true;
    };

    const onReady = () => {
      if (sendPageView()) return;
      const intervalId = window.setInterval(() => {
        if (sendPageView()) window.clearInterval(intervalId);
      }, 250);
    };

    if (sendPageView()) return;

    window.addEventListener(GOOGLE_TAGS_READY, onReady, { once: true });
    const intervalId = window.setInterval(() => {
      if (sendPageView()) {
        window.clearInterval(intervalId);
        window.removeEventListener(GOOGLE_TAGS_READY, onReady);
      }
    }, 500);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener(GOOGLE_TAGS_READY, onReady);
    };
  }, [pathname, searchParams, locale]);

  return null;
}

type GoogleTagsProps = {
  locale?: Locale;
};

export function GoogleTags({ locale = "he" }: GoogleTagsProps) {
  return (
    <>
      <GoogleTagsLoader />
      <Suspense fallback={null}>
        <PageViewTracker locale={locale} />
      </Suspense>
    </>
  );
}

export function pushLeadSubmitEvent(locale: Locale, formId: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "lead_submit",
    page_locale: locale,
    form_id: formId,
  });
  window.gtag?.("event", "lead_submit", { page_locale: locale, form_id: formId });
}
