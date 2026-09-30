import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "העמוד לא נמצא",
  description: "העמוד שחיפשתם אינו קיים.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <Container className="py-16 text-center">
      <p className="text-sm font-semibold text-sky-700">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">העמוד לא נמצא</h1>
      <p className="mx-auto mt-3 max-w-xl text-slate-600">
        הכתובת אינה קיימת או שהוסרה. אפשר לחזור לדף הבית או לעמוד יצירת הקשר.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          דף הבית
        </Link>
        <Link href="/contact-us/" className="btn btn-outline">
          יצירת קשר
        </Link>
      </div>
    </Container>
  );
}
