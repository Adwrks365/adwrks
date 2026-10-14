"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { resolveAlternatePaths } from "@/lib/i18n/alternates";
import { localeFromPath } from "@/i18n/locale";
import type { Locale } from "@/i18n/routing";

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const t = useTranslations("LanguageSwitcher");
  const currentPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const pairs = resolveAlternatePaths(currentPath);
  const targetLocale: Locale = locale === "he" ? "en" : "he";
  const href =
    targetLocale === "en"
      ? pairs?.en ?? "/en/"
      : pairs?.he ?? "/";

  return (
    <Link
      href={href}
      className="site-lang-switcher"
      aria-label={t("ariaLabel")}
      lang={targetLocale}
    >
      {targetLocale === "en" ? t("switchToEnglish") : t("switchToHebrew")}
    </Link>
  );
}

/** @deprecated use locale prop — kept for pathname-only contexts */
export function useCurrentLocaleFromPath(): Locale {
  const pathname = usePathname();
  return localeFromPath(pathname);
}
