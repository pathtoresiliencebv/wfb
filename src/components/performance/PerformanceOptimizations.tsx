import { useEffect } from 'react';
import { WebVitalsMonitor } from './WebVitalsMonitor';

/**
 * Component that includes all performance optimizations
 * Should be placed at the root level of the app
 */
export function PerformanceOptimizations() {
  useEffect(() => {
    // Preconnect to external resources for faster loading
    const preconnectLinks = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    preconnectLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Add dns-prefetch for better mobile performance
    const dnsPrefetchLinks = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    dnsPrefetchLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <>
      {/* Show web vitals monitor in development */}
      {process.env.NODE_ENV === 'development' && <WebVitalsMonitor />}
    </>
  );
}
