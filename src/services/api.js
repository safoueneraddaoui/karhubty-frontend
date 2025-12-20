import axios from 'axios';
import tokenService from './tokenService';

// Base API URL - Change this to your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Include credentials for CORS requests
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    console.log('📤 [API Request] URL:', config.url, '| Method:', config.method?.toUpperCase());
    
    // Skip token check for auth endpoints (login, register, forgot-password)
    const authEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/agent-requests'];
    const isAuthEndpoint = authEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    if (!isAuthEndpoint) {
      // Check if token has expired before making request (only for protected endpoints)
      const expired = tokenService.isTokenExpired();
      console.log('🔍 [API Request] Token expiration check:', { expired, endpoint: config.url });
      
      if (expired) {
        console.error('❌ [API Request] Token has expired, clearing auth and redirecting');
        tokenService.clearAuth();
        window.location.href = '/login';
        return Promise.reject(new Error('Token expired'));
      }
    } else {
      console.log('✅ [API Request] Skipping token check for auth endpoint:', config.url);
    }
    
    // Get token from tokenService (single source of truth)
    const token = tokenService.getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [API Request] Authorization header set');
      console.log('   - Token (first 20 chars):', token.substring(0, 20) + '...');
      console.log('   - Token (last 20 chars):', '...' + token.substring(token.length - 20));
      console.log('   - Full token length:', token.length);
      console.log('   - Token valid format:', tokenService.isValidToken(token));
      console.log('   - Expires in:', tokenService.getTimeUntilExpiry(), 'minutes');
      
      // Extend token validity on each API call (keep session alive with activity)
      tokenService.extendTokenValidity();
    } else {
      if (!isAuthEndpoint) {
        console.error('❌ [API Request] No token available for protected endpoint');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ [API Request] Interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log('📥 [API Response] Success -', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Handle CORS errors
    if (!error.response) {
      console.error('❌ [API Response] Network/CORS Error:', error.message);
      if (error.message === 'Network Error') {
        throw 'Network error. Please check if the backend server is running.';
      }
      throw error.message || 'An error occurred. Please try again.';
    }

    // Handle specific error cases
    if (error.response) {
      console.log('❌ [API Response] Status:', error.response.status, '| URL:', error.config?.url);
      
      // Handle 401 Unauthorized - Token is invalid or expired
      if (error.response.status === 401) {
        console.error('❌ [API Response] 401 Unauthorized - Token invalid or expired');
        console.error('Request URL:', error.config?.url);
        console.error('Token info:', {
          tokenExists: !!tokenService.getToken(),
          userExists: !!tokenService.getUser(),
          authHeader: error.config?.headers?.Authorization?.substring(0, 30) + '...'
        });
        
        // Clear auth and redirect to login
        console.log('🔓 [API Response] Clearing auth and redirecting to login');
        tokenService.clearAuth();
        // Use setTimeout to allow current request to finish rejecting first
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
        
        return Promise.reject(error);
      }
      
      // Handle 204 No Content (treat as success)
      if (error.response.status === 204) {
        console.log('ℹ️ [API Response] 204 No Content (treated as success)');
        return error.response;
      }
      
      // Handle other errors
      switch (error.response.status) {
        case 403:
          console.error('❌ [API Response] 403 Forbidden - Access denied');
          break;
        case 404:
          console.error('❌ [API Response] 404 Not Found');
          break;
        case 500:
          console.error('❌ [API Response] 500 Server Error');
          break;
        default:
          console.error('❌ [API Response] Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('❌ [API Response] No response from server');
    } else {
      console.error('❌ [API Response] Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Create axios instance for multipart/form-data (file uploads)
export const apiFormData = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 30000, // 30 seconds for file uploads
  withCredentials: true, // Include credentials for CORS requests
});

// Add request interceptor to form data instance
apiFormData.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [API FormData Request] Token attached');
    } else {
      console.warn('⚠️ [API FormData Request] No token available');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to form data instance
apiFormData.interceptors.response.use(
  (response) => {
    console.log('📥 [API FormData Response] Success -', response.status);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ [API FormData Response] 401 Unauthorized');
      tokenService.clearAuth();
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    }
    return Promise.reject(error);
  }
);

export default api;