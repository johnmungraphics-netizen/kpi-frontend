import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { KPI, KPIReview } from '../../../types';
import React from 'react';

export interface KPIStatusInfo {
  label: string;
  color: string;
  bgColor: string;
}

export const getKPIStatusInfo = (status: string): KPIStatusInfo => {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending Acknowledgement',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
      };
    case 'acknowledged':
      return {
        label: 'Acknowledged',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
      };
    case 'in_review':
      return {
        label: 'In Review',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
      };
    case 'completed':
      return {
        label: 'Completed',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
      };
    default:
      return {
        label: 'Unknown',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
      };
  }
};

export interface KPIStageInfo {
  stage: string;
  color: string;
  icon: React.ReactNode;
}

export const getKPIStageInfo = (kpi: KPI): KPIStageInfo => {
  if (kpi.status === 'pending') {
    return {
      stage: 'Pending Acknowledgement',
      color: 'bg-orange-100 text-orange-700',
      icon: React.createElement(FiAlertCircle, { className: 'inline' }),
    };
  }

  if (kpi.status === 'acknowledged') {
    return {
      stage: 'Acknowledged',
      color: 'bg-blue-100 text-blue-700',
      icon: React.createElement(FiCheckCircle, { className: 'inline' }),
    };
  }

  if (kpi.status === 'completed') {
    return {
      stage: 'Completed',
      color: 'bg-green-100 text-green-700',
      icon: React.createElement(FiCheckCircle, { className: 'inline' }),
    };
  }

  return {
    stage: 'Unknown',
    color: 'bg-gray-100 text-gray-700',
    icon: React.createElement(FiClock, { className: 'inline' }),
  };
};

export const canEditKPI = (kpi: KPI): boolean => {
  return kpi.status === 'pending' || kpi.status === 'acknowledged';
};

export const canDeleteKPI = (kpi: KPI): boolean => {
  return kpi.status === 'pending';
};

export const formatKPIDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};

export const parseKPIItems = (kpi: KPI) => {
  if (kpi.items && Array.isArray(kpi.items)) {
    return kpi.items;
  }
  return [];
};

export const getRatingLabel = (rating: number): string => {
  if (rating >= 1.4) return 'Exceeds Expectation';
  if (rating >= 1.15) return 'Meets Expectation';
  if (rating > 0) return 'Below Expectation';
  return 'Not Rated';
};

export const formatRating = (rating: number): string => {
  return rating > 0 ? rating.toFixed(2) : '0.00';
};

export const getQualitativeRatingDisplay = (rating: string): string => {
  const ratingMap: { [key: string]: string } = {
    below: 'Below Expectation',
    meets: 'Meets Expectation',
    exceeds: 'Exceeds Expectation',
  };
  return ratingMap[rating] || rating;
};

export const extractCommentFromJSON = (comment: string): string => {
  try {
    const parsed = JSON.parse(comment);
    return parsed.comment || parsed.text || comment;
  } catch {
    return comment;
  }
};

export const parseReviewData = (review: KPIReview | null, _kpi: KPI) => {
  if (!review) {
    return {
      employeeRating: 0,
      managerRating: 0,
      employeeComment: '',
      managerComment: '',
      employeeItemRatings: {},
      employeeItemComments: {},
      managerItemRatings: {},
      managerItemComments: {},
    };
  }

  const result = {
    employeeRating: review.employee_rating || 0,
    managerRating: review.manager_rating || 0,
    employeeComment: '',
    managerComment: review.manager_comment || '',
    employeeItemRatings: {} as { [key: number]: number },
    employeeItemComments: {} as { [key: number]: string },
    managerItemRatings: {} as { [key: number]: number },
    managerItemComments: {} as { [key: number]: string },
  };

  // NEW: First try to use structured item_ratings if available
  if (review.item_ratings) {
    // Parse employee ratings from structured data
    if (review.item_ratings.employee) {
      Object.entries(review.item_ratings.employee).forEach(([itemId, ratingData]: [string, any]) => {
        const id = parseInt(itemId);
        result.employeeItemRatings[id] = parseFloat(ratingData.rating) || 0;
        result.employeeItemComments[id] = ratingData.comment || '';
      });
    }

    // Parse manager ratings from structured data
    if (review.item_ratings.manager) {
      Object.entries(review.item_ratings.manager).forEach(([itemId, ratingData]: [string, any]) => {
        const id = parseInt(itemId);
        result.managerItemRatings[id] = parseFloat(ratingData.rating) || 0;
        result.managerItemComments[id] = ratingData.comment || '';
      });
    }

    // If structured data exists, use it and skip JSON parsing
    if (Object.keys(result.employeeItemRatings).length > 0 || Object.keys(result.managerItemRatings).length > 0) {
      return result;
    }
  }

  // FALLBACK: Parse from JSON (backward compatibility)
  try {
    if (review.employee_comment) {
      const commentData = JSON.parse(review.employee_comment);

      if (commentData.items && Array.isArray(commentData.items)) {
        commentData.items.forEach((item: any) => {
          if (item.item_id) {
            result.employeeItemRatings[item.item_id] = item.rating || 0;
            result.employeeItemComments[item.item_id] = item.comment || '';
          }
        });
      } else {
        result.employeeComment = review.employee_comment;
      }
    }
  } catch (error) {
    result.employeeComment = review.employee_comment || '';
  }

  // Parse manager comment JSON
  try {
    if (review.manager_comment) {
      const commentData = JSON.parse(review.manager_comment);

      if (commentData.items && Array.isArray(commentData.items)) {
        commentData.items.forEach((item: any) => {
          if (item.item_id) {
            result.managerItemRatings[item.item_id] = item.rating || 0;
            result.managerItemComments[item.item_id] = item.comment || '';
          }
        });
      }
    }
  } catch (error) {
    // Manager comment is not JSON, keep as is
  }

  return result;
};