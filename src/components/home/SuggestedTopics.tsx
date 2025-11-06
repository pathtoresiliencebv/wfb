import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Lightbulb, Eye, MessageSquare } from 'lucide-react';
import { useSuggestedTopics } from '@/hooks/useSuggestedTopics';
import { Skeleton } from '@/components/ui/skeleton';

export function SuggestedTopics() {
  const { topics, isLoading } = useSuggestedTopics(5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <CardTitle>Aanbevolen Voor Jou</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {topics.map((topic) => (
          <div key={topic.id} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
            <Link 
              to={`/topic/${topic.id}`}
              className="font-medium hover:text-primary transition-colors line-clamp-2"
            >
              {topic.title}
            </Link>
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={topic.profiles.avatar_url} />
                  <AvatarFallback>
                    {(topic.profiles.display_name || topic.profiles.username).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">
                  {topic.profiles.display_name || topic.profiles.username}
                </span>
              </div>
              
              <Badge variant="secondary" className="text-xs">
                {topic.categories.name}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{topic.view_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{topic.reply_count}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
