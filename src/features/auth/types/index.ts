/**
 * Auth Types
 * 
 * TypeScript types for authentication.
 */

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  company_id?: number;
  department_id?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
