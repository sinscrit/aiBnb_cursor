// Environment-specific configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// API Base URLs - configurable by environment
// Using Next.js proxy to avoid CORS issues and leverage the rewrite rule in next.config.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Properties
  PROPERTIES: '/properties',
  
  // Items
  ITEMS: '/items',
  
  // QR Codes
  QRCODES: '/qrcodes',
  
  // Content (for future implementation)
  CONTENT: '/content',
  
  // Health check
  HEALTH: '/health',
};

// Frontend URLs
export const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL || 'http://localhost:3000';

export const FRONTEND_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROPERTIES: '/properties',
  PROPERTIES_CREATE: '/properties/create',
  ITEMS: '/items',
  ITEMS_CREATE: '/items/create',
  QRCODES: '/qrcodes',
  CONTENT: '/content',
};

// Application Constants
export const APP_CONFIG = {
  // API timeouts
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  UPLOAD_TIMEOUT: 30000,  // 30 seconds for file uploads
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // QR Code settings
  QR_CODE_SIZES: [128, 256, 512, 1024],
  DEFAULT_QR_SIZE: 256,
  QR_CODE_FORMATS: ['png', 'svg', 'pdf'],
  DEFAULT_QR_FORMAT: 'png',
  
  // Demo user configuration
  DEMO_USER: {
    TOKEN: 'demo-user-token',
    ID: '550e8400-e29b-41d4-a716-446655440000',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'Authentication required. Please refresh the page.',
  FORBIDDEN: 'Access denied. You do not have permission for this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROPERTY_CREATED: 'Property created successfully!',
  PROPERTY_UPDATED: 'Property updated successfully!',
  PROPERTY_DELETED: 'Property deleted successfully!',
  ITEM_CREATED: 'Item created successfully!',
  ITEM_UPDATED: 'Item updated successfully!',
  ITEM_DELETED: 'Item deleted successfully!',
  QR_GENERATED: 'QR code generated successfully!',
  QR_DOWNLOADED: 'QR code downloaded successfully!',
  QR_DELETED: 'QR code deleted successfully!',
};

// Form validation constants
export const VALIDATION = {
  // Property validation
  PROPERTY_NAME_MIN_LENGTH: 2,
  PROPERTY_NAME_MAX_LENGTH: 100,
  PROPERTY_ADDRESS_MAX_LENGTH: 200,
  
  // Item validation
  ITEM_NAME_MIN_LENGTH: 2,
  ITEM_NAME_MAX_LENGTH: 100,
  ITEM_LOCATION_MAX_LENGTH: 100,
  ITEM_DESCRIPTION_MAX_LENGTH: 500,
  
  // URL validation regex
  URL_REGEX: /^https?:\/\/.+/,
  
  // Common patterns
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Item categories for dropdown selections
export const ITEM_CATEGORIES = [
  'Electronics',
  'Furniture', 
  'Appliances',
  'Kitchen',
  'Bathroom',
  'Bedroom',
  'Living Room',
  'Office',
  'Outdoor',
  'Cleaning',
  'Maintenance',
  'Safety',
  'Other'
];

// Location suggestions based on categories
export const LOCATION_SUGGESTIONS = {
  Electronics: ['Living Room', 'Office', 'Bedroom', 'Kitchen'],
  Furniture: ['Living Room', 'Bedroom', 'Office', 'Dining Room'],
  Appliances: ['Kitchen', 'Laundry Room', 'Basement', 'Garage'],
  Kitchen: ['Kitchen', 'Pantry', 'Dining Room'],
  Bathroom: ['Bathroom', 'Guest Bathroom', 'Master Bathroom'],
  Bedroom: ['Master Bedroom', 'Guest Bedroom', 'Kids Room'],
  'Living Room': ['Living Room', 'Family Room', 'Den'],
  Office: ['Office', 'Study', 'Home Office'],
  Outdoor: ['Patio', 'Garden', 'Garage', 'Shed'],
  Cleaning: ['Utility Room', 'Laundry Room', 'Storage Closet'],
  Maintenance: ['Garage', 'Basement', 'Utility Room'],
  Safety: ['Throughout Property', 'Entrance', 'Hallways'],
  Other: ['Storage', 'Closet', 'Attic', 'Basement']
};

// Environment flags
export const ENV_FLAGS = {
  IS_DEVELOPMENT: isDevelopment,
  IS_PRODUCTION: isProduction,
  ENABLE_DEBUG_LOGGING: isDevelopment,
  ENABLE_API_MOCKING: false,
};

// Export grouped constants for easier imports
export default {
  API_BASE_URL,
  API_ENDPOINTS,
  FRONTEND_BASE_URL,
  FRONTEND_ROUTES,
  APP_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  ITEM_CATEGORIES,
  LOCATION_SUGGESTIONS,
  ENV_FLAGS,
}; 