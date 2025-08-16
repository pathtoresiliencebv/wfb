import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  userCount: number;
  topicCount: number;
  expertCount: number;
  verifiedCommunity: string;
}

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
      try {
        // Get user count
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get expert count (users with expert or admin role)
        const { count: expertCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .in('role', ['expert', 'admin', 'moderator']);

        // Get actual topic count from topics table
        const { count: topicCount } = await supabase
          .from('topics')
          .select('*', { count: 'exact', head: true });

        setStats({
          userCount: userCount || 0,
          topicCount: topicCount || 0,
          expertCount: expertCount || 0,
          verifiedCommunity: '100%',
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to 0 values if query fails
        setStats({
          userCount: 0,
          topicCount: 0,
          expertCount: 0,
          verifiedCommunity: '100%',
        });
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