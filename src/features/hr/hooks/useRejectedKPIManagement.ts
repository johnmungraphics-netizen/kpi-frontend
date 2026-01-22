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
      console.log('🔍 [useRejectedKPIManagement] fetchData START');
      
      const [kpisRes, reviewsRes] = await Promise.all([
        hrService.fetchKPIs({}),
        hrService.fetchReviews(),
      ]);

      console.log('📦 [useRejectedKPIManagement] Raw API responses:', {
        kpisRes,
        reviewsRes,
        kpisResType: typeof kpisRes,
        reviewsResType: typeof reviewsRes,
        kpisResKeys: kpisRes ? Object.keys(kpisRes) : [],
        reviewsResIsArray: Array.isArray(reviewsRes)
      });

      // CRITICAL: The component doesn't need KPIs - it only needs reviews!
      // Each review already has kpi_id and all KPI info (kpi_title, kpi_description, etc.)
      // We can filter reviews directly by confirmation_status
      const allReviews = reviewsRes || [];
      
      console.log('🔍 [useRejectedKPIManagement] Strategy: Using reviews only (reviews contain KPI info)');
      console.log('📋 [useRejectedKPIManagement] Reviews count:', allReviews.length);

      if (allReviews.length > 0) {
        console.log('📝 [useRejectedKPIManagement] First Review sample:', {
          id: allReviews[0].id,
          kpi_id: allReviews[0].kpi_id,
          review_status: allReviews[0].review_status,
          confirmation_status: allReviews[0].confirmation_status,
          rejection_resolved_status: allReviews[0].rejection_resolved_status,
          rejection_note: allReviews[0].rejection_note,
          allKeys: Object.keys(allReviews[0])
        });
        
        // Log ALL reviews with their confirmation_status
        console.log('📊 [useRejectedKPIManagement] ALL Reviews confirmation statuses:');
        allReviews.forEach((review: any, index: number) => {
          console.log(`  Review ${index + 1} (ID: ${review.id}, KPI: ${review.kpi_id}):`, {
            confirmation_status: review.confirmation_status,
            rejection_resolved_status: review.rejection_resolved_status,
            rejection_note: review.rejection_note
          });
        });
        
        // Count how many have 'rejected' status
        const rejectedStatusCount = allReviews.filter((r: any) => r.confirmation_status === 'rejected').length;
        const resolvedStatusCount = allReviews.filter((r: any) => r.confirmation_status === 'rejected' && r.rejection_resolved_status === 'resolved').length;
        console.log('📈 [useRejectedKPIManagement] Status counts from reviews:', {
          totalReviews: allReviews.length,
          withRejectedStatus: rejectedStatusCount,
          withResolvedStatus: resolvedStatusCount
        });
      }

      setReviews(allReviews);

      // FIXED: Check confirmation_status (actual field name from backend)
      console.log('✅ [useRejectedKPIManagement] Checking confirmation_status for rejections');
      
      // IMPORTANT: Work directly with reviews - they already contain KPI info
      // Filter reviews based on rejection status
      const rejectedReviews = allReviews.filter((review: any) => {
        return review.confirmation_status === 'rejected' && review.rejection_resolved_status !== 'resolved';
      });

      const resolvedReviews = allReviews.filter((review: any) => {
        return review.confirmation_status === 'rejected' && review.rejection_resolved_status === 'resolved';
      });

      console.log('✅ [useRejectedKPIManagement] Filtered results:', {
        rejectedCount: rejectedReviews.length,
        resolvedCount: resolvedReviews.length,
        rejectedKPIs: rejectedReviews.map((r: any) => ({id: r.kpi_id, title: r.kpi_title}))
      });

      setRejectedCount(rejectedReviews.length);
      setResolvedCount(resolvedReviews.length);
      setReviews(allReviews);

      // Set displayed data based on selection (using reviews, not KPIs)
      if (selectedFilter === 'rejected') {
        setKpis(rejectedReviews);
      } else if (selectedFilter === 'resolved') {
        setKpis(resolvedReviews);
      } else {
        setKpis([]);
      }
      
      console.log('🏁 [useRejectedKPIManagement] fetchData COMPLETE');
    } catch (error) {
      console.error('❌ [useRejectedKPIManagement] Error fetching data:', error);
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
