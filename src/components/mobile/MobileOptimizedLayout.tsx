import React from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'compact' | 'normal' | 'relaxed';
}

export function MobileOptimizedLayout({ 
  children, 
  className,
  spacing = 'normal' 
}: MobileOptimizedLayoutProps) {
  const spacingClasses = {
    compact: 'space-y-2 md:space-y-3',
    normal: 'space-y-4 md:space-y-6',
    relaxed: 'space-y-6 md:space-y-8'
  };

  return (
    <div className={cn(
      'w-full max-w-7xl mx-auto',
      'px-3 sm:px-4 md:px-6 lg:px-8',
      'py-4 md:py-6 lg:py-8',
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  );
}

interface MobileOptimizedSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerActions?: React.ReactNode;
}

export function MobileOptimizedSection({ 
  children, 
  title, 
  subtitle, 
  className,
  headerActions 
}: MobileOptimizedSectionProps) {
  return (
    <section className={cn('space-y-3 md:space-y-4', className)}>
      {(title || subtitle || headerActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="space-y-1">
            {title && (
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm md:text-base text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2 self-start sm:self-center">
              {headerActions}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

interface MobileOptimizedGridProps {
  children: React.ReactNode;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MobileOptimizedGrid({ 
  children, 
  columns = { default: 1, sm: 2, lg: 3 },
  gap = 'md',
  className 
}: MobileOptimizedGridProps) {
  const gapClasses = {
    sm: 'gap-2 md:gap-3',
    md: 'gap-3 md:gap-4 lg:gap-6',
    lg: 'gap-4 md:gap-6 lg:gap-8'
  };

  const gridCols = `grid-cols-${columns.default}`;
  const smCols = columns.sm ? `sm:grid-cols-${columns.sm}` : '';
  const mdCols = columns.md ? `md:grid-cols-${columns.md}` : '';
  const lgCols = columns.lg ? `lg:grid-cols-${columns.lg}` : '';
  const xlCols = columns.xl ? `xl:grid-cols-${columns.xl}` : '';

  return (
    <div className={cn(
      'grid',
      gridCols,
      smCols,
      mdCols,
      lgCols,
      xlCols,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}