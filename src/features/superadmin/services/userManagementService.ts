import api from '../../../services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'hr' | 'manager' | 'employee';
  company_name?: string;
  company_id?: number;
  department?: string;
  position?: string;
  payroll_number?: string;
  created_at: string;
  is_active?: boolean;
}

export interface UserFilters {
  role?: string;
  company?: string;
  search?: string;
}

export const userManagementService = {
  fetchAllUsers: async (filters?: UserFilters): Promise<User[]> => {
    const response = await api.get('/super-admin/users', { params: filters });
    return response.data.users || [];
  },

  fetchCompanies: async (): Promise<Array<{ id: number; name: string }>> => {
    const response = await api.get('/companies');
    return response.data.companies || [];
  },

  toggleUserStatus: async (userId: number, isActive: boolean): Promise<void> => {
    await api.patch(`/super-admin/users/${userId}/status`, { is_active: isActive });
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/super-admin/users/${userId}`);
  },
};