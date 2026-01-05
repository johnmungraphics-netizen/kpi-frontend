import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { FiArrowLeft, FiUser, FiTrendingUp, FiCalendar, FiCheckCircle, FiFilter } from 'react-icons/fi';

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
  const [periodFilter, setPeriodFilter] = useState<'all' | 'quarterly' | 'yearly'>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');

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

  // Get available years from data
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    performanceData.forEach(p => {
      const year = p.year || p.review_year;
      if (year) years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [performanceData]);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    let filtered = [...performanceData];
    
    // Filter by period type
    if (periodFilter === 'quarterly') {
      filtered = filtered.filter(p => p.period === 'quarterly');
    } else if (periodFilter === 'yearly') {
      filtered = filtered.filter(p => p.period === 'yearly');
    }
    
    // Filter by year (only for quarterly)
    if (periodFilter === 'quarterly' && yearFilter !== 'all') {
      const selectedYear = parseInt(yearFilter);
      filtered = filtered.filter(p => (p.year || p.review_year) === selectedYear);
    }
    
    return filtered;
  }, [performanceData, periodFilter, yearFilter]);

  // Separate quarterly and yearly data
  const quarterlyData = useMemo(() => {
    return filteredData.filter(p => p.period === 'quarterly');
  }, [filteredData]);

  const yearlyData = useMemo(() => {
    return filteredData.filter(p => p.period === 'yearly');
  }, [filteredData]);

  // Calculate quarterly totals by year
  const quarterlyTotalsByYear = useMemo(() => {
    const totals: { [year: number]: { count: number; totalRating: number; averageRating: number } } = {};
    
    quarterlyData.forEach(period => {
      const year = period.year || period.review_year || 0;
      if (!totals[year]) {
        totals[year] = { count: 0, totalRating: 0, averageRating: 0 };
      }
      totals[year].count++;
      totals[year].totalRating += period.final_rating || 0;
    });
    
    // Calculate averages
    Object.keys(totals).forEach(year => {
      const yearNum = parseInt(year);
      if (totals[yearNum].count > 0) {
        totals[yearNum].averageRating = totals[yearNum].totalRating / totals[yearNum].count;
      }
    });
    
    return totals;
  }, [quarterlyData]);

  // Calculate average rating for filtered data
  const calculateAverageRating = (data: PerformanceData[]): number => {
    if (data.length === 0) return 0;
    const validRatings = data.filter(p => p.final_rating != null && !isNaN(p.final_rating));
    if (validRatings.length === 0) return 0;
    const sum = validRatings.reduce((acc, p) => acc + (p.final_rating || 0), 0);
    return sum / validRatings.length;
  };

  // Calculate average manager rating for a period
  const calculateAverageManagerRating = (itemCalculations: Array<{ manager_rating: number }>): number => {
    if (!itemCalculations || itemCalculations.length === 0) return 0;
    const validRatings = itemCalculations.filter(c => c.manager_rating != null && !isNaN(c.manager_rating) && c.manager_rating > 0);
    if (validRatings.length === 0) return 0;
    const sum = validRatings.reduce((acc, c) => acc + (c.manager_rating || 0), 0);
    return sum / validRatings.length;
  };

  // Prepare data for line graph (quarterly only, by year)
  const graphData = useMemo(() => {
    const data: { year: number; quarters: { [quarter: string]: number } }[] = [];
    const yearMap: { [year: number]: { [quarter: string]: number } } = {};
    
    quarterlyData.forEach(period => {
      const year = period.year || period.review_year || 0;
      const quarter = period.quarter || period.review_quarter || '';
      
      if (!yearMap[year]) {
        yearMap[year] = {};
      }
      yearMap[year][quarter] = period.final_rating || 0;
    });
    
    Object.keys(yearMap).sort((a, b) => parseInt(b) - parseInt(a)).forEach(yearStr => {
      const year = parseInt(yearStr);
      data.push({
        year,
        quarters: yearMap[year]
      });
    });
    
    return data;
  }, [quarterlyData]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const averageRating = calculateAverageRating(filteredData);
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <FiFilter className="text-gray-600" />
          <div className="flex-1 flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period Type</label>
              <select
                value={periodFilter}
                onChange={(e) => {
                  setPeriodFilter(e.target.value as 'all' | 'quarterly' | 'yearly');
                  if (e.target.value !== 'quarterly') {
                    setYearFilter('all');
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Periods</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            {periodFilter === 'quarterly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Years</option>
                  {availableYears.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FiCalendar className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Periods</p>
              <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
              {periodFilter === 'quarterly' && (
                <p className="text-xs text-gray-500 mt-1">
                  Quarterly: {quarterlyData.length} | Yearly: {yearlyData.length}
                </p>
              )}
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
              {periodFilter === 'quarterly' && quarterlyData.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Quarterly Avg: {calculateAverageRating(quarterlyData).toFixed(2)}
                </p>
              )}
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

      {/* Quarterly Totals by Year */}
      {periodFilter !== 'yearly' && Object.keys(quarterlyTotalsByYear).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Totals by Year</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(quarterlyTotalsByYear)
              .sort((a, b) => parseInt(b) - parseInt(a))
              .map(yearStr => {
                const year = parseInt(yearStr);
                const total = quarterlyTotalsByYear[year];
                const ratingInfo = getRatingLabel(total.averageRating);
                return (
                  <div key={year} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">{year}</p>
                    <p className="text-2xl font-bold text-blue-600">{total.averageRating.toFixed(2)}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {total.count} Quarter{total.count !== 1 ? 's' : ''}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium mt-2 inline-block ${ratingInfo.color}`}>
                      {ratingInfo.label}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Line Graph for Quarterly Performance */}
      {periodFilter !== 'yearly' && quarterlyData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Performance Trend</h2>
          {graphData.length > 0 ? (
            <div className="h-64 flex items-end justify-center space-x-4 overflow-x-auto pb-4">
              {graphData.map((yearData) => (
                <div key={`year-${yearData.year}`} className="flex-1 min-w-[120px] flex flex-col items-center">
                  <div className="w-full flex items-end justify-center space-x-1 h-48 mb-2">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => {
                      const rating = yearData.quarters[quarter];
                      if (rating === undefined) {
                        return (
                          <div key={`${yearData.year}-${quarter}-empty`} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-gray-200 rounded-t" style={{ height: '10px' }} />
                            <span className="text-xs text-gray-400 mt-1">{quarter}</span>
                          </div>
                        );
                      }
                      const height = Math.max((rating / 1.5) * 100, 5); // Scale to max 1.50, minimum 5%
                      return (
                        <div key={`${yearData.year}-${quarter}`} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-colors cursor-pointer min-h-[20px]"
                            style={{ height: `${height}%` }}
                            title={`${quarter} ${yearData.year}: ${rating.toFixed(2)}`}
                          />
                          <span className="text-xs text-gray-600 mt-1">{quarter}</span>
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 mt-2">{yearData.year}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">No quarterly data available for graph</p>
            </div>
          )}
        </div>
      )}

      {/* Quarterly Performance */}
      {periodFilter !== 'yearly' && quarterlyData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quarterly Performance</h2>
            <p className="text-sm text-gray-600 mt-1">
              Detailed ratings for each quarterly KPI period
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {quarterlyData.map((period, periodIdx) => {
              const finalRating = period.final_rating || 0;
              const ratingInfo = getRatingLabel(finalRating);
              const avgManagerRating = calculateAverageManagerRating(period.item_calculations || []);
              return (
                <div key={`quarterly-${period.id}-${period.review_id}-${periodIdx}`} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {period.quarter || period.review_quarter} {period.year || period.review_year} - Quarterly
                        </h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Quarterly
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
                            period.item_calculations.map((calc, calcIdx) => (
                              <tr key={`quarterly-calc-${period.id}-${calc.item_id}-${calcIdx}`} className="border-b border-gray-200">
                                <td className="py-2 px-3 text-gray-700">{calc.title || `Item ${calc.item_id}`}</td>
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
                            <td className="py-2 px-3 text-right">
                              {avgManagerRating > 0 ? avgManagerRating.toFixed(2) : '-'}
                            </td>
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
            })}
          </div>
        </div>
      )}

      {/* Yearly Performance */}
      {periodFilter !== 'quarterly' && yearlyData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Yearly Performance</h2>
            <p className="text-sm text-gray-600 mt-1">
              Yearly KPI periods (not aggregated with quarterly)
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {yearlyData.map((period, periodIdx) => {
              const finalRating = period.final_rating || 0;
              const ratingInfo = getRatingLabel(finalRating);
              const avgManagerRating = calculateAverageManagerRating(period.item_calculations || []);
              return (
                <div key={`yearly-${period.id}-${period.review_id}-${periodIdx}`} className="p-6 hover:bg-gray-50 border-l-4 border-red-500">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {period.year || period.review_year} - Yearly
                        </h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Yearly
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
                      <p className="text-3xl font-bold text-red-600">{finalRating.toFixed(2)}</p>
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
                            period.item_calculations.map((calc, calcIdx) => (
                              <tr key={`yearly-calc-${period.id}-${calc.item_id}-${calcIdx}`} className="border-b border-gray-200">
                                <td className="py-2 px-3 text-gray-700">{calc.title || `Item ${calc.item_id}`}</td>
                                <td className="py-2 px-3 text-right font-semibold">{(calc.manager_rating || 0).toFixed(2)}</td>
                                <td className="py-2 px-3 text-right">{((calc.goal_weight || 0) * 100).toFixed(0)}%</td>
                                <td className="py-2 px-3 text-right font-semibold text-red-600">{(calc.contribution || 0).toFixed(2)}</td>
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
                            <td className="py-2 px-3 text-right text-red-600">
                              {avgManagerRating > 0 ? avgManagerRating.toFixed(2) : '-'}
                            </td>
                            <td className="py-2 px-3 text-right">{((period.total_weight || 0) * 100).toFixed(0)}%</td>
                            <td className="py-2 px-3 text-right text-red-600">{finalRating.toFixed(2)}</td>
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
            })}
          </div>
        </div>
      )}

      {/* No Data Message */}
      {filteredData.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          <p>No performance data available for the selected filters</p>
        </div>
      )}
    </div>
  );
};

export default EmployeePerformance;

