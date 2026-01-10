/**
 * KPI Filters Component
 * Filter controls for KPI list
 */

import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { KPIFilters as Filters, PeriodSetting, Manager } from '../types';
import { getPeriodValue, getPeriodLabelFromSetting } from '../hooks/kpiListUtils';

interface KPIFiltersProps {
  filters: Filters;
  searchQuery: string;
  departments: string[];
  periodSettings: PeriodSetting[];
  managers: Manager[];
  onFilterChange: (key: keyof Filters, value: string) => void;
  onSearchChange: (value: string) => void;
}

export const KPIFilters: React.FC<KPIFiltersProps> = ({
  filters,
  searchQuery,
  departments,
  periodSettings,
  managers,
  onFilterChange,
  onSearchChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
            value={filters.department}
            onChange={(e) => onFilterChange('department', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">KPI Period</label>
          <select
            value={filters.period}
            onChange={(e) => onFilterChange('period', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Periods</option>
            {periodSettings.map(setting => (
              <option key={setting.id} value={getPeriodValue(setting)}>
                {getPeriodLabelFromSetting(setting)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
          <select
            value={filters.manager}
            onChange={(e) => onFilterChange('manager', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Managers</option>
            {managers.map(manager => (
              <option key={manager.id} value={manager.id}>{manager.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">KPI Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="pending">KPI Setting - Awaiting Acknowledgement</option>
            <option value="acknowledged">KPI Acknowledged - Review Pending</option>
            <option value="employee_submitted">Self-Rating Submitted</option>
            <option value="completed">KPI Review Completed</option>
            <option value="rejected">Review Rejected by Employee</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search KPIs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
