import { cache } from '../utils/cache';
import { apiHelpers } from '../utils/api';

/**
 * Cache Service
 * Handles caching operations and integration with API client
 */

// Cache configuration by resource type
const CACHE_CONFIG = {
  properties: {
    maxAge: 5 * 60 * 1000, // 5 minutes
    staleWhileRevalidate: true,
    backgroundRefresh: true,
    persistToStorage: true
  },
  items: {
    maxAge: 5 * 60 * 1000, // 5 minutes
    staleWhileRevalidate: true,
    backgroundRefresh: true,
    persistToStorage: true
  },
  qrcodes: {
    maxAge: 15 * 60 * 1000, // 15 minutes
    staleWhileRevalidate: true,
    backgroundRefresh: false,
    persistToStorage: true
  }
};

// Cache key prefixes
const CACHE_KEYS = {
  PROPERTIES: 'properties',
  ITEMS: 'items',
  QRCODES: 'qrcodes'
};

/**
 * Create cache key for a resource
 * @param {string} type - Resource type (properties, items, qrcodes)
 * @param {Object} params - Query parameters
 * @returns {string} Cache key
 */
const createCacheKey = (type, params = {}) => {
  return cache.generateKey(type, params);
};

/**
 * Cache API response data
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 * @param {string} type - Resource type for config
 */
const cacheResponse = (key, data, type) => {
  const config = CACHE_CONFIG[type] || {};
  cache.store.set(key, data, config);
};

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {*} Cached data or null
 */
const getCachedData = (key) => {
  return cache.store.get(key);
};

/**
 * Invalidate cached data
 * @param {string} key - Cache key
 */
const invalidateCache = (key) => {
  cache.store.delete(key);
};

/**
 * Clear all cached data
 */
const clearCache = () => {
  cache.store.clear();
};

/**
 * Cache-wrapped API client methods
 */
export const cachedApiClient = {
  properties: {
    getAll: async () => {
      const key = createCacheKey(CACHE_KEYS.PROPERTIES);
      const cachedData = getCachedData(key);
      
      if (cachedData) return cachedData;

      const response = await fetch('/api/properties');
      const data = await apiHelpers.extractData(response);
      cacheResponse(key, data, 'properties');
      return data;
    },

    getById: async (id) => {
      const key = createCacheKey(CACHE_KEYS.PROPERTIES, { id });
      const cachedData = getCachedData(key);
      
      if (cachedData) return cachedData;

      const response = await fetch(`/api/properties/${id}`);
      const data = await apiHelpers.extractData(response);
      cacheResponse(key, data, 'properties');
      return data;
    }
  },

  items: {
    getAll: async (propertyId) => {
      const key = createCacheKey(CACHE_KEYS.ITEMS, { propertyId });
      const cachedData = getCachedData(key);
      
      if (cachedData) return cachedData;

      const response = await fetch(`/api/items?propertyId=${propertyId}`);
      const data = await apiHelpers.extractData(response);
      cacheResponse(key, data, 'items');
      return data;
    },

    getById: async (id) => {
      const key = createCacheKey(CACHE_KEYS.ITEMS, { id });
      const cachedData = getCachedData(key);
      
      if (cachedData) return cachedData;

      const response = await fetch(`/api/items/${id}`);
      const data = await apiHelpers.extractData(response);
      cacheResponse(key, data, 'items');
      return data;
    }
  },

  qrcodes: {
    getAll: async () => {
      const key = createCacheKey(CACHE_KEYS.QRCODES);
      const cachedData = getCachedData(key);
      
      if (cachedData) return cachedData;

      const response = await fetch('/api/qrcodes');
      const data = await apiHelpers.extractData(response);
      cacheResponse(key, data, 'qrcodes');
      return data;
    },

    getByItemId: async (itemId) => {
      const key = createCacheKey(CACHE_KEYS.QRCODES, { itemId });
      const cachedData = getCachedData(key);
      
      if (cachedData) return cachedData;

      const response = await fetch(`/api/qrcodes/${itemId}`);
      const data = await apiHelpers.extractData(response);
      cacheResponse(key, data, 'qrcodes');
      return data;
    }
  }
};

// Export cache utilities
export const cacheService = {
  createKey: createCacheKey,
  get: getCachedData,
  set: cacheResponse,
  invalidate: invalidateCache,
  clear: clearCache,
  config: CACHE_CONFIG,
  keys: CACHE_KEYS
}; 