/**
 * Error Handling Utilities
 * QR Code-Based Instructional System - Error Management
 */

import { ERROR_MESSAGES } from './constants';

// Error types for categorization
export const ErrorTypes = {
  NETWORK: 'network',
  API: 'api',
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
};

// Error categories for user-friendly messages
export const ErrorCategories = {
  [ErrorTypes.NETWORK]: {
    title: 'Connection Error',
    icon: '🌐',
    retryable: true
  },
  [ErrorTypes.API]: {
    title: 'API Error',
    icon: '🔌',
    retryable: true
  },
  [ErrorTypes.VALIDATION]: {
    title: 'Invalid Input',
    icon: '⚠️',
    retryable: false
  },
  [ErrorTypes.AUTHENTICATION]: {
    title: 'Authentication Required',
    icon: '🔒',
    retryable: false
  },
  [ErrorTypes.AUTHORIZATION]: {
    title: 'Access Denied',
    icon: '🚫',
    retryable: false
  },
  [ErrorTypes.NOT_FOUND]: {
    title: 'Not Found',
    icon: '🔍',
    retryable: false
  },
  [ErrorTypes.SERVER]: {
    title: 'Server Error',
    icon: '⚡',
    retryable: true
  },
  [ErrorTypes.CLIENT]: {
    title: 'Application Error',
    icon: '💻',
    retryable: true
  },
  [ErrorTypes.UNKNOWN]: {
    title: 'Unknown Error',
    icon: '❓',
    retryable: true
  }
};

// Determine error type from error object
export const getErrorType = (error) => {
  if (!error) return ErrorTypes.UNKNOWN;

  // Network errors
  if (!error.response) {
    return ErrorTypes.NETWORK;
  }

  // API errors with status codes
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return ErrorTypes.VALIDATION;
      case 401:
        return ErrorTypes.AUTHENTICATION;
      case 403:
        return ErrorTypes.AUTHORIZATION;
      case 404:
        return ErrorTypes.NOT_FOUND;
      case 422:
        return ErrorTypes.VALIDATION;
      case 500:
      case 502:
      case 503:
      case 504:
        return ErrorTypes.SERVER;
      default:
        return ErrorTypes.API;
    }
  }

  // Client-side errors
  if (error instanceof TypeError || error instanceof ReferenceError) {
    return ErrorTypes.CLIENT;
  }

  return ErrorTypes.UNKNOWN;
};

// Get user-friendly error message
export const getUserMessage = (error) => {
  const errorType = getErrorType(error);
  const category = ErrorCategories[errorType];

  // Use specific error message if available
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Use predefined messages based on status code
  if (error.response?.status) {
    const statusMessage = ERROR_MESSAGES[error.response.status];
    if (statusMessage) return statusMessage;
  }

  // Use error message if available
  if (error.message && !error.message.includes('network') && !error.message.includes('failed')) {
    return error.message;
  }

  // Fallback to category title
  return category.title;
};

// Format error for display
export const formatError = (error) => {
  const errorType = getErrorType(error);
  const category = ErrorCategories[errorType];
  const userMessage = getUserMessage(error);

  return {
    type: errorType,
    title: category.title,
    message: userMessage,
    icon: category.icon,
    retryable: category.retryable,
    timestamp: new Date().toISOString(),
    details: process.env.NODE_ENV === 'development' ? {
      stack: error.stack,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    } : undefined
  };
};

// Log error for debugging
export const logError = (error, context = {}) => {
  const formattedError = formatError(error);
  
  console.error('=== ERROR LOG ===');
  console.error('Timestamp:', formattedError.timestamp);
  console.error('Type:', formattedError.type);
  console.error('Message:', formattedError.message);
  console.error('Context:', context);
  
  if (process.env.NODE_ENV === 'development') {
    console.error('Details:', formattedError.details);
  }
  
  console.error('================');

  return formattedError;
};

// Create error tracking event
export const trackError = (error, context = {}) => {
  const formattedError = formatError(error);
  
  // TODO: Implement error tracking service integration
  // For now, just log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('=== ERROR TRACKING ===');
    console.log('Error:', formattedError);
    console.log('Context:', context);
    console.log('====================');
  }

  return formattedError;
};

// Error boundary fallback component props
export const getErrorBoundaryProps = (error) => {
  const formattedError = formatError(error);
  
  return {
    icon: formattedError.icon,
    title: formattedError.title,
    message: formattedError.message,
    retryable: formattedError.retryable
  };
};

// Export all error handling utilities
export const errorHandling = {
  ErrorTypes,
  ErrorCategories,
  getErrorType,
  getUserMessage,
  formatError,
  logError,
  trackError,
  getErrorBoundaryProps
}; 