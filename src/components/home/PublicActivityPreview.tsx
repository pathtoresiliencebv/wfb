import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { usePublicActivity } from '@/hooks/usePublicActivity';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

export function PublicActivityPreview() {
  const { activities, isLoading } = usePublicActivity(6);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return null;
  }

  const getActivityText = (activity: any) => {
    switch (activity.activity_type) {
      case 'topic_created':
        return 'heeft een nieuw topic aangemaakt';
      case 'reply_created':
        return 'heeft gereageerd op een topic';
      case 'achievement_earned':
        return 'heeft een badge verdiend';
      case 'level_up':
        return 'is een level omhoog gegaan';
      default:
        return 'was actief';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle>Recente Activiteit</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.profiles.avatar_url} />
              <AvatarFallback>
                {(activity.profiles.display_name || activity.profiles.username).charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">
                  {activity.profiles.display_name || activity.profiles.username}
                </span>
                {' '}
                <span className="text-muted-foreground">
                  {getActivityText(activity)}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(activity.created_at), { 
                  addSuffix: true,
                  locale: nl 
                })}
              </p>
            </div>
            
            {activity.activity_type === 'achievement_earned' && (
              <Badge variant="secondary">🏆</Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
