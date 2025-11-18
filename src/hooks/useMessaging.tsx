import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  is_deleted?: boolean;
  deleted_at?: string;
  is_edited?: boolean;
  edited_at?: string;
  expires_at: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
  participants?: Array<{
    user_id: string;
    joined_at: string;
    last_read_at: string | null;
    profiles: {
      username: string;
      display_name: string;
      avatar_url?: string;
      is_verified?: boolean;
    };
  }>;
  last_message?: any;
  unread_count?: number;
}

export function useMessaging() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Participant cache to reduce duplicate queries
  const [participantCache] = useState(new Map());

  // Fetch conversations with simplified query strategy
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async (): Promise<Conversation[]> => {
      if (!user) return [];

      console.log('[useMessaging] Starting conversations fetch for user:', user.id);
      const startTime = performance.now();

      // Step 1: Fetch conversations (simple query without joins)
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (convError) {
        console.error('[useMessaging] Error fetching conversations:', convError);
        throw convError;
      }

      console.log('[useMessaging] Found conversations:', convData?.length || 0);

      if (!convData || convData.length === 0) return [];

      // Step 2: Fetch participants separately for each conversation
      const conversationsWithDetails = await Promise.all(
        convData.map(async (conv) => {
          // Check cache first
          let participants = participantCache.get(conv.id);
          
          if (!participants) {
            const { data: participantsData, error: participantsError } = await supabase
              .from('conversation_participants')
              .select(`
                user_id,
                joined_at,
                last_read_at,
                profiles:user_id (
                  username,
                  display_name,
                  avatar_url,
                  is_verified
                )
              `)
              .eq('conversation_id', conv.id);

            if (participantsError) {
              console.error('[useMessaging] Error fetching participants for conv', conv.id, participantsError);
              return null;
            }

            participants = participantsData || [];
            participantCache.set(conv.id, participants);
          }

          // Check if user is a participant
          const isUserParticipant = participants.some((p: any) => p.user_id === user.id);
          if (!isUserParticipant) return null;

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          // Get unread count
          const userParticipant = participants.find((p: any) => p.user_id === user.id);
          const lastReadAt = userParticipant?.last_read_at;

          let unreadCount = 0;
          if (lastReadAt) {
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .gt('created_at', lastReadAt)
              .neq('sender_id', user.id);
            unreadCount = count || 0;
          } else {
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .neq('sender_id', user.id);
            unreadCount = count || 0;
          }

          return {
            ...conv,
            participants,
            last_message: lastMessage,
            unread_count: unreadCount,
          };
        })
      );

      // Filter out null values (conversations where user is not a participant)
      const validConversations = conversationsWithDetails.filter(conv => conv !== null);

      const endTime = performance.now();
      console.log(`[useMessaging] Conversations loaded in ${(endTime - startTime).toFixed(2)}ms:`, validConversations.length);

      return validConversations;
    },
    enabled: !!user,
  });

  // Fetch messages for a specific conversation
  const useConversationMessages = (conversationId: string | null) => {
    return useQuery<Message[]>({
      queryKey: ['messages', conversationId],
      queryFn: async (): Promise<Message[]> => {
        if (!conversationId) return [];

        console.log('[DEBUG] Fetching messages:', {
          conversationId,
          timestamp: new Date().toISOString()
        });

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .eq('is_deleted', false)
          .gte('expires_at', new Date().toISOString())
          .order('created_at', { ascending: true });

        console.log('[DEBUG] Messages fetched:', {
          count: data?.length || 0,
          messages: data,
          error: error?.message
        });

        if (error) throw error;
        return data || [];
      },
      enabled: !!conversationId,
      refetchOnMount: true,
      staleTime: 0,
    });
  };

  // Create a new conversation
  const createConversationMutation = useMutation({
    mutationFn: async (participantUserId: string) => {
      if (!user) throw new Error('User not authenticated');

      console.log('[useMessaging] Checking for existing conversation with:', participantUserId);

      // Check with efficient database function
      const { data: existingConvId, error: findError } = await supabase.rpc(
        'find_existing_conversation',
        {
          current_user_id: user.id,
          other_user_id: participantUserId,
        }
      );

      if (findError) {
        console.error('[useMessaging] Error finding existing conversation:', findError);
      }

      if (existingConvId) {
        console.log('[useMessaging] Found existing conversation:', existingConvId);
        return existingConvId;
      }

      console.log('[useMessaging] Creating new conversation...');

      // Create new conversation
      const { data: conversationId, error } = await supabase.rpc(
        'create_conversation_with_participants',
        {
          participant_user_ids: [user.id, participantUserId],
        }
      );

      if (error) throw error;

      console.log('[useMessaging] Created new conversation:', conversationId);
      
      return conversationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  // Send a message
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('[useMessaging] Sending message to conversation:', conversationId);

      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
      });

      if (error) {
        console.error('[useMessaging] Message insert failed:', error);
        throw error;
      }
      
      console.log('[useMessaging] Message sent successfully');
    },
    retry: 2,
    retryDelay: 1000,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      // Show success toast
      toast({
        title: 'Bericht verzonden',
        description: 'Je bericht is succesvol verzonden',
      });
    },
    onError: (error, variables, context) => {
      console.error('[useMessaging] Send message failed after retries:', {
        error,
        conversationId: variables.conversationId,
        context
      });
      toast({
        variant: "destructive",
        title: "Bericht niet verzonden",
        description: "Er ging iets mis. Probeer het opnieuw.",
      });
    }
  });

  // Mark conversation as read
  const markConversationAsReadMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      console.error('Failed to mark as read:', error);
      // Silent error - not critical for user experience
    }
  });

  // Delete message (soft delete)
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .update({ 
          is_deleted: true, 
          deleted_at: new Date().toISOString() 
        })
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) throw error;
    },
    retry: 1,
    retryDelay: 500,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: 'Bericht verwijderd',
        description: 'Je bericht is succesvol verwijderd',
      });
    },
    onError: (error) => {
      console.error('Failed to delete message:', error);
      toast({
        variant: "destructive",
        title: "Kon bericht niet verwijderen",
        description: "Probeer het opnieuw",
      });
    }
  });

  // Edit message
  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, newContent }: { messageId: string; newContent: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .update({ 
          content: newContent,
          is_edited: true,
          edited_at: new Date().toISOString() 
        })
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: 'Bericht bewerkt',
        description: 'Je bericht is succesvol bijgewerkt',
      });
    },
    onError: (error) => {
      console.error('Failed to edit message:', error);
      toast({
        variant: "destructive",
        title: "Kon bericht niet bewerken",
        description: "Probeer het opnieuw",
      });
    }
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    console.log('[REALTIME] Setting up message subscriptions for user:', user.id);

    const channel = supabase
      .channel(`user-messages-${user.id}`) // Unique channel name per user
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          console.log('[REALTIME] New message received:', {
            messageId: newMessage.id,
            conversationId: newMessage.conversation_id,
            fromSelf: newMessage.sender_id === user.id
          });
          
          // Only show toast if message is not from current user
          if (newMessage.sender_id !== user.id) {
            toast({
              title: 'Nieuw bericht',
              description: newMessage.content.substring(0, 50) + '...',
            });
          }

          // Invalidate relevant queries to trigger refetch
          queryClient.invalidateQueries({ queryKey: ['messages'] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('[REALTIME] Message updated:', payload.new?.id);
          // Refresh messages when they're edited or deleted
          queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
      )
      .subscribe((status) => {
        console.log('[REALTIME] Messages subscription status:', status);
      });

    return () => {
      console.log('[REALTIME] Cleaning up message subscription');
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient, toast]);

  // Set up real-time subscription for new conversations
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`user-conversations-${user.id}`) // Unique channel name per user
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_participants',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refresh conversations when user is added to a new one
          queryClient.invalidateQueries({ queryKey: ['conversations', user.id] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          // Refresh conversations when last_message_at is updated
          queryClient.invalidateQueries({ queryKey: ['conversations', user.id] });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const createConversation = (participantUserId: string) => {
    return createConversationMutation.mutateAsync(participantUserId);
  };

  const sendMessage = (conversationId: string, content: string) => {
    return sendMessageMutation.mutateAsync({ conversationId, content });
  };

  const markConversationAsRead = (conversationId: string) => {
    markConversationAsReadMutation.mutate(conversationId);
  };

  const deleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  const editMessage = (messageId: string, newContent: string) => {
    editMessageMutation.mutate({ messageId, newContent });
  };

  // Calculate total unread messages across all conversations
  const totalUnreadCount = conversations?.reduce(
    (total, conv) => total + (conv.unread_count || 0),
    0
  ) || 0;

  return {
    conversations: conversations || [],
    conversationsLoading,
    useConversationMessages,
    createConversation,
    sendMessage,
    markConversationAsRead,
    deleteMessage,
    editMessage,
    totalUnreadCount,
    isSendingMessage: sendMessageMutation.isPending,
    isCreatingConversation: createConversationMutation.isPending,
    isMarkingAsRead: markConversationAsReadMutation.isPending,
    isDeletingMessage: deleteMessageMutation.isPending,
    isEditingMessage: editMessageMutation.isPending,
  };
}