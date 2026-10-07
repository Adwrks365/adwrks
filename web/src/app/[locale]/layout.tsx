import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Heebo } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { ContextualPopupProvider } from "@/components/popups/ContextualPopupProvider";
import { GlobalFloatingUI } from "@/components/GlobalFloatingUI";
import { GoogleTags } from "@/components/GoogleTags";
import { InsytixMetaTags, InsytixTracker } from "@/components/InsytixTracking";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata, stagingRobots } from "@/lib/content/metadata";
import { shouldAllowIndexing } from "@/lib/indexing";
import { getSiteConfig } from "@/lib/site";
import "../globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-heebo",
});

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locale as Locale;
  const site = getSiteConfig(validLocale);
  const homePath = validLocale === "en" ? "/en/" : "/";
  const base = buildPageMetadata(homePath, site.name, validLocale);
  return {
    ...base,
    metadataBase: new URL(site.domain),
    icons: {
      icon: [
        { url: site.favicon32, sizes: "32x32", type: "image/webp" },
        { url: site.favicon192, sizes: "192x192", type: "image/webp" },
      ],
      apple: [{ url: site.appleIcon, sizes: "180x180", type: "image/webp" }],
    },
    robots: stagingRobots() ?? base.robots,
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const site = getSiteConfig(locale as Locale);

  return (
    <html lang={site.language} dir={site.dir} className={`${heebo.variable} h-full`}>
      <head>{shouldAllowIndexing() ? <InsytixMetaTags /> : null}</head>
      <body className="flex min-h-full flex-col bg-white font-sans text-slate-900 antialiased">
        <NextIntlClientProvider messages={messages}>
          <ContextualPopupProvider>
            <SiteHeader locale={locale as Locale} />
            <main className="flex-1">{children}</main>
            <SiteFooter locale={locale as Locale} />
            <CookieConsentBanner />
            <GlobalFloatingUI />
          </ContextualPopupProvider>
        </NextIntlClientProvider>
        {shouldAllowIndexing() ? (
          <>
            <GoogleTags locale={locale as Locale} />
            <InsytixTracker locale={locale as Locale} />
          </>
        ) : null}
      </body>
    </html>
  );
}
