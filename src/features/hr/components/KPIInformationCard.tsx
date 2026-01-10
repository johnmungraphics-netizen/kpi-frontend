/**
 * KPI Information Card Component
 * Displays employee and manager information
 */

import React from 'react';
import { FiUser } from 'react-icons/fi';
import { KPI } from '../../../types';

interface KPIInformationCardProps {
  kpi: KPI;
}

export const KPIInformationCard: React.FC<KPIInformationCardProps> = ({ kpi }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee & Manager Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FiUser className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Employee</p>
              <p className="font-semibold text-gray-900">{kpi.employee_name}</p>
              <p className="text-sm text-gray-500">{kpi.employee_department}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUser className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Manager</p>
              <p className="font-semibold text-gray-900">{kpi.manager_name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
