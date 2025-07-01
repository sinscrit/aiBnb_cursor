/**
 * Loading State Utilities
 * QR Code-Based Instructional System - Loading Management
 */

import { useState, useCallback } from 'react';

// Loading state hook with timeout and error handling
export const useLoading = (options = {}) => {
  const {
    timeout = 30000, // Default 30s timeout
    onTimeout = () => {},
    onError = () => {}
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  // Start loading with timeout
  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);

    // Set timeout to prevent infinite loading
    const id = setTimeout(() => {
      setLoading(false);
      setError(new Error('Operation timed out'));
      onTimeout();
    }, timeout);

    setTimeoutId(id);
  }, [timeout, onTimeout]);

  // Stop loading and clear timeout
  const stopLoading = useCallback(() => {
    setLoading(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  // Handle error and stop loading
  const handleError = useCallback((error) => {
    setError(error);
    setLoading(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    onError(error);
  }, [timeoutId, onError]);

  // Wrap async function with loading state
  const withLoading = useCallback(async (fn) => {
    try {
      startLoading();
      const result = await fn();
      stopLoading();
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [startLoading, stopLoading, handleError]);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    handleError,
    withLoading
  };
};

// Loading state types for different contexts
export const LoadingTypes = {
  PAGE: 'page',
  COMPONENT: 'component',
  ACTION: 'action',
  BACKGROUND: 'background'
};

// Loading state configuration by type
export const LoadingConfig = {
  [LoadingTypes.PAGE]: {
    overlay: true,
    spinner: true,
    message: true,
    timeout: 30000
  },
  [LoadingTypes.COMPONENT]: {
    overlay: false,
    spinner: true,
    message: true,
    timeout: 20000
  },
  [LoadingTypes.ACTION]: {
    overlay: false,
    spinner: true,
    message: false,
    timeout: 10000
  },
  [LoadingTypes.BACKGROUND]: {
    overlay: false,
    spinner: false,
    message: false,
    timeout: 60000
  }
};

// Loading state messages
export const LoadingMessages = {
  default: 'Loading...',
  saving: 'Saving...',
  deleting: 'Deleting...',
  uploading: 'Uploading...',
  processing: 'Processing...',
  generating: 'Generating...',
  validating: 'Validating...',
  timeout: 'Operation timed out. Please try again.',
  error: 'An error occurred. Please try again.'
};

// Export all loading state utilities
export const loadingState = {
  useLoading,
  LoadingTypes,
  LoadingConfig,
  LoadingMessages
}; 