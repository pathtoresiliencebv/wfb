import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface ActivityItem {
  id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
  user_id: string;
}

export function useRealTimeActivity(limit: number = 5) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['real-time-activity', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_feed')
        .select('id, activity_type, activity_data, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as ActivityItem[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    if (data) {
      setActivities(data);
    }
  }, [data]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('public-activity')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_feed'
        },
        (payload) => {
          setActivities((prev) => [payload.new as ActivityItem, ...prev.slice(0, limit - 1)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return {
    activities,
    isLoading,
  };
}
