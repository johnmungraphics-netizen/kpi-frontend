/**
 * KPI Pagination Component
 * Pagination controls for KPI list
 */

import React from 'react';
import { Button } from '../../../components/common';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { KPIPagination as PaginationType } from '../types';

interface KPIPaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export const KPIPagination: React.FC<KPIPaginationProps> = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="p-4 border-t border-gray-200 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="ghost"
          size="sm"
          icon={FiChevronLeft}
          className="p-2 border border-gray-300"
        />
        {[...Array(Math.min(5, totalPages))].map((_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          return (
            <Button
              key={i}
              onClick={() => onPageChange(pageNum)}
              variant={currentPage === pageNum ? 'primary' : 'outline'}
              size="sm"
            >
              {pageNum}
            </Button>
          );
        })}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="ghost"
          size="sm"
          icon={FiChevronRight}
          className="p-2 border border-gray-300"
        />
      </div>
    </div>
  );
};
