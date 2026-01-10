/**
 * Stat Card Component for Rejected KPI Management
 */

import React from 'react';

interface StatCardProps {
  title: string;
  count: number;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
}

export const RejectedKPIStatCard: React.FC<StatCardProps> = ({ 
  title, 
  count, 
  color, 
  icon, 
  onClick, 
  isSelected 
}) => (
  <div
    onClick={onClick}
    className={`cursor-pointer bg-white rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-md ${
      isSelected ? `${color} border-current` : 'border-gray-200'
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{count}</p>
      </div>
      <div className={`text-4xl ${isSelected ? 'opacity-100' : 'opacity-50'}`}>
        {icon}
      </div>
    </div>
  </div>
);
