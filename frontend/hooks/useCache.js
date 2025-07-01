/**
 * useCache Hook
 * QR Code-Based Instructional System - Frontend Data Caching
 * Task 25.5: Implement Frontend Data Caching
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  cacheManager,
  createCacheKey,
  CACHE_STRATEGIES,
  CACHE_CONFIG
} from '../utils/cache';

/**
 * Custom hook for managing cached data with automatic refresh
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Function to fetch fresh data
 * @param {Object} options - Cache configuration options
 * @returns {Object} Cache state and operations
 */
export const useCachedData = (key, fetchFn, options = {}) => {
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
        const cachedData = cacheManager.get(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const freshData = await fetchFn();
      
      // Update cache and state
      cacheManager.set(key, freshData, options);
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
      cacheManager.onRefresh(key, fetchData);
    }
    return () => {
      // Cleanup refresh callback
      if (options.backgroundRefresh) {
        cacheManager.refreshCallbacks.delete(key);
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
    invalidate: () => cacheManager.delete(key)
  };
};

/**
 * Simple Cache Hook
 * Basic caching functionality for simple use cases
 */
export const useSimpleCache = (key, defaultValue = null) => {
  const [value, setValue] = useState(() => {
    return cacheManager.get(key) || defaultValue;
  });

  const set = useCallback((newValue, options = {}) => {
    setValue(newValue);
    cacheManager.set(key, newValue, options);
  }, [key]);

  const remove = useCallback(() => {
    setValue(defaultValue);
    cacheManager.delete(key);
  }, [key, defaultValue]);

  const refresh = useCallback(() => {
    const cachedValue = cacheManager.get(key);
    setValue(cachedValue || defaultValue);
    return cachedValue;
  }, [key, defaultValue]);

  return {
    value,
    set,
    remove,
    refresh
  };
};

/**
 * Advanced Cache Hook
 * Full-featured caching with strategies and invalidation
 */
export const useCache = (options = {}) => {
  const {
    strategy = CACHE_STRATEGIES.CACHE_FIRST,
    ttl = CACHE_CONFIG.DEFAULT_TTL,
    storage = 'memory',
    persistent = false,
    onCacheHit = () => {},
    onCacheMiss = () => {},
    onError = () => {}
  } = options;

  const [cache, setCache] = useState(new Map());
  const refreshTimeouts = useRef(new Map());

  /**
   * Get value from cache
   */
  const get = useCallback((key, fetchFn = null) => {
    try {
      // Try cache first
      const cachedValue = cacheManager.get(key);
      
      if (cachedValue !== null) {
        onCacheHit(key, cachedValue);
        
        // For stale-while-revalidate, trigger background refresh
        if (strategy === CACHE_STRATEGIES.STALE_WHILE_REVALIDATE && fetchFn) {
          setTimeout(() => {
            fetchFn().then(freshValue => {
              set(key, freshValue);
            }).catch(error => {
              onError(error, key);
            });
          }, 0);
        }
        
        return cachedValue;
      }

      onCacheMiss(key);

      // Handle cache miss based on strategy
      switch (strategy) {
        case CACHE_STRATEGIES.CACHE_ONLY:
          return null;
        
        case CACHE_STRATEGIES.NETWORK_FIRST:
        case CACHE_STRATEGIES.NETWORK_ONLY:
          if (fetchFn) {
            return fetchFn().then(value => {
              if (strategy !== CACHE_STRATEGIES.NETWORK_ONLY) {
                set(key, value);
              }
              return value;
            });
          }
          break;
        
        default: // CACHE_FIRST
          if (fetchFn) {
            return fetchFn().then(value => {
              set(key, value);
              return value;
            });
          }
      }

      return null;
    } catch (error) {
      onError(error, key);
      return null;
    }
  }, [strategy, onCacheHit, onCacheMiss, onError]);

  /**
   * Set value in cache
   */
  const set = useCallback((key, value, customOptions = {}) => {
    const cacheOptions = {
      ttl,
      storage,
      persistent,
      ...customOptions
    };

    cacheManager.set(key, value, cacheOptions);
    
    // Update local state
    setCache(prev => new Map(prev).set(key, value));
  }, [ttl, storage, persistent]);

  /**
   * Remove value from cache
   */
  const remove = useCallback((key) => {
    cacheManager.delete(key);
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  /**
   * Clear all cache
   */
  const clear = useCallback(() => {
    cacheManager.clear();
    setCache(new Map());
  }, []);

  /**
   * Invalidate cache keys by pattern
   */
  const invalidate = useCallback((pattern) => {
    if (typeof pattern === 'string') {
      // Exact match
      remove(pattern);
    } else if (pattern instanceof RegExp) {
      // Regex pattern
      const stats = cacheManager.stats();
      if (stats.memory && stats.memory.size > 0) {
        // For in-memory cache, we can iterate over keys
        // Note: This is a simplified implementation
        // In a real app, you'd want a more efficient approach
        cacheManager.memory.cache.forEach((_, key) => {
          if (pattern.test(key)) {
            remove(key);
          }
        });
      }
    } else if (typeof pattern === 'function') {
      // Function predicate
      cacheManager.memory.cache.forEach((_, key) => {
        if (pattern(key)) {
          remove(key);
        }
      });
    }
  }, [remove]);

  /**
   * Get cache statistics
   */
  const getStats = useCallback(() => {
    return cacheManager.stats();
  }, []);

  return {
    get,
    set,
    remove,
    clear,
    invalidate,
    getStats
  };
};

/**
 * API Cache Hook
 * Specialized caching for API requests
 */
export const useApiCache = (options = {}) => {
  const {
    baseURL = '',
    defaultParams = {},
    ...cacheOptions
  } = options;

  const cache = useCache(cacheOptions);

  /**
   * Cache API request
   */
  const cacheRequest = useCallback(async (url, params = {}, requestOptions = {}) => {
    const fullURL = baseURL + url;
    const allParams = { ...defaultParams, ...params };
    const cacheKey = createCacheKey(fullURL, allParams);

    const fetchFn = async () => {
      const response = await fetch(fullURL, {
        ...requestOptions,
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    };

    return cache.get(cacheKey, fetchFn);
  }, [baseURL, defaultParams, cache]);

  /**
   * Invalidate API cache by URL pattern
   */
  const invalidateAPI = useCallback((urlPattern) => {
    const pattern = new RegExp(`${baseURL}${urlPattern}`);
    cache.invalidate(pattern);
  }, [baseURL, cache]);

  return {
    ...cache,
    request: cacheRequest,
    invalidateAPI
  };
};

/**
 * Query Cache Hook
 * React Query-like caching with automatic refetching
 */
export const useQuery = (key, fetchFn, options = {}) => {
  const {
    enabled = true,
    refetchInterval = null,
    refetchOnWindowFocus = false,
    staleTime = CACHE_CONFIG.DEFAULT_TTL,
    ...cacheOptions
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const cache = useCache(cacheOptions);
  const refetchIntervalRef = useRef(null);

  /**
   * Execute query
   */
  const executeQuery = useCallback(async (force = false) => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      // Check cache first unless forced
      if (!force) {
        const cachedData = cache.get(key);
        if (cachedData !== null) {
          setData(cachedData);
          setLoading(false);
          return cachedData;
        }
      }

      // Fetch fresh data
      const result = await fetchFn();
      
      // Cache the result
      cache.set(key, result, { ttl: staleTime });
      
      setData(result);
      setLastFetch(Date.now());
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, enabled, cache, staleTime]);

  /**
   * Refetch data
   */
  const refetch = useCallback(() => {
    return executeQuery(true);
  }, [executeQuery]);

  /**
   * Invalidate and refetch
   */
  const invalidateAndRefetch = useCallback(() => {
    cache.remove(key);
    return refetch();
  }, [cache, key, refetch]);

  // Initial fetch
  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  // Set up refetch interval
  useEffect(() => {
    if (refetchInterval && enabled) {
      refetchIntervalRef.current = setInterval(() => {
        executeQuery(true);
      }, refetchInterval);
    }

    return () => {
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current);
      }
    };
  }, [refetchInterval, enabled, executeQuery]);

  // Handle window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      executeQuery(true);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, executeQuery]);

  const isStale = lastFetch && (Date.now() - lastFetch > staleTime);

  return {
    data,
    loading,
    error,
    refetch,
    invalidateAndRefetch,
    isStale
  };
};

/**
 * Mutation Cache Hook
 * Handle cache updates for mutations
 */
export const useMutation = (mutationFn, options = {}) => {
  const {
    onSuccess = () => {},
    onError = () => {},
    invalidateKeys = [],
    updateKeys = {},
    ...cacheOptions
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const cache = useCache(cacheOptions);

  /**
   * Execute mutation
   */
  const mutate = useCallback(async (variables) => {
    try {
      setLoading(true);
      setError(null);

      const result = await mutationFn(variables);
      setData(result);

      // Invalidate specified cache keys
      invalidateKeys.forEach(key => {
        if (typeof key === 'function') {
          cache.invalidate(key);
        } else {
          cache.remove(key);
        }
      });

      // Update specified cache keys
      Object.entries(updateKeys).forEach(([key, updateFn]) => {
        const cachedData = cache.get(key);
        if (cachedData !== null) {
          const updatedData = updateFn(cachedData, result, variables);
          cache.set(key, updatedData);
        }
      });

      onSuccess(result, variables);
      return result;
    } catch (err) {
      setError(err);
      onError(err, variables);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, cache, invalidateKeys, updateKeys, onSuccess, onError]);

  /**
   * Reset mutation state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    mutate,
    data,
    loading,
    error,
    reset
  };
};

export default useCache; 