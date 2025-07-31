import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserLevelCard } from '@/components/gamification/UserLevelCard';
import { PointsOverview } from '@/components/gamification/PointsOverview';
import { AchievementBadge } from '@/components/gamification/AchievementBadge';
import { StreakTracker } from '@/components/gamification/StreakTracker';
import { RewardsStore } from '@/components/gamification/RewardsStore';
import { EnhancedLeaderboard } from '@/components/gamification/EnhancedLeaderboard';
import { useGamification } from '@/hooks/useGamification';
import { useAchievements } from '@/hooks/useAchievements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Gamification() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userRewards } = useGamification();
  const { userAchievements, allAchievements } = useAchievements();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Gamification Center</h1>
            <p className="text-muted-foreground">Track your progress, earn rewards, and compete with the community</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Stats */}
            <div className="lg:col-span-2 space-y-6">
              <UserLevelCard userId={user?.id} />
              <PointsOverview userId={user?.id} />
            </div>

            {/* Right Column - Quick Stats */}
            <div className="space-y-6">
              <StreakTracker userId={user?.id} />
              
              {/* Quick Achievement Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userAchievements?.slice(0, 5).map((userAchievement) => {
                      const achievement = allAchievements?.find(a => a.id === userAchievement.achievement_id);
                      if (!achievement) return null;
                      
                      return (
                        <div key={userAchievement.id} className="flex items-center space-x-3">
                          <AchievementBadge 
                            achievement={achievement} 
                            earned={true}
                            earnedAt={userAchievement.earned_at}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{achievement.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(userAchievement.earned_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {(!userAchievements || userAchievements.length === 0) && (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">No achievements yet</p>
                        <p className="text-xs">Start participating to earn your first achievement!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Rewards Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userRewards?.slice(0, 3).map((userReward) => (
                      <div key={userReward.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm font-medium">{userReward.reward.name}</span>
                        <span className="text-xs text-muted-foreground">{userReward.reward.reward_type}</span>
                      </div>
                    ))}
                    
                    {(!userRewards || userRewards.length === 0) && (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">No rewards claimed yet</p>
                        <p className="text-xs">Visit the rewards store to claim your first reward!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAchievements?.map((achievement) => {
              const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);
              return (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  earned={!!userAchievement}
                  earnedAt={userAchievement?.earned_at}
                  showDetails={true}
                />
              );
            })}
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <RewardsStore userId={user?.id} />
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <EnhancedLeaderboard limit={20} showUserPosition={true} />
        </TabsContent>

        {/* Streaks Tab */}
        <TabsContent value="streaks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StreakTracker userId={user?.id} compact={false} />
            
            <Card>
              <CardHeader>
                <CardTitle>Streak Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allAchievements?.filter(a => a.category === 'streak').map((achievement) => {
                    const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);
                    return (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        earned={!!userAchievement}
                        earnedAt={userAchievement?.earned_at}
                        showDetails={true}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}