import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Types
export interface UserLevel {
  id: string;
  user_id: string;
  current_level: number;
  total_xp: number;
  xp_this_level: number;
  level_title: string;
  created_at: string;
  updated_at: string;
}

export interface PointCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface UserPoints {
  id: string;
  user_id: string;
  category_id: string;
  points: number;
  created_at: string;
  updated_at: string;
  category: PointCategory;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  reward_type: 'badge' | 'title' | 'special_privilege' | 'cosmetic';
  cost_points: number;
  cost_category_id: string;
  required_level: number;
  icon: string;
  is_active: boolean;
  is_limited: boolean;
  max_claims?: number;
  current_claims: number;
  expires_at?: string;
  created_at: string;
  cost_category?: PointCategory;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  claimed_at: string;
  is_active: boolean;
  reward: Reward;
}

export interface LevelDefinition {
  id: string;
  level_number: number;
  title: string;
  required_xp: number;
  perks: any[];
  icon: string;
  color: string;
  created_at: string;
}

export function useGamification(userId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const targetUserId = userId || user?.id;

  // Fetch user level
  const { data: userLevel, isLoading: levelLoading } = useQuery({
    queryKey: ['userLevel', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      
      const { data, error } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', targetUserId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!targetUserId,
  });

  // Fetch user points by category
  const { data: userPoints, isLoading: pointsLoading } = useQuery({
    queryKey: ['userPoints', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const { data, error } = await supabase
        .from('user_points')
        .select(`
          *,
          category:point_categories(*)
        `)
        .eq('user_id', targetUserId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!targetUserId,
  });

  // Fetch point categories
  const { data: pointCategories } = useQuery({
    queryKey: ['pointCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('point_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch available rewards
  const { data: rewards, isLoading: rewardsLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select(`
          *,
          cost_category:point_categories(*)
        `)
        .eq('is_active', true)
        .order('cost_points');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user's claimed rewards
  const { data: userRewards, isLoading: userRewardsLoading } = useQuery({
    queryKey: ['userRewards', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const { data, error } = await supabase
        .from('user_rewards')
        .select(`
          *,
          reward:rewards(
            *,
            cost_category:point_categories(*)
          )
        `)
        .eq('user_id', targetUserId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!targetUserId,
  });

  // Fetch level definitions
  const { data: levelDefinitions } = useQuery({
    queryKey: ['levelDefinitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('level_definitions')
        .select('*')
        .order('level_number');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch leaderboard data
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_levels')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      // Fetch profiles separately
      const userIds = data?.map(d => d.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, username, display_name, avatar_url')
        .in('user_id', userIds);
      
      // Merge data
      return data?.map(level => ({
        ...level,
        profile: profiles?.find(p => p.user_id === level.user_id)
      })) || [];
    },
  });

  // Claim reward mutation
  const claimRewardMutation = useMutation({
    mutationFn: async ({ rewardId, categoryPoints }: { rewardId: string; categoryPoints: { [key: string]: number } }) => {
      // Check if user can afford the reward
      const reward = rewards?.find(r => r.id === rewardId);
      if (!reward) throw new Error('Reward not found');

      const userCategoryPoints = userPoints?.find(up => up.category_id === reward.cost_category_id);
      if (!userCategoryPoints || userCategoryPoints.points < reward.cost_points) {
        throw new Error('Insufficient points');
      }

      if (userLevel && userLevel.current_level < reward.required_level) {
        throw new Error('Level requirement not met');
      }

      // Claim the reward
      const { error } = await supabase
        .from('user_rewards')
        .insert({
          user_id: targetUserId,
          reward_id: rewardId,
        });

      if (error) throw error;

      // Deduct points (this would typically be done in a database function for atomicity)
      const { error: pointsError } = await supabase
        .from('user_points')
        .update({
          points: userCategoryPoints.points - reward.cost_points,
        })
        .eq('user_id', targetUserId)
        .eq('category_id', reward.cost_category_id);

      if (pointsError) throw pointsError;

      return { rewardId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRewards', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['userPoints', targetUserId] });
      toast.success('Beloning succesvol geclaimd!');
    },
    onError: (error: Error) => {
      toast.error(`Fout bij claimen beloning: ${error.message}`);
    },
  });

  // Helper functions
  const getTotalPointsByCategory = (categoryName: string): number => {
    const categoryPoints = userPoints?.find(up => up.category.name === categoryName);
    return categoryPoints?.points || 0;
  };

  const canClaimReward = (reward: Reward): boolean => {
    if (!userLevel || !userPoints) return false;
    
    const hasRequiredLevel = userLevel.current_level >= reward.required_level;
    const hasRequiredPoints = getTotalPointsByCategory(reward.cost_category?.name || '') >= reward.cost_points;
    const notAlreadyClaimed = !userRewards?.some(ur => ur.reward_id === reward.id);
    
    return hasRequiredLevel && hasRequiredPoints && notAlreadyClaimed;
  };

  const getNextLevelInfo = () => {
    if (!userLevel || !levelDefinitions) return null;
    
    const nextLevel = levelDefinitions.find(ld => ld.level_number === userLevel.current_level + 1);
    if (!nextLevel) return null;
    
    const xpNeeded = nextLevel.required_xp - userLevel.total_xp;
    const progress = ((userLevel.total_xp - (levelDefinitions.find(ld => ld.level_number === userLevel.current_level)?.required_xp || 0)) / 
                     (nextLevel.required_xp - (levelDefinitions.find(ld => ld.level_number === userLevel.current_level)?.required_xp || 0))) * 100;
    
    return {
      nextLevel,
      xpNeeded: Math.max(0, xpNeeded),
      progress: Math.min(100, Math.max(0, progress)),
    };
  };

  const getUserRank = (): number => {
    if (!userLevel || !leaderboard) return 0;
    
    const rank = leaderboard.findIndex(entry => entry.user_id === targetUserId) + 1;
    return rank;
  };

  const isLoading = levelLoading || pointsLoading || rewardsLoading || userRewardsLoading || leaderboardLoading;

  return {
    // Data
    userLevel,
    userPoints,
    pointCategories,
    rewards,
    userRewards,
    levelDefinitions,
    leaderboard,
    
    // Loading states
    isLoading,
    
    // Actions
    claimReward: claimRewardMutation.mutate,
    
    // Helper functions
    getTotalPointsByCategory,
    canClaimReward,
    getNextLevelInfo,
    getUserRank,
  };
}