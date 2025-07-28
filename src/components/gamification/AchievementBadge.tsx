import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAchievements } from '@/hooks/useAchievements';
import * as LucideIcons from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
  earnedAt?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function AchievementBadge({ 
  achievement, 
  earned = false, 
  earnedAt,
  size = 'md',
  showDetails = false 
}: AchievementBadgeProps) {
  const { getRarityColor, getRarityBg } = useAchievements();
  
  // Get the icon dynamically
  const IconComponent = (LucideIcons as any)[achievement.icon] || LucideIcons.Award;
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const content = (
    <div className={`
      relative inline-flex items-center justify-center 
      ${sizeClasses[size]} 
      rounded-full border-2 transition-all duration-200
      ${earned 
        ? `${getRarityBg(achievement.rarity)} border-current ${getRarityColor(achievement.rarity)} hover:scale-110` 
        : 'bg-muted border-muted-foreground/20 text-muted-foreground/40'
      }
    `}>
      <IconComponent 
        size={iconSizes[size]} 
        className={earned ? 'text-current' : 'text-muted-foreground/40'}
      />
      
      {/* Shine effect for rare+ achievements when earned */}
      {earned && ['rare', 'epic', 'legendary'].includes(achievement.rarity) && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-30" />
      )}
      
      {/* Legendary glow effect */}
      {earned && achievement.rarity === 'legendary' && (
        <div className="absolute -inset-1 rounded-full bg-yellow-400/30 blur-sm -z-10 animate-pulse" />
      )}
    </div>
  );

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center space-y-1">
              <div className="font-semibold">{achievement.name}</div>
              <div className="text-sm text-muted-foreground">{achievement.description}</div>
              <div className="flex items-center justify-between text-xs">
                <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                  {achievement.rarity}
                </Badge>
                <span className="text-muted-foreground">{achievement.points} punten</span>
              </div>
              {earned && earnedAt && (
                <div className="text-xs text-muted-foreground">
                  Behaald: {new Date(earnedAt).toLocaleDateString('nl-NL')}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card className={`${earned ? 'ring-1 ring-current' : 'opacity-60'} ${getRarityColor(achievement.rarity)}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          {content}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{achievement.name}</h4>
              <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                {achievement.rarity}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{achievement.points} punten</span>
              {earned && earnedAt && (
                <span className="text-muted-foreground">
                  {new Date(earnedAt).toLocaleDateString('nl-NL')}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}