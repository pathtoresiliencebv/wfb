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
        // Batch all queries together for better performance
        const [profilesResult, expertsResult, topicsResult, verifiedResult] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['expert', 'admin', 'moderator']),
          supabase.from('topics').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_verified', true)
        ]);

        // Calculate verification percentage
        const totalUsers = profilesResult.count || 0;
        const verifiedUsers = verifiedResult.count || 0;
        const verificationPercentage = totalUsers > 0 
          ? Math.round((verifiedUsers / totalUsers) * 100) 
          : 0;

        const newStats = {
          userCount: totalUsers,
          topicCount: topicsResult.count || 0,
          expertCount: expertsResult.count || 0,
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