import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, MessageSquare, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import DOMPurify from 'dompurify';

interface ReplyData {
  id: string;
  content: string;
  created_at: string;
  depth?: number;
  parent_reply_id?: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
    role: string | null;
  };
  replies?: ReplyData[];
}

interface ReplyThreadProps {
  reply: ReplyData;
  depth?: number;
  maxDepth?: number;
  currentUserId?: string;
  onQuote: (reply: ReplyData) => void;
  onReply: (replyId: string) => void;
  onVote: (replyId: string, voteType: 'up' | 'down') => void;
}

export function ReplyThread({
  reply,
  depth = 0,
  maxDepth = 3,
  currentUserId,
  onQuote,
  onReply,
  onVote
}: ReplyThreadProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasChildren = reply.replies && reply.replies.length > 0;
  const shouldIndent = depth < maxDepth;
  const totalScore = 0; // Will be connected to voting system

  const username = reply.profiles?.username || 'Anonymous';
  const avatarUrl = reply.profiles?.avatar_url;
  const userRole = reply.profiles?.role;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'admin': return 'text-destructive';
      case 'moderator': return 'text-primary';
      case 'supplier': return 'text-success';
      default: return 'text-foreground';
    }
  };

  return (
    <div className={cn(
      "relative",
      shouldIndent && depth > 0 && "ml-6 md:ml-8"
    )}>
      {/* Threading line */}
      {depth > 0 && shouldIndent && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
      )}

      <div className={cn(
        "relative bg-card border-b border-border last:border-b-0",
        depth > 0 && shouldIndent && "pl-4"
      )}>
        {/* Reply Header */}
        <div className="flex items-start gap-3 p-4">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={avatarUrl || undefined} alt={username} />
            <AvatarFallback className="text-xs">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("font-semibold text-sm", getRoleColor(userRole))}>
                {username}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(reply.created_at), { 
                  addSuffix: true, 
                  locale: nl 
                })}
              </span>
            </div>

            {/* Content */}
            <div 
              className="prose prose-sm dark:prose-invert max-w-none mt-2 text-sm"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(reply.content) 
              }}
            />

            {/* Actions */}
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => onVote(reply.id, 'up')}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[44px] p-2"
              >
                <span className={cn(
                  "font-medium",
                  totalScore > 0 && "text-success",
                  totalScore < 0 && "text-destructive"
                )}>
                  {totalScore}
                </span>
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(reply.id)}
                className="h-8 px-2 text-xs"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Reageren
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuote(reply)}
                className="h-8 px-2 text-xs"
              >
                <Quote className="h-3 w-3 mr-1" />
                Quote
              </Button>

              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="h-8 px-2 text-xs ml-auto"
                >
                  {isCollapsed ? (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Toon {reply.replies?.length} {reply.replies?.length === 1 ? 'antwoord' : 'antwoorden'}
                    </>
                  ) : (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Verberg
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nested replies */}
      {hasChildren && !isCollapsed && (
        <div className="relative">
          {reply.replies?.map((childReply) => (
            <ReplyThread
              key={childReply.id}
              reply={childReply}
              depth={depth + 1}
              maxDepth={maxDepth}
              currentUserId={currentUserId}
              onQuote={onQuote}
              onReply={onReply}
              onVote={onVote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
