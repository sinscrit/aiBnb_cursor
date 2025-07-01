/**
 * Frontend Data Caching Utilities
 * QR Code-Based Instructional System - Frontend Data Caching
 * Task 25.5: Implement Frontend Data Caching
 */

/**
 * Cache configuration and constants
 */
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 100, // Maximum number of cached items
  STORAGE_KEY: 'qr_system_cache',
  VERSION: '1.0.0'
};

/**
 * Cache strategies
 */
export const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first', // Use cache if available, otherwise fetch
  CACHE_ONLY: 'cache-only', // Only use cache, don't fetch if not found
  NETWORK_FIRST: 'network-first', // Try network first, fallback to cache
  NETWORK_ONLY: 'network-only', // Always fetch from network
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate' // Return cached data and update in background
};

/**
 * In-memory cache implementation
 */
class MemoryCache {
  constructor(maxSize = CACHE_CONFIG.MAX_CACHE_SIZE) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.accessOrder = new Map(); // Track access order for LRU
  }

  /**
   * Set item in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    const expiresAt = Date.now() + ttl;
    
    // Remove oldest item if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this._evictOldest();
    }

    const cacheItem = {
      value,
      expiresAt,
      createdAt: Date.now(),
      accessCount: 0
    };

    this.cache.set(key, cacheItem);
    this.accessOrder.set(key, Date.now());
  }

  /**
   * Get item from cache
   * @param {string} key - Cache key
   * @returns {any} Cached value or null
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.delete(key);
      return null;
    }

    // Update access tracking
    item.accessCount++;
    this.accessOrder.set(key, Date.now());

    return item.value;
  }

  /**
   * Check if key exists and is valid
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists and is valid
   */
  has(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    if (Date.now() > item.expiresAt) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete item from cache
   * @param {string} key - Cache key
   * @returns {boolean} True if item was deleted
   */
  delete(key) {
    this.accessOrder.delete(key);
    return this.cache.delete(key);
  }

  /**
   * Clear all items from cache
   */
  clear() {
    this.cache.clear();
    this.accessOrder.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  stats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now <= item.expiresAt) {
        validItems++;
      } else {
        expiredItems++;
      }
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      validItems,
      expiredItems,
      utilization: (this.cache.size / this.maxSize) * 100
    };
  }

  /**
   * Evict oldest item (LRU)
   * @private
   */
  _evictOldest() {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, time] of this.accessOrder.entries()) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  /**
   * Clean up expired items
   */
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.delete(key));
    return keysToDelete.length;
  }
}

/**
 * Browser storage cache implementation
 */
class StorageCache {
  constructor(storage = localStorage, keyPrefix = CACHE_CONFIG.STORAGE_KEY) {
    this.storage = storage;
    this.keyPrefix = keyPrefix;
  }

  /**
   * Generate storage key
   * @param {string} key - Cache key
   * @returns {string} Storage key
   */
  _getStorageKey(key) {
    return `${this.keyPrefix}:${key}`;
  }

  /**
   * Set item in storage
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    const expiresAt = Date.now() + ttl;
    const cacheItem = {
      value,
      expiresAt,
      createdAt: Date.now(),
      version: CACHE_CONFIG.VERSION
    };

    try {
      this.storage.setItem(
        this._getStorageKey(key),
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      // Handle storage quota exceeded
      console.warn('Cache storage full, cleaning up expired items');
      this.cleanup();
      try {
        this.storage.setItem(
          this._getStorageKey(key),
          JSON.stringify(cacheItem)
        );
      } catch (e) {
        console.error('Failed to cache item:', e);
      }
    }
  }

  /**
   * Get item from storage
   * @param {string} key - Cache key
   * @returns {any} Cached value or null
   */
  get(key) {
    try {
      const stored = this.storage.getItem(this._getStorageKey(key));
      
      if (!stored) {
        return null;
      }

      const item = JSON.parse(stored);

      // Check version compatibility
      if (item.version !== CACHE_CONFIG.VERSION) {
        this.delete(key);
        return null;
      }

      // Check if expired
      if (Date.now() > item.expiresAt) {
        this.delete(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Error reading from cache:', error);
      this.delete(key);
      return null;
    }
  }

  /**
   * Check if key exists and is valid
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists and is valid
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete item from storage
   * @param {string} key - Cache key
   */
  delete(key) {
    this.storage.removeItem(this._getStorageKey(key));
  }

  /**
   * Clear all cache items from storage
   */
  clear() {
    const keysToDelete = [];
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.keyPrefix)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.storage.removeItem(key));
  }

