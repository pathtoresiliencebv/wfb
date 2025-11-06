import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp, Eye, MessageSquare } from 'lucide-react';
import { useTrendingTopics } from '@/hooks/useTrendingTopics';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface TrendingTopicsProps {
  limit?: number;
  showHeader?: boolean;
}

export function TrendingTopics({ limit = 6, showHeader = true }: TrendingTopicsProps) {
  const { topics, isLoading } = useTrendingTopics(limit);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showHeader && <Skeleton className="h-8 w-48" />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Trending Topics</h2>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <Card key={topic.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base line-clamp-2">
                  <Link 
                    to={`/topic/${topic.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {topic.title}
                  </Link>
                </CardTitle>
              </div>
              <Badge variant="secondary" className="w-fit mt-2">
                {topic.categories.name}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={topic.profiles.avatar_url} />
                  <AvatarFallback>
                    {(topic.profiles.display_name || topic.profiles.username).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">
                  {topic.profiles.display_name || topic.profiles.username}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{topic.view_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{topic.reply_count}</span>
                </div>
                <span className="ml-auto text-xs">
                  {formatDistanceToNow(new Date(topic.created_at), { 
                    addSuffix: true,
                    locale: nl 
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Link 
          to="/forums"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          Bekijk alle topics →
        </Link>
      </div>
    </div>
  );
}
