/**
 * KPI Details Utility Functions
 */

import { FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';
import { KPI, KPIReview } from '../../../types';
import { StageInfo } from '../types';

/**
 * Get stage information based on KPI status and review
 */
export const getStageInfo = (kpi: KPI | null, review: KPIReview | null): StageInfo => {
  if (!kpi) {
    return {
      stage: '',
      color: '',
      icon: null,
    };
  }

  if (kpi.status === 'pending') {
    return {
      stage: 'KPI Setting - Awaiting Acknowledgement',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: <FiClock className="text-xl" />,
    };
  }

  if (kpi.status === 'acknowledged' && !review) {
    return {
      stage: 'KPI Acknowledged - Review Pending',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <FiFileText className="text-xl" />,
    };
  }

  if (review) {
    if (review.review_status === 'employee_submitted') {
      return {
        stage: 'Self-Rating Submitted - Awaiting Manager Review',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: <FiClock className="text-xl" />,
      };
    }

    if (review.review_status === 'manager_submitted' || review.review_status === 'completed') {
      return {
        stage: 'KPI Review Completed',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: <FiCheckCircle className="text-xl" />,
      };
    }

    if (review.review_status === 'pending') {
      return {
        stage: 'KPI Review - Self-Rating Required',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: <FiFileText className="text-xl" />,
      };
    }
  }

  return {
    stage: 'In Progress',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: <FiClock className="text-xl" />,
  };
};

/**
 * Parse item ratings from review comment JSON or structured data
 */
export const parseItemRatings = (commentJson: string | null, itemRatings?: any, role: 'employee' | 'manager' = 'employee'): { [key: number]: number } => {
  const ratings: { [key: number]: number } = {};
  
  // NEW: First try to use structured item_ratings if available
  if (itemRatings && itemRatings[role]) {
    Object.entries(itemRatings[role]).forEach(([itemId, ratingData]: [string, any]) => {
      const id = parseInt(itemId);
      ratings[id] = parseFloat(ratingData.rating) || 0;
    });
    return ratings;
  }

  // FALLBACK: Parse from JSON (backward compatibility)
  if (!commentJson) return ratings;

  try {
    const data = JSON.parse(commentJson);
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((item: any) => {
        if (item.item_id) {
          ratings[item.item_id] = item.rating || 0;
        }
      });
    }
  } catch {
    // Not JSON, use legacy format
  }

  return ratings;
};

/**
 * Parse item comments from review comment JSON or structured data
 */
export const parseItemComments = (commentJson: string | null, itemRatings?: any, role: 'employee' | 'manager' = 'employee'): { [key: number]: string } => {
  const comments: { [key: number]: string } = {};
  
  // NEW: First try to use structured item_ratings if available
  if (itemRatings && itemRatings[role]) {
    Object.entries(itemRatings[role]).forEach(([itemId, ratingData]: [string, any]) => {
      const id = parseInt(itemId);
      comments[id] = ratingData.comment || '';
    });
    return comments;
  }

  // FALLBACK: Parse from JSON (backward compatibility)
  if (!commentJson) return comments;

  try {
    const data = JSON.parse(commentJson);
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((item: any) => {
        if (item.item_id) {
          comments[item.item_id] = item.comment || '';
        }
      });
    }
  } catch {
    // Not JSON
  }

  return comments;
};

/**
 * Get rating label based on numeric rating
 */
export const getRatingLabel = (rating: number): string => {
  if (rating === 1.00) return 'Below';
  if (rating === 1.25) return 'Meets';
  if (rating === 1.50) return 'Exceeds';
  return '';
};

/**
 * Get overall rating label
 */
export const getOverallRatingLabel = (rating: number): string => {
  if (rating >= 1.40) return 'Exceeds Expectation';
  if (rating >= 1.15) return 'Meets Expectation';
  return 'Below Expectation';
};

/**
 * Format rating value
 */
export const formatRating = (rating: any): string => {
  const numRating = typeof rating === 'number' ? rating : parseFloat(String(rating || '0'));
  return isNaN(numRating) ? '0.00' : numRating.toFixed(2);
};

/**
 * Parse goal weight from string
 */
export const parseGoalWeight = (goalWeight: any): number => {
  if (!goalWeight) return 0;
  
  const weightStr = String(goalWeight).trim();
  if (weightStr.endsWith('%')) {
    return parseFloat(weightStr.replace('%', '')) / 100;
  } else {
    const weight = parseFloat(weightStr);
    // If weight > 1, assume it's a percentage (e.g., 40 means 40%)
    if (weight > 1) {
      return weight / 100;
    }
    return weight;
  }
};
