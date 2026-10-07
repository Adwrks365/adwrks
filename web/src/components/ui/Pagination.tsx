import Link from "next/link";
import { PhysicalNavRow } from "@/components/ui/PhysicalNavRow";
import type { Locale } from "@/i18n/routing";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  getHref: (page: number) => string;
  ariaLabel?: string;
  locale?: Locale;
};

export function Pagination({
  currentPage,
  totalPages,
  getHref,
  ariaLabel,
  locale = "he",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevLabel = locale === "en" ? "Previous" : "הקודם";
  const nextLabel = locale === "en" ? "Next" : "הבא";
  const label = ariaLabel ?? (locale === "en" ? "Pagination" : "עימוד");

  return (
    <nav className="pagination-nav" aria-label={label}>
      {currentPage > 1 && (
        <Link href={getHref(currentPage - 1)} className="pagination-btn pagination-btn-nav">
          <PhysicalNavRow label={prevLabel} arrow={locale === "en" ? "left" : "right"} />
        </Link>
      )}
      <div className="pagination-pages">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={getHref(p)}
            className={`pagination-btn ${p === currentPage ? "is-active" : ""}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </Link>
        ))}
      </div>
      {currentPage < totalPages && (
        <Link href={getHref(currentPage + 1)} className="pagination-btn pagination-btn-nav">
          <PhysicalNavRow
            label={nextLabel}
            arrow={locale === "en" ? "right" : "left"}
            arrowPosition="start"
          />
        </Link>
      )}
    </nav>
  );
}
