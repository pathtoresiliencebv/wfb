import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface OnlineUser {
  user_id: string;
  last_seen: string;
  is_online: boolean;
  profiles: {
    username: string;
    display_name: string;
    avatar_url: string;
  } | null;
}

export function useOnlineStatus() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Get online users
  const { data: onlineUsers = [], isLoading } = useQuery({
    queryKey: ['online-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_online_status')
        .select(`
          user_id,
          last_seen,
          is_online
        `)
        .eq('is_online', true)
        .gte('last_seen', new Date(Date.now() - 30 * 60 * 1000).toISOString()) // Last 30 minutes
        .order('last_seen', { ascending: false });

      if (error) throw error;
      
      // Fetch profiles separately for online users
      if (!data || data.length === 0) return [];
      
      const userIds = data.map(u => u.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, username, display_name, avatar_url')
        .in('user_id', userIds);
      
      // Combine online status with profile data
      return data.map(onlineUser => ({
        ...onlineUser,
        profiles: profiles?.find(p => p.user_id === onlineUser.user_id) || null
      })) as OnlineUser[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Update user online status
  const updateStatusMutation = useMutation({
    mutationFn: async (online: boolean) => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('user_online_status')
        .upsert({
          user_id: user.id,
          is_online: online,
          last_seen: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['online-users'] });
    },
  });

  // Handle browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      updateStatusMutation.mutate(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      updateStatusMutation.mutate(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updateStatusMutation]);

  // Update status on mount and cleanup on unmount
  useEffect(() => {
    if (user?.id) {
      updateStatusMutation.mutate(true);
    }

    // Cleanup: set offline when component unmounts
    return () => {
      if (user?.id) {
        updateStatusMutation.mutate(false);
      }
    };
  }, [user?.id]);

  // Heartbeat to keep status updated
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      if (isOnline) {
        updateStatusMutation.mutate(true);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user?.id, isOnline, updateStatusMutation]);

  // Real-time subscription for online status changes
  useEffect(() => {
    const channel = supabase
      .channel('online-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_online_status',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['online-users'] });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  const getOnlineCount = () => onlineUsers.length;
  
  const isUserOnline = (userId: string) => {
    return onlineUsers.some(user => user.user_id === userId);
  };

  return {
    onlineUsers,
    isLoading,
    getOnlineCount,
    isUserOnline,
    isOnline,
  };
}
