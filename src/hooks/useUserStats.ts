import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  topicCount: number;
  rank: number;
  totalMembers: number;
  reputation: number;
}

export function useUserStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-stats', userId],
    queryFn: async (): Promise<UserStats> => {
      if (!userId) {
        return {
          topicCount: 0,
          rank: 0,
          totalMembers: 0,
          reputation: 0,
        };
      }

      // Get topic count
      const { count: topicCount } = await supabase
        .from('topics')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', userId);

      // Get user profile with reputation
      const { data: profile } = await supabase
        .from('profiles')
        .select('reputation')
        .eq('user_id', userId)
        .single();

      // Get user rank using RPC
      const { data: rankData } = await supabase
        .rpc('get_user_rank', {
          user_id: userId
        });

      // Get total members
      const { count: totalMembers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      return {
        topicCount: topicCount || 0,
        rank: rankData || 0,
        totalMembers: totalMembers || 0,
        reputation: profile?.reputation || 0,
      };
    },
    enabled: !!userId,
    staleTime: 60000, // 1 minute
  });
}
