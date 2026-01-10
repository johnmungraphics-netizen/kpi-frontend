import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import api from '../../../services/api';
import { KPI } from '../../../types';
import { RatingOption } from '../types';

interface TextModalState {
  isOpen: boolean;
  title: string;
  value: string;
  onChange?: (value: string) => void;
}

// Extended KPIItem interface with review fields
interface ExtendedKPIItem {
  id: number;
  title: string;
  description?: string;
  current_performance_status?: string;
  target_value?: string;
  measure_unit?: string;
  expected_completion_date?: string;
  goal_weight?: string;
  measure_criteria?: string;
  is_qualitative?: boolean;
  self_rating?: number | null;
  employee_comment?: string | null;
}

export const useEmployeeSelfRating = () => {
  const { kpiId } = useParams<{ kpiId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [kpi, setKpi] = useState<KPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [employeeSignature, setEmployeeSignature] = useState('');
  const [reviewDate, setReviewDate] = useState<Date | null>(new Date()); // Changed to Date | null
  const [ratingOptions, setRatingOptions] = useState<RatingOption[]>([]);
  const [qualitativeRatingOptions, setQualitativeRatingOptions] = useState<RatingOption[]>([]);
  const [majorAccomplishments, setMajorAccomplishments] = useState('');
  const [disappointments, setDisappointments] = useState('');
  const [improvementNeeded, setImprovementNeeded] = useState('');
  const [textModal, setTextModal] = useState<TextModalState>({
    isOpen: false,
    title: '',
    value: '',
  });

  useEffect(() => {
    if (kpiId) {
      fetchKPIDetails();
      fetchRatingOptions();
    }
  }, [kpiId]);

  const fetchKPIDetails = async () => {
    if (!kpiId) return;

    try {
      setLoading(true);
      const response = await api.get(`/kpis/${kpiId}`);
      const data = response.data.kpi;
      setKpi(data);

      // Load existing self-ratings if any
      if (data.items && data.items.length > 0) {
        const initialRatings: Record<number, number> = {};
        const initialComments: Record<number, string> = {};

        data.items.forEach((item: ExtendedKPIItem) => {
          if (item.self_rating !== null && item.self_rating !== undefined) {
            initialRatings[item.id] = item.self_rating;
          }
          if (item.employee_comment) {
            initialComments[item.id] = item.employee_comment;
          }
        });

        setRatings(initialRatings);
        setComments(initialComments);
      }

      // Load other self-rating data
      if (data.employee_signature) setEmployeeSignature(data.employee_signature);
      if (data.self_review_date) setReviewDate(new Date(data.self_review_date));
      if (data.major_accomplishments) setMajorAccomplishments(data.major_accomplishments);
      if (data.disappointments) setDisappointments(data.disappointments);
      if (data.improvement_needed) setImprovementNeeded(data.improvement_needed);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load KPI details');
      navigate('/employee/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingOptions = async () => {
    try {
      const response = await api.get('/rating-options');
      const allOptions = response.data?.rating_options || [];
      
      // Separate numeric (quarterly/yearly) and qualitative rating options
      const numericOptions = allOptions.filter((opt: RatingOption) => 
        opt.rating_type === 'quarterly' || opt.rating_type === 'yearly'
      );
      const qualitativeOptions = allOptions.filter((opt: RatingOption) => 
        opt.rating_type === 'qualitative'
      );
      
      setRatingOptions(numericOptions);
      setQualitativeRatingOptions(qualitativeOptions);
    } catch (error) {
      console.error('Failed to fetch rating options:', error);
      // Fallback to default options
      setRatingOptions([
        { rating_value: 1.0, label: 'Below Expectation', rating_type: 'quarterly' },
        { rating_value: 1.25, label: 'Meets Expectation', rating_type: 'quarterly' },
        { rating_value: 1.5, label: 'Exceeds Expectation', rating_type: 'quarterly' },
      ]);
      setQualitativeRatingOptions([]);
    }
  };

  const handleRatingChange = (itemId: number, ratingValue: number) => {
    console.log('🔄 [useEmployeeSelfRating] handleRatingChange called:', { itemId, ratingValue });
    setRatings((prev) => {
      const updated = { ...prev, [itemId]: ratingValue };
      console.log('✅ [useEmployeeSelfRating] Updated ratings state:', updated);
      return updated;
    });
  };

  const handleCommentChange = (itemId: number, comment: string) => {
    setComments((prev) => ({ ...prev, [itemId]: comment }));
  };

  const handleSaveDraft = async () => {
    if (!kpiId || !kpi) return;

    try {
      setSaving(true);
      // Save draft logic here
      const draftData = {
        ratings,
        comments,
        employeeSignature,
        reviewDate: reviewDate?.toISOString(),
        majorAccomplishments,
        disappointments,
        improvementNeeded,
      };
      localStorage.setItem(`self-rating-draft-${kpiId}`, JSON.stringify(draftData));
      toast.success('Draft saved successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!kpiId || !kpi) return;

    // Validate all KPIs have ratings (excluding qualitative ones)
    const itemsNeedingRatings = kpi.items?.filter((item: any) => !item.is_qualitative) || [];
    const allRated = itemsNeedingRatings.every((item: any) => ratings[item.id] > 0);

    if (!allRated) {
      toast.error('Please provide ratings for all KPIs before submitting');
      return;
    }

    if (!employeeSignature) {
      toast.error('Please provide your signature');
      return;
    }

    if (!reviewDate) {
      toast.error('Please select the review date');
      return;
    }

    try {
      setSaving(true);
      
      // Calculate average rating (only from numeric items)
      const itemRatings = itemsNeedingRatings.map((item: any) => ratings[item.id] || 0);
      const averageRating = itemRatings.reduce((sum, rating) => sum + rating, 0) / itemRatings.length;
      
      // Round to nearest allowed value
      const allowedRatings = [1.00, 1.25, 1.50];
      const roundedRating = allowedRatings.reduce((prev, curr) => 
        Math.abs(curr - averageRating) < Math.abs(prev - averageRating) ? curr : prev
      );
      
      // Include ALL items (both numeric and qualitative) in submission
      const allItems = kpi.items || [];
      const itemData = {
        items: allItems.map((item: any) => ({
          item_id: item.id,
          rating: ratings[item.id] || 0,
          comment: comments[item.id] || '',
          is_qualitative: item.is_qualitative || false,
        })),
        average_rating: averageRating,
        rounded_rating: roundedRating,
      };

      await api.post(`/kpi-review/${kpiId}/self-rating`, {
        employee_rating: roundedRating,
        employee_comment: JSON.stringify(itemData),
        employee_signature: employeeSignature,
        review_period: kpi?.period || 'quarterly',
        review_quarter: kpi?.quarter,
        review_year: kpi?.year,
        major_accomplishments: majorAccomplishments,
        disappointments: disappointments,
        improvement_needed: improvementNeeded,
      });
      
      // Clear draft
      localStorage.removeItem(`self-rating-draft-${kpiId}`);
      
      toast.success('Self-rating submitted successfully!');
      navigate('/employee/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit self-rating');
    } finally {
      setSaving(false);
    }
  };

  const openTextModal = (
    title: string,
    value: string,
    _type?: string,       // Prefixed with underscore
    _itemId?: number,     // Prefixed with underscore
    onChange?: (value: string) => void
  ) => {
    setTextModal({
      isOpen: true,
      title,
      value,
      onChange,
    });
  };

  const closeTextModal = () => {
    setTextModal({
      isOpen: false,
      title: '',
      value: '',
    });
  };

  const updateTextModalValue = (value: string) => {
    if (textModal.onChange) {
      textModal.onChange(value);
    }
    setTextModal((prev) => ({ ...prev, value }));
  };

  // Calculate average rating
  const averageRating = (() => {
    const itemsWithRatings = kpi?.items?.filter((item: any) => !item.is_qualitative && ratings[item.id]) || [];
    if (itemsWithRatings.length === 0) return 0;
    const sum = itemsWithRatings.reduce((acc, item: any) => acc + (ratings[item.id] || 0), 0);
    return sum / itemsWithRatings.length;
  })();

  // Calculate completion percentage
  const completion = (() => {
    const itemsNeedingRatings = kpi?.items?.filter((item: any) => !item.is_qualitative) || [];
    if (itemsNeedingRatings.length === 0) return 100;
    const ratedCount = itemsNeedingRatings.filter((item: any) => ratings[item.id] > 0).length;
    return Math.round((ratedCount / itemsNeedingRatings.length) * 100);
  })();

  return {
    user,
    kpi,
    loading,
    saving,
    ratings,
    comments,
    employeeSignature,
    reviewDate,
    ratingOptions,
    qualitativeRatingOptions,
    majorAccomplishments,
    disappointments,
    improvementNeeded,
    textModal,
    averageRating,
    completion,
    setEmployeeSignature,
    setReviewDate, // Now returns Date | null
    setMajorAccomplishments,
    setDisappointments,
    setImprovementNeeded,
    handleRatingChange,
    handleCommentChange,
    handleSaveDraft,
    handleSubmit,
    openTextModal,
    closeTextModal,
    updateTextModalValue,
    navigate,
  };
};