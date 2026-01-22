import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { KPI } from '../../../types';
import { employeeService } from '../services/employeeService';
import { KPIReviewConfirmation, TextModalState } from '../types';
import {
  parseItemRatingsFromReview,
  calculateRatingSummary,
  validateConfirmation,
} from './kpiConfirmationUtils';

export const useEmployeeKPIConfirmation = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [review, setReview] = useState<KPIReviewConfirmation | null>(null);
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [textModal, setTextModal] = useState<TextModalState>({
    isOpen: false,
    title: '',
    value: '',
  });

  useEffect(() => {
    if (reviewId) {
      fetchReview();
    }
  }, [reviewId]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      const reviewData = await employeeService.fetchReviewById(parseInt(reviewId!));
      console.log('📥 [useEmployeeKPIConfirmation] fetched reviewData:', reviewData);
      setReview(reviewData);

      // Fetch the full KPI details with items
      if (reviewData?.kpi_id) {
        const kpiData = await employeeService.fetchKPIById(reviewData.kpi_id);
        console.log('📥 [useEmployeeKPIConfirmation] fetched kpiData:', kpiData);
        console.log('✅ Using items from kpiData:', kpiData);
        setKpi(kpiData);
      }
    } catch (error: any) {
      console.error('Error fetching review:', error);
      setError('Failed to load review');
    } finally {
      setLoading(false);
    }
  };

  const handleActionSelect = (selectedAction: 'approve' | 'reject') => {
    setAction(selectedAction);
    if (selectedAction === 'approve') {
      setRejectionNote('');
    } else {
      setSignature('');
    }
  };

  const handleSubmit = async () => {
    console.log('🚀 [handleSubmit] START', {
      action,
      rejectionNote,
      signature,
      reviewId,
      hasReviewId: !!reviewId
    });
    
    const validation = validateConfirmation(action, rejectionNote, signature);
    console.log('✅ [handleSubmit] Validation result:', validation);
    
    if (!validation.valid) {
      console.error('❌ [handleSubmit] Validation FAILED:', validation.error);
      setError(validation.error!);
      return;
    }

    console.log('📤 [handleSubmit] Setting submitting to true...');
    setSubmitting(true);
    setError('');

    try {
     
      
      const response = await employeeService.submitConfirmation(parseInt(reviewId!), {
        confirmation_status: action === 'approve' ? 'approved' : 'rejected',
        rejection_note: action === 'reject' ? rejectionNote : null,
        signature: action === 'approve' ? signature : null,
      });
      

      toast.success(
        action === 'approve'
          ? 'Review approved successfully!'
          : 'Review rejected successfully. Your manager and HR have been notified.'
      );
      
      navigate('/employee/dashboard');
    } catch (error: any) {
      console.error('❌ [handleSubmit] Error data:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to confirm review');
    } finally {
      setSubmitting(false);
    }
  };

  const openTextModal = (title: string, value: string) => {
    setTextModal({ isOpen: true, title, value });
  };

  const closeTextModal = () => {
    setTextModal({ isOpen: false, title: '', value: '' });
  };

  const parsedRatings = review ? parseItemRatingsFromReview(review) : null;
  const ratingSummary = review ? calculateRatingSummary(review, kpi) : null;

  // Log parsed ratings and review for debugging
  useEffect(() => {
    if (review) {
      console.log('🔍 [useEmployeeKPIConfirmation] review object:', review);
    }
  }, [review, parsedRatings, ratingSummary]);

  return {
    reviewId,
    review,
    kpi,
    loading,
    submitting,
    action,
    rejectionNote,
    signature,
    error,
    textModal,
    parsedRatings,
    ratingSummary,
    setAction: handleActionSelect,
    setRejectionNote,
    setSignature,
    handleSubmit,
    openTextModal,
    closeTextModal,
    navigate,
  };
};