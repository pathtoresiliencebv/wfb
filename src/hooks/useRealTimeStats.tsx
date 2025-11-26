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
    verifiedCommunity: '0%',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      // Return cached data if still valid
      if (cachedStats && Date.now() - cachedStats.timestamp < CACHE_DURATION) {
        setStats(cachedStats.data);
        setIsLoading(false);
        return;
      }

      try {
        // Execute queries independently to prevent one failure from blocking others
        const [profilesResult, expertsResult, topicsResult, verifiedResult] = await Promise.allSettled([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['expert', 'admin', 'moderator']),
          supabase.from('topics').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_verified', true)
        ]);

        // Helper to extract count from settled promise
        const getCount = (result: PromiseSettledResult<{ count: number | null }>) => {
          if (result.status === 'fulfilled' && result.value.count !== null) {
            return result.value.count;
          }
          if (result.status === 'rejected') {
            console.error('Stats query failed:', result.reason);
          }
          return 0;
        };

        const totalUsers = getCount(profilesResult as any);
        const expertCount = getCount(expertsResult as any);
        const topicCount = getCount(topicsResult as any);
        const verifiedUsers = getCount(verifiedResult as any);

        // Calculate verification percentage
        const verificationPercentage = totalUsers > 0 
          ? Math.round((verifiedUsers / totalUsers) * 100) 
          : 0;

        const newStats = {
          userCount: totalUsers,
          topicCount: topicCount,
          expertCount: expertCount,
          verifiedCommunity: `${verificationPercentage}%`,
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
            verifiedCommunity: '0%',
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