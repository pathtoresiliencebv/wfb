import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/hooks/useGamification';
import * as LucideIcons from 'lucide-react';

interface UserLevelCardProps {
  userId?: string;
  compact?: boolean;
}

export function UserLevelCard({ userId, compact = false }: UserLevelCardProps) {
  const { userLevel, getNextLevelInfo, getUserRank, levelDefinitions, isLoading } = useGamification(userId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userLevel) return null;

  const nextLevelInfo = getNextLevelInfo();
  const userRank = getUserRank();
  const currentLevelDef = levelDefinitions?.find(ld => ld.level_number === userLevel.current_level);
  
  const IconComponent = currentLevelDef?.icon ? 
    (LucideIcons as any)[currentLevelDef.icon] || LucideIcons.Star : 
    LucideIcons.Star;

  if (compact) {
    return (
      <div className="flex items-center space-x-3 p-3 bg-card rounded-lg border">
        <div 
          className="flex items-center justify-center w-10 h-10 rounded-full border-2"
          style={{ borderColor: currentLevelDef?.color, backgroundColor: `${currentLevelDef?.color}20` }}
        >
          <IconComponent size={20} style={{ color: currentLevelDef?.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">{userLevel.level_title}</span>
            <Badge variant="outline" className="text-xs">
              Lvl {userLevel.current_level}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            {userLevel.total_xp.toLocaleString()} XP
            {userRank > 0 && ` • #${userRank}`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full border-2"
              style={{ borderColor: currentLevelDef?.color, backgroundColor: `${currentLevelDef?.color}20` }}
            >
              <IconComponent size={16} style={{ color: currentLevelDef?.color }} />
            </div>
            <span>Level Progress</span>
          </div>
          {userRank > 0 && (
            <Badge variant="outline">
              Rank #{userRank}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{userLevel.level_title}</h3>
            <p className="text-sm text-muted-foreground">Level {userLevel.current_level}</p>
          </div>
          <div className="text-right">
            <div className="font-bold">{userLevel.total_xp.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </div>
        </div>

        {nextLevelInfo && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Progress to {nextLevelInfo.nextLevel.title}</span>
              <span>{nextLevelInfo.xpNeeded.toLocaleString()} XP needed</span>
            </div>
            <Progress 
              value={nextLevelInfo.progress} 
              className="h-2"
            />
            <div className="text-xs text-muted-foreground text-center">
              {nextLevelInfo.progress.toFixed(1)}% complete
            </div>
          </div>
        )}

        {currentLevelDef?.perks && Array.isArray(currentLevelDef.perks) && currentLevelDef.perks.length > 0 && (
          <div className="pt-2 border-t">
            <h4 className="font-semibold text-sm mb-2">Level Perks</h4>
            <div className="space-y-1">
              {currentLevelDef.perks.map((perk: any, index: number) => (
                <div key={index} className="text-xs text-muted-foreground flex items-center">
                  <LucideIcons.Check size={12} className="text-green-500 mr-2" />
                  {typeof perk === 'object' ? perk.description : perk}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}