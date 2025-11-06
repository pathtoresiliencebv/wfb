import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PublicActivity {
  id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export function usePublicActivity(limit: number = 6) {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['public-activity', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_feed')
        .select(`
          id,
          activity_type,
          activity_data,
          created_at,
          user_id,
          profiles(username, display_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as PublicActivity[];
    },
  });

  return {
    activities,
    isLoading,
    error,
  };
}
