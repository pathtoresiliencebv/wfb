import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RecentTopic {
  id: string;
  title: string;
  view_count: number;
  reply_count: number;
  created_at: string;
  categories: {
    name: string;
    slug: string;
  };
}

export function useRecentActivity(limit: number = 6) {
  const { data: topics, isLoading, error } = useQuery({
    queryKey: ['recent-activity', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select(`
          id,
          title,
          view_count,
          reply_count,
          created_at,
          categories!inner(name, slug)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as RecentTopic[];
    },
  });

  return {
    topics,
    isLoading,
    error,
  };
}
