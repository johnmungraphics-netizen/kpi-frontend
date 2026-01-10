import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  titleColor?: string;
  valueColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
  titleColor = 'text-gray-600',
  valueColor = 'text-gray-900',
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <div className={`${iconColor} text-2xl`}>
            {icon}
          </div>
        </div>
        <div>
          <p className={`text-sm ${titleColor} mb-1${titleColor.includes('font') ? '' : ' font-medium'}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${valueColor}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
