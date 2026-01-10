import React from 'react';
import { FiArrowLeft, FiEye, FiUser, FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';
import { Button } from '../../../components/common';
import { useManagerEmployeeKPIs } from '../hooks';

const ManagerEmployeeKPIs: React.FC = () => {
  const {
    employee,
    loading,
    searchQuery,
    filteredKPIs,
    setSearchQuery,
    getKPIStageInfo,
    handleKPIClick,
    handleBack,
  } = useManagerEmployeeKPIs();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          icon={FiArrowLeft}
          className="p-2"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {employee?.name}'s KPIs
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            View all KPIs for this employee
          </p>
        </div>
      </div>

      {/* Employee Info */}
      {employee && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <FiUser className="text-purple-600 text-2xl" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-900">{employee.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="font-semibold text-gray-900">{employee.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-semibold text-gray-900">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payroll Number</p>
                <p className="font-semibold text-gray-900">{employee.payroll_number}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <FiEye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search KPIs by title, period, or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* KPI List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            KPIs ({filteredKPIs.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredKPIs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No KPIs found for this employee
            </div>
          ) : (
            filteredKPIs.map((kpi) => {
              const stageInfo = getKPIStageInfo(kpi);
              
              // Determine icon based on stage
              const getStageIcon = () => {
                if (stageInfo.stage.includes('Completed')) {
                  return <FiCheckCircle className="inline" />;
                } else if (stageInfo.stage.includes('Pending') || stageInfo.stage.includes('Awaiting')) {
                  return <FiClock className="inline" />;
                } else {
                  return <FiFileText className="inline" />;
                }
              };

              return (
                <div key={kpi.id} className="hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => handleKPIClick(kpi.id)}
                    className="w-full text-left p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{kpi.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${stageInfo.color}`}>
                            {getStageIcon()}
                            <span>{stageInfo.stage}</span>
                          </span>
                        </div>
                        {kpi.items && kpi.items.length > 0 && (
                          <p className="text-sm text-gray-500 mb-2">
                            {kpi.items.length} KPI item{kpi.items.length > 1 ? 's' : ''}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mb-2">{kpi.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Period: {kpi.quarter} {kpi.year}</span>
                          {kpi.meeting_date && (
                            <span>Meeting: {new Date(kpi.meeting_date).toLocaleDateString()}</span>
                          )}
                          {kpi.items && kpi.items.length > 0 && (
                            <span>Items: {kpi.items.length}</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <FiEye className="text-gray-400 text-xl" />
                      </div>
                    </div>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerEmployeeKPIs;
