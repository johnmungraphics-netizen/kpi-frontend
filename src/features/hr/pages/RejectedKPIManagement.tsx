/**
 * Rejected KPI Management Page - Refactored
 * Manage rejected KPIs and track resolution status
 */

import React from 'react';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { useRejectedKPIManagement } from '../hooks';
import { RejectedKPIStatCard, RejectedKPITable } from '../components';

const RejectedKPIManagement: React.FC = () => {
  const {
    loading,
    selectedFilter,
    kpis,
    rejectedCount,
    resolvedCount,
    handleCardClick,
    getReviewForKPI,
  } = useRejectedKPIManagement();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rejected KPI Management</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage rejected KPIs and track resolution status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RejectedKPIStatCard
          title="Active Rejections"
          count={rejectedCount}
          color="bg-red-50"
          icon={<FiAlertTriangle className="text-red-600" />}
          onClick={() => handleCardClick('rejected')}
          isSelected={selectedFilter === 'rejected'}
        />
        <RejectedKPIStatCard
          title="Resolved Issues"
          count={resolvedCount}
          color="bg-teal-50"
          icon={<FiCheckCircle className="text-teal-600" />}
          onClick={() => handleCardClick('resolved')}
          isSelected={selectedFilter === 'resolved'}
        />
      </div>

      {/* KPI List */}
      {selectedFilter && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedFilter === 'rejected' ? 'Active Rejections' : 'Resolved Issues'} ({kpis.length})
            </h2>
          </div>

          {kpis.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-5xl mb-4">
                <FiCheckCircle className="mx-auto" />
              </div>
              <p className="text-gray-500">
                {selectedFilter === 'rejected'
                  ? 'No active rejections found'
                  : 'No resolved issues found'}
              </p>
            </div>
          ) : (
            <RejectedKPITable kpis={kpis} getReviewForKPI={getReviewForKPI} />
          )}
        </div>
      )}

      {/* Empty State when no filter selected */}
      {!selectedFilter && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 text-5xl mb-4">
            <FiAlertTriangle className="mx-auto" />
          </div>
          <p className="text-gray-600 text-lg font-medium mb-2">Select a Category</p>
          <p className="text-gray-500">
            Click on one of the cards above to view rejected or resolved KPIs
          </p>
        </div>
      )}
    </div>
  );
};

export default RejectedKPIManagement;
