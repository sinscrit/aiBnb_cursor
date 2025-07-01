import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, ERROR_MESSAGES } from './constants';

// Debug logging for API configuration
console.log('=== API CLIENT DEBUG INFO ===');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('API_ENDPOINTS:', API_ENDPOINTS);
console.log('Current window location:', typeof window !== 'undefined' ? window.location.href : 'SSR');
console.log('Process env NODE_ENV:', process.env.NODE_ENV);
console.log('===============================');

// Create axios instance with fixed proxy path
const apiClient = axios.create({
  baseURL: '/api',  // Always use Next.js proxy path
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Demo-User': '550e8400-e29b-41d4-a716-446655440000'
  }
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(config => {
  // Enhanced request logging
  const requestInfo = {
    method: config.method?.toUpperCase(),
    url: config.url,
    fullUrl: `${config.baseURL}${config.url}`,
    headers: { ...config.headers },
    data: config.data,
    timestamp: new Date().toISOString()
  };
  
  console.log('🚀 API Request:', requestInfo);
  
  // Add request timestamp for latency tracking
  config.metadata = { startTime: Date.now() };
  
  return config;
}, error => {
  console.error('❌ Request Error:', error);
  return Promise.reject(error);
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    // Calculate request duration
    const duration = response.config.metadata 
      ? Date.now() - response.config.metadata.startTime 
      : 'unknown';

    // Enhanced response logging
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      data: response.data
    });
    
    return response;
  },
  error => {
    // Enhanced error logging with detailed information
    const errorInfo = {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      timestamp: new Date().toISOString(),
      duration: error.config?.metadata 
        ? `${Date.now() - error.config.metadata.startTime}ms`
        : 'unknown'
    };

    console.error('❌ API Error:', errorInfo);

    // Transform network errors into user-friendly messages
    if (!error.response) {
      error.userMessage = ERROR_MESSAGES.NETWORK_ERROR;
    } else {
      switch (error.response.status) {
        case 401:
          error.userMessage = ERROR_MESSAGES.UNAUTHORIZED;
          break;
        case 403:
          error.userMessage = ERROR_MESSAGES.FORBIDDEN;
          break;
        case 404:
          error.userMessage = ERROR_MESSAGES.NOT_FOUND;
          break;
        case 422:
          error.userMessage = ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case 500:
          error.userMessage = ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          error.userMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
      }
    }

    return Promise.reject(error);
  }
);

// API service object with endpoints
const apiService = {
  properties: {
    getAll: () => apiClient.get('/properties'),
    getById: (id) => apiClient.get(`/properties/${id}`),
    create: (data) => apiClient.post('/properties', data),
    update: (id, data) => apiClient.put(`/properties/${id}`, data),
    delete: (id) => apiClient.delete(`/properties/${id}`)
  },
  items: {
    getAll: (propertyId) => apiClient.get(`/items?propertyId=${propertyId}`),
    getById: (id) => apiClient.get(`/items/${id}`),
    create: (data) => apiClient.post('/items', data),
    update: (id, data) => apiClient.put(`/items/${id}`, data),
    delete: (id) => apiClient.delete(`/items/${id}`)
  },
  qrcodes: {
    generate: (itemId) => apiClient.post(`/qrcodes/${itemId}`),
    getAll: () => apiClient.get('/qrcodes'),
    getByItemId: (itemId) => apiClient.get(`/qrcodes/${itemId}`)
  }
};

// Helper functions for common operations
export const apiHelpers = {
  // Extract data from successful API response
  extractData: (response) => {
    if (response.data?.success) {
      return response.data.data;
    }
    const error = new Error(response.data?.message || 'API response indicates failure');
    error.userMessage = response.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    throw error;
  },

  // Handle API errors with user-friendly messages
  handleError: (error) => {
    // Return user-friendly error info
    return {
      message: error.userMessage || error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      status: error.response?.status || 0,
      details: error.response?.data || null,
      timestamp: new Date().toISOString()
    };
  },

  // Download file from blob response
  downloadFile: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Create query string from parameters
  createQueryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  },
};

export default apiService;

// Export individual functions for backward compatibility
export const get = (url, config) => apiClient.get(url, config);
export const post = (url, data, config) => apiClient.post(url, data, config);
export const put = (url, data, config) => apiClient.put(url, data, config);
export const del = (url, config) => apiClient.delete(url, config); 