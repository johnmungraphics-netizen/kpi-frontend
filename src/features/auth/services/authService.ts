/**
 * Auth Service
 * 
 * API calls for authentication endpoints.
 */

import api from '../../../services/api';

export const authService = {
  // TODO: Implement auth API calls
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export default authService;
