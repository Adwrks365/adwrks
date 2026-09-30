import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  narrow?: boolean;
};

export function Container({ children, className = "", as: Tag = "div", narrow }: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full px-4 md:px-6 ${narrow ? "max-w-3xl" : "max-w-7xl"} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
