/**
 * Cache Utilities
 * QR Code-Based Instructional System - Data Caching
 */

// Cache configuration
const DEFAULT_CACHE_CONFIG = {
  maxAge: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: true,
  backgroundRefresh: true,
  persistToStorage: false
};

// Cache entry structure
class CacheEntry {
  constructor(key, value, config = {}) {
    this.key = key;
    this.value = value;
    this.timestamp = Date.now();
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
  }

  isStale() {
    return Date.now() - this.timestamp > this.config.maxAge;
  }

  isValid() {
    return !this.isStale() || this.config.staleWhileRevalidate;
  }

  serialize() {
    return {
      key: this.key,
      value: this.value,
      timestamp: this.timestamp,
      config: this.config
    };
  }

  static deserialize(data) {
    const entry = new CacheEntry(data.key, data.value, data.config);
    entry.timestamp = data.timestamp;
    return entry;
  }
}

// In-memory cache store
class CacheStore {
  constructor() {
    this.cache = new Map();
    this.refreshCallbacks = new Map();
    
    // Load persisted cache on initialization
    this.loadFromStorage();
  }

  // Get cache entry
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry is stale
    if (entry.isStale()) {
      // If stale but can serve stale data, trigger background refresh
      if (entry.config.staleWhileRevalidate) {
        this.triggerBackgroundRefresh(key);
      } else {
        // If can't serve stale data, remove entry
        this.delete(key);
        return null;
      }
    }

    return entry.isValid() ? entry.value : null;
  }

  // Set cache entry
  set(key, value, config = {}) {
    const entry = new CacheEntry(key, value, config);
    this.cache.set(key, entry);

    // Persist to storage if configured
    if (entry.config.persistToStorage) {
      this.saveToStorage();
    }

    return entry;
  }

  // Delete cache entry
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  // Clear all cache entries
  clear() {
    this.cache.clear();
    this.refreshCallbacks.clear();
    this.clearStorage();
  }

  // Register refresh callback
  onRefresh(key, callback) {
    if (!this.refreshCallbacks.has(key)) {
      this.refreshCallbacks.set(key, new Set());
    }
    this.refreshCallbacks.get(key).add(callback);
  }

  // Trigger background refresh
  triggerBackgroundRefresh(key) {
    if (!this.refreshCallbacks.has(key)) return;

    const callbacks = this.refreshCallbacks.get(key);
    callbacks.forEach(callback => {
      if (typeof callback === 'function') {
        // Execute callback in background
        setTimeout(() => {
          try {
            callback();
          } catch (error) {
            console.error('Cache refresh error:', error);
          }
        }, 0);
      }
    });
  }

  // Save cache to local storage
  saveToStorage() {
    if (typeof window === 'undefined') return;

    const persistentData = {};
    this.cache.forEach((entry, key) => {
      if (entry.config.persistToStorage) {
        persistentData[key] = entry.serialize();
      }
    });

    try {
      localStorage.setItem('app_cache', JSON.stringify(persistentData));
    } catch (error) {
      console.error('Failed to save cache to storage:', error);
    }
  }

  // Load cache from local storage
  loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem('app_cache');
      if (data) {
        const persistentData = JSON.parse(data);
        Object.entries(persistentData).forEach(([key, value]) => {
          const entry = CacheEntry.deserialize(value);
          if (entry.isValid()) {
            this.cache.set(key, entry);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
    }
  }

  // Clear storage
  clearStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('app_cache');
    } catch (error) {
      console.error('Failed to clear cache storage:', error);
    }
  }
}

// Create singleton cache instance
export const cacheStore = new CacheStore();

// Cache key generator
export const generateCacheKey = (prefix, params = {}) => {
  const sortedParams = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  return `${prefix}:${JSON.stringify(sortedParams)}`;
};

// Export cache utilities
export const cache = {
  store: cacheStore,
  generateKey: generateCacheKey,
  defaultConfig: DEFAULT_CACHE_CONFIG
}; 