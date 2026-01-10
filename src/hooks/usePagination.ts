/**
 * Custom Hook: usePagination
 * 
 * Hook for managing pagination state.
 * To be implemented in Phase 1.
 */

import { useState } from 'react';

interface PaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  total?: number;
}

export function usePagination({
  initialPage = 1,
  initialLimit = 10,
  total = 0,
}: PaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const nextPage = () => {
    if (hasNext) setPage(page + 1);
  };

  const prevPage = () => {
    if (hasPrev) setPage(page - 1);
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  const reset = () => {
    setPage(initialPage);
  };

  return {
    page,
    limit,
    setPage: goToPage,
    setLimit,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
    totalPages,
    reset,
  };
}

export default usePagination;
