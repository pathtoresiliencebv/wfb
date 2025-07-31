import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  persistToLocalStorage?: boolean;
  keyPrefix?: string;
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
  private readonly maxSize = 100;
  private readonly keyPrefix = 'wietforum_cache_';

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      // Try loading from localStorage
      const stored = this.getFromStorage(key);
      if (stored) {
        this.cache.set(key, stored);
        return stored.data as T;
      }
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.delete(key);
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T, config: CacheConfig = {}): void {
    const ttl = config.ttl || this.defaultTTL;
    const now = Date.now();
    
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };

    // Manage cache size
    if (this.cache.size >= (config.maxSize || this.maxSize)) {
      this.evictOldest();
    }

    this.cache.set(key, item);

    // Persist to localStorage if enabled
    if (config.persistToLocalStorage !== false) {
      this.saveToStorage(key, item);
    }
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    
    // Remove from localStorage
    try {
      localStorage.removeItem(this.keyPrefix + key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
    
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    
    // Clear localStorage items
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.keyPrefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  private getFromStorage<T>(key: string): CacheItem<T> | null {
    try {
      const stored = localStorage.getItem(this.keyPrefix + key);
      if (!stored) return null;

      const item: CacheItem<T> = JSON.parse(stored);
      
      // Check if expired
      if (Date.now() > item.expiresAt) {
        localStorage.removeItem(this.keyPrefix + key);
        return null;
      }

      return item;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return null;
    }
  }

  private saveToStorage<T>(key: string, item: CacheItem<T>): void {
    try {
      localStorage.setItem(this.keyPrefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  // Cleanup expired items
  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.delete(key));
  }
}

// Global cache instance
const globalCache = new CacheManager();

// Cleanup expired items periodically
setInterval(() => {
  globalCache.cleanup();
}, 60000); // Every minute

export function useCache<T>(key: string, config: CacheConfig = {}) {
  const [data, setData] = useState<T | null>(() => globalCache.get<T>(key));
  const [isLoading, setIsLoading] = useState(false);

  const set = useCallback((newData: T) => {
    globalCache.set(key, newData, config);
    setData(newData);
  }, [key, config]);

  const get = useCallback((): T | null => {
    const cachedData = globalCache.get<T>(key);
    setData(cachedData);
    return cachedData;
  }, [key]);

  const remove = useCallback(() => {
    globalCache.delete(key);
    setData(null);
  }, [key]);

  const refresh = useCallback(() => {
    remove();
    return get();
  }, [get, remove]);

  // Async fetch with caching
  const fetchWithCache = useCallback(async <K,>(
    fetcher: () => Promise<K>,
    options: { forceRefresh?: boolean } = {}
  ): Promise<K> => {
    const cacheKey = key;
    
    // Return cached data if available and not forcing refresh
    if (!options.forceRefresh) {
      const cached = globalCache.get<K>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    setIsLoading(true);
    try {
      const result = await fetcher();
      globalCache.set(cacheKey, result, config);
      setData(result as any);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [key, config]);

  return {
    data,
    isLoading,
    set,
    get,
    remove,
    refresh,
    fetchWithCache,
    has: globalCache.has(key),
  };
}

// Hook for caching query results
export function useCachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  config: CacheConfig & { enabled?: boolean } = {}
) {
  const { enabled = true, ...cacheConfig } = config;
  const cache = useCache<T>(key, cacheConfig);
  const [error, setError] = useState<Error | null>(null);

  const executeQuery = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    try {
      setError(null);
      const result = await cache.fetchWithCache(queryFn, { forceRefresh });
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Query failed');
      setError(error);
      throw error;
    }
  }, [enabled, cache, queryFn]);

  // Execute query on mount if cache is empty
  useEffect(() => {
    if (enabled && !cache.has) {
      executeQuery();
    }
  }, [enabled, cache.has, executeQuery]);

  return {
    data: cache.data,
    isLoading: cache.isLoading,
    error,
    refetch: () => executeQuery(true),
    fetchIfEmpty: () => executeQuery(false),
  };
}

// Export the global cache for direct access
export { globalCache };