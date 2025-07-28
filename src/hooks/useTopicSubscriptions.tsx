import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TopicSubscription {
  id: string;
  user_id: string;
  topic_id: string;
  notification_type: 'all' | 'mentions' | 'replies';
  subscribed_at: string;
}

export function useTopicSubscriptions(topicId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is subscribed to a specific topic
  const { data: isSubscribed, isLoading: isCheckingSubscription } = useQuery({
    queryKey: ['topic-subscription', user?.id, topicId],
    queryFn: async () => {
      if (!user?.id || !topicId) return false;
      
      const { data, error } = await supabase
        .from('topic_subscriptions')
        .select('id, notification_type')
        .eq('user_id', user.id)
        .eq('topic_id', topicId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data ? { subscribed: true, type: data.notification_type } : { subscribed: false, type: null };
    },
    enabled: !!user?.id && !!topicId,
  });

  // Get all user's subscriptions
  const { data: userSubscriptions } = useQuery({
    queryKey: ['user-subscriptions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('topic_subscriptions')
        .select(`
          *,
          topics:topic_id(
            id,
            title,
            author_id,
            created_at,
            reply_count,
            view_count,
            profiles:author_id(username, display_name)
          )
        `)
        .eq('user_id', user.id)
        .order('subscribed_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Subscribe to topic mutation
  const subscribeMutation = useMutation({
    mutationFn: async ({ topicId, notificationType }: { topicId: string; notificationType: 'all' | 'mentions' | 'replies' }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('topic_subscriptions')
        .upsert({
          user_id: user.id,
          topic_id: topicId,
          notification_type: notificationType,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['topic-subscription', user?.id, variables.topicId] });
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
      
      toast({
        title: 'Geabonneerd',
        description: 'Je bent nu geabonneerd op dit topic.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Fout',
        description: 'Kon niet abonneren op dit topic.',
        variant: 'destructive',
      });
    },
  });

  // Unsubscribe from topic mutation
  const unsubscribeMutation = useMutation({
    mutationFn: async (topicId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('topic_subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('topic_id', topicId);
      
      if (error) throw error;
    },
    onSuccess: (_, topicId) => {
      queryClient.invalidateQueries({ queryKey: ['topic-subscription', user?.id, topicId] });
      queryClient.invalidateQueries({ queryKey: ['user-subscriptions'] });
      
      toast({
        title: 'Uitgeschreven',
        description: 'Je bent uitgeschreven van dit topic.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Fout',
        description: 'Kon niet uitschrijven van dit topic.',
        variant: 'destructive',
      });
    },
  });

  // Toggle subscription
  const toggleSubscription = (topicId: string, notificationType: 'all' | 'mentions' | 'replies' = 'all') => {
    if (!user?.id) {
      toast({
        title: 'Inloggen vereist',
        description: 'Je moet ingelogd zijn om je te abonneren op topics.',
        variant: 'destructive',
      });
      return;
    }

    const currentSubscription = isSubscribed as { subscribed: boolean; type: string | null };
    
    if (currentSubscription?.subscribed) {
      unsubscribeMutation.mutate(topicId);
    } else {
      subscribeMutation.mutate({ topicId, notificationType });
    }
  };

  return {
    isSubscribed: (isSubscribed as { subscribed: boolean; type: string | null })?.subscribed || false,
    subscriptionType: (isSubscribed as { subscribed: boolean; type: string | null })?.type,
    isCheckingSubscription,
    userSubscriptions,
    toggleSubscription,
    subscribe: subscribeMutation.mutate,
    unsubscribe: unsubscribeMutation.mutate,
    isToggling: subscribeMutation.isPending || unsubscribeMutation.isPending,
  };
}