import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { KPI, KPIReview } from '../../../types';
import { getKPIStageInfo, parseReviewData } from './employeeKPIDetailsUtils';

export const useEmployeeKPIDetails = () => {
  const { kpiId } = useParams<{ kpiId: string }>();
  const navigate = useNavigate();
  
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [review, setReview] = useState<KPIReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [textModal, setTextModal] = useState<{
    isOpen: boolean;
    title: string;
    value: string;
  }>({
    isOpen: false,
    title: '',
    value: '',
  });

  useEffect(() => {
    if (kpiId) {
      fetchKPI();
    }
  }, [kpiId]);

  const fetchKPI = async () => {
    try {
      setLoading(true);
      const [kpiRes, reviewsRes] = await Promise.all([
        api.get(`/kpis/${kpiId}`),
        api.get('/kpi-review'),
      ]);

      const kpiData = kpiRes.data.kpi || kpiRes.data;
      setKpi(kpiData);

      // Find review for this KPI
      const kpiReview = reviewsRes.data.reviews?.find(
        (r: KPIReview) => r.kpi_id === parseInt(kpiId!)
      );
      if (kpiReview) {
        setReview(kpiReview);
      }
    } catch (error: any) {
      console.error('Error fetching KPI:', error);
      setError('Failed to load KPI details');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAcknowledgeKPI = () => {
    if (kpi) {
      navigate(`/employee/kpi-acknowledgement/${kpi.id}`);
    }
  };

  const handleStartSelfRating = () => {
    if (kpi) {
      navigate(`/employee/self-rating/${kpi.id}`);
    }
  };

  const handleBackToList = () => {
    navigate('/employee/kpi-list');
  };

  const openTextModal = (title: string, value: string) => {
    setTextModal({
      isOpen: true,
      title,
      value,
    });
  };

  const closeTextModal = () => {
    setTextModal({
      isOpen: false,
      title: '',
      value: '',
    });
  };

  // FIXED: Only compute stageInfo and parsedReviewData when kpi exists
  const stageInfo = kpi ? getKPIStageInfo(kpi) : {
    stage: '',
    color: '',
    icon: null,
  };

  const parsedReviewData = kpi ? parseReviewData(review, kpi) : {
    employeeRating: 0,
    managerRating: 0,
    employeeComment: '',
    managerComment: '',
    employeeItemRatings: {},
    employeeItemComments: {},
    managerItemRatings: {},
    managerItemComments: {},
  };

  return {
    kpi,
    review,
    loading,
    error,
    textModal,
    stageInfo,
    parsedReviewData,
    handleBack,
    handleAcknowledgeKPI,
    handleStartSelfRating,
    handleBackToList,
    openTextModal,
    closeTextModal,
  };
};