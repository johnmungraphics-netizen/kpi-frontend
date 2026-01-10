/**
 * Manager API Services
 */

import api from '../../../services/api';
import { Employee, ManagerDepartment } from '../types';
import { KPIReview, Notification } from '../../../types';

export const managerService = {
  /**
   * Fetch KPI reviews
   */
  fetchReviews: async (): Promise<KPIReview[]> => {
    const response = await api.get('/kpi-review');
    return response.data.reviews || [];
  },

  /**
   * Fetch unread notifications for manager
   */
  fetchNotifications: async (limit: number = 5): Promise<Notification[]> => {
    const response = await api.get('/notifications', { 
      params: { limit, read: 'false' } 
    });
    return response.data.notifications || [];
  },

  /**
   * Fetch recent activity
   */
  fetchRecentActivity: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications/activity');
    return response.data.activities || [];
  },

  /**
   * Fetch all employees
   */
  fetchEmployees: async (): Promise<Employee[]> => {
    const response = await api.get('/employees');
    return response.data.employees || [];
  },

  /**
   * Fetch single KPI by ID
   */
  fetchKPIById: async (kpiId: number): Promise<any> => {
    const response = await api.get(`/kpis/${kpiId}`);
    return response.data.kpi;
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
   * Fetch manager's departments
   */
  fetchManagerDepartments: async (): Promise<ManagerDepartment[]> => {
    const response = await api.get('/departments/manager-departments');
    return response.data.departments || [];
  },

  /**
   * Mark notification as read
   */
  markNotificationRead: async (id: number): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  /**
   * Fetch a specific employee by ID
   */
  fetchEmployeeById: async (employeeId: string): Promise<any> => {
    const response = await api.get(`/employees/${employeeId}`);
    return response.data.employee;
  },

  /**
   * Fetch KPIs for a specific employee
   */
  fetchEmployeeKPIs: async (employeeId: string): Promise<any[]> => {
    const response = await api.get('/kpis');
    const allKPIs = response.data.kpis || [];
    // Filter KPIs for this specific employee
    return allKPIs.filter((kpi: any) => kpi.employee_id === parseInt(employeeId));
  },
};
