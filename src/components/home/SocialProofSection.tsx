import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRealTimeActivity } from '@/hooks/useRealTimeActivity';
import { useRecentMembers } from '@/hooks/useRecentMembers';
import { useRealTimeStats } from '@/hooks/useRealTimeStats';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import { TrendingUp, Users, MessageSquare, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SocialProofSection() {
  const { activities, isLoading: activitiesLoading, error: activitiesError } = useRealTimeActivity(5);
  const { members, isLoading: membersLoading, error: membersError } = useRecentMembers(8);
  const { stats } = useRealTimeStats();

  const getActivityText = (activity: any) => {
    switch (activity.activity_type) {
      case 'topic_created':
        return 'heeft een nieuw topic gestart';
      case 'reply_created':
        return 'reageerde op een topic';
      case 'achievement_earned':
        return 'heeft een badge verdiend';
      default:
        return 'was actief';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Wat Gebeurt Er Nu</h2>
        <p className="text-muted-foreground">
          Bekijk de levendige activiteit in onze community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Member Activity Feed */}
        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Live Activiteit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[320px] pr-4">
              {activitiesError || !activities || activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <Activity className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Nog geen recente activiteit
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Wees de eerste om actief te worden!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user_id}`} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">Gebruiker</span>{' '}
                          {getActivityText(activity)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.created_at), {
                            addSuffix: true,
                            locale: nl,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Registrations */}
        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Nieuwe Leden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[320px] pr-4">
              {membersError || !members || members.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <Users className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Nog geen nieuwe leden
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Word de eerste die zich registreert!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => (
                    <div 
                      key={member.id} 
                      className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback>
                            {member.display_name?.[0] || member.username?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {member.display_name || member.username}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            🆕
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(member.created_at), {
                            addSuffix: true,
                            locale: nl,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Community Stats Card */}
        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Community Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Totaal Leden</p>
                    <p className="text-2xl font-bold">{stats?.userCount || 0}</p>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Topics</p>
                    <p className="text-2xl font-bold">{stats?.topicCount || 0}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expert Leden</p>
                    <p className="text-2xl font-bold">{stats?.expertCount || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/register" className="block">
              <Button className="w-full" size="lg">
                Word Lid van {stats?.userCount || 0}+ Actieve Leden
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
