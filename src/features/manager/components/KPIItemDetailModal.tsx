import React from 'react';
import { FiX, FiTarget, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { Button } from '../../../components/common';

interface KPIItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    title: string;
    description: string;
    target_value?: string;
    measure_unit?: string;
    current_performance_status?: string;
    expected_completion_date?: string;
    goal_weight?: string;
    is_qualitative?: boolean;
  };
  index: number;
}

const KPIItemDetailModal: React.FC<KPIItemDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  index,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">KPI Item Details</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {item.is_qualitative ? 'Qualitative KPI' : 'Quantitative KPI'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KPI Title
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 font-medium">{item.title}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Target Value */}
              {item.target_value && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiTarget className="text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Target Value</span>
                  </div>
                  <p className="text-lg font-bold text-purple-900">
                    {item.target_value} {item.measure_unit}
                  </p>
                </div>
              )}

              {/* Current Performance */}
              {item.current_performance_status && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiTrendingUp className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Current Status</span>
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {item.current_performance_status}
                  </p>
                </div>
              )}

              {/* Expected Completion */}
              {item.expected_completion_date && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiCalendar className="text-green-600" />
                    <span className="text-sm font-medium text-green-900">Expected Completion</span>
                  </div>
                  <p className="text-lg font-bold text-green-900">
                    {new Date(item.expected_completion_date).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Goal Weight */}
              {item.goal_weight && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-orange-900">Goal Weight</span>
                  </div>
                  <p className="text-lg font-bold text-orange-900">
                    {item.goal_weight}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIItemDetailModal;