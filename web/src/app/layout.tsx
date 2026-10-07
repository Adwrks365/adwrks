import type { ReactNode } from "react";

/** Root layout passes through to [locale]/layout.tsx which owns html/body. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
