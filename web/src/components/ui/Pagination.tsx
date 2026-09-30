import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  getHref: (page: number) => string;
  ariaLabel?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  getHref,
  ariaLabel = "עימוד",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination-nav" aria-label={ariaLabel}>
      {currentPage > 1 && (
        <Link href={getHref(currentPage - 1)} className="pagination-btn pagination-btn-nav">
          ← הקודם
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
          הבא →
        </Link>
      )}
    </nav>
  );
}
