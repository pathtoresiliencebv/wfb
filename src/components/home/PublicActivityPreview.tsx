import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare, Eye } from 'lucide-react';
import { useRecentActivity } from '@/hooks/usePublicActivity';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

export function PublicActivityPreview() {
  const { topics, isLoading } = useRecentActivity(6);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(6)].map((_, i) => (
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
        <div className="flex items-center justify-between">
          <CardTitle>Nieuwste Topics</CardTitle>
          <Link to="/forums" className="text-sm text-primary hover:underline">
            Bekijk alle →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {topics.map((topic) => (
          <div key={topic.id} className="pb-4 border-b last:border-0 last:pb-0">
            <Link 
              to={`/topic/${topic.id}`}
              className="font-medium hover:text-primary transition-colors line-clamp-2 mb-2 block"
            >
              {topic.title}
            </Link>
            
            <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {topic.categories.name}
              </Badge>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{topic.view_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{topic.reply_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">
                    {formatDistanceToNow(new Date(topic.created_at), { 
                      addSuffix: true,
                      locale: nl 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
