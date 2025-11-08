import React from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InlineRichTextEditor } from '@/components/rich-text/InlineRichTextEditor';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface ModernReplyBoxProps {
  user: {
    username?: string;
    avatar_url?: string;
    email?: string;
  };
  replyContent: string;
  onReplyContentChange: (content: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  maxCharacters?: number;
}

export function ModernReplyBox({
  user,
  replyContent,
  onReplyContentChange,
  onSubmit,
  isSubmitting,
  maxCharacters = 5000,
}: ModernReplyBoxProps) {
  const getInitials = (name?: string) => {
    if (!name) return user.email?.charAt(0).toUpperCase() || '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const characterCount = replyContent.replace(/<[^>]*>/g, '').length;
  const isOverLimit = characterCount > maxCharacters;
  const isNearLimit = characterCount > maxCharacters * 0.8;

  return (
    <div className="w-full px-2 space-y-3">
      {/* Header with Avatar */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials(user.username)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-sm text-foreground">
            {user.username || user.email}
          </p>
          <p className="text-xs text-muted-foreground">Wat wil je delen?</p>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative">
        <InlineRichTextEditor
          value={replyContent}
          onChange={onReplyContentChange}
          placeholder="Deel je gedachten, ervaringen of stel een vraag..."
          minHeight={120}
          actions={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReplyContentChange('')}
                disabled={!replyContent || isSubmitting}
                className="h-9 w-9 p-0 rounded-full"
                title="Annuleren"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={onSubmit}
                disabled={!replyContent.trim() || isSubmitting || isOverLimit}
                className="h-9 w-9 p-0 rounded-full bg-primary hover:bg-primary/90 transition-all hover:scale-105"
                title="Reageren"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </>
          }
        />
      </div>

      {/* Character Counter */}
      {characterCount > 0 && (
        <div className={cn(
          "text-xs text-right transition-colors",
          isOverLimit ? "text-destructive font-semibold" : 
          isNearLimit ? "text-warning" : "text-muted-foreground"
        )}>
          {characterCount} / {maxCharacters}
        </div>
      )}
    </div>
  );
}
