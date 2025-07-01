/**
 * Cache Service
 * QR Code-Based Instructional System - Frontend Data Caching
 * Task 25.5: Implement Frontend Data Caching
 */

import {
  cacheManager,
  createCacheKey,
  CACHE_STRATEGIES,
  CACHE_CONFIG
} from '../utils/cache';

/**
 * API-specific cache configuration
 */
const API_CACHE_CONFIG = {
  PROPERTIES: {
    ttl: 10 * 60 * 1000, // 10 minutes
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    persistent: true
  },
  ITEMS: {
    ttl: 5 * 60 * 1000, // 5 minutes
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    persistent: false
  },
  QR_CODES: {
    ttl: 15 * 60 * 1000, // 15 minutes
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    persistent: true
  },
  CONTENT: {
    ttl: 30 * 60 * 1000, // 30 minutes
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    persistent: true
  }
};

/**
 * Cache Service Class
 * Provides high-level caching functionality for the application
 */
class CacheService {
  constructor() {
    this.cache = cacheManager;
    this.apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  }

  /**
   * Generate cache key for API requests
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Request parameters
   * @param {Object} headers - Request headers
   * @returns {string} Cache key
   */
  generateAPIKey(endpoint, params = {}, headers = {}) {
    const url = `${this.apiBaseURL}${endpoint}`;
    const keyData = {
      ...params,
      // Include relevant headers that affect response
      userId: headers['X-Demo-User-ID'] || headers['X-User-ID'],
      contentType: headers['Content-Type']
    };
    return createCacheKey(url, keyData);
  }

  /**
   * Cache API response
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Response data to cache
   * @param {Object} options - Cache options
   * @returns {void}
   */
  cacheAPIResponse(endpoint, data, options = {}) {
    const {
      params = {},
      headers = {},
      config = API_CACHE_CONFIG.PROPERTIES
    } = options;

    const key = this.generateAPIKey(endpoint, params, headers);
    this.cache.set(key, data, {
      ttl: config.ttl,
      storage: config.persistent ? 'persistent' : 'memory',
      persistent: config.persistent
    });
  }

  /**
   * Get cached API response
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {any} Cached data or null
   */
  getCachedAPIResponse(endpoint, options = {}) {
    const {
      params = {},
      headers = {}
    } = options;

    const key = this.generateAPIKey(endpoint, params, headers);
    return this.cache.get(key);
  }

  /**
   * Invalidate API cache by endpoint pattern
   * @param {string} endpointPattern - Pattern to match endpoints
   * @returns {void}
   */
  invalidateAPICache(endpointPattern) {
    const pattern = new RegExp(`${this.apiBaseURL}${endpointPattern}`);
    this.cache.invalidate(pattern);
  }

  /**
   * Properties Cache Methods
   */
  cacheProperties(properties, userId = null) {
    const key = this.generateAPIKey('/api/properties', {}, { 'X-Demo-User-ID': userId });
    this.cache.set(key, properties, API_CACHE_CONFIG.PROPERTIES);
  }

  getCachedProperties(userId = null) {
    const key = this.generateAPIKey('/api/properties', {}, { 'X-Demo-User-ID': userId });
    return this.cache.get(key);
  }

  invalidateProperties(userId = null) {
    if (userId) {
      const key = this.generateAPIKey('/api/properties', {}, { 'X-Demo-User-ID': userId });
      this.cache.delete(key);
    } else {
      this.invalidateAPICache('/api/properties');
    }
  }

  cacheProperty(propertyId, property, userId = null) {
    const key = this.generateAPIKey(`/api/properties/${propertyId}`, {}, { 'X-Demo-User-ID': userId });
    this.cache.set(key, property, API_CACHE_CONFIG.PROPERTIES);
  }

  getCachedProperty(propertyId, userId = null) {
    const key = this.generateAPIKey(`/api/properties/${propertyId}`, {}, { 'X-Demo-User-ID': userId });
    return this.cache.get(key);
  }

  /**
   * Items Cache Methods
   */
  cacheItems(items, propertyId = null, userId = null) {
    const params = propertyId ? { propertyId } : {};
    const key = this.generateAPIKey('/api/items', params, { 'X-Demo-User-ID': userId });
    this.cache.set(key, items, API_CACHE_CONFIG.ITEMS);
  }

  getCachedItems(propertyId = null, userId = null) {
    const params = propertyId ? { propertyId } : {};
    const key = this.generateAPIKey('/api/items', params, { 'X-Demo-User-ID': userId });
    return this.cache.get(key);
  }

  invalidateItems(propertyId = null, userId = null) {
    if (propertyId) {
      const key = this.generateAPIKey('/api/items', { propertyId }, { 'X-Demo-User-ID': userId });
      this.cache.delete(key);
    } else {
      this.invalidateAPICache('/api/items');
    }
  }

  cacheItem(itemId, item, userId = null) {
    const key = this.generateAPIKey(`/api/items/${itemId}`, {}, { 'X-Demo-User-ID': userId });
    this.cache.set(key, item, API_CACHE_CONFIG.ITEMS);
  }

  getCachedItem(itemId, userId = null) {
    const key = this.generateAPIKey(`/api/items/${itemId}`, {}, { 'X-Demo-User-ID': userId });
    return this.cache.get(key);
  }

