import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useManagerReviewsList } from '../hooks';

const ReviewsList: React.FC = () => {
  const {
    reviews,
    loading,
    pendingCount,
    getStatusColor,
    handleBack,
    handleReview,
    handleEdit,
    handleViewKPI,
    handleView,
  } = useManagerReviewsList();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KPI Reviews</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and review employee KPI evaluations</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Pending Reviews ({pendingCount})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">EMPLOYEE</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">KPI TITLE</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">PERIOD</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">EMPLOYEE RATING</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No reviews found
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{review.employee_name}</p>
                      <p className="text-sm text-gray-500">{review.employee_department}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{review.kpi_title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {review.review_quarter} {review.review_year}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {review.employee_rating ? parseFloat(String(review.employee_rating)).toFixed(2) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(review.review_status)}`}>
                        {review.review_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {review.review_status === 'manager_submitted' || review.review_status === 'completed' ? (
                          <>
                            <button
                              onClick={() => handleEdit(review.id)}
                              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                            >
                              Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => handleViewKPI(review.kpi_id)}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              View KPI
                            </button>
                          </>
                        ) : (review.review_status === 'employee_submitted' || review.review_status === 'pending') ? (
                          <button
                            onClick={() => handleReview(review.id)}
                            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                          >
                            Review
                          </button>
                        ) : (
                          <button
                            onClick={() => handleView(review.id)}
                            className="text-gray-600 hover:text-gray-700 font-medium text-sm"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;
