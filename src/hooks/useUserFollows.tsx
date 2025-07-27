import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useUserFollows(userId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if current user follows the specified user
  const { data: isFollowing, isLoading: isFollowingLoading } = useQuery({
    queryKey: ['user-follows', user?.id, userId],
    queryFn: async () => {
      if (!user?.id || !userId || user.id === userId) return false;
      
      const { data, error } = await supabase
        .from('user_followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    },
    enabled: !!user?.id && !!userId && user.id !== userId,
  });

  // Get followers count for a user
  const { data: followersCount } = useQuery({
    queryKey: ['followers-count', userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      const { count, error } = await supabase
        .from('user_followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });

  // Get following count for a user
  const { data: followingCount } = useQuery({
    queryKey: ['following-count', userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      const { count, error } = await supabase
        .from('user_followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });

  // Follow/unfollow mutation
  const followMutation = useMutation({
    mutationFn: async ({ targetUserId, action }: { targetUserId: string; action: 'follow' | 'unfollow' }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      if (action === 'follow') {
        const { error } = await supabase
          .from('user_followers')
          .insert({
            follower_id: user.id,
            following_id: targetUserId,
          });
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_followers')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);
        
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-follows'] });
      queryClient.invalidateQueries({ queryKey: ['followers-count', variables.targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['following-count', user?.id] });
      
      toast({
        title: variables.action === 'follow' ? 'Gebruiker gevolgd' : 'Gebruiker ontvolgd',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Kon actie niet uitvoeren',
        variant: 'destructive',
      });
    },
  });

  const toggleFollow = (targetUserId: string) => {
    if (!user?.id || user.id === targetUserId) return;
    
    const action = isFollowing ? 'unfollow' : 'follow';
    followMutation.mutate({ targetUserId, action });
  };

  return {
    isFollowing,
    isFollowingLoading,
    followersCount,
    followingCount,
    toggleFollow,
    isToggling: followMutation.isPending,
  };
}