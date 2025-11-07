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
import { motion } from 'framer-motion';

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
  createdAt: Date;
  votes: number;
  replyCount: number;
  isSticky: boolean;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { votes, handleVote } = useVoting();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  // Calculate reading time (200 words per minute average)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Check if post is new (< 24 hours)
  const isNew = differenceInHours(new Date(), post.createdAt) < 24;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="card-hover-glow gradient-card overflow-hidden transition-all duration-300 group">
        <CardContent className="p-4 sm:p-6">
          <div className="flex gap-4">
            {/* Voting Section */}
            <VotingButtons 
              votes={votes(post.id, 'topic') || post.votes}
              userVote={null}
              onVote={(voteType) => handleVote(post.id, voteType, 'topic')}
            />

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              {/* Header with Author Info */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                      <AvatarImage src={post.author.avatar || undefined} alt={post.author.username} />
                      <AvatarFallback>{post.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <a 
                        href={`/profile/${post.author.username}`}
                        className="font-medium text-foreground hover:text-primary transition-colors truncate"
                      >
                        {post.author.username}
                      </a>
                      {post.author.isVerified && <VerifiedBadge />}
                      {isNew && (
                        <Badge variant="secondary" className="badge-new text-xs">
                          Nieuw
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {formatDistanceToNow(post.createdAt, { 
                          addSuffix: true, 
                          locale: nl 
                        })}
                      </span>
                      <span>•</span>
                      <span className="reading-time">
                        <Clock className="w-3 h-3" />
                        {readingTime} min leestijd
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <a 
                href={`/topic/${post.id}`}
                className="block mb-2 group/title"
              >
                <h3 className="text-lg font-semibold text-foreground group-hover/title:text-primary transition-colors line-clamp-2">
                  {post.isSticky && <Pin className="inline w-4 h-4 mr-1 text-primary" />}
                  {post.title}
                </h3>
              </a>

              {/* Content Preview */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {post.content}
              </p>

              {/* Footer with Category and Actions */}
              <div className="flex items-center justify-between gap-4">
                <Badge 
                  variant="secondary" 
                  className="text-xs hover:bg-primary/10 transition-colors"
                >
                  {post.category}
                </Badge>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.replyCount}</span>
                  </div>
                  <PostActions 
                    isBookmarked={isBookmarked(post.id)}
                    onBookmark={() => toggleBookmark(post.id, 'topic')}
                    replyCount={post.replyCount}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
