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
import { motion } from 'framer-motion';

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
      <CardContent className="space-y-2">
        {activities?.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Nog geen activiteiten om te tonen
          </p>
        ) : (
          activities?.map((activity) => {
            const targetUrl = activity.activity_data?.topic_id 
              ? `/topic/${activity.activity_data.topic_id}`
              : `/profile/${activity.profiles?.username}`;
            
            return (
              <Link 
                key={activity.id}
                to={targetUrl}
                className="block"
              >
                <motion.div
                  className="flex items-start gap-3 p-3 -mx-3 rounded-lg border hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 active:scale-[0.98] cursor-pointer min-h-[80px]"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={activity.profiles?.avatar_url} />
                    <AvatarFallback>
                      {activity.profiles?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">
                        {activity.profiles?.display_name || activity.profiles?.username}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`h-6 w-6 p-0 rounded-full flex items-center justify-center ${getActivityColor(activity.activity_type)}`}
                      >
                        {getActivityIcon(activity.activity_type)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-snug">
                      {getActivityText(activity)}
                    </p>
                    
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { 
                        addSuffix: true, 
                        locale: nl 
                      })}
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}