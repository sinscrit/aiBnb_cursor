/**
 * useLoading Hook
 * QR Code-Based Instructional System - Frontend Loading States
 * Task 25.4: Implement Frontend Loading State Management
 */

import React, { useState, useCallback, useRef, useReducer } from 'react';
import {
  loadingReducer,
  createInitialState,
  isLoading,
  isSuccess,
  hasError,
  getError,
  getMessage,
  getLoadingDuration,
  createLoadingTimeout,
  clearLoadingTimeout,
  LOADING_OPERATIONS,
  LOADING_TIMEOUTS
} from '../utils/loadingState';

/**
 * Simple Loading Hook
 * Basic loading state management for simple use cases
 */
export const useSimpleLoading = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setLoadingError = useCallback((error) => {
    setError(error);
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setError: setLoadingError,
    reset
  };
};

/**
 * Advanced Loading Hook
 * Full-featured loading state management with timeout and operation tracking
 */
export const useLoading = (options = {}) => {
  const {
    timeout = LOADING_TIMEOUTS.DEFAULT,
    onTimeout = () => {},
    onError = () => {},
    onSuccess = () => {},
    autoReset = true,
    resetDelay = 3000
  } = options;

  // Loading state with operations
  const [state, dispatch] = useReducer(loadingReducer, {});
  
  // Timeout management
  const timeoutRefs = useRef(new Map());
  const resetTimeoutRefs = useRef(new Map());

  /**
   * Start loading for an operation
   */
  const startLoading = useCallback((operation, message) => {
    // Clear existing timeout for this operation
    const existingTimeout = timeoutRefs.current.get(operation);
    if (existingTimeout) {
      clearLoadingTimeout(existingTimeout);
    }

    // Dispatch start loading action
    dispatch({
      type: 'START_LOADING',
      operation,
      message
    });

    // Set timeout for this operation
    const timeoutId = createLoadingTimeout(() => {
      dispatch({
        type: 'SET_ERROR',
        operation,
        message: 'Operation timed out',
        error: 'timeout'
      });
      onTimeout(operation);
    }, timeout);

    timeoutRefs.current.set(operation, timeoutId);
  }, [timeout, onTimeout]);

  /**
   * Set success for an operation
   */
  const setSuccess = useCallback((operation, message) => {
    // Clear timeout
    const timeoutId = timeoutRefs.current.get(operation);
    if (timeoutId) {
      clearLoadingTimeout(timeoutId);
      timeoutRefs.current.delete(operation);
    }

    // Dispatch success action
    dispatch({
      type: 'SET_SUCCESS',
      operation,
      message
    });

    onSuccess(operation);

    // Auto reset if enabled
    if (autoReset) {
      const resetTimeoutId = setTimeout(() => {
        dispatch({ type: 'RESET_LOADING', operation });
      }, resetDelay);
      resetTimeoutRefs.current.set(operation, resetTimeoutId);
    }
  }, [onSuccess, autoReset, resetDelay]);

  /**
   * Set error for an operation
   */
  const setError = useCallback((operation, error, message) => {
    // Clear timeout
    const timeoutId = timeoutRefs.current.get(operation);
    if (timeoutId) {
      clearLoadingTimeout(timeoutId);
      timeoutRefs.current.delete(operation);
    }

    // Dispatch error action
    dispatch({
      type: 'SET_ERROR',
      operation,
      error,
      message
    });

    onError(operation, error);

    // Auto reset if enabled
    if (autoReset) {
      const resetTimeoutId = setTimeout(() => {
        dispatch({ type: 'RESET_LOADING', operation });
      }, resetDelay);
      resetTimeoutRefs.current.set(operation, resetTimeoutId);
    }
  }, [onError, autoReset, resetDelay]);

  /**
   * Reset loading state for an operation
   */
  const reset = useCallback((operation) => {
    // Clear all timeouts for this operation
    const timeoutId = timeoutRefs.current.get(operation);
    if (timeoutId) {
      clearLoadingTimeout(timeoutId);
      timeoutRefs.current.delete(operation);
    }

    const resetTimeoutId = resetTimeoutRefs.current.get(operation);
    if (resetTimeoutId) {
      clearTimeout(resetTimeoutId);
      resetTimeoutRefs.current.delete(resetTimeoutId);
    }

    dispatch({ type: 'RESET_LOADING', operation });
  }, []);

  /**
   * Reset all loading states
   */
  const resetAll = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(timeoutId => clearLoadingTimeout(timeoutId));
    resetTimeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutRefs.current.clear();
    resetTimeoutRefs.current.clear();

    // Reset all operations
    Object.keys(state).forEach(operation => {
      dispatch({ type: 'RESET_LOADING', operation });
    });
  }, [state]);

  /**
   * Wrap async function with loading state
   */
  const withLoading = useCallback(async (operation, asyncFn, message) => {
    try {
      startLoading(operation, message);
      const result = await asyncFn();
      setSuccess(operation, 'Operation completed successfully');
      return result;
    } catch (error) {
      setError(operation, error, error.message || 'Operation failed');
      throw error;
    }
  }, [startLoading, setSuccess, setError]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeoutId => clearLoadingTimeout(timeoutId));
      resetTimeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, []);

  // Helper functions for checking state
  const getLoadingState = useCallback((operation) => ({
    loading: isLoading(state, operation),
    success: isSuccess(state, operation),
    error: hasError(state, operation),
    message: getMessage(state, operation),
    errorMessage: getError(state, operation),
    duration: state[operation] ? getLoadingDuration(state[operation]) : null
  }), [state]);

  return {
    state,
    startLoading,
    setSuccess,
    setError,
    reset,
    resetAll,
    withLoading,
    getLoadingState,
    // Convenience methods for checking state
    isLoading: (operation) => isLoading(state, operation),
    isSuccess: (operation) => isSuccess(state, operation),
    hasError: (operation) => hasError(state, operation),
    getError: (operation) => getError(state, operation),
    getMessage: (operation) => getMessage(state, operation)
  };
};

