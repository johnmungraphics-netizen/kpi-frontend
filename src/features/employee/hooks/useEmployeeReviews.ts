import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KPI, KPIReview } from '../../../types';
import api from '../../../services/api';

interface ReviewStatusInfo {
  stage: string;
  color: string;
}

export const useEmployeeReviews = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [reviews, setReviews] = useState<KPIReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviewPendingKPIs();
  }, []);

  const fetchReviewPendingKPIs = async () => {
    try {
      setLoading(true);
      setError(null);

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
    } catch (err) {
      console.error('Error fetching review pending KPIs:', err);
      setError('Failed to load review pending KPIs');
    } finally {
      setLoading(false);
    }
  };

  const getReviewStatus = (kpi: KPI): ReviewStatusInfo => {
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

  const handleViewKPI = (kpiId: number) => {
    navigate(`/employee/kpi-details/${kpiId}`);
  };

  const handleStartReview = (kpiId: number) => {
    navigate(`/employee/self-rating/${kpiId}`);
  };

  return {
    kpis,
    reviews,
    loading,
    error,
    getReviewStatus,
    handleViewKPI,
    handleStartReview,
    refetch: fetchReviewPendingKPIs,
  };
};