  /**
   * Clean up expired items
   */
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    for (let i = 0; i < this.storage.length; i++) {
      const storageKey = this.storage.key(i);
      
      if (!storageKey || !storageKey.startsWith(this.keyPrefix)) {
        continue;
      }

      try {
        const stored = this.storage.getItem(storageKey);
        if (!stored) continue;

        const item = JSON.parse(stored);
        
        if (now > item.expiresAt || item.version !== CACHE_CONFIG.VERSION) {
          keysToDelete.push(storageKey);
        }
      } catch (error) {
        // Invalid JSON, remove it
        keysToDelete.push(storageKey);
      }
    }

    keysToDelete.forEach(key => this.storage.removeItem(key));
    return keysToDelete.length;
  }
}

/**
 * Create cache key from URL and parameters
 * @param {string} url - Request URL
 * @param {Object} params - Request parameters
 * @returns {string} Cache key
 */
export const createCacheKey = (url, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  return sortedParams ? `${url}?${sortedParams}` : url;
};

/**
 * Default cache instances
 */
export const memoryCache = new MemoryCache();
export const sessionCache = new StorageCache(sessionStorage, `${CACHE_CONFIG.STORAGE_KEY}_session`);
export const persistentCache = new StorageCache(localStorage, `${CACHE_CONFIG.STORAGE_KEY}_persistent`);

/**
 * Cache manager with multiple storage strategies
 */
export class CacheManager {
  constructor() {
    this.memory = memoryCache;
    this.session = sessionCache;
    this.persistent = persistentCache;
  }

  /**
   * Set item with storage strategy
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {Object} options - Cache options
   */
  set(key, value, options = {}) {
    const {
      ttl = CACHE_CONFIG.DEFAULT_TTL,
      storage = 'memory',
      persistent = false
    } = options;

    if (persistent) {
      this.persistent.set(key, value, ttl);
    } else if (storage === 'session') {
      this.session.set(key, value, ttl);
    } else {
      this.memory.set(key, value, ttl);
    }
  }

  /**
   * Get item with fallback strategy
   * @param {string} key - Cache key
   * @param {Object} options - Get options
   * @returns {any} Cached value or null
   */
  get(key, options = {}) {
    const { fallback = true } = options;

    // Try memory first
    let value = this.memory.get(key);
    if (value !== null) return value;

    if (!fallback) return null;

    // Try session storage
    value = this.session.get(key);
    if (value !== null) {
      // Promote to memory cache
      this.memory.set(key, value);
      return value;
    }

    // Try persistent storage
    value = this.persistent.get(key);
    if (value !== null) {
      // Promote to memory cache
      this.memory.set(key, value);
      return value;
    }

    return null;
  }

  /**
   * Delete from all storage types
   * @param {string} key - Cache key
   */
  delete(key) {
    this.memory.delete(key);
    this.session.delete(key);
    this.persistent.delete(key);
  }

  /**
   * Clear all caches
   */
  clear() {
    this.memory.clear();
    this.session.clear();
    this.persistent.clear();
  }

  /**
   * Clean up expired items in all caches
   */
  cleanup() {
    const memoryCleanup = this.memory.cleanup();
    const sessionCleanup = this.session.cleanup();
    const persistentCleanup = this.persistent.cleanup();

    return {
      memory: memoryCleanup,
      session: sessionCleanup,
      persistent: persistentCleanup,
      total: memoryCleanup + sessionCleanup + persistentCleanup
    };
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  stats() {
    return {
      memory: this.memory.stats(),
      session: { supported: typeof sessionStorage !== 'undefined' },
      persistent: { supported: typeof localStorage !== 'undefined' }
    };
  }
}

/**
 * Default cache manager instance
 */
export const cacheManager = new CacheManager();

/**
 * Auto cleanup expired items every 5 minutes
 */
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanup();
  }, 5 * 60 * 1000);
} 