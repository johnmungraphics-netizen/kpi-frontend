/**
 * Custom hook for Rejected KPI Management page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KPI, KPIReview } from '../../../types';
import { hrService } from '../services';

export const useRejectedKPIManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'rejected' | 'resolved' | null>(null);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [reviews, setReviews] = useState<KPIReview[]>([]);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, [selectedFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kpisRes, reviewsRes] = await Promise.all([
        hrService.fetchKPIs({}),
        hrService.fetchReviews(),
      ]);

      const allKpis = kpisRes.kpis || [];
      const allReviews = reviewsRes || [];
      setReviews(allReviews);

      // Filter KPIs based on rejection status
      const rejectedKpis = allKpis.filter((kpi: KPI) => {
        const review = allReviews.find((r: KPIReview) => r.kpi_id === kpi.id);
        return review && review.review_status === 'rejected' && review.rejection_resolved_status !== 'resolved';
      });

      const resolvedKpis = allKpis.filter((kpi: KPI) => {
        const review = allReviews.find((r: KPIReview) => r.kpi_id === kpi.id);
        return review && review.review_status === 'rejected' && review.rejection_resolved_status === 'resolved';
      });

      setRejectedCount(rejectedKpis.length);
      setResolvedCount(resolvedKpis.length);

      // Filter displayed KPIs based on selection
      if (selectedFilter === 'rejected') {
        setKpis(rejectedKpis);
      } else if (selectedFilter === 'resolved') {
        setKpis(resolvedKpis);
      } else {
        setKpis([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (filter: 'rejected' | 'resolved') => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
  };

  const getReviewForKPI = (kpiId: number): KPIReview | undefined => {
    return reviews.find(r => r.kpi_id === kpiId);
  };

  return {
    loading,
    selectedFilter,
    kpis,
    reviews,
    rejectedCount,
    resolvedCount,
    handleCardClick,
    getReviewForKPI,
    navigate,
  };
};
