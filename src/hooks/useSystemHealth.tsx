import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  uptime: number;
  memoryUsage: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
}

export function useSystemHealth() {
  const [startTime] = useState(Date.now());
  const [responseTime, setResponseTime] = useState(0);

  // Get active users count
  const { data: onlineUsersCount = 0 } = useQuery({
    queryKey: ['system-active-users'],
    queryFn: async () => {
      const { count } = await supabase
        .from('user_online_status')
        .select('*', { count: 'exact', head: true })
        .eq('is_online', true)
        .gte('last_seen', new Date(Date.now() - 30 * 60 * 1000).toISOString());
      
      return count || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Measure API response time
  useEffect(() => {
    const measureResponseTime = async () => {
      const start = performance.now();
      try {
        await supabase.from('profiles').select('id').limit(1).single();
        const end = performance.now();
        setResponseTime(Math.round(end - start));
      } catch (error) {
        // Error is expected if no profiles exist
        const end = performance.now();
        setResponseTime(Math.round(end - start));
      }
    };

    measureResponseTime();
    const interval = setInterval(measureResponseTime, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate uptime in hours
  const uptime = Math.floor((Date.now() - startTime) / (1000 * 60 * 60));

  // Get memory usage if available
  const memoryUsage = (performance as any).memory 
    ? Math.round(((performance as any).memory.usedJSHeapSize / (performance as any).memory.jsHeapSizeLimit) * 100)
    : 0;

  // Calculate system status
  const getStatus = (): 'healthy' | 'warning' | 'error' => {
    if (responseTime > 1000 || memoryUsage > 90) return 'error';
    if (responseTime > 500 || memoryUsage > 75) return 'warning';
    return 'healthy';
  };

  const systemHealth: SystemHealth = {
    status: getStatus(),
    uptime,
    memoryUsage,
    responseTime,
    errorRate: 0, // Track via error boundary in production
    activeUsers: onlineUsersCount,
  };

  return systemHealth;
}
