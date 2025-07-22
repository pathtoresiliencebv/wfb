
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VoteType } from '@/hooks/useVoting';

interface VotingButtonsProps {
  itemId: string;
  upvotes: number;
  downvotes: number;
  currentVote: VoteType;
  onVote: (voteType: 'up' | 'down') => void;
  size?: 'sm' | 'md';
  orientation?: 'vertical' | 'horizontal';
}

export function VotingButtons({
  itemId,
  upvotes,
  downvotes,
  currentVote,
  onVote,
  size = 'md',
  orientation = 'vertical'
}: VotingButtonsProps) {
  const totalScore = upvotes - downvotes;
  const sizeClasses = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className={cn(
      "flex items-center gap-1",
      orientation === 'vertical' ? 'flex-col' : 'flex-row'
    )}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          sizeClasses,
          currentVote === 'up' && 'text-green-600 bg-green-50 hover:bg-green-100'
        )}
        onClick={() => onVote('up')}
      >
        <ArrowUp className={iconSize} />
      </Button>
      
      <span className={cn(
        "text-sm font-medium min-w-[2rem] text-center",
        totalScore > 0 && 'text-green-600',
        totalScore < 0 && 'text-red-600'
      )}>
        {totalScore}
      </span>
      
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          sizeClasses,
          currentVote === 'down' && 'text-red-600 bg-red-50 hover:bg-red-100'
        )}
        onClick={() => onVote('down')}
      >
        <ArrowDown className={iconSize} />
      </Button>
    </div>
  );
}
