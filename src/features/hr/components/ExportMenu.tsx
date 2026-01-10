/**
 * Export Menu Component
 * Menu for exporting KPI data to CSV or Excel
 */

import React from 'react';
import { Button } from '../../../components/common';
import { FiDownload } from 'react-icons/fi';
import { KPI, KPIReview } from '../../../types';
import { exportToCSV, exportToExcel } from '../hooks/kpiListUtils';

interface ExportMenuProps {
  kpis: KPI[];
  reviews: KPIReview[];
  isOpen: boolean;
  onToggle: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ 
  kpis, 
  reviews, 
  isOpen, 
  onToggle,
  menuRef 
}) => {
  const handleExportCSV = () => {
    exportToCSV(kpis, reviews);
    onToggle();
  };

  const handleExportExcel = () => {
    exportToExcel(kpis, reviews);
    onToggle();
  };

  return (
    <div className="relative export-menu-container" ref={menuRef}>
      <Button
        onClick={onToggle}
        variant="success"
        icon={FiDownload}
      >
        Export
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <Button
            onClick={handleExportExcel}
            variant="ghost"
            className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg justify-start"
          >
            Export to Excel
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="ghost"
            className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg justify-start"
          >
            Export to CSV
          </Button>
        </div>
      )}
    </div>
  );
};
