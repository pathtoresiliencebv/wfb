import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export function usePerformanceMonitor() {
  const measurePerformance = useCallback((): Promise<PerformanceMetrics> => {
    return new Promise((resolve) => {
      const metrics: Partial<PerformanceMetrics> = {};

      // Load Time
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      }

      // First Contentful Paint
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcp) {
        metrics.firstContentfulPaint = fcp.startTime;
      }

      // Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          metrics.largestContentfulPaint = lastEntry.startTime;
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cumulativeLayoutShift = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Resolve after a short delay to collect metrics
      setTimeout(() => {
        resolve(metrics as PerformanceMetrics);
        observer.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
      }, 3000);
    });
  }, []);

  const logPerformance = useCallback(async () => {
    try {
      const metrics = await measurePerformance();
      
      console.group('🚀 Performance Metrics');
      console.log('Load Time:', `${metrics.loadTime?.toFixed(2)}ms`);
      console.log('First Contentful Paint:', `${metrics.firstContentfulPaint?.toFixed(2)}ms`);
      console.log('Largest Contentful Paint:', `${metrics.largestContentfulPaint?.toFixed(2)}ms`);
      console.log('Cumulative Layout Shift:', metrics.cumulativeLayoutShift?.toFixed(4));
      console.log('First Input Delay:', `${metrics.firstInputDelay?.toFixed(2)}ms`);
      console.groupEnd();

      // Send to analytics if needed
      if (process.env.NODE_ENV === 'production') {
        // Send metrics to your analytics service
        console.log('Metrics sent to analytics:', metrics);
      }
    } catch (error) {
      console.error('Performance monitoring error:', error);
    }
  }, [measurePerformance]);

  useEffect(() => {
    // Measure performance on component mount
    if (typeof window !== 'undefined') {
      logPerformance();
    }
  }, [logPerformance]);

  return {
    measurePerformance,
    logPerformance
  };
}