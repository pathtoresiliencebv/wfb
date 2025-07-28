import { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/useMobileGestures';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function PullToRefresh({ 
  children, 
  onRefresh, 
  disabled = false,
  className 
}: PullToRefreshProps) {
  const {
    ref,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    pullDistance,
    pullProgress,
    isRefreshing,
  } = usePullToRefresh({ 
    onPullToRefresh: onRefresh, 
    disabled 
  });

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-muted/50 transition-all duration-200 ease-out z-50"
        style={{
          height: `${Math.max(0, pullDistance)}px`,
          transform: `translateY(-${Math.max(0, 60 - pullDistance)}px)`,
        }}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw 
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isRefreshing && "animate-spin",
              pullProgress >= 1 && !isRefreshing && "rotate-180"
            )}
          />
          <span className="text-sm font-medium">
            {isRefreshing 
              ? "Vernieuwen..." 
              : pullProgress >= 1 
                ? "Loslaten om te vernieuwen"
                : "Trek naar beneden om te vernieuwen"
            }
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}