/**
 * KPI Table Component
 * Displays paginated list of KPIs with status indicators
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KPI, KPIReview } from '../../../types';
import { Button } from '../../../components/common';
import { FiEye } from 'react-icons/fi';
import { getKPIStage, getPeriodLabel } from '../hooks/kpiListUtils';

interface KPITableProps {
  kpis: KPI[];
  reviews: KPIReview[];
}

export const KPITable: React.FC<KPITableProps> = ({ kpis, reviews }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">EMPLOYEE NAME</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">PAYROLL NUMBER</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">MANAGER</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">PERIOD</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">KPI STATUS</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">REVIEW DATE</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {kpis.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                No KPIs found
              </td>
            </tr>
          ) : (
            kpis.map((kpi) => {
              const stageInfo = getKPIStage(kpi, reviews);
              return (
                <tr key={kpi.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{kpi.employee_name}</p>
                    <p className="text-sm text-gray-500">{kpi.employee_department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{kpi.employee_payroll_number || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{kpi.manager_name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{getPeriodLabel(kpi)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${stageInfo.color}`}>
                      {stageInfo.icon}
                      <span>{stageInfo.stage}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {new Date(kpi.updated_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => navigate(`/hr/kpi-details/${kpi.id}`)}
                      variant="ghost"
                      size="sm"
                      icon={FiEye}
                      className="text-purple-600 hover:text-purple-900 p-0"
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
