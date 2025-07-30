import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface VotingStats {
  item_id: string;
  item_type: 'topic' | 'reply';
  upvotes: number;
  downvotes: number;
  total_votes: number;
  score: number;
  percentage_positive: number;
  vote_history: Array<{
    date: string;
    vote_type: 'up' | 'down';
    count: number;
  }>;
}

export function useVotingStats(itemId: string, itemType: 'topic' | 'reply') {
  return useQuery({
    queryKey: ['voting-stats', itemId, itemType],
    queryFn: async (): Promise<VotingStats> => {
      // Get current vote counts
      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('vote_type, created_at')
        .eq('item_id', itemId)
        .eq('item_type', itemType);

      if (votesError) throw votesError;

      const upvotes = votes?.filter(v => v.vote_type === 'up').length || 0;
      const downvotes = votes?.filter(v => v.vote_type === 'down').length || 0;
      const totalVotes = upvotes + downvotes;
      const score = upvotes - downvotes;
      const percentagePositive = totalVotes > 0 ? (upvotes / totalVotes) * 100 : 0;

      // Group votes by date for history
      const voteHistory: Record<string, { up: number; down: number }> = {};
      
      votes?.forEach(vote => {
        const date = new Date(vote.created_at).toISOString().split('T')[0];
        if (!voteHistory[date]) {
          voteHistory[date] = { up: 0, down: 0 };
        }
        voteHistory[date][vote.vote_type as 'up' | 'down']++;
      });

      const history = Object.entries(voteHistory)
        .sort(([a], [b]) => a.localeCompare(b))
        .flatMap(([date, counts]) => [
          { date, vote_type: 'up' as const, count: counts.up },
          { date, vote_type: 'down' as const, count: counts.down },
        ])
        .filter(entry => entry.count > 0);

      return {
        item_id: itemId,
        item_type: itemType,
        upvotes,
        downvotes,
        total_votes: totalVotes,
        score,
        percentage_positive: percentagePositive,
        vote_history: history,
      };
    },
    enabled: !!itemId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUserVotingActivity(userId: string) {
  return useQuery({
    queryKey: ['user-voting-activity', userId],
    queryFn: async () => {
      const { data: votes, error } = await supabase
        .from('votes')
        .select(`
          vote_type,
          created_at,
          item_type,
          topics:item_id(title),
          replies:item_id(content)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const stats = {
        total_votes: votes?.length || 0,
        upvotes_given: votes?.filter(v => v.vote_type === 'up').length || 0,
        downvotes_given: votes?.filter(v => v.vote_type === 'down').length || 0,
        topics_voted: votes?.filter(v => v.item_type === 'topic').length || 0,
        replies_voted: votes?.filter(v => v.item_type === 'reply').length || 0,
        recent_activity: votes || [],
      };

      return stats;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}