import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { Skeleton } from '@/components/ui/skeleton';
import { AchievementBadge } from '@/components/gamification/AchievementBadge';

export function AchievementsShowcase() {
  const { userLevel, userRewards, getNextLevelInfo, isLoading } = useGamification();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-16" />
        </CardContent>
      </Card>
    );
  }

  const nextLevel = getNextLevelInfo();
  const recentRewards = userRewards?.slice(0, 3) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <CardTitle>Jouw Prestaties</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Level {userLevel?.current_level || 1}
              </p>
              <p className="text-xs text-muted-foreground">
                {userLevel?.xp_this_level || 0} / {nextLevel?.nextLevel?.required_xp || 0} XP
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>{nextLevel?.xpNeeded || 0} XP nodig</span>
            </div>
          </div>
          
          <Progress value={nextLevel?.progress || 0} className="h-2" />
        </div>

        {/* Recent Badges */}
        {recentRewards.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Recente Badges</h4>
            <div className="flex flex-wrap gap-2">
              {recentRewards.map((userReward) => {
                if (!userReward.reward) return null;
                
                const achievement = {
                  id: userReward.reward.id,
                  name: userReward.reward.name,
                  description: userReward.reward.description || '',
                  icon: userReward.reward.icon || 'Award',
                  points: userReward.reward.cost_points,
                  category: 'reward',
                  rarity: 'common' as const,
                };
                
                return (
                  <AchievementBadge
                    key={userReward.id}
                    achievement={achievement}
                    earned={true}
                    earnedAt={userReward.claimed_at}
                  />
                );
              })}
            </div>
          </div>
        )}

        {recentRewards.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Nog geen badges verdiend. Blijf actief om je eerste badge te verdienen!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
