/**
 * useKPIDetails Hook
 * Manages KPI details page state and logic
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { useConfirm } from '../../../hooks/useConfirm';
import { KPI, KPIReview } from '../../../types';
import { TextModalState } from '../types';
import { hrService } from '../services/hrService';
import { getStageInfo } from './kpiDetailsUtils';

export const useKPIDetails = () => {
  const { kpiId } = useParams<{ kpiId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [kpi, setKpi] = useState<KPI | null>(null);
  const [review, setReview] = useState<KPIReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolveNote, setResolveNote] = useState('');
  const [textModal, setTextModal] = useState<TextModalState>({
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
      const { kpi: fetchedKpi, review: fetchedReview } = await hrService.fetchKPIById(kpiId!);
      setKpi(fetchedKpi);
      setReview(fetchedReview || null);
    } catch (error) {
      console.error('Error fetching KPI:', error);
      toast.error('Failed to load KPI details');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveRejection = async () => {
    if (!review) return;

    const confirmed = await confirm.confirm({
      title: 'Mark as Resolved',
      message: 'Mark this rejection as resolved? This will move it to the Resolved Issues section.',
      variant: 'info',
    });

    if (confirmed) {
      try {
        await hrService.resolveRejection(review.id, resolveNote);
        toast.success('Rejection marked as resolved successfully!');
        setResolveNote('');
        fetchKPI(); // Refresh data
      } catch (error) {
        console.error('Error resolving rejection:', error);
        toast.error('Failed to mark as resolved');
      }
    }
  };

  const openTextModal = (title: string, value: string) => {
    setTextModal({ isOpen: true, title, value });
  };

  const closeTextModal = () => {
    setTextModal({ isOpen: false, title: '', value: '' });
  };

  const stageInfo = getStageInfo(kpi, review);

  return {
    kpi,
    review,
    loading,
    resolveNote,
    setResolveNote,
    textModal,
    stageInfo,
    openTextModal,
    closeTextModal,
    handleResolveRejection,
    navigate,
  };
};
