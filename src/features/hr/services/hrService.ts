/**
 * HR API Services
 */

import api from '../../../services/api';
import { Employee, Manager } from '../types';
import { KPIReview, Notification } from '../../../types';

export const hrService = {
  /**
   * Fetch KPI reviews
   */
  fetchReviews: async (): Promise<KPIReview[]> => {
    const response = await api.get('/kpi-review');
    return response.data.reviews || [];
  },

  /**
   * Fetch unread notifications
   */
  fetchNotifications: async (limit: number = 5): Promise<Notification[]> => {
    console.log('[hrService] 📡 API call: GET /notifications', { limit, read: 'false' });
    const response = await api.get('/notifications', { 
      params: { limit, read: 'false' } 
    });
    console.log('[hrService] 📥 Response:', {
      status: response.status,
      notificationsCount: response.data.notifications?.length || 0,
      data: response.data
    });
    return response.data.notifications || [];
  },

  /**
   * Fetch recent activity
   */
  fetchRecentActivity: async (): Promise<Notification[]> => {
    console.log('[hrService] 📡 API call: GET /notifications/activity');
    const response = await api.get('/notifications/activity');
    console.log('[hrService] 📥 Response:', {
      status: response.status,
      activitiesCount: response.data.activities?.length || 0
    });
    return response.data.activities || [];
  },

  /**
   * Fetch employees by department and category
   */
  fetchEmployeesByCategory: async (
    department: string, 
    category: string
  ): Promise<Employee[]> => {
    const response = await api.get(
      `/departments/statistics/${department}/${category}`
    );
    return response.data.employees || [];
  },

  /**
   * Fetch list of managers
   */
  fetchManagers: async (): Promise<Manager[]> => {
    const response = await api.get('/departments/managers');
    return response.data.managers || [];
  },

  /**
   * Mark notification as read
   */
  markNotificationRead: async (id: number): Promise<void> => {
    console.log(`[hrService] 📡 API call: PATCH /notifications/${id}/read`);
    const response = await api.patch(`/notifications/${id}/read`);
    console.log(`[hrService] ✅ Notification ${id} marked as read:`, response.data);
  },

  /**
   * Fetch paginated KPIs with filters
   */
  fetchKPIs: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: string;
    period?: string;
    manager?: string;
    employee_id?: string;
  }) => {
    const response = await api.get('/kpis', { params });
    return response.data;
  },

  /**
   * Fetch departments list
   */
  fetchDepartments: async (): Promise<string[]> => {
    const response = await api.get('/departments/statistics');
    const stats = response.data.statistics || [];
    return stats.map((stat: any) => stat.department);
  },

  /**
   * Fetch department statistics
   */
  fetchDepartmentStatistics: async () => {
    const response = await api.get('/departments/statistics');
    return response.data.statistics || [];
  },

  /**
   * Fetch period settings
   */
  fetchPeriodSettings: async () => {
    const response = await api.get('/settings/period-settings');
    return response.data.settings || [];
  },

  /**
   * Save period setting
   */
  savePeriodSetting: async (setting: any) => {
    if (setting.id) {
      const response = await api.put(`/settings/period-settings/${setting.id}`, setting);
      return response.data;
    } else {
      const response = await api.post('/settings/period-settings', setting);
      return response.data;
    }
  },

  /**
   * Delete period setting
   */
  deletePeriodSetting: async (id: number) => {
    const response = await api.delete(`/settings/period-settings/${id}`);
    return response.data;
  },

  /**
   * Fetch reminder settings
   */
  fetchReminderSettings: async () => {
    const response = await api.get('/settings/reminder-settings');
    return response.data.settings || [];
  },

  /**
   * Save reminder setting
   */
  saveReminderSetting: async (setting: any) => {
    if (setting.id) {
      const response = await api.put(`/settings/reminder-settings/${setting.id}`, setting);
      return response.data;
    } else {
      const response = await api.post('/settings/reminder-settings', setting);
      return response.data;
    }
  },

  /**
   * Delete reminder setting
   */
  deleteReminderSetting: async (id: number) => {
    const response = await api.delete(`/settings/reminder-settings/${id}`);
    return response.data;
  },

  /**
   * Fetch daily reminder setting
   */
  fetchDailyReminderSetting: async () => {
    const response = await api.get('/settings/daily-reminders');
    return response.data.setting || { 
      send_daily_reminders: false, 
      days_before_meeting: 3, 
      cc_emails: '' 
    };
  },

  /**
   * Save daily reminder setting
   */
  saveDailyReminderSetting: async (setting: any) => {
    const response = await api.post('/settings/daily-reminders', setting);
    return response.data;
  },

  /**
   * Fetch HR email notifications setting
   */
  fetchHREmailNotifications: async (): Promise<boolean> => {
    try {
      const response = await api.get('/settings/hr-email-notifications');
      return response.data.setting?.receive_email_notifications ?? true;
    } catch {
      return true;
    }
  },

  /**
   * Save HR email notifications setting
   */
  saveHREmailNotifications: async (receiveNotifications: boolean) => {
    const response = await api.post('/settings/hr-email-notifications', {
      receive_email_notifications: receiveNotifications,
    });
    return response.data;
  },

  /**
   * Fetch rating options
   */
  fetchRatingOptions: async () => {
    try {
      const response = await api.get('/rating-options/manage');
      return response.data.rating_options || [];
    } catch {
      return [];
    }
  },

  /**
   * Save rating option
   */
  saveRatingOption: async (option: any) => {
    if (option.id) {
      const response = await api.put(`/rating-options/${option.id}`, option);
      return response.data;
    } else {
      const response = await api.post('/rating-options', option);
      return response.data;
    }
  },

  /**
   * Delete rating option
   */
  deleteRatingOption: async (id: number) => {
    const response = await api.delete(`/rating-options/${id}`);
    return response.data;
  },

  /**
   * Fetch rejected KPIs (active rejections)
   */
  fetchRejectedKPIs: async () => {
    const [kpisRes, reviewsRes] = await Promise.all([
      api.get('/kpis'),
      api.get('/kpi-review'),
    ]);

    const allKpis = kpisRes.data.kpis || [];
    const allReviews = reviewsRes.data.reviews || [];

    const rejectedKpis = allKpis.filter((kpi: any) => {
      const review = allReviews.find((r: any) => r.kpi_id === kpi.id);
      return review && review.review_status === 'rejected' && review.rejection_resolved_status !== 'resolved';
    });

    return { kpis: rejectedKpis, reviews: allReviews };
  },

  /**
   * Fetch resolved rejected KPIs
   */
  fetchResolvedKPIs: async () => {
    const [kpisRes, reviewsRes] = await Promise.all([
      api.get('/kpis'),
      api.get('/kpi-review'),
    ]);

    const allKpis = kpisRes.data.kpis || [];
    const allReviews = reviewsRes.data.reviews || [];

    const resolvedKpis = allKpis.filter((kpi: any) => {
      const review = allReviews.find((r: any) => r.kpi_id === kpi.id);
      return review && review.review_status === 'rejected' && review.rejection_resolved_status === 'resolved';
    });

    return { kpis: resolvedKpis, reviews: allReviews };
  },

  /**
   * Fetch KPI by ID with its review
   */
  fetchKPIById: async (kpiId: string) => {
    const [kpiRes, reviewsRes] = await Promise.all([
      api.get(`/kpis/${kpiId}`),
      api.get('/kpi-review'),
    ]);

    const kpi = kpiRes.data.kpi;
    const review = reviewsRes.data.reviews?.find((r: any) => r.kpi_id === parseInt(kpiId));

    return { kpi, review };
  },

  /**
   * Resolve a rejected KPI
   */
  resolveRejection: async (reviewId: number, note: string) => {
    const response = await api.post(`/kpi-review/${reviewId}/resolve-rejection`, { note });
    return response.data;
  },
};

