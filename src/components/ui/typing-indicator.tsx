import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  usernames: string[];
  className?: string;
}

export function TypingIndicator({ usernames, className }: TypingIndicatorProps) {
  if (usernames.length === 0) return null;

  const getTypingText = () => {
    if (usernames.length === 1) {
      return `${usernames[0]} is aan het typen...`;
    } else if (usernames.length === 2) {
      return `${usernames[0]} en ${usernames[1]} zijn aan het typen...`;
    } else {
      return `${usernames[0]} en ${usernames.length - 1} anderen zijn aan het typen...`;
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-muted/50",
      className
    )}>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
      </div>
      <span className="text-xs">
        {getTypingText()}
      </span>
    </div>
  );
}