import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MobileOptimizedCardProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  touchOptimized?: boolean;
}

export function MobileOptimizedCard({ 
  loading = false, 
  children, 
  className,
  touchOptimized = true 
}: MobileOptimizedCardProps) {
  if (loading) {
    return (
      <Card className={cn("mb-4", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "mb-4 transition-all duration-200",
        touchOptimized && "active:scale-[0.98] cursor-pointer",
        "hover:shadow-md",
        className
      )}
    >
      {children}
    </Card>
  );
}

export function MobileOptimizedGrid({ 
  children, 
  loading = false, 
  itemCount = 6 
}: { 
  children: React.ReactNode; 
  loading?: boolean; 
  itemCount?: number;
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: itemCount }).map((_, index) => (
          <MobileOptimizedCard key={index} loading>
            <div />
          </MobileOptimizedCard>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {children}
    </div>
  );
}