import { useEffect, useCallback, useMemo } from 'react';
import { useCache } from './useCache';
import { useRateLimit } from './useRateLimit';

// Production optimization settings
const PRODUCTION_CONFIG = {
  enableServiceWorker: true,
  enableImageOptimization: true,
  enableLazyLoading: true,
  enablePreloading: true,
  enableCompression: true,
  cacheStrategy: 'stale-while-revalidate' as const,
  maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours
};

export function useProductionOptimizations() {
  const cache = useCache('app-settings', { ttl: PRODUCTION_CONFIG.maxCacheAge });

  // Service Worker registration
  useEffect(() => {
    if (!PRODUCTION_CONFIG.enableServiceWorker || !('serviceWorker' in navigator)) {
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                if (confirm('Een nieuwe versie is beschikbaar. Wil je de pagina verversen?')) {
                  window.location.reload();
                }
              }
            });
          }
        });

        console.log('Service Worker registered successfully');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    };

    registerSW();
  }, []);

  // Image optimization
  const optimizeImage = useCallback((src: string, width?: number, height?: number) => {
    if (!PRODUCTION_CONFIG.enableImageOptimization) {
      return src;
    }

    // Add optimization parameters if supported
    if (src.includes('supabase') || src.includes('unsplash')) {
      const url = new URL(src);
      if (width) url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());
      url.searchParams.set('q', '80'); // Quality
      url.searchParams.set('fm', 'webp'); // Format
      return url.toString();
    }

    return src;
  }, []);

  // Preload critical resources
  const preloadResource = useCallback((href: string, as: string, type?: string) => {
    if (!PRODUCTION_CONFIG.enablePreloading) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    
    // Add to document head
    document.head.appendChild(link);

    // Clean up after loading
    link.onload = () => {
      setTimeout(() => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      }, 1000);
    };
  }, []);

  // Prefetch next page resources
  const prefetchPage = useCallback((url: string) => {
    if (!PRODUCTION_CONFIG.enablePreloading) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }, []);

  // Critical CSS loading
  const loadCriticalCSS = useCallback((css: string) => {
    const style = document.createElement('style');
    style.textContent = css;
    style.setAttribute('data-critical', 'true');
    document.head.appendChild(style);
  }, []);

  // Bundle splitting and lazy loading
  const lazyLoadComponent = useCallback((importFn: () => Promise<any>) => {
    if (!PRODUCTION_CONFIG.enableLazyLoading) {
      return importFn;
    }

    return () => {
      // Add loading delay for better UX
      return new Promise(resolve => {
        setTimeout(() => {
          importFn().then(resolve);
        }, 100);
      });
    };
  }, []);

  // Resource hints
  const addResourceHints = useCallback(() => {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://api.supabase.co' },
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.rel === 'preconnect') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }, []);

  // Performance monitoring
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    
    // Store metrics for analysis
    const metrics = (cache.data as Record<string, any>) || {};
    metrics[name] = {
      duration: end - start,
      timestamp: Date.now(),
    };
    cache.set(metrics);
  }, [cache]);

  // Memory management
  const cleanupMemory = useCallback(() => {
    // Remove unused cached data
    cache.refresh();
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    // Clear old performance entries
    if (performance.clearMeasures) {
      performance.clearMeasures();
    }
    
    if (performance.clearMarks) {
      performance.clearMarks();
    }
  }, [cache]);

  // Error boundary integration
  const reportError = useCallback((error: Error, errorInfo?: any) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorInfo,
    };

    // Store error for later reporting
    const errors = (cache.data as any[]) || [];
    errors.push(errorData);
    cache.set(errors.slice(-10)); // Keep last 10 errors

    console.error('Production Error:', errorData);
  }, [cache]);

  // Initialize optimizations
  useEffect(() => {
    addResourceHints();
    
    // Cleanup on page unload
    const handleBeforeUnload = () => {
      cleanupMemory();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [addResourceHints, cleanupMemory]);

  // Memoized configuration
  const config = useMemo(() => PRODUCTION_CONFIG, []);

  return {
    config,
    optimizeImage,
    preloadResource,
    prefetchPage,
    loadCriticalCSS,
    lazyLoadComponent,
    measurePerformance,
    cleanupMemory,
    reportError,
  };
}

// Critical CSS for above-the-fold content
export const CRITICAL_CSS = `
  /* Critical styles for first paint */
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  /* Critical layout styles */
  .header { height: 64px; }
  .sidebar { width: 240px; }
  .main-content { min-height: calc(100vh - 64px); }
`;

// Production-ready font loading
export const loadOptimizedFonts = () => {
  const fontDisplay = 'swap'; // Use font-display: swap for better performance
  
  const preloadFont = (href: string, type = 'font/woff2') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = type;
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  };

  // Preload critical fonts
  preloadFont('/fonts/inter-regular.woff2');
  preloadFont('/fonts/inter-medium.woff2');
  preloadFont('/fonts/inter-semibold.woff2');
};