import React from 'react';

interface StatusCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  titleColor: string;
  countColor: string;
  onClick?: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  count,
  icon,
  bgColor,
  borderColor,
  iconColor,
  titleColor,
  countColor,
  onClick,
}) => {
  const baseClasses = `${bgColor} border ${borderColor} rounded-lg p-4 hover:shadow-md transition-shadow text-left`;
  
  if (onClick) {
    return (
      <button onClick={onClick} className={baseClasses}>
        <div className="flex items-center space-x-2 mb-2">
          <span className={iconColor}>{icon}</span>
          <p className={`text-xs font-medium ${titleColor}`}>{title}</p>
        </div>
        <p className={`text-2xl font-bold ${countColor}`}>{count}</p>
      </button>
    );
  }

  return (
    <div className={baseClasses}>
      <div className="flex items-center space-x-2 mb-2">
        <span className={iconColor}>{icon}</span>
        <p className={`text-xs font-medium ${titleColor}`}>{title}</p>
      </div>
      <p className={`text-2xl font-bold ${countColor}`}>{count}</p>
    </div>
  );
};

export default StatusCard;
