import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Lightbulb, Eye, MessageSquare } from 'lucide-react';
import { useSuggestedTopics } from '@/hooks/useSuggestedTopics';
import { Skeleton } from '@/components/ui/skeleton';
import { BadgedText } from '@/lib/badgeParser';

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
      <CardContent className="space-y-2">
        {topics.map((topic) => (
          <Link 
            key={topic.id}
            to={`/forums/${topic.categories.slug}/topic/${topic.id}`}
            className="block"
          >
            <div className="p-3 -mx-3 rounded-lg transition-all duration-200 hover:bg-muted/50 active:bg-muted active:scale-[0.98] cursor-pointer min-h-[80px]">
              <div className="space-y-2">
                <h4 className="font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  <BadgedText text={topic.title} />
                </h4>
                
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarImage src={topic.profiles.avatar_url} />
                      <AvatarFallback>
                        {(topic.profiles.display_name || topic.profiles.username).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate">
                      {topic.profiles.display_name || topic.profiles.username}
                    </span>
                  </div>
                  
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
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
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
