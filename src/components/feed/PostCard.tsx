
import React from 'react';
import { ArrowUp, ArrowDown, MessageSquare, Pin, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

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
  const timeAgo = formatDistanceToNow(post.createdAt, { 
    addSuffix: true, 
    locale: nl 
  });

  return (
    <Card className="post-card">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center space-y-1 min-w-[3rem]">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-foreground">{post.votes}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar || undefined} />
                <AvatarFallback>
                  {post.author.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {post.author.username}
                  </span>
                  {post.author.isVerified && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{timeAgo}</span>
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  {post.isSticky && (
                    <Pin className="h-3 w-3 text-primary" />
                  )}
                </div>

                <h3 className="font-medium text-foreground mb-2 line-clamp-1">
                  {post.title}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {post.content}
                </p>

                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="gap-2 h-8">
                    <MessageSquare className="h-3 w-3" />
                    <span className="text-xs">{post.replyCount} reacties</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
