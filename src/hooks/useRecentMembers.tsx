import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RecentMember {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
}

export function useRecentMembers(limit: number = 8) {
  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ['recent-members', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, username, display_name, avatar_url, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.warn('Recent members fetch failed:', error);
        return [];
      }
      return data as RecentMember[] || [];
    },
    staleTime: 300000,
    retry: false,
  });

  return {
    members,
    isLoading,
    error,
  };
}
