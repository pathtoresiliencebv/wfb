import { ArrowUp, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ActionButtonGridProps {
  upvotes: number;
  replyCount: number;
  currentVote: 'up' | 'down' | null;
  onVote: () => void;
  onReply: () => void;
  className?: string;
}

export function ActionButtonGrid({
  upvotes,
  replyCount,
  currentVote,
  onVote,
  onReply,
  className
}: ActionButtonGridProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          navigator.clipboard.writeText(window.location.href);
          toast.success('Link gekopieerd naar klembord');
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link gekopieerd naar klembord');
    }
  };

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      <Button
        variant="outline"
        className={cn(
          "flex flex-col items-center gap-1 h-auto py-3 min-h-[44px]",
          currentVote === 'up' && "bg-success/10 border-success/20"
        )}
        onClick={onVote}
      >
        <ArrowUp className={cn(
          "h-5 w-5",
          currentVote === 'up' ? "text-success" : "text-muted-foreground"
        )} />
        <span className={cn(
          "text-xs font-medium",
          currentVote === 'up' ? "text-success" : "text-muted-foreground"
        )}>
          {upvotes} {upvotes === 1 ? 'Stem' : 'Stemmen'}
        </span>
      </Button>

      <Button
        variant="outline"
        className="flex flex-col items-center gap-1 h-auto py-3 min-h-[44px]"
        onClick={onReply}
      >
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {replyCount} {replyCount === 1 ? 'Reactie' : 'Reacties'}
        </span>
      </Button>

      <Button
        variant="outline"
        className="flex flex-col items-center gap-1 h-auto py-3 min-h-[44px]"
        onClick={handleShare}
      >
        <Share2 className="h-5 w-5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          Delen
        </span>
      </Button>
    </div>
  );
}
