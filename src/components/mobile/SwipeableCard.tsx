import { ReactNode, useState } from 'react';
import { Heart, Bookmark, MoreHorizontal, ArrowUp } from 'lucide-react';
import { useSwipeGesture } from '@/hooks/useMobileGestures';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface SwipeAction {
  icon: ReactNode;
  label: string;
  color: string;
  action: () => void;
}

interface SwipeableCardProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onVote?: () => void;
  onBookmark?: () => void;
  onMore?: () => void;
  className?: string;
}

export function SwipeableCard({
  children,
  leftActions,
  rightActions,
  onVote,
  onBookmark,
  onMore,
  className
}: SwipeableCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isVoted, setIsVoted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const defaultLeftActions: SwipeAction[] = [
    {
      icon: <ArrowUp className="h-5 w-5" />,
      label: 'Upvote',
      color: 'bg-green-500',
      action: () => {
        setIsVoted(!isVoted);
        onVote?.();
      }
    }
  ];

  const defaultRightActions: SwipeAction[] = [
    {
      icon: <Bookmark className="h-5 w-5" />,
      label: 'Bookmark',
      color: 'bg-blue-500',
      action: () => {
        setIsBookmarked(!isBookmarked);
        onBookmark?.();
      }
    },
    {
      icon: <MoreHorizontal className="h-5 w-5" />,
      label: 'More',
      color: 'bg-gray-500',
      action: () => onMore?.()
    }
  ];

  const finalLeftActions = leftActions || defaultLeftActions;
  const finalRightActions = rightActions || defaultRightActions;

  const swipeGesture = useSwipeGesture({
    onSwipeLeft: () => {
      if (finalRightActions.length > 0) {
        finalRightActions[0].action();
      }
    },
    onSwipeRight: () => {
      if (finalLeftActions.length > 0) {
        finalLeftActions[0].action();
      }
    },
    threshold: 30
  });

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Left actions background */}
      <div className="absolute left-0 top-0 bottom-0 flex items-center justify-start pl-4 z-10">
        {finalLeftActions.map((action, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center w-16 h-16 rounded-full text-white mr-2",
              action.color
            )}
          >
            {action.icon}
          </div>
        ))}
      </div>

      {/* Right actions background */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-4 z-10">
        {finalRightActions.map((action, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center w-16 h-16 rounded-full text-white ml-2",
              action.color
            )}
          >
            {action.icon}
          </div>
        ))}
      </div>

      {/* Main card content */}
      <Card
        className={cn(
          "relative z-20 transition-transform duration-200 ease-out touch-pan-y",
          className
        )}
        style={{
          transform: `translateX(${swipeOffset}px)`
        }}
        {...swipeGesture}
      >
        {children}
      </Card>
    </div>
  );
}