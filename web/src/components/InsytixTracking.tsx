import Script from "next/script";
import {
  INSYTIX_SCRIPT_URL,
  INSYTIX_TRACK_ENDPOINT,
  INSYTIX_TRACKING_ID,
} from "@/lib/insytix";

/** Global Insytix meta tags — render inside `<head>`. */
export function InsytixMetaTags() {
  return (
    <>
      <meta name="insytix-tracking-id" content={INSYTIX_TRACKING_ID} />
      <meta name="insytix-endpoint" content={INSYTIX_TRACK_ENDPOINT} />
    </>
  );
}

/**
 * Global Insytix tracker — render once in root layout `<body>`.
 *
 * Load order: inline `__INSYTIX_CONFIG__` (lazyOnload, first) then external
 * tf.js (lazyOnload, second). Same strategy preserves document order while
 * deferring third-party work until after load (no beforeInteractive / no LCP dependency).
 */
type InsytixTrackerProps = {
  locale?: import("@/i18n/routing").Locale;
};

export function InsytixTracker({ locale = "he" }: InsytixTrackerProps) {
  const configJson = JSON.stringify({
    trackingId: INSYTIX_TRACKING_ID,
    endpoint: INSYTIX_TRACK_ENDPOINT,
    locale,
  });

  return (
    <>
      <Script
        id="insytix-config"
        strategy="lazyOnload"
        data-no-optimize="1"
        data-cfasync="false"
      >
        {`window.__INSYTIX_CONFIG__=${configJson};`}
      </Script>
      <Script
        id="insytix-tf-js"
        src={INSYTIX_SCRIPT_URL}
        strategy="lazyOnload"
        data-no-optimize="1"
        data-cfasync="false"
        data-tracking-id={INSYTIX_TRACKING_ID}
        data-endpoint={INSYTIX_TRACK_ENDPOINT}
      />
    </>
  );
}
