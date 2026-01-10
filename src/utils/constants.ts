/**
 * Constants
 * 
 * Application-wide constants.
 */

export const APP_NAME = 'KPI Management System';

export const USER_ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  HR: 'hr',
  SUPER_ADMIN: 'super_admin',
} as const;

export const KPI_STATUS = {
  DRAFT: 'draft',
  PENDING_EMPLOYEE: 'pending_employee',
  PENDING_MANAGER: 'pending_manager',
  PENDING_HR: 'pending_hr',
  ACKNOWLEDGED: 'acknowledged',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
} as const;

export const API_ENDPOINTS = {
  AUTH: '/auth',
  KPIS: '/kpis',
  EMPLOYEES: '/employees',
  DEPARTMENTS: '/departments',
  NOTIFICATIONS: '/notifications',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
} as const;
