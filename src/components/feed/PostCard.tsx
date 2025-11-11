import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, differenceInHours } from 'date-fns';
import { nl } from 'date-fns/locale';
import { MessageSquare, Pin, Clock } from 'lucide-react';
import { VotingButtons } from '@/components/interactive/VotingButtons';
import { PostActions } from '@/components/interactive/PostActions';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { useVoting } from '@/hooks/useVoting';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { BadgedText } from '@/lib/badgeParser';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
    avatar: string | null;
    isVerified: boolean;
  };
  category: string;
  categorySlug?: string;
  createdAt: Date;
  votes: number;
  replyCount: number;
  isSticky: boolean;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { getVoteData, handleVote } = useVoting();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Calculate reading time (200 words per minute average)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Check if post is new (< 24 hours)
  const isNew = differenceInHours(new Date(), post.createdAt) < 24;

  const voteData = getVoteData(post.id) || {
    id: post.id,
    type: 'topic' as const,
    currentVote: null,
    upvotes: post.votes,
    downvotes: 0,
  };

  const handleBookmarkClick = () => toggleBookmark(post.id, 'topic');

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('a[href]') || 
      target.closest('.no-click')
    ) {
      return;
    }
    
    // Use category slug for correct routing
    if (post.categorySlug) {
      navigate(`/forums/${post.categorySlug}/topic/${post.id}`);
    } else {
      navigate(`/topic/${post.id}`);
    }
  };

  return (
    <Card 
      className="card-hover-glow gradient-card overflow-hidden transition-all duration-300 group cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]"
      onClick={handleCardClick}
    >
        <CardContent className="p-4">
          <div className={cn(
            "flex gap-4",
            isMobile ? "flex-col" : "flex-row"
          )}>
            
            {/* Voting - Desktop only on left */}
            {!isMobile && (
              <div className="flex-shrink-0 no-click" onClick={(e) => e.stopPropagation()}>
                <VotingButtons 
                  itemId={post.id}
                  upvotes={voteData.upvotes}
                  downvotes={voteData.downvotes}
                  currentVote={voteData.currentVote}
                  onVote={(voteType) => handleVote(post.id, voteType, 'topic')}
                  size="md"
                />
              </div>
            )}

            {/* Content Section */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Header with Author */}
              <div className="flex items-center gap-3">
                <a
                  href={`/profile/${post.author.username}`}
                  className="flex items-center gap-3 min-w-0 no-click"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                    <AvatarImage src={post.author.avatar || undefined} />
                    <AvatarFallback>
                      {post.author.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">
                        {post.author.username}
                      </span>
                      {post.author.isVerified && <VerifiedBadge />}
                      {isNew && (
                        <Badge variant="secondary" className="text-xs">
                          Nieuw
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(post.createdAt, { 
                        addSuffix: true, 
                        locale: nl 
                      })}
                    </div>
                  </div>
                </a>
              </div>

              {/* Title - Met badges en max 2 regels */}
              <h3 className="text-base font-semibold leading-tight line-clamp-2">
                {post.isSticky && <Pin className="inline w-4 h-4 mr-1 text-primary" />}
                <BadgedText text={post.title} />
              </h3>

              {/* Content Preview */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.content}
              </p>

              {/* Footer - Category, Stats, Actions */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
                
                <div className="flex items-center gap-4">
                  {/* Mobile: Show voting inline */}
                  {isMobile && (
                    <div className="no-click" onClick={(e) => e.stopPropagation()}>
                      <VotingButtons 
                        itemId={post.id}
                        upvotes={voteData.upvotes}
                        downvotes={voteData.downvotes}
                        currentVote={voteData.currentVote}
                        onVote={(voteType) => handleVote(post.id, voteType, 'topic')}
                        size="sm"
                        inline
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.replyCount}</span>
                  </div>
                  
                  <div 
                    className="no-click" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PostActions 
                      itemId={post.id}
                      itemType="topic"
                      isBookmarked={isBookmarked(post.id)}
                      onBookmark={handleBookmarkClick}
                      replyCount={post.replyCount}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
