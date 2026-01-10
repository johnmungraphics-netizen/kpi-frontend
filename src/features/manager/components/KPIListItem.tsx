/**
 * KPI List Item Component
 * 
 * Reusable component for displaying KPI in a list
 */

import React from 'react';
import { FiEye, FiUser } from 'react-icons/fi';
import { KPI } from '../../../types';

interface KPIListItemProps {
  kpi: KPI;
  stageInfo: {
    stage: string;
    color: string;
    icon: React.ReactNode;
  };
  onClick: () => void;
}

export const KPIListItem: React.FC<KPIListItemProps> = ({ kpi, stageInfo, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-6 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg">{kpi.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${stageInfo.color}`}>
              {stageInfo.icon}
              <span>{stageInfo.stage}</span>
            </span>
          </div>
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FiUser className="text-gray-400" />
              <span>{kpi.employee_name}</span>
            </div>
            <span className="text-sm text-gray-500">{kpi.employee_department}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{kpi.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Period: {kpi.quarter} {kpi.year}</span>
            <span>Target: {kpi.target_value} {kpi.measure_unit}</span>
            {kpi.meeting_date && (
              <span>Meeting: {new Date(kpi.meeting_date).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <div className="ml-4">
          <FiEye className="text-gray-400 text-xl" />
        </div>
      </div>
    </button>
  );
};
