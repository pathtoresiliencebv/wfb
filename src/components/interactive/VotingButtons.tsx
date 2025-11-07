
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
  inline?: boolean; // Alias for horizontal orientation
}

export function VotingButtons({
  itemId,
  upvotes,
  downvotes,
  currentVote,
  onVote,
  size = 'md',
  orientation = 'vertical',
  inline = false
}: VotingButtonsProps) {
  const effectiveOrientation = inline ? 'horizontal' : orientation;
  const totalScore = upvotes - downvotes;
  const sizeClasses = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className={cn(
      "flex items-center gap-1",
      effectiveOrientation === 'vertical' ? 'flex-col' : 'flex-row'
    )}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          sizeClasses,
          currentVote === 'up' && 'text-success bg-success/10 hover:bg-success/20'
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onVote('up');
        }}
        aria-label="Upvote"
      >
        <ArrowUp className={iconSize} />
      </Button>
      
      <span className={cn(
        "text-sm font-medium min-w-[2rem] text-center",
        totalScore > 0 && 'text-success',
        totalScore < 0 && 'text-destructive'
      )}>
        {totalScore}
      </span>
      
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          sizeClasses,
          currentVote === 'down' && 'text-destructive bg-destructive/10 hover:bg-destructive/20'
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onVote('down');
        }}
        aria-label="Downvote"
      >
        <ArrowDown className={iconSize} />
      </Button>
    </div>
  );
}
