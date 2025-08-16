
import React from 'react';
import { Calendar, MessageSquare, ThumbsUp, UserPlus, Star, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const getActivityIcon = (activityType: string) => {
  switch (activityType) {
    case 'topic_created':
      return FileText;
    case 'reply_created':
      return MessageSquare;
    case 'vote_cast':
      return ThumbsUp;
    case 'user_joined':
      return UserPlus;
    case 'achievement_earned':
      return Star;
    default:
      return MessageSquare;
  }
};

const getActivityText = (activity: any) => {
  const displayName = activity.profiles?.display_name || activity.profiles?.username || 'Onbekende gebruiker';
  
  switch (activity.activity_type) {
    case 'topic_created':
      return {
        user: displayName,
        action: 'maakte een nieuw topic',
        target: activity.activity_data?.topic_title || 'topic'
      };
    case 'reply_created':
      return {
        user: displayName,
        action: 'reageerde op',
        target: activity.activity_data?.topic_title || 'een topic'
      };
    case 'vote_cast':
      return {
        user: displayName,
        action: 'gaf een vote op',
        target: activity.activity_data?.item_title || 'een post'
      };
    case 'user_joined':
      return {
        user: displayName,
        action: 'werd lid van',
        target: 'de community'
      };
    case 'achievement_earned':
      return {
        user: displayName,
        action: 'verdiende',
        target: activity.activity_data?.achievement_name || 'een achievement'
      };
    default:
      return {
        user: displayName,
        action: 'was actief in',
        target: 'de community'
      };
  }
};

export function RecentActivity() {
  const { activities, isLoading, error } = useActivityFeed();

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Recente Activiteit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Er ging iets mis bij het laden van activiteiten.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Recente Activiteit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-2 bg-muted rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          activities.slice(0, 5).map((activity) => {
            const ActivityIcon = getActivityIcon(activity.activity_type);
            const { user, action, target } = getActivityText(activity);
            
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <ActivityIcon className="h-3 w-3 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">
                    <Link 
                      to={`/user/${activity.user_id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {user}
                    </Link>
                    {' '}{action}{' '}
                    <span className="font-medium text-foreground">{target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { 
                      addSuffix: true, 
                      locale: nl 
                    })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground">Nog geen recente activiteit.</p>
        )}
      </CardContent>
    </Card>
  );
}
