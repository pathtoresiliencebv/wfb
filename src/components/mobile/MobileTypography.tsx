import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveHeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  gradient?: boolean;
}

export function ResponsiveHeading({ 
  children, 
  level, 
  className, 
  gradient = false 
}: ResponsiveHeadingProps) {
  const baseClasses = {
    1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold',
    2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold',
    3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold',
    4: 'text-base sm:text-lg md:text-xl lg:text-2xl font-semibold',
    5: 'text-sm sm:text-base md:text-lg lg:text-xl font-medium',
    6: 'text-xs sm:text-sm md:text-base lg:text-lg font-medium'
  };

  const gradientClasses = gradient 
    ? 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
    : '';

  const Component = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Component className={cn(
      'font-heading leading-tight tracking-tight',
      baseClasses[level],
      gradientClasses,
      className
    )}>
      {children}
    </Component>
  );
}

interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  className?: string;
  muted?: boolean;
}

export function ResponsiveText({ 
  children, 
  size = 'base', 
  className, 
  muted = false 
}: ResponsiveTextProps) {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-sm sm:text-base md:text-lg',
    lg: 'text-base sm:text-lg md:text-xl',
    xl: 'text-lg sm:text-xl md:text-2xl'
  };

  const mutedClasses = muted ? 'text-muted-foreground' : 'text-foreground';

  return (
    <p className={cn(
      'leading-relaxed',
      sizeClasses[size],
      mutedClasses,
      className
    )}>
      {children}
    </p>
  );
}

interface TruncatedTextProps {
  children: React.ReactNode;
  lines?: number;
  className?: string;
  showExpand?: boolean;
}

export function TruncatedText({ 
  children, 
  lines = 2, 
  className,
  showExpand = false 
}: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const truncateClass = lines === 1 ? 'truncate' : `line-clamp-${lines}`;

  return (
    <div className={className}>
      <div className={cn(
        isExpanded ? '' : truncateClass,
        'transition-all duration-200'
      )}>
        {children}
      </div>
      {showExpand && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary hover:text-primary/80 text-sm mt-1 transition-colors"
        >
          {isExpanded ? 'Minder tonen' : 'Meer tonen'}
        </button>
      )}
    </div>
  );
}

interface ReadableTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ReadableText({ children, className }: ReadableTextProps) {
  return (
    <div className={cn(
      'prose prose-sm sm:prose-base max-w-none',
      'prose-headings:font-heading prose-headings:text-foreground',
      'prose-p:text-foreground prose-p:leading-relaxed',
      'prose-strong:text-foreground prose-strong:font-semibold',
      'prose-em:text-foreground',
      'prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
      'prose-pre:bg-muted prose-pre:text-foreground',
      'prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary',
      'prose-hr:border-border',
      'prose-th:text-foreground prose-td:text-foreground',
      'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
      className
    )}>
      {children}
    </div>
  );
}