  /**
   * QR Codes Cache Methods
   */
  cacheQRCodes(qrCodes, itemId = null, userId = null) {
    const params = itemId ? { itemId } : {};
    const key = this.generateAPIKey('/api/qrcodes', params, { 'X-Demo-User-ID': userId });
    this.cache.set(key, qrCodes, API_CACHE_CONFIG.QR_CODES);
  }

  getCachedQRCodes(itemId = null, userId = null) {
    const params = itemId ? { itemId } : {};
    const key = this.generateAPIKey('/api/qrcodes', params, { 'X-Demo-User-ID': userId });
    return this.cache.get(key);
  }

  invalidateQRCodes(itemId = null, userId = null) {
    if (itemId) {
      const key = this.generateAPIKey('/api/qrcodes', { itemId }, { 'X-Demo-User-ID': userId });
      this.cache.delete(key);
    } else {
      this.invalidateAPICache('/api/qrcodes');
    }
  }

  cacheQRCode(qrId, qrCode, userId = null) {
    const key = this.generateAPIKey(`/api/qrcodes/${qrId}`, {}, { 'X-Demo-User-ID': userId });
    this.cache.set(key, qrCode, API_CACHE_CONFIG.QR_CODES);
  }

  getCachedQRCode(qrId, userId = null) {
    const key = this.generateAPIKey(`/api/qrcodes/${qrId}`, {}, { 'X-Demo-User-ID': userId });
    return this.cache.get(key);
  }

  /**
   * Content Cache Methods
   */
  cacheContent(qrId, content) {
    const key = this.generateAPIKey(`/api/content/${qrId}`);
    this.cache.set(key, content, API_CACHE_CONFIG.CONTENT);
  }

  getCachedContent(qrId) {
    const key = this.generateAPIKey(`/api/content/${qrId}`);
    return this.cache.get(key);
  }

  invalidateContent(qrId = null) {
    if (qrId) {
      const key = this.generateAPIKey(`/api/content/${qrId}`);
      this.cache.delete(key);
    } else {
      this.invalidateAPICache('/api/content');
    }
  }

  /**
   * Cache Invalidation Strategies
   */

  /**
   * Invalidate related caches when property is updated
   * @param {string} propertyId - Property ID
   * @param {string} userId - User ID
   */
  invalidatePropertyRelated(propertyId, userId = null) {
    // Invalidate property cache
    this.cacheProperty(propertyId, null, userId);
    this.invalidateProperties(userId);
    
    // Invalidate related items cache
    this.invalidateItems(propertyId, userId);
    
    // Invalidate QR codes for items in this property
    this.invalidateAPICache(`/api/qrcodes.*propertyId=${propertyId}`);
  }

  /**
   * Invalidate related caches when item is updated
   * @param {string} itemId - Item ID
   * @param {string} propertyId - Property ID
   * @param {string} userId - User ID
   */
  invalidateItemRelated(itemId, propertyId = null, userId = null) {
    // Invalidate item cache
    this.cacheItem(itemId, null, userId);
    
    // Invalidate items list cache
    this.invalidateItems(propertyId, userId);
    
    // Invalidate QR codes for this item
    this.invalidateQRCodes(itemId, userId);
    
    // Invalidate property cache if provided
    if (propertyId) {
      this.cacheProperty(propertyId, null, userId);
    }
  }

  /**
   * Invalidate related caches when QR code is updated
   * @param {string} qrId - QR code ID
   * @param {string} itemId - Item ID
   * @param {string} userId - User ID
   */
  invalidateQRRelated(qrId, itemId = null, userId = null) {
    // Invalidate QR code cache
    this.cacheQRCode(qrId, null, userId);
    
    // Invalidate QR codes list cache
    this.invalidateQRCodes(itemId, userId);
    
    // Invalidate content cache
    this.invalidateContent(qrId);
    
    // Invalidate item cache if provided
    if (itemId) {
      this.cacheItem(itemId, null, userId);
    }
  }

  /**
   * Cache Statistics and Management
   */

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    return this.cache.stats();
  }

  /**
   * Clean up expired cache entries
   * @returns {Object} Cleanup results
   */
  cleanup() {
    return this.cache.cleanup();
  }

  /**
   * Clear all cache
   */
  clearAll() {
    this.cache.clear();
  }

  /**
   * Preload cache with initial data
   * @param {Object} initialData - Initial data to cache
   */
  preload(initialData = {}) {
    const { properties, items, qrCodes, content } = initialData;

    if (properties) {
      this.cacheProperties(properties);
    }

    if (items) {
      this.cacheItems(items);
    }

    if (qrCodes) {
      this.cacheQRCodes(qrCodes);
    }

    if (content) {
      Object.entries(content).forEach(([qrId, contentData]) => {
        this.cacheContent(qrId, contentData);
      });
    }
  }

  /**
   * Export cache data for backup
   * @returns {Object} Cache data
   */
  export() {
    const stats = this.getStats();
    return {
      stats,
      timestamp: Date.now(),
      version: CACHE_CONFIG.VERSION
    };
  }

  /**
   * Warm up cache with common data
   * @param {Function} fetchFn - Function to fetch data
   */
  async warmup(fetchFn) {
    if (typeof fetchFn === 'function') {
      try {
        const data = await fetchFn();
        this.preload(data);
      } catch (error) {
        console.warn('Cache warmup failed:', error);
      }
    }
  }
}

/**
 * Default cache service instance
 */
export const cacheService = new CacheService();

/**
 * Export cache service class for custom instances
 */
export default CacheService; 