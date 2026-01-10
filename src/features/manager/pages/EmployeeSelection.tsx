import React from 'react';
import { FiArrowLeft, FiUser, FiSearch, FiEye, FiEdit, FiFileText, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from '../../../components/common';
import { useManagerEmployeeSelection } from '../hooks';

const EmployeeSelection: React.FC = () => {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    currentEmployees,
    filteredEmployees,
    employeesPerPage,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    pendingReviewsCount,
    handlePreviousPage,
    handleNextPage,
    handleScrollToEmployees,
    handleNavigateToTemplates,
    handleNavigateToReviews,
    handleNavigateToScheduleMeeting,
    handleViewKPIs,
    handleSetKPI,
    handleBack,
  } = useManagerEmployeeSelection();

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Select Employee</h1>
          <p className="text-sm text-gray-600 mt-1">Choose an employee to set KPIs for</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleScrollToEmployees}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiEdit className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Set New KPI</p>
                <p className="text-sm text-gray-500">Create KPI for employee</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleNavigateToTemplates}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FiFileText className="text-indigo-600 text-xl" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">KPI Templates</p>
                <p className="text-sm text-gray-500">Create & use templates</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleNavigateToReviews}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiFileText className="text-orange-600 text-xl" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Review KPIs</p>
                <p className="text-sm text-gray-500">
                  {pendingReviewsCount} pending reviews
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleNavigateToScheduleMeeting}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Schedule Meeting</p>
                <p className="text-sm text-gray-500">KPI review meetings</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, payroll number, or department..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Employees List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 employee-list-section">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Employees ({filteredEmployees.length})
            </h2>
            <p className="text-sm text-gray-500">
              Showing {filteredEmployees.length > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payroll Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Position</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                currentEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FiUser className="text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{employee.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">{employee.email || '-'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{employee.payroll_number || '-'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{employee.department || '-'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{employee.position || '-'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewKPIs(employee.id);
                          }}
                          variant="primary"
                          icon={FiEye}
                          size="sm"
                        >
                          View KPIs
                        </Button>
                        <Button
                          onClick={() => handleSetKPI(employee.id)}
                          variant="secondary"
                          icon={FiEdit}
                          size="sm"
                        >
                          Set KPI
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredEmployees.length > employeesPerPage && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                variant="outline"
                icon={FiChevronLeft}
              >
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                iconPosition="right"
                icon={FiChevronRight}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSelection;
