
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  const { isAuthenticated } = useAuth();

  const handleVote = (itemId: string, voteType: 'up' | 'down', itemType: 'topic' | 'reply') => {
    if (!isAuthenticated) {
      toast({
        title: 'Inloggen vereist',
        description: 'Je moet ingelogd zijn om te kunnen stemmen.',
        variant: 'destructive',
      });
      return;
    }

    setVotes(prev => {
      const currentVote = prev[itemId]?.currentVote || null;
      const isUpvote = voteType === 'up';
      const currentUpvotes = prev[itemId]?.upvotes || 0;
      const currentDownvotes = prev[itemId]?.downvotes || 0;

      let newUpvotes = currentUpvotes;
      let newDownvotes = currentDownvotes;
      let newCurrentVote: VoteType = voteType;

      // Handle vote logic
      if (currentVote === voteType) {
        // Remove vote if clicking same vote
        newCurrentVote = null;
        if (isUpvote) {
          newUpvotes = Math.max(0, currentUpvotes - 1);
        } else {
          newDownvotes = Math.max(0, currentDownvotes - 1);
        }
      } else if (currentVote === null) {
        // Add new vote
        if (isUpvote) {
          newUpvotes = currentUpvotes + 1;
        } else {
          newDownvotes = currentDownvotes + 1;
        }
      } else {
        // Switch vote
        if (isUpvote) {
          newUpvotes = currentUpvotes + 1;
          newDownvotes = Math.max(0, currentDownvotes - 1);
        } else {
          newDownvotes = currentDownvotes + 1;
          newUpvotes = Math.max(0, currentUpvotes - 1);
        }
      }

      return {
        ...prev,
        [itemId]: {
          id: itemId,
          type: itemType,
          currentVote: newCurrentVote,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
        }
      };
    });

    // Show feedback
    const action = votes[itemId]?.currentVote === voteType ? 'Stem ingetrokken' : 
                  voteType === 'up' ? 'Upvote geregistreerd' : 'Downvote geregistreerd';
    
    toast({
      title: action,
      description: 'Je stem is bijgewerkt.',
    });
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
