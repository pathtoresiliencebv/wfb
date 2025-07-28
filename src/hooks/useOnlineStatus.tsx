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

  // Get online users - temporarily disabled due to migration
  const { data: onlineUsers = [], isLoading } = useQuery({
    queryKey: ['online-users'],
    queryFn: async () => {
      // Return mock data for now until migration is complete
      return [] as OnlineUser[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Update user online status - temporarily disabled
  const updateStatusMutation = useMutation({
    mutationFn: async (online: boolean) => {
      // Temporarily disabled until migration is complete
      return;
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
