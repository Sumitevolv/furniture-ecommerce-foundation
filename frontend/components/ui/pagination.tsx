import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageRange(current: number, total: number): (number | "ellipsis")[] {
  const delta = 1;
  const range: (number | "ellipsis")[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push("ellipsis");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("ellipsis");
  if (total > 1) range.push(total);

  return range;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = getPageRange(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-sm text-text-secondary transition-colors hover:bg-surface-muted disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="flex h-9 w-9 items-center justify-center text-text-muted">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-sm text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              page === currentPage
                ? "bg-charcoal text-ivory"
                : "text-text-secondary hover:bg-surface-muted"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-sm text-text-secondary transition-colors hover:bg-surface-muted disabled:opacity-30 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
