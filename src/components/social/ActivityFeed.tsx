import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, User, Calendar } from 'lucide-react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { LoadingState } from '@/components/ui/loading-spinner';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

export function ActivityFeed() {
  const { activities, isLoading, error } = useActivityFeed();

  if (isLoading) {
    return <LoadingState text="Activiteiten laden..." />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Kon activiteiten niet laden</p>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'topic_created':
        return <MessageSquare className="h-4 w-4" />;
      case 'reply_created':
        return <MessageSquare className="h-4 w-4" />;
      case 'vote_cast':
        return <ThumbsUp className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.activity_type) {
      case 'topic_created':
        return (
          <>
            heeft een nieuw topic aangemaakt:{' '}
            <Link 
              to={`/topics/${activity.activity_data.topic_id}`}
              className="font-medium text-primary hover:underline"
            >
              {activity.activity_data.topic_title}
            </Link>
          </>
        );
      case 'reply_created':
        return (
          <>
            heeft gereageerd op een{' '}
            <Link 
              to={`/topics/${activity.activity_data.topic_id}`}
              className="font-medium text-primary hover:underline"
            >
              topic
            </Link>
          </>
        );
      default:
        return 'heeft een activiteit uitgevoerd';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'topic_created':
        return 'bg-primary/10 text-primary';
      case 'reply_created':
        return 'bg-secondary/10 text-secondary';
      case 'vote_cast':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recente Activiteit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities?.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Nog geen activiteiten om te tonen
          </p>
        ) : (
          activities?.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.profiles?.avatar_url} />
                <AvatarFallback>
                  {activity.profiles?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link 
                    to={`/profile/${activity.profiles?.username}`}
                    className="font-medium text-sm hover:underline"
                  >
                    {activity.profiles?.display_name || activity.profiles?.username}
                  </Link>
                  <Badge 
                    variant="secondary" 
                    className={`h-6 w-6 p-0 rounded-full ${getActivityColor(activity.activity_type)}`}
                  >
                    {getActivityIcon(activity.activity_type)}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {getActivityText(activity)}
                </p>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(activity.created_at), { 
                    addSuffix: true, 
                    locale: nl 
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}