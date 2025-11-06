import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SuggestedTopic {
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

export function useSuggestedTopics(limit: number = 5) {
  const { user } = useAuth();

  const { data: topics, isLoading, error } = useQuery({
    queryKey: ['suggested-topics', user?.id, limit],
    queryFn: async () => {
      if (!user) return [];

      // Get topics from categories user has interacted with
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
        .neq('author_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as SuggestedTopic[];
    },
    enabled: !!user,
  });

  return {
    topics,
    isLoading,
    error,
  };
}
