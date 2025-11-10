import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  userCount: number;
  topicCount: number;
  expertCount: number;
  verifiedCommunity: string;
}

// Cache stats in memory with timestamp
let cachedStats: { data: Stats; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useRealTimeStats() {
  const [stats, setStats] = useState<Stats>({
    userCount: 0,
    topicCount: 0,
    expertCount: 0,
    verifiedCommunity: '100%',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Return cached data if still valid
      if (cachedStats && Date.now() - cachedStats.timestamp < CACHE_DURATION) {
        setStats(cachedStats.data);
        setIsLoading(false);
        return;
      }

      try {
        // Batch all queries together for better performance
        const [profilesResult, expertsResult, topicsResult] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['expert', 'admin', 'moderator']),
          supabase.from('topics').select('*', { count: 'exact', head: true })
        ]);

        const newStats = {
          userCount: profilesResult.count || 0,
          topicCount: topicsResult.count || 0,
          expertCount: expertsResult.count || 0,
          verifiedCommunity: '100%',
        };

        // Update cache
        cachedStats = {
          data: newStats,
          timestamp: Date.now()
        };

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Use cached data if available, otherwise fallback to 0
        if (cachedStats) {
          setStats(cachedStats.data);
        } else {
          setStats({
            userCount: 0,
            topicCount: 0,
            expertCount: 0,
            verifiedCommunity: '100%',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Subscribe to real-time updates for all relevant tables
    const subscription = supabase
      .channel('admin_stats')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchStats();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'topics' },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { stats, isLoading };
}