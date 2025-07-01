/**
 * Loading Hook
 * QR Code-Based Instructional System - Loading State Management
 */

import { useCallback } from 'react';
import { useLoading as useLoadingState } from '../utils/loadingState';

// Loading hook with enhanced functionality
export const useLoading = (options = {}) => {
  const {
    type,
    message,
    onSuccess,
    onError,
    onTimeout,
    ...loadingOptions
  } = options;

  // Get base loading state
  const {
    loading,
    error,
    startLoading,
    stopLoading,
    handleError,
    withLoading
  } = useLoadingState({
    onError: (error) => {
      if (onError) onError(error);
    },
    onTimeout: () => {
      if (onTimeout) onTimeout();
    },
    ...loadingOptions
  });

  // Enhanced async function wrapper with success callback
  const withLoadingAndCallback = useCallback(async (fn) => {
    try {
      const result = await withLoading(fn);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      // Error already handled by withLoading
      throw error;
    }
  }, [withLoading, onSuccess]);

  // Loading state with metadata
  const loadingState = {
    loading,
    error,
    type,
    message
  };

  return {
    loading,
    error,
    loadingState,
    startLoading,
    stopLoading,
    handleError,
    withLoading: withLoadingAndCallback
  };
};

export default useLoading; 