import type { ReactNode } from "react";
import { Container } from "./Container";

type SectionTone = "white" | "muted" | "sky" | "gradient" | "dark" | "accent";

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  tone?: SectionTone;
  label?: string;
  title?: string;
  subtitle?: string;
  narrow?: boolean;
  /** Left-align header instead of center */
  align?: "center" | "start";
};

const toneClasses: Record<SectionTone, string> = {
  white: "section-tone-white",
  muted: "section-tone-muted",
  sky: "section-tone-sky",
  gradient: "section-tone-gradient",
  dark: "section-tone-dark",
  accent: "section-tone-accent",
};

export function Section({
  children,
  id,
  className = "",
  tone = "white",
  label,
  title,
  subtitle,
  narrow,
  align = "center",
}: SectionProps) {
  return (
    <section id={id} className={`section ${toneClasses[tone]} ${className}`.trim()}>
      <Container narrow={narrow}>
        {(label || title || subtitle) && (
          <header
            className={`section-header mb-6 md:mb-8 ${align === "start" ? "section-header-start" : "text-center"}`}
          >
            {label && <p className="section-label">{label}</p>}
            {title && <h2 className="section-title">{title}</h2>}
            {subtitle && (
              <p
                className={`section-subtitle mt-4 ${align === "start" ? "max-w-2xl" : "mx-auto max-w-2xl"}`}
              >
                {subtitle}
              </p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
