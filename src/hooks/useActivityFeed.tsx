import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export function useActivityFeed() {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['activity-feed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_feed')
        .select(`
          *,
          profiles!activity_feed_user_id_fkey(username, display_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as any[];
    },
  });

  return {
    activities,
    isLoading,
    error,
  };
}