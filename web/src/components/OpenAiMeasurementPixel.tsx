import Script from "next/script";
import { buildOpenAiPixelSnippet } from "@/lib/openai-pixel";

/**
 * ChatGPT Ads Measurement Pixel — once per document, in the locale layout.
 *
 * `afterInteractive` runs the tiny queue stub after hydration and loads the SDK
 * with `async`, so it does not sit on the critical rendering path.
 * Shared flags with `measureOpenAiLeadCreated` keep a single SDK tag and a single init.
 */
export function OpenAiMeasurementPixel() {
  return (
    <Script
      id="openai-measurement-pixel"
      strategy="afterInteractive"
      data-no-optimize="1"
      data-cfasync="false"
    >
      {buildOpenAiPixelSnippet()}
    </Script>
  );
}
