import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TouchOptimizedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  touchFeedback?: boolean;
}

export function TouchOptimizedButton({ 
  children, 
  className, 
  touchFeedback = true,
  ...props 
}: TouchOptimizedButtonProps) {
  return (
    <Button
      className={cn(
        'min-h-[44px] min-w-[44px]', // WCAG AAA touch target size
        'px-4 py-2',
        touchFeedback && 'active:scale-95 transition-transform duration-150',
        'touch-manipulation', // Disable double-tap to zoom
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

interface TouchOptimizedInputProps {
  children: React.ReactNode;
  className?: string;
}

export function TouchOptimizedInput({ children, className }: TouchOptimizedInputProps) {
  return (
    <div className={cn(
      '[&>input]:min-h-[44px]',
      '[&>textarea]:min-h-[44px]',
      '[&>select]:min-h-[44px]',
      '[&>input]:text-base', // Prevent zoom on iOS
      '[&>textarea]:text-base',
      '[&>select]:text-base',
      '[&>input]:touch-manipulation',
      '[&>textarea]:touch-manipulation',
      '[&>select]:touch-manipulation',
      className
    )}>
      {children}
    </div>
  );
}

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export function SwipeableCard({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  className 
}: SwipeableCardProps) {
  const [startX, setStartX] = React.useState<number | null>(null);
  const [currentX, setCurrentX] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!startX || !currentX) {
      setStartX(null);
      setCurrentX(null);
      setIsDragging(false);
      return;
    }

    const diffX = startX - currentX;
    const threshold = 100; // Minimum swipe distance

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (diffX < 0 && onSwipeRight) {
        onSwipeRight();
      }
    }

    setStartX(null);
    setCurrentX(null);
    setIsDragging(false);
  };

  const transform = isDragging && startX && currentX 
    ? `translateX(${(currentX - startX) * 0.3}px)` 
    : 'translateX(0px)';

  return (
    <div
      className={cn(
        'touch-pan-y transition-transform duration-200',
        isDragging && 'transition-none',
        className
      )}
      style={{ transform }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

interface MobileScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  horizontal?: boolean;
}

export function MobileScrollArea({ 
  children, 
  className, 
  horizontal = false 
}: MobileScrollAreaProps) {
  return (
    <div className={cn(
      'overflow-auto',
      horizontal ? 'overflow-x-auto overflow-y-hidden' : 'overflow-y-auto overflow-x-hidden',
      'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent',
      '-webkit-overflow-scrolling-touch', // Smooth scrolling on iOS
      className
    )}>
      {children}
    </div>
  );
}