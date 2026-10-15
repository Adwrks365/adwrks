"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import type { Locale } from "@/i18n/routing";
import { GA4_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
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

    if (sendPageView()) return;

    const intervalId = window.setInterval(() => {
      if (sendPageView()) window.clearInterval(intervalId);
    }, 250);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-tags-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_MEASUREMENT_ID}');
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
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
