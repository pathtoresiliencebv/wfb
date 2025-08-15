import React from 'react';
import { Trophy, Star, TrendingUp, Award, Medal, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/hooks/useGamification';
import { useAchievements } from '@/hooks/useAchievements';
import { EnhancedLeaderboard } from '@/components/gamification/EnhancedLeaderboard';
import { Skeleton } from '@/components/ui/skeleton';


const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  }
};


export default function Leaderboard() {
  const { leaderboard, isLoading: leaderboardLoading } = useGamification();
  const { 
    allAchievements, 
    userAchievements, 
    isLoading: achievementsLoading,
    getRarityColor 
  } = useAchievements();

  const isLoading = leaderboardLoading || achievementsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-heading text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">
              Onze meest waardevolle community leden
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const earnedAchievementIds = userAchievements?.map(ua => ua.achievement_id) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-heading text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">
            Onze meest waardevolle community leden
          </p>
        </div>
      </div>

      <Tabs defaultValue="contributors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contributors">Top Contributors</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="contributors" className="space-y-6">
          <EnhancedLeaderboard limit={10} showUserPosition={true} />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {allAchievements && allAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {allAchievements.map((achievement) => {
                const isEarned = userAchievements?.some(ua => ua.achievement_id === achievement.id) || false;
                return (
                  <Card key={achievement.id} className={`${isEarned ? 'border-primary' : 'opacity-60'}`}>
                    <CardContent className="p-6 text-center">
                      <div className={`h-12 w-12 mx-auto mb-3 flex items-center justify-center rounded-full ${isEarned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {achievement.icon ? (
                          <span className="text-2xl">{achievement.icon}</span>
                        ) : (
                          <Star className="h-6 w-6" />
                        )}
                      </div>
                      <h3 className={`font-medium mb-2 ${getRarityColor(achievement.rarity)}`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>
                      <Badge variant={isEarned ? 'default' : 'outline'} className="text-xs">
                        {isEarned ? 'Behaald' : 'Vergrendeld'}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Geen achievements beschikbaar</h3>
                <p className="text-muted-foreground">
                  Er zijn nog geen achievements ingesteld.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}