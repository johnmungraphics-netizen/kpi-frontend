/**
 * Auth Redux Slice
 * 
 * State management for authentication.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { User, Company } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  companies: Company[];
  hasMultipleCompanies: boolean;
  selectedCompany: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  passwordChangeRequired: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  companies: [],
  hasMultipleCompanies: false,
  selectedCompany: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  passwordChangeRequired: false,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ payrollNumber, password }: { payrollNumber: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', {
        payrollNumber,
        password,
        loginMethod: 'payroll',
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        loginMethod: 'email',
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const selectCompany = createAsyncThunk(
  'auth/selectCompany',
  async (companyId: number, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/select-company', { companyId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Company selection failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.companies = [];
      state.hasMultipleCompanies = false;
      state.selectedCompany = null;
      state.isAuthenticated = false;
      state.passwordChangeRequired = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('companies');
      localStorage.removeItem('selectedCompany');
      localStorage.removeItem('passwordChangeRequired');
      delete api.defaults.headers.common['Authorization'];
    },
    initializeAuth: (state) => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedCompanies = localStorage.getItem('companies');
      const storedSelectedCompany = localStorage.getItem('selectedCompany');
      const storedPasswordChange = localStorage.getItem('passwordChangeRequired');

      if (storedToken && storedUser) {
        state.token = storedToken;
        state.user = JSON.parse(storedUser);
        state.isAuthenticated = true;
        state.passwordChangeRequired = storedPasswordChange === 'true';
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        if (storedCompanies) {
          const parsedCompanies = JSON.parse(storedCompanies);
          state.companies = parsedCompanies;
          state.hasMultipleCompanies = parsedCompanies.length > 1;
        }

        if (storedSelectedCompany) {
          state.selectedCompany = JSON.parse(storedSelectedCompany);
        }
      }
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.companies = action.payload.companies || [];
        state.hasMultipleCompanies = action.payload.hasMultipleCompanies || false;
        state.passwordChangeRequired = action.payload.passwordChangeRequired || false;
        state.isAuthenticated = true;

        // Set selected company
        if (action.payload.companies && action.payload.companies.length > 0) {
          const primary = action.payload.companies.find((c: Company) => c.is_primary) || action.payload.companies[0];
          state.selectedCompany = primary;
          localStorage.setItem('selectedCompany', JSON.stringify(primary));
        }

        // Store in localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('companies', JSON.stringify(action.payload.companies || []));
        localStorage.setItem('passwordChangeRequired', action.payload.passwordChangeRequired ? 'true' : 'false');
        api.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login with email
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.companies = action.payload.companies || [];
        state.hasMultipleCompanies = action.payload.hasMultipleCompanies || false;
        state.passwordChangeRequired = action.payload.passwordChangeRequired || false;
        state.isAuthenticated = true;

        if (action.payload.companies && action.payload.companies.length > 0) {
          const primary = action.payload.companies.find((c: Company) => c.is_primary) || action.payload.companies[0];
          state.selectedCompany = primary;
          localStorage.setItem('selectedCompany', JSON.stringify(primary));
        }

        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('companies', JSON.stringify(action.payload.companies || []));
        localStorage.setItem('passwordChangeRequired', action.payload.passwordChangeRequired ? 'true' : 'false');
        api.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Select company
    builder
      .addCase(selectCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(selectCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.selectedCompany = action.payload.selectedCompany;

        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('selectedCompany', JSON.stringify(action.payload.selectedCompany));
        api.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      })
      .addCase(selectCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, logout, initializeAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
