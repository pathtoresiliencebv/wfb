import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TrendingTopic {
  id: string;
  title: string;
  view_count: number;
  reply_count: number;
  created_at: string;
  categories: {
    id: string;
    name: string;
    slug: string;
  };
  profiles: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export function useTrendingTopics(limit: number = 6) {
  const { data: topics, isLoading, error } = useQuery({
    queryKey: ['trending-topics', limit],
    queryFn: async () => {
      // Get topics from last 7 days, ordered by views + reply_count
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('topics')
        .select(`
          id,
          title,
          view_count,
          reply_count,
          created_at,
          categories!inner(id, name, slug),
          profiles!topics_author_id_fkey(username, display_name, avatar_url)
        `)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('view_count', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      // Filter out topics without profiles (deleted users)
      const validTopics = (data || []).filter(topic => topic.profiles !== null);
      
      return validTopics as TrendingTopic[];
    },
  });

  return {
    topics,
    isLoading,
    error,
  };
}
