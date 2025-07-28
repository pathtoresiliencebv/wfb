import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAchievements } from '@/hooks/useAchievements';
import * as LucideIcons from 'lucide-react';

interface AchievementNotificationProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  };
  onClose?: () => void;
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const { getRarityColor, getRarityBg } = useAchievements();
  const IconComponent = (LucideIcons as any)[achievement.icon] || LucideIcons.Award;

  useEffect(() => {
    // Auto-close after delay based on rarity
    const delay = achievement.rarity === 'legendary' ? 8000 : 
                  achievement.rarity === 'epic' ? 6000 : 
                  achievement.rarity === 'rare' ? 5000 : 4000;

    const timer = setTimeout(() => {
      onClose?.();
    }, delay);

    return () => clearTimeout(timer);
  }, [achievement.rarity, onClose]);

  return (
    <Card className={`
      border-2 shadow-lg transition-all duration-300 animate-scale-in
      ${getRarityBg(achievement.rarity)} ${getRarityColor(achievement.rarity)}
      ${achievement.rarity === 'legendary' ? 'shadow-yellow-400/30' : ''}
    `}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`
            relative flex items-center justify-center w-12 h-12 rounded-full
            ${getRarityBg(achievement.rarity)} border-2 border-current
          `}>
            <IconComponent size={24} className="text-current" />
            
            {/* Special effects for higher rarities */}
            {achievement.rarity === 'legendary' && (
              <div className="absolute -inset-1 rounded-full bg-yellow-400/30 blur-sm -z-10 animate-pulse" />
            )}
            
            {['rare', 'epic', 'legendary'].includes(achievement.rarity) && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent" />
            )}
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">🎉 Prestatie Behaald!</h4>
              <Badge variant="outline" className={`${getRarityColor(achievement.rarity)} border-current`}>
                {achievement.rarity}
              </Badge>
            </div>
            
            <h5 className="font-semibold">{achievement.name}</h5>
            <p className="text-sm opacity-90">{achievement.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">+{achievement.points} punten</span>
              <span className="opacity-75">Gefeliciteerd! 🎊</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook to show achievement notifications
export function useAchievementNotifications() {
  const showAchievementToast = (achievement: AchievementNotificationProps['achievement']) => {
    toast.custom((t) => (
      <AchievementNotification 
        achievement={achievement} 
        onClose={() => toast.dismiss(t)}
      />
    ), {
      duration: achievement.rarity === 'legendary' ? 8000 : 
                achievement.rarity === 'epic' ? 6000 : 
                achievement.rarity === 'rare' ? 5000 : 4000,
      position: 'top-center',
    });
  };

  return { showAchievementToast };
}