import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  criteria: any;
  is_active: boolean;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  progress: any;
  achievements: Achievement;
}

interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  streak_type: string;
}

export function useAchievements(userId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const targetUserId = userId || user?.id;

  // Get all achievements
  const { data: allAchievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('points', { ascending: true });
      
      if (error) throw error;
      return data as Achievement[];
    },
  });

  // Get user's earned achievements
  const { data: userAchievements, isLoading } = useQuery({
    queryKey: ['user-achievements', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements:achievement_id(*)
        `)
        .eq('user_id', targetUserId)
        .order('earned_at', { ascending: false });
      
      if (error) throw error;
      return data as UserAchievement[];
    },
    enabled: !!targetUserId,
  });

  // Get user's streaks
  const { data: userStreaks } = useQuery({
    queryKey: ['user-streaks', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', targetUserId);
      
      if (error) throw error;
      return data as UserStreak[];
    },
    enabled: !!targetUserId,
  });

  // Award achievement mutation
  const awardAchievementMutation = useMutation({
    mutationFn: async ({ achievementName, progressData }: { achievementName: string; progressData?: any }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { data, error } = await supabase.rpc('award_achievement', {
        target_user_id: user.id,
        achievement_name: achievementName,
        progress_data: progressData || {}
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Update streak mutation
  const updateStreakMutation = useMutation({
    mutationFn: async (streakType: string = 'login') => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { data, error } = await supabase.rpc('update_user_streak', {
        target_user_id: user.id,
        p_streak_type: streakType
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-streaks'] });
    },
  });

  // Helper functions
  const isAchievementEarned = (achievementName: string): boolean => {
    return userAchievements?.some(ua => ua.achievements.name === achievementName) || false;
  };

  const getAchievementsByCategory = (category: string): Achievement[] => {
    return allAchievements?.filter(a => a.category === category) || [];
  };

  const getUserAchievementsByCategory = (category: string): UserAchievement[] => {
    return userAchievements?.filter(ua => ua.achievements.category === category) || [];
  };

  const getTotalPoints = (): number => {
    return userAchievements?.reduce((total, ua) => total + ua.achievements.points, 0) || 0;
  };

  const getCurrentStreak = (streakType: string): number => {
    return userStreaks?.find(s => s.streak_type === streakType)?.current_streak || 0;
  };

  const getLongestStreak = (streakType: string): number => {
    return userStreaks?.find(s => s.streak_type === streakType)?.longest_streak || 0;
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'uncommon': return 'text-green-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getRarityBg = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'bg-gray-100';
      case 'uncommon': return 'bg-green-100';
      case 'rare': return 'bg-blue-100';
      case 'epic': return 'bg-purple-100';
      case 'legendary': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  return {
    allAchievements,
    userAchievements,
    userStreaks,
    isLoading,
    awardAchievement: awardAchievementMutation.mutate,
    updateStreak: updateStreakMutation.mutate,
    isAchievementEarned,
    getAchievementsByCategory,
    getUserAchievementsByCategory,
    getTotalPoints,
    getCurrentStreak,
    getLongestStreak,
    getRarityColor,
    getRarityBg,
  };
}