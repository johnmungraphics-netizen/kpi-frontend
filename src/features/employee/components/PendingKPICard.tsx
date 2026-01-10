import React from 'react';
import { FiClock, FiEye } from 'react-icons/fi';
import { Button } from '../../../components/common';
import { KPI } from '../../../types';

interface PendingKPICardProps {
  kpi: KPI;
  onView: (kpiId: number) => void;
  onAcknowledge: (kpiId: number) => void;
}

export const PendingKPICard: React.FC<PendingKPICardProps> = ({ kpi, onView, onAcknowledge }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{kpi.title}</h3>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 flex items-center space-x-1">
              <FiClock className="inline" />
              <span>Pending Acknowledgement</span>
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{kpi.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Period</p>
              <p className="font-medium text-gray-900">{kpi.quarter} {kpi.year}</p>
            </div>
            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium text-gray-900 capitalize">{kpi.period}</p>
            </div>
            <div>
              <p className="text-gray-500">KPI Items</p>
              <p className="font-medium text-gray-900">{kpi.items?.length || kpi.item_count || 1}</p>
            </div>
            {kpi.meeting_date && (
              <div>
                <p className="text-gray-500">Meeting Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(kpi.meeting_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="ml-4 flex flex-col space-y-2">
          <Button
            onClick={() => onView(kpi.id)}
            variant="link"
            icon={FiEye}
            size="sm"
          >
            View
          </Button>
          <Button
            onClick={() => onAcknowledge(kpi.id)}
            variant="primary"
            size="sm"
          >
            Acknowledge Now
          </Button>
        </div>
      </div>
    </div>
  );
};