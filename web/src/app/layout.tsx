import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { Heebo } from "next/font/google";
import { GlobalFloatingUI } from "@/components/GlobalFloatingUI";
import { ProductionGoogleTags } from "@/components/ProductionGoogleTags";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildPageMetadata, stagingRobots } from "@/lib/content/metadata";
import { SITE } from "@/lib/site";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-heebo",
});

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  const pageMeta = buildPageMetadata("/", undefined, host);

  return {
    ...pageMeta,
    metadataBase: new URL(SITE.domain),
    icons: {
      icon: [
        { url: SITE.favicon32, sizes: "32x32", type: "image/webp" },
        { url: SITE.favicon192, sizes: "192x192", type: "image/webp" },
      ],
      apple: [{ url: SITE.appleIcon, sizes: "180x180", type: "image/webp" }],
    },
    robots: stagingRobots(host) ?? pageMeta.robots,
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={SITE.language} dir={SITE.dir} className={`${heebo.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-slate-900 antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <GlobalFloatingUI />
        <ProductionGoogleTags />
      </body>
    </html>
  );
}
