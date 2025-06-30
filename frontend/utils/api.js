import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './constants';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication headers
apiClient.interceptors.request.use(
  (config) => {
    // Add demo user authentication header (matches backend expectation)
    config.headers['X-Demo-User-ID'] = '550e8400-e29b-41d4-a716-446655440000';
    
    // Log request for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log('Request Data:', config.data);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    
    return response;
  },
  (error) => {
    // Centralized error handling
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          error.message = data?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          error.message = 'Authentication required. Please refresh the page.';
          break;
        case 403:
          error.message = 'Access denied. You do not have permission for this action.';
          break;
        case 404:
          error.message = data?.message || 'Resource not found.';
          break;
        case 500:
          error.message = 'Server error. Please try again later.';
          break;
        default:
          error.message = data?.message || `Request failed with status ${status}`;
      }
    } else if (error.request) {
      // Network error - no response received
      error.message = 'Network error. Please check your connection and try again.';
    } else {
      // Something else happened
      error.message = error.message || 'An unexpected error occurred.';
    }
    
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Properties API
  properties: {
    getAll: () => apiClient.get(API_ENDPOINTS.PROPERTIES),
    getById: (id) => apiClient.get(`${API_ENDPOINTS.PROPERTIES}/${id}`),
    create: (data) => apiClient.post(API_ENDPOINTS.PROPERTIES, data),
    update: (id, data) => apiClient.put(`${API_ENDPOINTS.PROPERTIES}/${id}`, data),
    delete: (id) => apiClient.delete(`${API_ENDPOINTS.PROPERTIES}/${id}`),
  },

  // Items API
  items: {
    getAll: (params = {}) => apiClient.get(API_ENDPOINTS.ITEMS, { params }),
    getById: (id) => apiClient.get(`${API_ENDPOINTS.ITEMS}/${id}`),
    getByProperty: (propertyId) => apiClient.get(API_ENDPOINTS.ITEMS, { params: { propertyId } }),
    create: (data) => apiClient.post(API_ENDPOINTS.ITEMS, data),
    update: (id, data) => apiClient.put(`${API_ENDPOINTS.ITEMS}/${id}`, data),
    delete: (id) => apiClient.delete(`${API_ENDPOINTS.ITEMS}/${id}`),
  },

  // QR Codes API
  qrcodes: {
    getAll: (params = {}) => apiClient.get(API_ENDPOINTS.QRCODES, { params }),
    getById: (id) => apiClient.get(`${API_ENDPOINTS.QRCODES}/${id}`),
    getByItem: (itemId) => apiClient.get(API_ENDPOINTS.QRCODES, { params: { itemId } }),
    create: (data) => apiClient.post(API_ENDPOINTS.QRCODES, data),
    update: (id, data) => apiClient.put(`${API_ENDPOINTS.QRCODES}/${id}`, data),
    delete: (id) => apiClient.delete(`${API_ENDPOINTS.QRCODES}/${id}`),
    download: (id) => apiClient.get(`${API_ENDPOINTS.QRCODES}/${id}/download`, { 
      responseType: 'blob' 
    }),
    getMapping: (id) => apiClient.get(`${API_ENDPOINTS.QRCODES}/${id}/mapping`),
    getStatistics: () => apiClient.get(`${API_ENDPOINTS.QRCODES}/statistics`),
  },

  // Content API
  content: {
    getByQRCode: (qrCode) => apiClient.get(`${API_ENDPOINTS.CONTENT}/${qrCode}`),
    getMeta: (qrCode) => apiClient.get(`${API_ENDPOINTS.CONTENT}/${qrCode}/meta`),
    recordView: (qrCode, data) => apiClient.post(`${API_ENDPOINTS.CONTENT}/${qrCode}/view`, data),
    getStats: (qrCode) => apiClient.get(`${API_ENDPOINTS.CONTENT}/${qrCode}/stats`),
  },
};

// Helper functions for common operations
export const apiHelpers = {
  // Extract data from successful API response
  extractData: (response) => {
    if (response.data?.success) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'API response indicates failure');
  },

  // Handle API errors with user-friendly messages
  handleError: (error) => {
    console.error('API Error Details:', error);
    
    // Return user-friendly error message
    return {
      message: error.message || 'An unexpected error occurred',
      status: error.response?.status || 0,
      details: error.response?.data || null,
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

// Export the configured axios instance for custom requests
export default apiClient;

// Export individual functions for backward compatibility
export const get = (url, config) => apiClient.get(url, config);
export const post = (url, data, config) => apiClient.post(url, data, config);
export const put = (url, data, config) => apiClient.put(url, data, config);
export const del = (url, config) => apiClient.delete(url, config); 