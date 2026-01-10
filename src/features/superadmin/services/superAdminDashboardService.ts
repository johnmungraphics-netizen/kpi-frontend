import api from '../../../services/api';

export interface DashboardStats {
  totalCompanies: number;
  totalHRUsers: number;
  totalManagers: number;
  totalEmployees: number;
  totalDepartments: number;
}

export interface Company {
  id: number;
  name: string;
  domain?: string;
  created_at: string;
  total_employees: number;
  total_managers: number;
  total_hr: number;
  total_departments: number;
}

export const superAdminDashboardService = {
  fetchDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/super-admin/dashboard-stats');
    return response.data;
  },

  fetchRecentCompanies: async (limit: number = 5): Promise<Company[]> => {
    const response = await api.get('/companies', {
      params: { limit, sort: 'recent' }
    });
    return response.data.companies || [];
  },
};