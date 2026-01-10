import React from 'react';
import { FiEye } from 'react-icons/fi';
import { Button } from '../../../components/common';
import { KPI } from '../../../types';
import { KPIStageInfo, KPIActionInfo } from '../hooks/kpiListUtils';

interface KPIListRowProps {
  kpi: KPI;
  stageInfo: KPIStageInfo;
  primaryAction: KPIActionInfo;
  showEditButton: boolean;
  onView: (kpiId: number) => void;
  onEdit: (kpiId: number) => void;
}

export const KPIListRow: React.FC<KPIListRowProps> = ({
  kpi,
  stageInfo,
  primaryAction,
  showEditButton,
  onView,
  onEdit,
}) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-gray-900">{kpi.title}</p>
          {kpi.items && kpi.items.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              KPI Form with {kpi.items.length} item{kpi.items.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">
          <p>{kpi.quarter} {kpi.year}</p>
          {kpi.meeting_date && (
            <p className="text-xs text-gray-500 mt-1">
              Meeting: {new Date(kpi.meeting_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${stageInfo.color}`}>
          {stageInfo.icon}
          <span>{stageInfo.stage}</span>
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => onView(kpi.id)}
            variant="link"
            icon={FiEye}
            className="text-sm"
          >
            View
          </Button>
          {primaryAction.label && primaryAction.onClick && (
            <>
              <span className="text-gray-300">|</span>
              <Button
                onClick={primaryAction.onClick}
                variant="primary"
                size="xs"
              >
                {primaryAction.label}
              </Button>
            </>
          )}
          {showEditButton && (
            <>
              <span className="text-gray-300">|</span>
              <Button
                onClick={() => onEdit(kpi.id)}
                variant="link"
                className="text-sm"
              >
                Edit
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};