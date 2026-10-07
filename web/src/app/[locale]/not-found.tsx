import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
    alternates: { canonical: null },
  };
}

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");

  return (
    <Container className="py-16 text-center">
      <p className="text-sm font-semibold text-sky-700">{t("code")}</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{t("title")}</h1>
      <p className="mx-auto mt-3 max-w-xl text-slate-600">{t("description")}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          {t("backHome")}
        </Link>
      </div>
    </Container>
  );
}