/**
 * Multi-Operation Loading Hook
 * Manages loading states for multiple operations simultaneously
 */
export const useMultiLoading = (operations = [], options = {}) => {
  const loading = useLoading(options);
  
  // Initialize states for all operations
  React.useEffect(() => {
    operations.forEach(operation => {
      if (!loading.state[operation]) {
        loading.reset(operation);
      }
    });
  }, [operations, loading]);

  /**
   * Check if any operation is loading
   */
  const isAnyLoading = useCallback(() => {
    return operations.some(operation => loading.isLoading(operation));
  }, [operations, loading]);

  /**
   * Check if all operations are successful
   */
  const areAllSuccess = useCallback(() => {
    return operations.every(operation => loading.isSuccess(operation));
  }, [operations, loading]);

  /**
   * Check if any operation has error
   */
  const hasAnyError = useCallback(() => {
    return operations.some(operation => loading.hasError(operation));
  }, [operations, loading]);

  /**
   * Get summary of all operations
   */
  const getSummary = useCallback(() => {
    const summary = {
      total: operations.length,
      loading: 0,
      success: 0,
      error: 0,
      operations: {}
    };

    operations.forEach(operation => {
      const state = loading.getLoadingState(operation);
      summary.operations[operation] = state;
      
      if (state.loading) summary.loading++;
      else if (state.success) summary.success++;
      else if (state.error) summary.error++;
    });

    return summary;
  }, [operations, loading]);

  return {
    ...loading,
    operations,
    isAnyLoading,
    areAllSuccess,
    hasAnyError,
    getSummary
  };
};

/**
 * Async Action Hook
 * Wraps async actions with loading state management
 */
export const useAsyncAction = (asyncFn, options = {}) => {
  const { operation = 'asyncAction', ...loadingOptions } = options;
  const loading = useLoading(loadingOptions);

  const execute = useCallback(async (...args) => {
    return loading.withLoading(operation, () => asyncFn(...args));
  }, [asyncFn, operation, loading]);

  return {
    execute,
    ...loading.getLoadingState(operation),
    reset: () => loading.reset(operation)
  };
};

export default useLoading; 