import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
};

export function Card({ children, className = "", hover = false, glass = false }: CardProps) {
  return (
    <div
      className={`card ${hover ? "card-hover" : ""} ${glass ? "card-glass" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
