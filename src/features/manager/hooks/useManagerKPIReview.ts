/**
 * useManagerKPIReview
 * 
 * Custom hook for managing KPI Review form state and logic.
 * Handles complex review workflow with ratings, comments, and signatures.
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import type { KPI, KPIReview, Accomplishment } from '../../../types';
import {
  parseEmployeeData,
  parseManagerData,
  initializeItemMaps,
  getRatingLabel as getRatingLabelUtil,
  calculateAverageRating,
  roundToAllowedRating,
  validateAllItemsRated,
  buildQualitativeRatingsArray,
  saveReviewDraft,
  loadReviewDraft,
  clearReviewDraft,
  type ItemRatingsMap,
  type ItemCommentsMap,
  type QualitativeRatingsMap,
} from './kpiReviewUtils';

interface TextModalState {
  isOpen: boolean;
  title: string;
  value: string;
  field?: string;
  itemId?: number;
  onChange?: (value: string) => void;
}

interface RatingOption {
  id?: number;
  rating_value: number | string;
  label: string;
  description?: string;
  rating_type: 'yearly' | 'quarterly' | 'qualitative';
}

interface UseManagerKPIReviewReturn {
  // State
  review: KPIReview | null;
  kpi: KPI | null;
  loading: boolean;
  saving: boolean;
  managerRatings: ItemRatingsMap;
  managerComments: ItemCommentsMap;
  qualitativeRatings: QualitativeRatingsMap;
  qualitativeComments: ItemCommentsMap;
  overallComment: string;
  managerSignature: string;
  reviewDate: Date | null;
  employeeRatings: ItemRatingsMap;
  employeeComments: ItemCommentsMap;
  employeeQualitativeRatings: ItemRatingsMap;
  ratingOptions: RatingOption[];
  qualitativeRatingOptions: RatingOption[];
  majorAccomplishmentsManagerComment: string;
  disappointmentsManagerComment: string;
  improvementNeededManagerComment: string;
  accomplishments: Accomplishment[];
  actualValues: Record<number, string>;
  targetValues: Record<number, string>;
  goalWeights: Record<number, string>;
  currentPerformanceStatuses: Record<number, string>;
  managerRatingPercentages: Record<number, string>;
  textModal: TextModalState;
  employeeAvg: number;
  managerAvg: number;
  employeeFinalRating: number;
  managerFinalRating: number;
  employeeRatingPercentage: number | null;
  employeeFinalRatingPercentage: number | null;
  managerFinalRatingPercentage: number | null;
  
  // Actions
  setManagerRatings: (ratings: ItemRatingsMap) => void;
  setManagerComments: (comments: ItemCommentsMap) => void;
  setQualitativeRatings: (ratings: QualitativeRatingsMap) => void;
  setQualitativeComments: (comments: ItemCommentsMap) => void;
  setOverallComment: (comment: string) => void;
  setManagerSignature: (signature: string) => void;
  setReviewDate: (date: Date | null) => void;
  setMajorAccomplishmentsManagerComment: (comment: string) => void;
  setDisappointmentsManagerComment: (comment: string) => void;
  setImprovementNeededManagerComment: (comment: string) => void;
  setAccomplishments: (accomplishments: Accomplishment[]) => void;
  setActualValues: (values: Record<number, string>) => void;
  setTargetValues: (values: Record<number, string>) => void;
  setGoalWeights: (values: Record<number, string>) => void;
  setCurrentPerformanceStatuses: (values: Record<number, string>) => void;
  setManagerRatingPercentages: (values: Record<number, string>) => void;
  setTextModal: (modal: TextModalState) => void;
  handleRatingChange: (itemId: number, value: number) => void;
  handleCommentChange: (itemId: number, value: string) => void;
  handleSaveDraft: () => void;
  handleSubmit: () => Promise<void>;
  handleBack: () => void;
  getRatingLabel: (rating: number) => string;
}

export const useManagerKPIReview = (): UseManagerKPIReviewReturn => {
  const { reviewId, kpiId } = useParams<{ reviewId?: string; kpiId?: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  
  console.log('🚀 [useManagerKPIReview] Hook initialized with params:', {
    reviewId,
    kpiId,
    hasReviewId: !!reviewId,
    hasKpiId: !!kpiId,
    currentPath: window.location.pathname
  });
  
  const [review, setReview] = useState<KPIReview | null>(null);
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [managerRatings, setManagerRatings] = useState<ItemRatingsMap>({});
  const [managerComments, setManagerComments] = useState<ItemCommentsMap>({});
  const [qualitativeRatings, setQualitativeRatings] = useState<QualitativeRatingsMap>({});
  const [qualitativeComments, setQualitativeComments] = useState<ItemCommentsMap>({});
  const [overallComment, setOverallComment] = useState('');
  const [managerSignature, setManagerSignature] = useState('');
  const [reviewDate, setReviewDate] = useState<Date | null>(new Date());
  const [employeeRatings, setEmployeeRatings] = useState<ItemRatingsMap>({});
  const [employeeComments, setEmployeeComments] = useState<ItemCommentsMap>({});
  const [employeeQualitativeRatings, setEmployeeQualitativeRatings] = useState<ItemRatingsMap>({});
  const [ratingOptions, setRatingOptions] = useState<RatingOption[]>([]);
  const [qualitativeRatingOptions, setQualitativeRatingOptions] = useState<RatingOption[]>([]);
  const [majorAccomplishmentsManagerComment, setMajorAccomplishmentsManagerComment] = useState('');
  const [disappointmentsManagerComment, setDisappointmentsManagerComment] = useState('');
  const [improvementNeededManagerComment, setImprovementNeededManagerComment] = useState('');
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>([]);
  const [actualValues, setActualValues] = useState<Record<number, string>>({});
  const [targetValues, setTargetValues] = useState<Record<number, string>>({});
  const [goalWeights, setGoalWeights] = useState<Record<number, string>>({});
  const [currentPerformanceStatuses, setCurrentPerformanceStatuses] = useState<Record<number, string>>({});
  const [managerRatingPercentages, setManagerRatingPercentages] = useState<Record<number, string>>({});
  const [textModal, setTextModal] = useState<TextModalState>({
    isOpen: false,
    title: '',
    value: '',
  });

  useEffect(() => {
    console.log('🔄 [useManagerKPIReview] useEffect triggered:', {
      reviewId,
      kpiId,
      hasReviewId: !!reviewId,
      hasKpiId: !!kpiId,
      pathname: window.location.pathname,
      search: window.location.search
    });
    
    if (reviewId) {
      console.log('✅ [useManagerKPIReview] Has reviewId, fetching review...');
      fetchReview();
      loadDraft();
    } else if (kpiId) {
      console.log('✅ [useManagerKPIReview] Has kpiId (no reviewId), fetching KPI for new review...');
      fetchKPIForNewReview();
    } else {
      console.error('❌ [useManagerKPIReview] No reviewId or kpiId! Redirecting to dashboard');
      navigate('/manager/dashboard');
    }
  }, [reviewId, kpiId]);

  // Fetch rating options based on KPI period
  useEffect(() => {
    if (kpi && kpi.period) {
      fetchRatingOptions(kpi.period);
    }
  }, [kpi]);

  // Auto-save draft whenever form data changes
  useEffect(() => {
    if (reviewId) {
      saveReviewDraft(reviewId, {
        managerRatings,
        managerComments,
        qualitativeRatings,
        qualitativeComments,
        overallComment,
        managerSignature,
        reviewDate: reviewDate?.toISOString() || '',
        majorAccomplishmentsManagerComment,
        disappointmentsManagerComment,
        improvementNeededManagerComment,
      });
    }
  }, [managerRatings, managerComments, qualitativeRatings, qualitativeComments, overallComment, managerSignature, reviewDate, reviewId, majorAccomplishmentsManagerComment, disappointmentsManagerComment, improvementNeededManagerComment]);

  const loadDraft = () => {
    if (!reviewId) return;
    
    // Load draft after a short delay to allow API data to load first
    setTimeout(() => {
      const draftData = loadReviewDraft(reviewId);
      if (draftData) {
        // Only load draft if there's no existing manager data (indicating it's a new review)
        if (Object.keys(managerRatings).length === 0 && draftData.managerRatings) {
          setManagerRatings(draftData.managerRatings);
        }
        if (Object.keys(managerComments).length === 0 && draftData.managerComments) {
          setManagerComments(draftData.managerComments);
        }
        if (Object.keys(qualitativeRatings).length === 0 && draftData.qualitativeRatings) {
          setQualitativeRatings(draftData.qualitativeRatings);
        }
        if (Object.keys(qualitativeComments).length === 0 && draftData.qualitativeComments) {
          setQualitativeComments(draftData.qualitativeComments);
        }
        if (!overallComment && draftData.overallComment) {
          setOverallComment(draftData.overallComment);
        }
        if (!managerSignature && draftData.managerSignature) {
          setManagerSignature(draftData.managerSignature);
        }
        if (!reviewDate && draftData.reviewDate) {
          setReviewDate(new Date(draftData.reviewDate));
        }
        if (!majorAccomplishmentsManagerComment && draftData.majorAccomplishmentsManagerComment) {
          setMajorAccomplishmentsManagerComment(draftData.majorAccomplishmentsManagerComment);
        }
        if (!disappointmentsManagerComment && draftData.disappointmentsManagerComment) {
          setDisappointmentsManagerComment(draftData.disappointmentsManagerComment);
        }
        if (!improvementNeededManagerComment && draftData.improvementNeededManagerComment) {
          setImprovementNeededManagerComment(draftData.improvementNeededManagerComment);
        }
      }
    }, 500);
  };

  const fetchRatingOptions = async (period?: string) => {
    try {
      console.log('🔍 [KPIReview] Fetching rating options from API for period:', period);
      const response = await api.get('/rating-options');
      console.log('✅ [KPIReview] Rating options response:', response.data);
      const allOptions = response.data.rating_options || [];
      
      // Filter numeric options based on KPI period (yearly or quarterly)
      const periodType = period || 'quarterly'; // Default to quarterly if not specified
      const numericOptions = allOptions.filter((opt: RatingOption) => 
        opt.rating_type === periodType
      );
      const qualitativeOptions = allOptions.filter((opt: RatingOption) => 
        opt.rating_type === 'qualitative'
      );
      
      console.log(`📋 [KPIReview] Setting ${periodType} rating options:`, numericOptions);
      console.log('📋 [KPIReview] Setting qualitative rating options:', qualitativeOptions);
      setRatingOptions(numericOptions);
      setQualitativeRatingOptions(qualitativeOptions);
      
      // If no options returned, use fallback
      if (numericOptions.length === 0) {
        console.warn('⚠️ [KPIReview] No rating options returned, using fallback');
        const fallbackOptions = [
          { rating_value: 1.00, label: 'Below Expectation', rating_type: periodType as 'quarterly' | 'yearly' },
          { rating_value: 1.25, label: 'Meets Expectation', rating_type: periodType as 'quarterly' | 'yearly' },
          { rating_value: 1.50, label: 'Exceeds Expectation', rating_type: periodType as 'quarterly' | 'yearly' },
        ];
        setRatingOptions(fallbackOptions);
      }
    } catch (error) {
      console.error('❌ [KPIReview] Error fetching rating options:', error);
      // Fallback to default options if API fails
      const periodType = period || 'quarterly';
      const fallbackOptions = [
        { rating_value: 1.00, label: 'Below Expectation', rating_type: periodType as 'quarterly' | 'yearly' },
        { rating_value: 1.25, label: 'Meets Expectation', rating_type: periodType as 'quarterly' | 'yearly' },
        { rating_value: 1.50, label: 'Exceeds Expectation', rating_type: periodType as 'quarterly' | 'yearly' },
      ];
      console.log('🔄 [KPIReview] Using fallback rating options:', fallbackOptions);
      setRatingOptions(fallbackOptions);
      setQualitativeRatingOptions([]);
    }
  };

  const fetchReview = async () => {
    console.log('📡 [fetchReview] Starting fetch for reviewId:', reviewId);
    try {
      const response = await api.get(`/kpi-review/${reviewId}`);
      console.log('📦 [fetchReview] Response received:', response.data);
      const reviewData = response.data.review;
      
      console.log('🔍 [fetchReview] Review data employee fields:', {
        employee_rating: reviewData.employee_rating,
        employee_final_rating: reviewData.employee_final_rating,
        employee_rating_percentage: reviewData.employee_rating_percentage,
        employee_final_rating_percentage: reviewData.employee_final_rating_percentage,
        manager_rating: reviewData.manager_rating,
        manager_final_rating: reviewData.manager_final_rating,
        manager_final_rating_percentage: reviewData.manager_final_rating_percentage
      });
      
      // If review doesn't have an ID, it means it's a new review from KPI
      if (!reviewData.id && reviewData.kpi_id) {
        // This is KPI data formatted as review - review doesn't exist yet
        setReview(reviewData);
        // Fetch KPI to get items
        try {
          const kpiRes = await api.get(`/kpis/${reviewData.kpi_id}`);
          setKpi(kpiRes.data.kpi);
        } catch (error) {
          console.error('Error fetching KPI:', error);
        }
        setLoading(false);
        return;
      }
      
      setReview(reviewData);
      
      // Fetch KPI to get items
      try {
        const kpiRes = await api.get(`/kpis/${reviewData.kpi_id}`);
        console.log('📦 [useManagerKPIReview] KPI response:', kpiRes.data);
        const kpiData = kpiRes.data.data || kpiRes.data.kpi || kpiRes.data;
        console.log('📦 [useManagerKPIReview] Extracted KPI data:', { 
          hasKpiData: !!kpiData, 
          hasItems: !!kpiData?.items, 
          itemsCount: kpiData?.items?.length 
        });
        setKpi(kpiData);
        
        // Initialize manager ratings/comments for all items
        if (kpiData && kpiData.items && kpiData.items.length > 0) {
          const { ratings, comments } = initializeItemMaps(kpiData.items);
          setManagerRatings(ratings);
          setManagerComments(comments);
        }
        
        // Parse employee ratings/comments from structured data or JSON fallback
        const { ratings: empRatings, comments: empComments } = parseEmployeeData(
          reviewData.employee_comment || '{}',
          reviewData.item_ratings // Pass structured data if available
        );
        console.log('✅ [KPIReview] Employee ratings:', empRatings);
        console.log('✅ [KPIReview] Employee comments:', empComments);
        
        // Separate qualitative ratings from numeric ratings
        const empQualitativeRatings: ItemRatingsMap = {};
        const empNumericRatings: ItemRatingsMap = {};
        
        if (kpiData.items && Array.isArray(kpiData.items)) {
          kpiData.items.forEach((item: any) => {
            if (item.is_qualitative && empRatings[item.id]) {
              empQualitativeRatings[item.id] = empRatings[item.id];
            } else if (empRatings[item.id]) {
              empNumericRatings[item.id] = empRatings[item.id];
            }
          });
        }
        
        setEmployeeRatings(empNumericRatings);
        setEmployeeQualitativeRatings(empQualitativeRatings);
        setEmployeeComments(empComments);
        
        // Load existing manager ratings from database (item_ratings.manager)
        console.log('📥 [fetchReview] Loading existing manager ratings from database');
        const mgrRatings: ItemRatingsMap = {};
        const mgrComments: ItemCommentsMap = {};
        const mgrQualitativeRatings: ItemRatingsMap = {};
        const mgrQualitativeComments: ItemCommentsMap = {};
        const mgrActualValues: Record<number, string> = {};
        const mgrTargetValues: Record<number, string> = {};
        const mgrGoalWeights: Record<number, string> = {};
        const mgrCurrentStatuses: Record<number, string> = {};
        
        if (reviewData.item_ratings && reviewData.item_ratings.manager) {
          console.log('✅ [fetchReview] Found manager ratings in item_ratings:', reviewData.item_ratings.manager);
          Object.entries(reviewData.item_ratings.manager).forEach(([itemIdStr, ratingData]: [string, any]) => {
            const itemId = parseInt(itemIdStr);
            const item = kpiData.items?.find((i: any) => i.id === itemId);
            
            if (item && item.is_qualitative) {
              // Qualitative item
              if (ratingData.qualitative_rating !== null && ratingData.qualitative_rating !== undefined) {
                mgrQualitativeRatings[itemId] = ratingData.qualitative_rating;
              }
              if (ratingData.comment) {
                mgrQualitativeComments[itemId] = ratingData.comment;
              }
            } else {
              // Quantitative item
              if (ratingData.rating !== null && ratingData.rating !== undefined) {
                mgrRatings[itemId] = ratingData.rating;
              }
              if (ratingData.comment) {
                mgrComments[itemId] = ratingData.comment;
              }
              if (ratingData.actual_value) {
                mgrActualValues[itemId] = ratingData.actual_value;
              }
            }
          });
          
          console.log('📊 [fetchReview] Loaded manager data:', {
            ratings: mgrRatings,
            comments: mgrComments,
            qualitativeRatings: mgrQualitativeRatings,
            qualitativeComments: mgrQualitativeComments,
            actualValues: mgrActualValues
          });
        } else {
          console.warn('⚠️ [fetchReview] No manager ratings found in item_ratings, trying legacy JSON parse');
          // Fallback: Try parsing from JSON (legacy)
          const { ratings: mgrRatingsLegacy, comments: mgrCommentsLegacy } = parseManagerData(
            reviewData.manager_comment || '{}'
          );
          Object.assign(mgrRatings, mgrRatingsLegacy);
          Object.assign(mgrComments, mgrCommentsLegacy);
        }
        
        // Set manager ratings state
        if (Object.keys(mgrRatings).length > 0) {
          console.log('✅ [fetchReview] Setting manager ratings:', mgrRatings);
          setManagerRatings(mgrRatings);
          console.log('✅ [fetchReview] Manager ratings state updated');
        } else {
          console.log('⚠️ [fetchReview] No manager ratings to set (review not submitted yet)');
        }
        if (Object.keys(mgrComments).length > 0) {
          console.log('✅ [fetchReview] Setting manager comments:', mgrComments);
          setManagerComments(mgrComments);
        }
        if (Object.keys(mgrQualitativeRatings).length > 0) {
          console.log('✅ [fetchReview] Setting qualitative ratings:', mgrQualitativeRatings);
          setQualitativeRatings(mgrQualitativeRatings);
        }
        if (Object.keys(mgrQualitativeComments).length > 0) {
          console.log('✅ [fetchReview] Setting qualitative comments:', mgrQualitativeComments);
          setQualitativeComments(mgrQualitativeComments);
        }
        if (Object.keys(mgrActualValues).length > 0) {
          console.log('✅ [fetchReview] Setting actual values:', mgrActualValues);
          setActualValues(mgrActualValues);
        }

        // Load accomplishments from review
        console.log('🏆 [fetchReview] Loading accomplishments:', {
          hasAccomplishments: !!reviewData.accomplishments,
          isArray: Array.isArray(reviewData.accomplishments),
          count: reviewData.accomplishments?.length || 0,
          accomplishments: reviewData.accomplishments?.map((acc: Accomplishment) => ({
            id: acc.id,
            title: acc.title,
            employee_rating: acc.employee_rating,
            manager_rating: acc.manager_rating,
            item_order: acc.item_order
          }))
        });
        
        if (reviewData.accomplishments && Array.isArray(reviewData.accomplishments)) {
          console.log('✅ [fetchReview] Setting accomplishments state:', {
            count: reviewData.accomplishments.length
          });
          setAccomplishments(reviewData.accomplishments);
        } else {
          console.warn('⚠️ [fetchReview] No accomplishments found, setting empty array');
          // Set empty array so table still shows for manager
          setAccomplishments([]);
        }

        // Load target values, goal weights, and current status from kpi items (don't overwrite manager's actual values)
        const targetVals: Record<number, string> = {};
        const goalWeightVals: Record<number, string> = {};
        const currentStatusVals: Record<number, string> = {};
        if (kpiData.items) {
          kpiData.items.forEach((item: any) => {
            if (item.target_value) {
              targetVals[item.id] = item.target_value;
            }
            if (item.goal_weight) {
              goalWeightVals[item.id] = item.goal_weight;
            }
            if (item.current_performance_status) {
              currentStatusVals[item.id] = item.current_performance_status;
            }
            // Only set actual value from item if manager hasn't entered one
            if (item.actual_value && !mgrActualValues[item.id]) {
              mgrActualValues[item.id] = item.actual_value;
            }
          });
        }
        setTargetValues(targetVals);
        setGoalWeights(goalWeightVals);
        setCurrentPerformanceStatuses(currentStatusVals);
        // Update actual values with merged data (manager entries + item fallbacks)
        if (Object.keys(mgrActualValues).length > 0) {
          setActualValues(mgrActualValues);
        }
      } catch (error) {
        console.error('Error fetching KPI:', error);
      }
      
      setOverallComment(reviewData.overall_comment || '');
      setMajorAccomplishmentsManagerComment(reviewData.major_accomplishments_comment || '');
      setDisappointmentsManagerComment(reviewData.disappointments_comment || '');
      setImprovementNeededManagerComment(reviewData.improvement_needed_manager_comment || '');
      // Load manager signature if exists
      if (reviewData.manager_signature) {
        setManagerSignature(reviewData.manager_signature);
      }
      if (reviewData.manager_signed_at) {
        setReviewDate(new Date(reviewData.manager_signed_at));
      }
    } catch (error) {
      console.error('❌ [fetchReview] Error fetching review:', error);
    } finally {
      console.log('✅ [fetchReview] Setting loading to false');
      setLoading(false);
    }
  };

  const fetchKPIForNewReview = async () => {
    console.log('📡 [fetchKPIForNewReview] Starting fetch for kpiId:', kpiId);
    try {
      const response = await api.get(`/kpis/${kpiId}`);
      console.log('📦 [fetchKPIForNewReview] Response received:', response.data);
      const kpiData = response.data.data || response.data.kpi || response.data;
      console.log('📦 [fetchKPIForNewReview] Extracted KPI data:', { 
        hasKpiData: !!kpiData, 
        hasItems: !!kpiData?.items, 
        itemsCount: kpiData?.items?.length,
        kpiData 
      });
      
      setKpi(kpiData);
      
      // Initialize empty review object for new review
      setReview({
        id: 0, // Temporary ID for new review
        kpi_id: kpiData.id,
        employee_id: kpiData.employee_id,
        manager_id: kpiData.manager_id,
        company_id: kpiData.company_id,
        employee_name: kpiData.employee_name,
        manager_name: kpiData.manager_name,
        kpi_title: kpiData.title,
        review_quarter: kpiData.quarter,
        review_year: kpiData.year,
        review_period: kpiData.period || 'quarterly',
        employee_rating: undefined,
        manager_rating: undefined,
        employee_comment: undefined,
        manager_comment: undefined,
        overall_comment: undefined,
      } as Partial<KPIReview> as KPIReview);
      
      // Initialize manager ratings/comments for all items
      if (kpiData && kpiData.items && kpiData.items.length > 0) {
        console.log('🎯 [fetchKPIForNewReview] Initializing ratings for', kpiData.items.length, 'items');
        const { ratings, comments } = initializeItemMaps(kpiData.items);
        setManagerRatings(ratings);
        setManagerComments(comments);
      }
      
      // Load actual values from kpi items
      const actualVals: Record<number, string> = {};
      if (kpiData.items) {
        kpiData.items.forEach((item: any) => {
          if (item.actual_value) {
            actualVals[item.id] = item.actual_value;
          }
        });
      }
      setActualValues(actualVals);
      
      console.log('✅ [fetchKPIForNewReview] KPI loaded successfully for new review');
    } catch (error) {
      console.error('❌ [fetchKPIForNewReview] Error fetching KPI:', error);
      toast.error('Failed to load KPI data');
      navigate('/manager/dashboard');
    } finally {
      console.log('✅ [fetchKPIForNewReview] Setting loading to false');
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!reviewId) return;
    saveReviewDraft(reviewId, {
      managerRatings,
      managerComments,
      qualitativeRatings,
      qualitativeComments,
      overallComment,
      managerSignature,
      reviewDate: reviewDate?.toISOString() || '',
      majorAccomplishmentsManagerComment,
      disappointmentsManagerComment,
      improvementNeededManagerComment,
    });
    toast.success('Draft saved successfully! Your progress has been saved.');
  };

  const handleRatingChange = (itemId: number, value: number) => {
    const ratingValue = parseFloat(String(value));
    console.log('📝 [KPIReview] Rating changed for item:', itemId, 'Raw value:', value, 'Parsed:', ratingValue, 'Type:', typeof ratingValue);
    const newRatings = { ...managerRatings, [itemId]: ratingValue };
    console.log('📊 [KPIReview] Updated manager ratings state:', newRatings);
    setManagerRatings(newRatings);
  };

  const handleCommentChange = (itemId: number, value: string) => {
    setManagerComments({ ...managerComments, [itemId]: value });
  };

  const handleSubmit = async () => {
    console.log('🚀 [handleSubmit] Starting submission');
    console.log('📊 KPI items:', kpi?.items);
    console.log('📊 Manager ratings:', managerRatings);
    console.log('📊 Qualitative ratings:', qualitativeRatings);
    console.log('📊 Accomplishments:', accomplishments);
    
    if (!kpi?.items || kpi.items.length === 0) {
      toast.error('No KPI items found');
      return;
    }

    // Validate all KPI items are rated (returns details on missing items)
    const validation = validateAllItemsRated(kpi.items, managerRatings, qualitativeRatings);
    const allRated = validation.valid;
    if (!allRated) {
      console.error('❌ Validation failed: Not all items are rated');
      console.error('❌ Missing or invalid items:', validation.missingItems);
      // Show a user-friendly toast and also include item ids for debugging
      toast.error('Please provide a rating for all KPI items. Missing: ' + validation.missingItems.map(i => `${i.item_id}(${i.title})`).join(', '));
      return;
    }
    console.log('✅ All KPI items validated');

    // Additional guard: ensure at least one manager rating is > 0 (avoid submitting all-zero payloads)
    const managerValues = Object.values(managerRatings || {}).map(v => parseFloat(String(v)) || 0);
    const hasAnyManagerRating = managerValues.some(v => v > 0) || (accomplishments && accomplishments.length > 0);
    if (!hasAnyManagerRating) {
      console.error('❌ Submission blocked: All manager item ratings are zero or empty and no accomplishments provided');
      toast.error('Please provide ratings for items before submitting the review');
      return;
    }

    // Validate all accomplishments have manager ratings
    if (accomplishments && accomplishments.length > 0) {
      console.log('🔍 Validating accomplishments:', accomplishments);
      const unratedAccomplishments = accomplishments.some(acc => {
        const isUnrated = acc.manager_rating === null || 
          acc.manager_rating === undefined;
        console.log(`📝 Accomplishment "${acc.title}": manager_rating=${acc.manager_rating}, isUnrated=${isUnrated}`);
        return isUnrated;
      });
      
      if (unratedAccomplishments) {
        console.error('❌ Validation failed: Not all accomplishments are rated');
        toast.error('Please provide ratings for all major accomplishments');
        return;
      }
      console.log('✅ All accomplishments validated');
    }

    if (!managerSignature) {
      toast.warning('Please provide your digital signature');
      return;
    }

    console.log('✅ All validations passed, proceeding with submission');

    // Calculate and round average rating (including accomplishments)
    const averageRating = calculateAverageRating(kpi.items, managerRatings, accomplishments);
    const roundedRating = roundToAllowedRating(averageRating);

    // Build manager ratings array for kpi_item_ratings table
    const managerRatingsArray = kpi.items.map(item => {
      const actualValue = actualValues[item.id] || '';
      const targetValue = targetValues[item.id] || item.target_value || '';
      const goalWeight = goalWeights[item.id] || item.goal_weight || '';
      const currentStatus = currentPerformanceStatuses[item.id] || item.current_performance_status || '';
      
      const targetValueNum = targetValue ? parseFloat(String(targetValue)) : 0;
      const goalWeightNum = goalWeight ? parseFloat(String(goalWeight).replace('%', '')) / 100 : 0;
      
      // Calculate percentage value obtained: (actual / target) * 100
      const percentageValueObtained = actualValue && targetValueNum > 0 
        ? (parseFloat(actualValue) / targetValueNum) * 100
        : null;
      
      // Calculate manager rating percentage: Use manual value if provided, otherwise calculate
      const manualRatingPercentage = managerRatingPercentages[item.id];
      const calculatedRatingPercentage = percentageValueObtained && goalWeightNum > 0
        ? percentageValueObtained * goalWeightNum
        : null;
      
      // Use manual value if provided, otherwise use calculated value
      const managerRatingPercentage = manualRatingPercentage && manualRatingPercentage.trim() !== ''
        ? parseFloat(manualRatingPercentage.replace('%', ''))
        : calculatedRatingPercentage;
      
      return {
        item_id: item.id,
        rating: managerRatings[item.id] || 0,
        comment: managerComments[item.id] || '',
        actual_value: actualValue || null,
        target_value: targetValue || null,
        goal_weight: goalWeight || null,
        current_performance_status: currentStatus || null,
        percentage_value_obtained: percentageValueObtained,
        manager_rating_percentage: managerRatingPercentage,
      };
    });

    console.log('📊 [handleSubmit] Manager ratings array:', managerRatingsArray);

    setSaving(true);
    try {
        // Prepare qualitative ratings array for backend
        const qualitativeRatingsArray = buildQualitativeRatingsArray(
          kpi.items,
          qualitativeRatings,
          qualitativeComments
        );

        const payload = {
          manager_rating: managerRatingsArray, // Send as array for kpi_item_ratings table
          overall_comment: overallComment,
          manager_signature: managerSignature,
          qualitative_ratings: qualitativeRatingsArray,
          major_accomplishments_comment: majorAccomplishmentsManagerComment,
          disappointments_comment: disappointmentsManagerComment,
          improvement_needed_manager_comment: improvementNeededManagerComment,
          accomplishments: accomplishments,
          average_manager_rating: roundedRating, // Include rounded average for kpi_reviews table
        };

        console.log('📤 [handleSubmit] Manager review payload:', payload);
        console.log('🔍 [handleSubmit] Detailed payload breakdown:');
        
        // Log each item's data to verify what's being sent
        managerRatingsArray.forEach((item, index) => {
          console.log(`📋 [Item ${item.item_id}] Payload data:`, {
            rating: item.rating,
            comment: item.comment || '[EMPTY]',
            actual_value: item.actual_value || '[EMPTY]',
            target_value: item.target_value || '[EMPTY]',
            goal_weight: item.goal_weight || '[EMPTY]',
            current_performance_status: item.current_performance_status || '[EMPTY]',
            percentage_value_obtained: item.percentage_value_obtained || '[EMPTY]',
            manager_rating_percentage: item.manager_rating_percentage || '[EMPTY]'
          });
          
          // Warn about missing critical data
          const warnings = [];
          if (!item.actual_value || item.actual_value === '') warnings.push('ACTUAL VALUE');
          if (!item.current_performance_status || item.current_performance_status === '') warnings.push('CURRENT PERFORMANCE STATUS');
          if (item.percentage_value_obtained === null || item.percentage_value_obtained === undefined) warnings.push('PERCENTAGE OBTAINED');
          if (item.manager_rating_percentage === null || item.manager_rating_percentage === undefined) warnings.push('MANAGER RATING %');
          if (!item.comment || item.comment === '') warnings.push('MANAGER COMMENT');
          
          if (warnings.length > 0) {
            console.warn(`⚠️ [Item ${item.item_id}] Missing data: ${warnings.join(', ')}`);
          } else {
            console.log(`✅ [Item ${item.item_id}] All data present`);
          }
        });

        // Check if this is a manager-initiated review (no reviewId) or updating existing review
        let response;
        if (!reviewId && kpiId) {
          // Manager-initiated review: Create new review for this KPI
          console.log('🆕 [handleSubmit] Initiating new manager-led review for KPI:', kpiId);
          response = await api.post(`/kpi-review/initiate/${kpiId}`, payload);
        } else if (reviewId) {
          // Existing review: Update with manager ratings
          console.log('📝 [handleSubmit] Updating existing review:', reviewId);
          response = await api.post(`/kpi-review/${reviewId}/manager-review`, payload);
        } else {
          throw new Error('Invalid state: No reviewId or kpiId available');
        }
        
        console.log('✅ [handleSubmit] Backend response:', response.data);
        
        // Verify response indicates success
        if (response.data.success) {
          console.log('✅ [handleSubmit] Manager review successfully submitted to database');
          
          // Log the returned review data if available
          if (response.data.review) {
            console.log('📦 [handleSubmit] Returned review data:', {
              review_id: response.data.review.id,
              kpi_id: response.data.review.kpi_id,
              status: response.data.review.review_status || response.data.review.status
            });
          }
        } else {
          console.warn('⚠️ [handleSubmit] Backend returned success=false:', response.data);
        }

      // Clear draft after successful submission
      if (reviewId) {
        clearReviewDraft(reviewId);
      }

      toast.success('Review submitted successfully!');
      navigate('/manager/reviews');
    } catch (error: any) {
      console.error('❌ [handleSubmit] Submission failed:', error);
      console.error('❌ [handleSubmit] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getRatingLabel = (rating: number): string => {
    return getRatingLabelUtil(rating);
  };

  // EMPLOYEE ratings: Fetch from backend (employee already submitted)
  // Backend returns strings from PostgreSQL, need to parse to numbers
  const employeeAvg = review?.employee_rating 
    ? parseFloat(review.employee_rating.toString())
    : 0;
  const employeeFinalRating = review?.employee_final_rating
    ? parseFloat(review.employee_final_rating.toString())
    : employeeAvg;
  
  // Employee percentages from backend (calculated when employee submitted)
  const employeeRatingPercentage = review?.employee_rating_percentage
    ? parseFloat(review.employee_rating_percentage.toString())
    : null;
  const employeeFinalRatingPercentage = review?.employee_final_rating_percentage
    ? parseFloat(review.employee_final_rating_percentage.toString())
    : null;
  
  console.log('📊 [useManagerKPIReview] Employee data from backend (RAW):', {
    employee_rating: review?.employee_rating,
    employee_final_rating: review?.employee_final_rating,
    employee_rating_percentage: review?.employee_rating_percentage,
    employee_final_rating_percentage: review?.employee_final_rating_percentage
  });
  
  console.log('✅ [useManagerKPIReview] Employee data PARSED to numbers:', {
    employeeAvg,
    employeeFinalRating,
    employeeRatingPercentage,
    employeeFinalRatingPercentage
  });
  
  // MANAGER ratings: Calculate in REAL-TIME as manager is rating (like SelfRating.tsx)
  // Use IIFE pattern instead of useMemo for immediate recalculation
  const managerAvg = (() => {
    console.log('🔄 [managerAvg calculation] START', {
      hasBackendValue: typeof review?.manager_rating === 'number',
      backendValue: review?.manager_rating,
      hasKpi: !!kpi,
      kpiItemsCount: kpi?.items?.length,
      managerRatingsCount: Object.keys(managerRatings).length,
      managerRatings: managerRatings,
      accomplishmentsCount: accomplishments.length
    });
    
    // If already submitted, use backend value
    if (typeof review?.manager_rating === 'number') {
      console.log('✅ [managerAvg] Using backend value:', review.manager_rating);
      return review.manager_rating;
    }
    
    // Calculate from current form state (like SelfRating does)
    if (!kpi || !kpi.items) {
      console.log('⚠️ [managerAvg] No KPI data, returning 0');
      return 0;
    }
    
    // Get items with ratings (exclude qualitative and excluded items)
    const itemsWithRatings = kpi.items.filter((item: any) => 
      !item.is_qualitative && 
      managerRatings[item.id] && 
      managerRatings[item.id] > 0 &&
      (!item.exclude_from_calculation || item.exclude_from_calculation === 0)
    );
    
    const itemRatingsSum = itemsWithRatings.reduce((acc, item: any) => 
      acc + (managerRatings[item.id] || 0), 0);
    
    // Include accomplishments with manager_rating
    const accomplishmentRatings = accomplishments
      .filter(acc => acc.manager_rating !== null && acc.manager_rating !== undefined && acc.manager_rating > 0)
      .map(acc => Number(acc.manager_rating) || 0);
    const accomplishmentsSum = accomplishmentRatings.reduce((acc: number, rating: number) => acc + rating, 0);
    
    const totalCount = itemsWithRatings.length + accomplishmentRatings.length;
    
    console.log('🔢 [managerAvg] Calculation details:', {
      itemsWithRatingsCount: itemsWithRatings.length,
      itemRatingsSum,
      accomplishmentRatingsCount: accomplishmentRatings.length,
      accomplishmentsSum,
      totalCount
    });
    
    if (totalCount === 0) {
      console.log('⚠️ [managerAvg] No ratings yet, returning 0');
      return 0;
    }
    
    const average = (itemRatingsSum + accomplishmentsSum) / totalCount;
    console.log('✅ [managerAvg] Calculated average:', average);
    return average;
  })();
  
  const managerFinalRating = typeof review?.manager_final_rating === 'number' 
    ? review.manager_final_rating 
    : managerAvg;
  
  // Manager percentage: Calculate in real-time (like SelfRating does)
  const managerFinalRatingPercentage = (() => {
    console.log('🔄 [managerPercentage calculation] START', {
      hasBackendValue: typeof review?.manager_final_rating_percentage === 'number',
      backendValue: review?.manager_final_rating_percentage,
      managerAvg,
      ratingOptionsCount: ratingOptions.length
    });
    
    // If already submitted, use backend value
    if (typeof review?.manager_final_rating_percentage === 'number') {
      console.log('✅ [managerPercentage] Using backend value:', review.manager_final_rating_percentage);
      return review.manager_final_rating_percentage;
    }
    
    // Calculate percentage in real-time
    if (managerAvg === 0) {
      console.log('⚠️ [managerPercentage] Manager average is 0, returning null');
      return null;
    }
    
    if (ratingOptions.length === 0) {
      console.log('⚠️ [managerPercentage] No rating options, returning null');
      return null;
    }
    
    const maxRating = Math.max(...ratingOptions.map(opt => parseFloat(String(opt.rating_value))));
    console.log('🔢 [managerPercentage] MaxRating:', maxRating);
    
    if (maxRating === 0) {
      console.log('⚠️ [managerPercentage] MaxRating is 0, returning null');
      return null;
    }
    
    const percentage = (managerAvg / maxRating) * 100;
    console.log('✅ [managerPercentage] Calculated percentage:', percentage);
    return percentage;
  })();
  
  console.log('📊 [useManagerKPIReview] Manager data (real-time):', {
    manager_rating_from_backend: review?.manager_rating,
    manager_final_rating_percentage_from_backend: review?.manager_final_rating_percentage,
    computed_managerAvg: managerAvg,
    computed_managerFinalRating: managerFinalRating,
    computed_managerFinalRatingPercentage: managerFinalRatingPercentage,
    ratingOptionsCount: ratingOptions.length
  });

  return {
    // State
    review,
    kpi,
    loading,
    saving,
    managerRatings,
    managerComments,
    qualitativeRatings,
    qualitativeComments,
    overallComment,
    managerSignature,
    reviewDate,
    employeeRatings,
    employeeComments,
    employeeQualitativeRatings,
    ratingOptions,
    qualitativeRatingOptions,
    majorAccomplishmentsManagerComment,
    disappointmentsManagerComment,
    improvementNeededManagerComment,
    accomplishments,
    actualValues,
    targetValues,
    goalWeights,
    currentPerformanceStatuses,
    managerRatingPercentages,
    textModal,
    employeeAvg,
    managerAvg,
    employeeFinalRating,
    managerFinalRating,
    employeeRatingPercentage,
    employeeFinalRatingPercentage,
    managerFinalRatingPercentage,
    
    // Actions
    setManagerRatings,
    setManagerComments,
    setQualitativeRatings,
    setQualitativeComments,
    setOverallComment,
    setManagerSignature,
    setReviewDate,
    setMajorAccomplishmentsManagerComment,
    setDisappointmentsManagerComment,
    setImprovementNeededManagerComment,
    setAccomplishments,
    setActualValues,
    setTargetValues,
    setGoalWeights,
    setCurrentPerformanceStatuses,
    setManagerRatingPercentages,
    setTextModal,
    handleRatingChange,
    handleCommentChange,
    handleSaveDraft,
    handleSubmit,
    handleBack,
    getRatingLabel,
  };
};
