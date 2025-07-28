import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAchievements } from '@/hooks/useAchievements';
import { Calendar, Flame, Trophy, Target } from 'lucide-react';

interface StreakTrackerProps {
  userId?: string;
  compact?: boolean;
}

export function StreakTracker({ userId, compact = false }: StreakTrackerProps) {
  const { userStreaks, isLoading } = useAchievements(userId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-2 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const loginStreak = userStreaks?.find(s => s.streak_type === 'login');
  const postStreak = userStreaks?.find(s => s.streak_type === 'post');

  const streakData = [
    {
      type: 'login',
      title: 'Inlog Streak',
      icon: Calendar,
      current: loginStreak?.current_streak || 0,
      longest: loginStreak?.longest_streak || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      nextMilestone: getNextMilestone(loginStreak?.current_streak || 0),
    },
    {
      type: 'post',
      title: 'Post Streak',
      icon: Flame,
      current: postStreak?.current_streak || 0,
      longest: postStreak?.longest_streak || 0,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      nextMilestone: getNextMilestone(postStreak?.current_streak || 0),
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {streakData.map((streak) => {
          const Icon = streak.icon;
          return (
            <Card key={streak.type} className="relative overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full ${streak.bgColor}`}>
                    <Icon size={16} className={streak.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground truncate">
                      {streak.title}
                    </p>
                    <p className="text-lg font-bold">{streak.current}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5" />
          <span>Streak Tracker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {streakData.map((streak) => {
          const Icon = streak.icon;
          const progressToNext = streak.nextMilestone 
            ? (streak.current / streak.nextMilestone) * 100 
            : 100;

          return (
            <div key={streak.type} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${streak.bgColor}`}>
                    <Icon size={20} className={streak.color} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{streak.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Huidige streak: {streak.current} dagen
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant="outline" className={streak.color}>
                    Record: {streak.longest}
                  </Badge>
                </div>
              </div>

              {streak.nextMilestone && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Voortgang naar {streak.nextMilestone} dagen
                    </span>
                    <span className="font-medium">
                      {streak.current}/{streak.nextMilestone}
                    </span>
                  </div>
                  <Progress 
                    value={progressToNext} 
                    className="h-2" 
                  />
                </div>
              )}

              {streak.current > 0 && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Target size={14} />
                  <span>
                    {streak.current === 1 
                      ? 'Goed bezig! Blijf volhouden.' 
                      : `Geweldig! ${streak.current} dagen op rij.`
                    }
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function getNextMilestone(current: number): number | null {
  const milestones = [7, 30, 50, 100, 365];
  return milestones.find(m => m > current) || null;
}