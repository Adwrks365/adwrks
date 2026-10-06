import type { CSSProperties } from "react";

export type CalculatorIconName =
  | "search"
  | "share"
  | "map-pin"
  | "trending-up"
  | "layout"
  | "globe"
  | "building"
  | "clock"
  | "zap"
  | "message"
  | "phone"
  | "check";

type PricingCalculatorIconProps = {
  name: CalculatorIconName;
  className?: string;
  style?: CSSProperties;
};

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Lucide-style stroke icons for the pricing calculator. */
export function PricingCalculatorIcon({ name, className, style }: PricingCalculatorIconProps) {
  const common = {
    className,
    style,
    viewBox: "0 0 24 24",
    width: 24,
    height: 24,
    "aria-hidden": true,
  };

  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle {...stroke} cx="11" cy="11" r="8" />
          <path {...stroke} d="m21 21-4.3-4.3" />
        </svg>
      );
    case "share":
      return (
        <svg {...common}>
          <circle {...stroke} cx="18" cy="5" r="3" />
          <circle {...stroke} cx="6" cy="12" r="3" />
          <circle {...stroke} cx="18" cy="19" r="3" />
          <path {...stroke} d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
        </svg>
      );
    case "map-pin":
      return (
        <svg {...common}>
          <path {...stroke} d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle {...stroke} cx="12" cy="10" r="3" />
        </svg>
      );
    case "trending-up":
      return (
        <svg {...common}>
          <path {...stroke} d="M16 7h6v6" />
          <path {...stroke} d="m22 7-8.5 8.5-5-5L2 17" />
        </svg>
      );
    case "layout":
      return (
        <svg {...common}>
          <rect {...stroke} x="3" y="3" width="18" height="18" rx="2" />
          <path {...stroke} d="M3 9h18M9 21V9" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle {...stroke} cx="12" cy="12" r="10" />
          <path {...stroke} d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <path {...stroke} d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
          <path {...stroke} d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle {...stroke} cx="12" cy="12" r="10" />
          <path {...stroke} d="M12 6v6l4 2" />
        </svg>
      );
    case "zap":
      return (
        <svg {...common}>
          <path {...stroke} d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path {...stroke} d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path {...stroke} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path {...stroke} d="M20 6 9 17l-5-5" />
        </svg>
      );
  }
}
