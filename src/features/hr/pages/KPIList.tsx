/**
 * HR KPI List Page - Refactored with Separation of Concerns
 * Displays paginated list of all KPIs with filters and export functionality
 */

import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Button } from '../../../components/common';
import { useKPIList } from '../hooks';
import { KPIFilters, KPITable, KPIPagination, ExportMenu } from '../components';

const HRKPIList: React.FC = () => {
  const {
    kpis,
    reviews,
    loading,
    searchQuery,
    filters,
    pagination,
    departments,
    managers,
    periodSettings,
    showExportMenu,
    exportMenuRef,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
    setShowExportMenu,
    getPageTitle,
    getPageSubtitle,
    navigate,
  } = useKPIList();

  if (loading && kpis.length === 0) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            icon={FiArrowLeft}
            className="p-2"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            <p className="text-sm text-gray-600 mt-1">{getPageSubtitle()}</p>
          </div>
        </div>
        <ExportMenu
          kpis={kpis}
          reviews={reviews}
          isOpen={showExportMenu}
          onToggle={() => setShowExportMenu(!showExportMenu)}
          menuRef={exportMenuRef}
        />
      </div>

      {/* Filters */}
      <KPIFilters
        filters={filters}
        searchQuery={searchQuery}
        departments={departments}
        periodSettings={periodSettings}
        managers={managers}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
      />

      {/* KPI Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalCount)} of {pagination.totalCount} KPIs
          </h2>
        </div>

        <KPITable kpis={kpis} reviews={reviews} />

        {/* Pagination */}
        <KPIPagination pagination={pagination} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default HRKPIList;
