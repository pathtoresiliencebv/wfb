
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type VoteType = 'up' | 'down' | null;

interface VoteData {
  id: string;
  type: 'topic' | 'reply';
  currentVote: VoteType;
  upvotes: number;
  downvotes: number;
}

interface UseVotingReturn {
  votes: Record<string, VoteData>;
  handleVote: (itemId: string, voteType: 'up' | 'down', itemType: 'topic' | 'reply') => void;
  getVoteData: (itemId: string) => VoteData | null;
}

export function useVoting(initialVotes: Record<string, VoteData> = {}): UseVotingReturn {
  const [votes, setVotes] = useState<Record<string, VoteData>>(initialVotes);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Load votes from Supabase on mount
  useEffect(() => {
    const loadVotes = async () => {
      if (!user) return;

      try {
        const { data: userVotes, error } = await supabase
          .from('votes')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading votes:', error);
          return;
        }

        // Load vote counts for each item
        const itemIds = [...new Set(userVotes?.map(v => v.item_id) || [])];
        
        if (itemIds.length > 0) {
          const { data: voteCounts, error: countError } = await supabase
            .from('votes')
            .select('item_id, vote_type, item_type')
            .in('item_id', itemIds);

          if (countError) {
            console.error('Error loading vote counts:', countError);
            return;
          }

          const voteData: Record<string, VoteData> = {};
          
          itemIds.forEach(itemId => {
            const itemVotes = voteCounts?.filter(v => v.item_id === itemId) || [];
            const userVote = userVotes?.find(v => v.item_id === itemId);
            const itemType = itemVotes[0]?.item_type as 'topic' | 'reply';
            
            const upvotes = itemVotes.filter(v => v.vote_type === 'up').length;
            const downvotes = itemVotes.filter(v => v.vote_type === 'down').length;
            
            voteData[itemId] = {
              id: itemId,
              type: itemType,
              currentVote: userVote?.vote_type as VoteType || null,
              upvotes,
              downvotes,
            };
          });

          setVotes(voteData);
        }
      } catch (error) {
        console.error('Error loading votes:', error);
      }
    };

    loadVotes();
  }, [user]);

  const handleVote = async (itemId: string, voteType: 'up' | 'down', itemType: 'topic' | 'reply') => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Inloggen vereist',
        description: 'Je moet ingelogd zijn om te kunnen stemmen.',
        variant: 'destructive',
      });
      return;
    }

    const currentVote = votes[itemId]?.currentVote || null;
    
    try {
      if (currentVote === voteType) {
        // Remove vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId);

        if (error) throw error;

        // Update local state
        setVotes(prev => ({
          ...prev,
          [itemId]: {
            ...prev[itemId],
            currentVote: null,
            upvotes: voteType === 'up' ? Math.max(0, (prev[itemId]?.upvotes || 0) - 1) : prev[itemId]?.upvotes || 0,
            downvotes: voteType === 'down' ? Math.max(0, (prev[itemId]?.downvotes || 0) - 1) : prev[itemId]?.downvotes || 0,
          }
        }));

        toast({
          title: 'Stem ingetrokken',
          description: 'Je stem is verwijderd.',
        });
      } else {
        // Add or update vote
        const { error } = await supabase
          .from('votes')
          .upsert({
            user_id: user.id,
            item_id: itemId,
            item_type: itemType,
            vote_type: voteType,
          });

        if (error) throw error;

        // Update local state
        setVotes(prev => {
          const current = prev[itemId] || { id: itemId, type: itemType, currentVote: null, upvotes: 0, downvotes: 0 };
          let newUpvotes = current.upvotes;
          let newDownvotes = current.downvotes;

          if (currentVote === null) {
            // New vote
            if (voteType === 'up') {
              newUpvotes++;
            } else {
              newDownvotes++;
            }
          } else {
            // Switch vote
            if (currentVote === 'up' && voteType === 'down') {
              newUpvotes = Math.max(0, newUpvotes - 1);
              newDownvotes++;
            } else if (currentVote === 'down' && voteType === 'up') {
              newDownvotes = Math.max(0, newDownvotes - 1);
              newUpvotes++;
            }
          }

          return {
            ...prev,
            [itemId]: {
              ...current,
              currentVote: voteType,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
            }
          };
        });

        toast({
          title: voteType === 'up' ? 'Upvote geregistreerd' : 'Downvote geregistreerd',
          description: 'Je stem is opgeslagen.',
        });
      }
    } catch (error) {
      console.error('Error handling vote:', error);
      toast({
        title: 'Fout bij stemmen',
        description: 'Er is een fout opgetreden bij het verwerken van je stem.',
        variant: 'destructive',
      });
    }
  };

  const getVoteData = (itemId: string): VoteData | null => {
    return votes[itemId] || null;
  };

  return {
    votes,
    handleVote,
    getVoteData,
  };
}
