import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { KPI, KPIReview } from '../../types';
import { FiFileText, FiEye, FiCheckCircle } from 'react-icons/fi';

const Reviews: React.FC = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [reviews, setReviews] = useState<KPIReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviewPendingKPIs();
  }, []);

  const fetchReviewPendingKPIs = async () => {
    try {
      const [kpisRes, reviewsRes] = await Promise.all([
        api.get('/kpis'),
        api.get('/kpi-review'),
      ]);

      // Filter KPIs that are acknowledged and need employee review
      const acknowledgedKPIs = kpisRes.data.kpis.filter((kpi: KPI) => kpi.status === 'acknowledged');
      const reviewsList = reviewsRes.data.reviews || [];
      
      // Filter to show only KPIs that need employee action (not yet submitted by employee)
      const needReviewKPIs = acknowledgedKPIs.filter((kpi: KPI) => {
        const review = reviewsList.find((r: KPIReview) => r.kpi_id === kpi.id);
        // Show if no review exists OR if review status is 'pending' (employee hasn't submitted yet)
        return !review || review.review_status === 'pending';
      });

      setKpis(needReviewKPIs);
      setReviews(reviewsList);
    } catch (error) {
      console.error('Error fetching review pending KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReviewStatus = (kpi: KPI): { stage: string; color: string } => {
    const review = reviews.find(r => r.kpi_id === kpi.id);
    
    if (!review) {
      return {
        stage: 'Review Pending - Action Required',
        color: 'bg-blue-100 text-blue-700'
      };
    }
    
    if (review.review_status === 'pending') {
      return {
        stage: 'Self-Rating Required',
        color: 'bg-purple-100 text-purple-700'
      };
    }

    return {
      stage: 'Review Pending',
      color: 'bg-blue-100 text-blue-700'
    };
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KPIs Awaiting Review</h1>
        <p className="text-sm text-gray-600 mt-1">
          Complete your self-assessment for acknowledged KPIs
        </p>
      </div>

      {/* KPI Cards */}
      {kpis.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FiCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">You have no KPIs pending review at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {kpis.map((kpi) => {
            const statusInfo = getReviewStatus(kpi);
            
            return (
              <div key={kpi.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{kpi.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusInfo.color}`}>
                        <FiFileText className="inline" />
                        <span>{statusInfo.stage}</span>
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{kpi.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Period</p>
                        <p className="font-medium text-gray-900">{kpi.quarter} {kpi.year}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p className="font-medium text-gray-900 capitalize">{kpi.period}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">KPI Items</p>
                        <p className="font-medium text-gray-900">{kpi.items?.length || kpi.item_count || 1}</p>
                      </div>
                      {kpi.meeting_date && (
                        <div>
                          <p className="text-gray-500">Meeting Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(kpi.meeting_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => navigate(`/employee/kpi-details/${kpi.id}`)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <FiEye className="text-lg" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => navigate(`/employee/self-rating/${kpi.id}`)}
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
                    >
                      Start Review
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reviews;
