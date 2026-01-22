import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Dynamically add auth token and provide logging
// SECURITY FIX: Token is now retrieved on each request, not set once at module load
api.interceptors.request.use(
  (config) => {
    // Dynamically retrieve token from localStorage for each request
    // This ensures the token is always up-to-date after login/logout/token refresh
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Explicitly remove Authorization header if no token exists
      delete config.headers.Authorization;
    }

    // Debug logging for rating-options endpoint
    if (config.url?.includes('rating-options')) {





    }
    return config;
  },
  (error) => {
    console.error('❌ [api] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes('rating-options')) {



    }
    return response;
  },
  (error) => {
    if (error.config?.url?.includes('rating-options')) {
      console.error('❌ [api] Response interceptor - rating-options error');
      console.error('❌ [api] Error response:', error.response);
      console.error('❌ [api] Error status:', error.response?.status);
      console.error('❌ [api] Error data:', error.response?.data);
    }
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

