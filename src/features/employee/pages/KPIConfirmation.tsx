import React from 'react';
import { FiCheckCircle, FiX, FiAlertCircle } from 'react-icons/fi';
import { Button } from '../../../components/common';
import SignatureField from '../../../components/SignatureField';
import TextModal from '../../../components/TextModal';
import { useEmployeeKPIConfirmation } from '../hooks';
import {
  getRatingPercentage,
  getRatingDescription,
  getItemRatingDescription,
} from '../hooks/kpiConfirmationUtils';

const KPIConfirmation: React.FC = () => {
  const {
    review,
    kpi,
    loading,
    submitting,
    action,
    rejectionNote,
    signature,
    error,
    textModal,
    parsedRatings,
    ratingSummary,
    setAction,
    setRejectionNote,
    setSignature,
    handleSubmit,
    openTextModal,
    closeTextModal,
    navigate,
  } = useEmployeeKPIConfirmation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <p className="text-red-600">Review not found</p>
      </div>
    );
  }

  if (review.review_status !== 'manager_submitted') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <p className="text-orange-600">This review is not awaiting confirmation</p>
        <Button onClick={() => navigate('/employee/dashboard')} variant="primary" className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Confirm KPI Review</h1>
        <Button onClick={() => navigate('/employee/dashboard')} variant="secondary">
          Back to Dashboard
        </Button>
      </div>

      {/* Action Required Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FiAlertCircle className="text-blue-600 text-xl mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Action Required</h3>
            <p className="text-sm text-blue-800 mt-1">
              Your manager <span className="font-semibold">{review.manager_name}</span> has
              completed your KPI review. Please review the rating and comments below and confirm
              whether you agree with the assessment.
            </p>
          </div>
        </div>
      </div>

      {/* Review Details Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">KPI Review Details</h2>
        <div className="space-y-2 text-sm text-gray-600 mb-6">
          <p>
            <span className="font-medium text-gray-900">KPI Title:</span> {review.kpi_title}
          </p>
          <p>
            <span className="font-medium text-gray-900">Manager:</span> {review.manager_name}
          </p>
          {kpi && (
            <>
              <p>
                <span className="font-medium text-gray-900">Period:</span> {kpi.quarter}{' '}
                {kpi.year}
              </p>
              <p>
                <span className="font-medium text-gray-900">Total Items:</span>{' '}
                {kpi.items?.length || 1}
              </p>
            </>
          )}
        </div>

        {/* KPI Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '1800px' }}>
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase sticky left-0 bg-gray-50 z-10"
                  style={{ minWidth: '50px' }}
                >
                  #
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  style={{ minWidth: '200px' }}
                >
                  KPI TITLE
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  style={{ minWidth: '250px' }}
                >
                  DESCRIPTION
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  style={{ minWidth: '150px' }}
                >
                  TARGET VALUE
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  style={{ minWidth: '120px' }}
                >
                  MEASURE UNIT
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  style={{ minWidth: '120px' }}
                >
                  GOAL WEIGHT
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  style={{ minWidth: '150px' }}
                >
                  EMPLOYEE RATING
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  style={{ minWidth: '200px' }}
                >
                  EMPLOYEE COMMENT
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  style={{ minWidth: '150px' }}
                >
                  MANAGER RATING
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  style={{ minWidth: '200px' }}
                >
                  MANAGER COMMENT
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kpi && kpi.items && kpi.items.length > 0 ? (
                kpi.items.map((item, index) => {
                  const empRating = parsedRatings?.employeeItemRatings[item.id] || 0;
                  const empComment = parsedRatings?.employeeItemComments[item.id] || '';
                  const mgrRating = parsedRatings?.managerItemRatings[item.id] || 0;
                  const mgrComment = parsedRatings?.managerItemComments[item.id] || '';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 sticky left-0 bg-white z-10">
                        <span className="font-semibold text-gray-900">{index + 1}</span>
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          onClick={() => openTextModal('KPI Title', item.title || 'N/A')}
                          variant="link"
                          className="text-left font-semibold"
                        >
                          <p className="truncate max-w-[200px]" title={item.title}>
                            {item.title}
                          </p>
                        </Button>
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          onClick={() =>
                            openTextModal('Description', item.description || 'N/A')
                          }
                          variant="link"
                          className="text-left"
                        >
                          <p
                            className="truncate max-w-[250px]"
                            title={item.description || 'N/A'}
                          >
                            {item.description || 'N/A'}
                          </p>
                        </Button>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{item.target_value || 'N/A'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm">
                          {item.measure_unit || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700">{item.goal_weight || 'N/A'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-purple-600">
                              {empRating.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({getRatingPercentage(empRating)}%)
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {getItemRatingDescription(empRating)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {empComment ? (
                          <Button
                            onClick={() => openTextModal('Employee Comment', empComment)}
                            variant="link"
                            className="text-left"
                          >
                            <p className="truncate max-w-[200px]" title={empComment}>
                              {empComment.length > 40
                                ? empComment.substring(0, 40) + '...'
                                : empComment}
                            </p>
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-400">No comment</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-yellow-600">
                              {mgrRating.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({getRatingPercentage(mgrRating)}%)
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {getItemRatingDescription(mgrRating)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {mgrComment ? (
                          <Button
                            onClick={() => openTextModal('Manager Comment', mgrComment)}
                            variant="link"
                            className="text-left"
                          >
                            <p className="truncate max-w-[200px]" title={mgrComment}>
                              {mgrComment.length > 40
                                ? mgrComment.substring(0, 40) + '...'
                                : mgrComment}
                            </p>
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-400">No comment</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                // Fallback for legacy single KPI format
                <tr>
                  <td className="px-4 py-4 sticky left-0 bg-white z-10">
                    <span className="font-semibold text-gray-900">1</span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-900">{review.kpi_title}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-700">{review.kpi_description || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-900">N/A</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm">
                      N/A
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-700">N/A</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-purple-600">
                          {typeof review.employee_rating === 'number'
                            ? review.employee_rating.toFixed(2)
                            : '0.00'}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({getRatingPercentage(review.employee_rating || 0)}%)
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-700">{review.employee_comment || 'No comment'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-yellow-600">
                          {typeof review.manager_rating === 'number'
                            ? review.manager_rating.toFixed(2)
                            : '0.00'}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({getRatingPercentage(review.manager_rating || 0)}%)
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-700">{review.manager_comment || 'No comment'}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rating Summary */}
        {ratingSummary && (
          <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Rating Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-gray-600 mb-2">Total Employee Rating</p>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-purple-600">
                    {ratingSummary.avgEmployeeRating.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500">
                    ({getRatingPercentage(ratingSummary.avgEmployeeRating)}%)
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getRatingDescription(ratingSummary.avgEmployeeRating)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-yellow-200">
                <p className="text-sm text-gray-600 mb-2">Total Manager Rating</p>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-yellow-600">
                    {ratingSummary.avgManagerRating.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500">
                    ({getRatingPercentage(ratingSummary.avgManagerRating)}%)
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getRatingDescription(ratingSummary.avgManagerRating)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Overall Manager Comments */}
        {review.overall_manager_comment && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm font-medium text-yellow-900 mb-2">Overall Manager Comments:</p>
            <p className="text-sm text-yellow-700">{review.overall_manager_comment}</p>
          </div>
        )}
      </div>

      {/* Decision Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Decision</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => setAction('approve')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                action === 'approve'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiCheckCircle
                  className={action === 'approve' ? 'text-green-600' : 'text-gray-400'}
                />
                <span
                  className={`font-medium ${
                    action === 'approve' ? 'text-green-700' : 'text-gray-600'
                  }`}
                >
                  Approve Rating
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                I agree with my manager's assessment
              </p>
            </button>

            <button
              onClick={() => setAction('reject')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                action === 'reject'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FiX className={action === 'reject' ? 'text-red-600' : 'text-gray-400'} />
                <span
                  className={`font-medium ${
                    action === 'reject' ? 'text-red-700' : 'text-gray-600'
                  }`}
                >
                  Reject Rating
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">I disagree with this assessment</p>
            </button>
          </div>

          {/* Rejection Note */}
          {action === 'reject' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <label className="block text-sm font-medium text-red-900 mb-2">
                Reason for Rejection <span className="text-red-600">*</span>
              </label>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Please explain why you disagree with this rating..."
                rows={4}
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
              <p className="text-xs text-red-600 mt-1">
                Your manager and HR will be notified of your rejection and the reason provided.
              </p>
            </div>
          )}

          {/* Signature Field */}
          {action === 'approve' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <label className="block text-sm font-medium text-green-900 mb-2">
                Your Signature <span className="text-green-600">*</span>
              </label>
              <SignatureField
                value={signature}
                onChange={setSignature}
                placeholder="Sign here to approve..."
              />
              <p className="text-xs text-green-600 mt-2">
                By signing, you confirm that you agree with your manager's rating and assessment.
              </p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={() => navigate('/employee/dashboard')} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!action || submitting}
              variant={
                action === 'approve' ? 'success' : action === 'reject' ? 'danger' : 'secondary'
              }
              loading={submitting}
            >
              {action === 'approve'
                ? 'Approve & Sign'
                : action === 'reject'
                ? 'Submit Rejection'
                : 'Select an Option'}
            </Button>
          </div>
        </div>
      </div>

      {/* Text Modal */}
      <TextModal
        isOpen={textModal.isOpen}
        onClose={closeTextModal}
        title={textModal.title}
        value={textModal.value}
      />
    </div>
  );
};

export default KPIConfirmation;
