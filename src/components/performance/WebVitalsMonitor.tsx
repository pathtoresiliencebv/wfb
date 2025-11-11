import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WebVitals {
  LCP: number;
  FID: number;
  CLS: number;
  TTFB: number;
}

export function WebVitalsMonitor() {
  const [vitals, setVitals] = useState<WebVitals>({
    LCP: 0,
    FID: 0,
    CLS: 0,
    TTFB: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
      return;
    }

    // Toggle visibility with keyboard shortcut (Ctrl/Cmd + Shift + P)
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setVitals(prev => ({ ...prev, LCP: lastEntry.startTime }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          setVitals(prev => ({ ...prev, FID: fid }));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        setVitals(prev => ({ ...prev, CLS: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const ttfb = navigationEntries[0].responseStart - navigationEntries[0].requestStart;
        setVitals(prev => ({ ...prev, TTFB: ttfb }));
      }

      return () => {
        window.removeEventListener('keydown', handleKeyPress);
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getVitalStatus = (metric: keyof WebVitals, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-success';
      case 'needs-improvement': return 'bg-warning';
      case 'poor': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 p-3 bg-background/95 backdrop-blur-sm border shadow-lg z-50 w-64">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Web Vitals</h3>
          <Badge variant="outline" className="text-xs">Dev</Badge>
        </div>
        
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">LCP:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{vitals.LCP.toFixed(0)}ms</span>
              <div className={cn("w-2 h-2 rounded-full", getStatusColor(getVitalStatus('LCP', vitals.LCP)))} />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">FID:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{vitals.FID.toFixed(0)}ms</span>
              <div className={cn("w-2 h-2 rounded-full", getStatusColor(getVitalStatus('FID', vitals.FID)))} />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">CLS:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{vitals.CLS.toFixed(3)}</span>
              <div className={cn("w-2 h-2 rounded-full", getStatusColor(getVitalStatus('CLS', vitals.CLS)))} />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">TTFB:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono">{vitals.TTFB.toFixed(0)}ms</span>
              <div className={cn("w-2 h-2 rounded-full", getStatusColor(getVitalStatus('TTFB', vitals.TTFB)))} />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t text-xs text-muted-foreground">
          Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Shift+P</kbd> to toggle
        </div>
      </div>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
