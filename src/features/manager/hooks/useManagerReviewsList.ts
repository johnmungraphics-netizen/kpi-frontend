/**
 * useManagerReviewsList
 * 
 * Custom hook for managing reviews list page state and logic.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { KPIReview } from '../../../types';

interface UseManagerReviewsListReturn {
  reviews: KPIReview[];
  loading: boolean;
  pendingCount: number;
  getStatusColor: (status: string) => string;
  handleBack: () => void;
  handleReview: (reviewId: number) => void;
  handleEdit: (reviewId: number) => void;
  handleViewKPI: (kpiId: number) => void;
  handleView: (reviewId: number) => void;
}

export const useManagerReviewsList = (): UseManagerReviewsListReturn => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<KPIReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/kpi-review');
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = reviews.filter(
    r => r.review_status === 'employee_submitted' || r.review_status === 'pending'
  ).length;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'manager_submitted':
        return 'bg-blue-100 text-blue-700';
      case 'employee_submitted':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleReview = (reviewId: number) => {
    navigate(`/manager/kpi-review/${reviewId}`);
  };

  const handleEdit = (reviewId: number) => {
    navigate(`/manager/kpi-review/${reviewId}`);
  };

  const handleViewKPI = (kpiId: number) => {
    navigate(`/manager/kpi-details/${kpiId}`);
  };

  const handleView = (reviewId: number) => {
    navigate(`/manager/kpi-review/${reviewId}`);
  };

  return {
    reviews,
    loading,
    pendingCount,
    getStatusColor,
    handleBack,
    handleReview,
    handleEdit,
    handleViewKPI,
    handleView,
  };
};
