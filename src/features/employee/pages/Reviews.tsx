import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { useEmployeeReviews } from '../hooks';
import { ReviewPendingKPICard } from '../components';

const Reviews: React.FC = () => {
  const {
    kpis,
    loading,
    error,
    getReviewStatus,
    handleViewKPI,
    handleStartReview,
  } = useEmployeeReviews();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KPIs Awaiting Review</h1>
        <p className="text-sm text-gray-600 mt-1">
          Complete your self-assessment for acknowledged KPIs
        </p>
      </div>

      {/* KPI Cards */}
      {kpis.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FiCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">You have no KPIs pending review at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {kpis.map((kpi) => {
            const statusInfo = getReviewStatus(kpi);
            
            return (
              <ReviewPendingKPICard
                key={kpi.id}
                kpi={kpi}
                statusInfo={statusInfo}
                onView={handleViewKPI}
                onStartReview={handleStartReview}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reviews;
