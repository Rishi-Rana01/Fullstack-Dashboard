import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../../types/lead.types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

/**
 * Generates an array of page numbers to display.
 * Shows at most 5 page numbers with ellipsis for large ranges.
 * Example: [1, '...', 4, 5, 6, '...', 20]
 */
const getPageNumbers = (
  currentPage: number,
  totalPages: number
): (number | '...')[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  if (currentPage > 3) pages.push('...');

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) pages.push('...');
  pages.push(totalPages);

  return pages;
};

/**
 * Pagination — page number buttons, prev/next controls, and result range display.
 * Disables Previous on page 1 and Next on the last page.
 */
export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { total, page, limit, totalPages, hasNextPage, hasPrevPage } = meta;

  if (totalPages <= 1) return null;

  const start = Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3">
      {/* Result count summary */}
      <p className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
        Showing{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">{start}–{end}</span>
        {' '}of{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span>
        {' '}results
      </p>

      {/* Page buttons */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page number buttons */}
        {pageNumbers.map((pageNum, idx) =>
          pageNum === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-3 py-1.5 text-sm text-gray-400 dark:text-gray-600 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum as number)}
              aria-current={pageNum === page ? 'page' : undefined}
              className={[
                'min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors',
                pageNum === page
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
              ].join(' ')}
            >
              {pageNum}
            </button>
          )
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
};
