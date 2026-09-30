"use client";

import { useEffect, useRef } from "react";

type PricingCalculatorIframeProps = {
  src: string;
  title: string;
};

/** Resizes pricing calculator iframe via postMessage (matches production behavior). */
export function PricingCalculatorIframe({ src, title }: PricingCalculatorIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as { type?: string; height?: number };
      if (data?.type === "pricing-calculator-height" && data.height && iframeRef.current) {
        iframeRef.current.style.height = `${data.height}px`;
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      id="pricing-calculator-iframe"
      src={src}
      title={title}
      loading="lazy"
      className="my-8 block w-full rounded-2xl border-0"
      style={{ minHeight: 600 }}
    />
  );
}
