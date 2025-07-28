import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from './useNotifications';
import { useAchievementNotifications } from '@/components/gamification/AchievementNotification';
import { toast } from 'sonner';

export function useRealTimeNotifications() {
  const { user } = useAuth();
  const { refetch } = useNotifications();
  const { showAchievementToast } = useAchievementNotifications();

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to new notifications
    const notificationChannel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const notification = payload.new;
          
          // Show achievement notification if it's an achievement
          if (notification.type === 'achievement_earned' && notification.data?.achievement_id) {
            showAchievementToast({
              id: notification.data.achievement_id,
              name: notification.data.achievement_name,
              description: notification.message,
              icon: 'Trophy',
              points: notification.data.points || 0,
              rarity: 'common'
            });
          } else {
            // Show regular toast for other notifications
            toast(notification.title, {
              description: notification.message,
            });
          }
          
          refetch();
        }
      )
      .subscribe();

    // Subscribe to achievement awards
    const achievementChannel = supabase
      .channel('user-achievements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch achievements when new ones are earned
          // This will be handled by the achievement notification above
        }
      )
      .subscribe();

    return () => {
      notificationChannel.unsubscribe();
      achievementChannel.unsubscribe();
    };
  }, [user?.id, refetch, showAchievementToast]);

  return null;
}