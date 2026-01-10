import React from 'react';
import { FiClock, FiFileText, FiBell, FiCheckCircle, FiEdit } from 'react-icons/fi';
import { KPI, KPIReview } from '../../../types';

export interface DashboardStageInfo {
  stage: string;
  color: string;
  icon: React.ReactNode;
}

export const getDashboardKPIStage = (kpi: KPI, reviews: KPIReview[]): DashboardStageInfo => {
  const review = reviews.find(r => r.kpi_id === kpi.id);

  if (kpi.status === 'pending') {
    return {
      stage: 'KPI Setting - Awaiting Acknowledgement',
      color: 'bg-orange-100 text-orange-700',
      icon: <FiClock className="inline" />
    };
  }

  if (kpi.status === 'acknowledged' && !review) {
    return {
      stage: 'KPI Acknowledged - Review Pending',
      color: 'bg-blue-100 text-blue-700',
      icon: <FiFileText className="inline" />
    };
  }

  if (review) {
    if (review.review_status === 'manager_submitted') {
      return {
        stage: 'Awaiting Your Confirmation',
        color: 'bg-indigo-100 text-indigo-700',
        icon: <FiBell className="inline" />
      };
    }

    if (review.review_status === 'employee_submitted') {
      return {
        stage: 'Self-Rating Submitted - Awaiting Manager Review',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <FiClock className="inline" />
      };
    }

    if (review.review_status === 'completed') {
      return {
        stage: 'KPI Review Completed',
        color: 'bg-green-100 text-green-700',
        icon: <FiCheckCircle className="inline" />
      };
    }

    if (review.review_status === 'rejected') {
      return {
        stage: 'Review Rejected',
        color: 'bg-red-100 text-red-700',
        icon: <FiEdit className="inline" />
      };
    }

    if (review.review_status === 'pending') {
      return {
        stage: 'KPI Review - Self-Rating Required',
        color: 'bg-purple-100 text-purple-700',
        icon: <FiFileText className="inline" />
      };
    }
  }

  return {
    stage: 'In Progress',
    color: 'bg-gray-100 text-gray-700',
    icon: <FiClock className="inline" />
  };
};

export interface DashboardStats {
  totalKpis: number;
  reviewCompleted: number;
  settingCompleted: number;
  awaitingAcknowledgement: number;
  reviewPending: number;
  selfRatingRequired: number;
  awaitingManagerReview: number;
  awaitingConfirmation: number;
  completed: number;
  rejected: number;
}

export const calculateDashboardStats = (kpis: KPI[], reviews: KPIReview[]): DashboardStats => {
  return {
    totalKpis: kpis.length,
    reviewCompleted: kpis.filter(k => {
      const review = reviews.find(r => r.kpi_id === k.id);
      return review && (review.review_status === 'manager_submitted' || review.review_status === 'completed');
    }).length,
    settingCompleted: kpis.filter(k => k.status === 'acknowledged').length,
    awaitingAcknowledgement: kpis.filter(k => k.status === 'pending').length,
    reviewPending: kpis.filter(k => {
      const review = reviews.find(r => r.kpi_id === k.id);
      return k.status === 'acknowledged' && !review;
    }).length,
    selfRatingRequired: kpis.filter(k => {
      const review = reviews.find(r => r.kpi_id === k.id);
      return review && review.review_status === 'pending';
    }).length,
    awaitingManagerReview: kpis.filter(k => {
      const review = reviews.find(r => r.kpi_id === k.id);
      return review && review.review_status === 'employee_submitted';
    }).length,
    awaitingConfirmation: kpis.filter(k => {
      const review = reviews.find(r => r.kpi_id === k.id);
      return review && review.review_status === 'manager_submitted';
    }).length,
    completed: kpis.filter(k => {
      const review = reviews.find(r => r.kpi_id === k.id);
      return review && review.review_status === 'completed';
    }).length,
    rejected: kpis.filter(k => {
      const review = reviews.find(r => r.kpi_id === k.id);
      return review && review.review_status === 'rejected';
    }).length,
  };
};

export const getUniquePeriods = (kpis: KPI[]): string[] => {
  return Array.from(new Set(kpis.map(kpi => `${kpi.quarter} ${kpi.year}`))).sort();
};

export const filterKpis = (
  kpis: KPI[],
  reviews: KPIReview[],
  searchTerm: string,
  selectedPeriod: string,
  selectedStatus: string
): KPI[] => {
  return kpis.filter(kpi => {
    const matchesSearch = searchTerm === '' || 
      kpi.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPeriod = selectedPeriod === '' || 
      `${kpi.quarter} ${kpi.year}` === selectedPeriod;
    
    const stageInfo = getDashboardKPIStage(kpi, reviews);
    const matchesStatus = selectedStatus === '' || 
      stageInfo.stage.toLowerCase().includes(selectedStatus.toLowerCase());

    return matchesSearch && matchesPeriod && matchesStatus;
  });
};

export const scrollToTable = () => {
  document.querySelector('.overflow-x-auto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};