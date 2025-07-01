import { useState, useEffect, useCallback } from 'react';
import { cache } from '../utils/cache';

/**
 * Custom hook for managing cached data with automatic refresh
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to fetch fresh data
 * @param {Object} options - Cache configuration options
 * @returns {Object} Cache state and operations
 */
export const useCache = (key, fetchFn, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data and update cache
  const fetchData = useCallback(async (force = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first unless force refresh
      if (!force) {
        const cachedData = cache.store.get(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const freshData = await fetchFn();
      
      // Update cache and state
      cache.store.set(key, freshData, options);
      setData(freshData);

    } catch (err) {
      setError(err);
      console.error('Cache fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, options]);

  // Register cache refresh callback
  useEffect(() => {
    if (options.backgroundRefresh) {
      cache.store.onRefresh(key, fetchData);
    }
    return () => {
      // Cleanup refresh callback
      if (options.backgroundRefresh) {
        cache.store.refreshCallbacks.delete(key);
      }
    };
  }, [key, fetchData, options.backgroundRefresh]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: () => fetchData(true),
    invalidate: () => cache.store.delete(key)
  };
}; 