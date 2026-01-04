import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { FiArrowLeft, FiUser, FiTrendingUp, FiCalendar, FiCheckCircle } from 'react-icons/fi';

interface PerformanceData {
  id: number;
  employee_name: string;
  employee_department: string;
  employee_payroll_number: string;
  manager_name: string;
  period: 'quarterly' | 'yearly';
  quarter?: string;
  year: number;
  review_id: number;
  final_rating: number;
  total_weight: number;
  manager_signed_at: string;
  review_quarter?: string;
  review_year?: number;
  item_calculations: Array<{
    item_id: number;
    title: string;
    manager_rating: number;
    goal_weight: number;
    contribution: number;
  }>;
}

const EmployeePerformance: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [employeeInfo, setEmployeeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employeeId) {
      fetchPerformanceData();
    }
  }, [employeeId]);

  const fetchPerformanceData = async () => {
    try {
      const response = await api.get(`/kpis/employee-performance/${employeeId}`);
      const data = response.data.performance || [];
      
      // Ensure all final_rating values are numbers
      const normalizedData = data.map((period: any) => ({
        ...period,
        final_rating: period.final_rating != null && !isNaN(period.final_rating) ? period.final_rating : 0,
        total_weight: period.total_weight != null && !isNaN(period.total_weight) ? period.total_weight : 0,
        item_calculations: period.item_calculations || [],
      }));
      
      setPerformanceData(normalizedData);
      
      if (normalizedData.length > 0) {
        setEmployeeInfo({
          name: normalizedData[0].employee_name,
          department: normalizedData[0].employee_department,
          payroll_number: normalizedData[0].employee_payroll_number,
        });
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = (rating: number): { label: string; color: string } => {
    if (rating >= 1.40) return { label: 'Exceeds Expectation', color: 'text-green-700 bg-green-100' };
    if (rating >= 1.15) return { label: 'Meets Expectation', color: 'text-blue-700 bg-blue-100' };
    return { label: 'Below Expectation', color: 'text-orange-700 bg-orange-100' };
  };

  const calculateAverageRating = (): number => {
    if (performanceData.length === 0) return 0;
    const validRatings = performanceData.filter(p => p.final_rating != null && !isNaN(p.final_rating));
    if (validRatings.length === 0) return 0;
    const sum = validRatings.reduce((acc, p) => acc + (p.final_rating || 0), 0);
    return sum / validRatings.length;
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const averageRating = calculateAverageRating();
  const avgRatingInfo = getRatingLabel(averageRating);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiArrowLeft className="text-xl" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Employee Performance</h1>
          <p className="text-sm text-gray-600 mt-1">
            Performance ratings across all KPI periods
          </p>
        </div>
      </div>

      {/* Employee Information */}
      {employeeInfo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <FiUser className="text-purple-600 text-2xl" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{employeeInfo.name}</h2>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>Department: {employeeInfo.department}</span>
                <span>Payroll: {employeeInfo.payroll_number}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Overall Average</p>
              <p className="text-3xl font-bold text-purple-600">{averageRating.toFixed(2)}</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${avgRatingInfo.color}`}>
                {avgRatingInfo.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FiCalendar className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Periods</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FiTrendingUp className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FiCheckCircle className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Performance Level</p>
              <p className="text-lg font-semibold text-gray-900">{avgRatingInfo.label}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance by Period */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Performance by KPI Period</h2>
          <p className="text-sm text-gray-600 mt-1">
            Detailed ratings for each completed KPI period
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {performanceData.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No performance data available for this employee</p>
            </div>
          ) : (
            performanceData.map((period, index) => {
              const finalRating = period.final_rating || 0;
              const ratingInfo = getRatingLabel(finalRating);
              return (
                <div key={period.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {period.period === 'quarterly' 
                            ? `${period.quarter || period.review_quarter} ${period.year || period.review_year} - Quarterly`
                            : `${period.year || period.review_year} - Yearly`}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          period.period === 'quarterly' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {period.period === 'quarterly' ? 'Quarterly' : 'Yearly'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Manager: {period.manager_name}</span>
                        {period.manager_signed_at && (
                          <span>Completed: {new Date(period.manager_signed_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Final Rating</p>
                      <p className="text-3xl font-bold text-purple-600">{finalRating.toFixed(2)}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium mt-2 inline-block ${ratingInfo.color}`}>
                        {ratingInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Calculation Breakdown */}
                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Rating Calculation:</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left py-2 px-3">KPI Item</th>
                            <th className="text-right py-2 px-3">Manager Rating</th>
                            <th className="text-right py-2 px-3">Goal Weight</th>
                            <th className="text-right py-2 px-3">Contribution</th>
                          </tr>
                        </thead>
                        <tbody>
                          {period.item_calculations && period.item_calculations.length > 0 ? (
                            period.item_calculations.map((calc, idx) => (
                              <tr key={calc.item_id} className="border-b border-gray-200">
                                <td className="py-2 px-3 text-gray-700">{calc.title || `Item ${idx + 1}`}</td>
                                <td className="py-2 px-3 text-right font-semibold">{(calc.manager_rating || 0).toFixed(2)}</td>
                                <td className="py-2 px-3 text-right">{((calc.goal_weight || 0) * 100).toFixed(0)}%</td>
                                <td className="py-2 px-3 text-right font-semibold text-purple-600">{(calc.contribution || 0).toFixed(2)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-4 px-3 text-center text-gray-500 text-sm">
                                No calculation data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-gray-400 font-semibold">
                            <td className="py-2 px-3">Total</td>
                            <td className="py-2 px-3 text-right">-</td>
                            <td className="py-2 px-3 text-right">{((period.total_weight || 0) * 100).toFixed(0)}%</td>
                            <td className="py-2 px-3 text-right text-purple-600">{finalRating.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => navigate(`/hr/kpi-details/${period.id}`)}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      View Full Details →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePerformance;

