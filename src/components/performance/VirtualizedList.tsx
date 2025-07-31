import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface VirtualizedListProps<T> {
  items: T[];
  height: number; // Container height
  itemHeight: number; // Fixed item height
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number; // Number of items to render outside viewport
  className?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
}

export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  className,
  onLoadMore,
  hasMore = false,
  loading = false,
  loadingComponent,
  emptyComponent,
  getItemKey,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(height);

  const totalHeight = items.length * itemHeight;

  // Calculate visible range
  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length - 1, start + visibleCount);

    // Apply overscan
    const startWithOverscan = Math.max(0, start - overscan);
    const endWithOverscan = Math.min(items.length - 1, end + overscan);

    const visible = items.slice(startWithOverscan, endWithOverscan + 1);

    return {
      startIndex: startWithOverscan,
      endIndex: endWithOverscan,
      visibleItems: visible,
    };
  }, [scrollTop, containerHeight, itemHeight, items, overscan]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);

    // Load more when near bottom
    if (onLoadMore && hasMore && !loading) {
      const scrollHeight = e.currentTarget.scrollHeight;
      const clientHeight = e.currentTarget.clientHeight;
      const scrolledPercentage = (newScrollTop + clientHeight) / scrollHeight;

      if (scrolledPercentage > 0.8) {
        onLoadMore();
      }
    }
  }, [onLoadMore, hasMore, loading]);

  // Update container height on resize
  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  // Empty state
  if (items.length === 0 && !loading) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ height }}>
        {emptyComponent || (
          <div className="text-center text-muted-foreground">
            <div className="text-2xl mb-2">📝</div>
            <p>Geen items gevonden</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn('overflow-auto', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      {/* Virtual container */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Rendered items */}
        <div
          style={{
            transform: `translateY(${startIndex * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => {
            const itemIndex = startIndex + index;
            const key = getItemKey ? getItemKey(item, itemIndex) : itemIndex;

            return (
              <div
                key={key}
                style={{
                  height: itemHeight,
                  overflow: 'hidden',
                }}
              >
                {renderItem(item, itemIndex)}
              </div>
            );
          })}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {loadingComponent || (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                <span>Laden...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for managing virtualized list state
export function useVirtualizedList<T>(
  items: T[],
  config: {
    pageSize?: number;
    loadMore?: () => Promise<T[]>;
    hasMore?: boolean;
  } = {}
) {
  const { pageSize = 20, loadMore, hasMore: initialHasMore = true } = config;
  
  const [displayedItems, setDisplayedItems] = useState<T[]>(() => 
    items.slice(0, pageSize)
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);

  // Update displayed items when items change
  useEffect(() => {
    setDisplayedItems(items.slice(0, Math.max(pageSize, displayedItems.length)));
  }, [items, pageSize, displayedItems.length]);

  const handleLoadMore = useCallback(async () => {
    if (!loadMore || loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await loadMore();
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedItems(prev => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
    }
  }, [loadMore, loading, hasMore]);

  const reset = useCallback(() => {
    setDisplayedItems(items.slice(0, pageSize));
    setHasMore(initialHasMore);
    setLoading(false);
  }, [items, pageSize, initialHasMore]);

  return {
    items: displayedItems,
    loading,
    hasMore,
    loadMore: handleLoadMore,
    reset,
  };
}