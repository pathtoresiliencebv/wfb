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

  // Fetch conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async (): Promise<Conversation[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_participants!inner (
            user_id,
            joined_at,
            last_read_at,
            profiles (
              username,
              display_name,
              avatar_url,
              is_verified
            )
          )
        `)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;

      // Filter conversations where user is a participant
      const userConversations = (data || []).filter(conv =>
        conv.conversation_participants.some((p: any) => p.user_id === user.id)
      );

      // Fetch last message and unread count for each conversation
      const conversationsWithDetails = await Promise.all(
        userConversations.map(async (conv) => {
          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const userParticipant = conv.conversation_participants.find(
            (p: any) => p.user_id === user.id
          );
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
            last_message: lastMessage,
            unread_count: unreadCount,
          };
        })
      );

      return conversationsWithDetails;
    },
    enabled: !!user,
  });

  // Fetch messages for a specific conversation
  const useConversationMessages = (conversationId: string | null) => {
    return useQuery({
      queryKey: ['messages', conversationId],
      queryFn: async (): Promise<Message[]> => {
        if (!conversationId) return [];

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .eq('is_deleted', false)
          .gte('expires_at', new Date().toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
      },
      enabled: !!conversationId,
    });
  };

  // Create a new conversation
  const createConversationMutation = useMutation({
    mutationFn: async (participantUserId: string) => {
      if (!user) throw new Error('User not authenticated');

      // Check if conversation already exists
      const { data: existingConversations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (existingConversations) {
        for (const conv of existingConversations) {
          const { data: otherParticipants } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conv.conversation_id)
            .neq('user_id', user.id);

          if (
            otherParticipants?.length === 1 &&
            otherParticipants[0].user_id === participantUserId
          ) {
            return conv.conversation_id;
          }
        }
      }

      // Use database function to create conversation with participants
      const { data: conversationId, error } = await supabase.rpc(
        'create_conversation_with_participants',
        {
          participant_user_ids: [user.id, participantUserId],
        }
      );

      if (error) throw error;

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

      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
      });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: 'Bericht verwijderd',
        description: 'Je bericht is succesvol verwijderd',
      });
    },
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
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Only show toast if message is not from current user
          if (newMessage.sender_id !== user.id) {
            toast({
              title: 'Nieuw bericht',
              description: newMessage.content.substring(0, 50) + '...',
            });
          }

          // Invalidate relevant queries
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
          // Refresh messages when they're edited or deleted
          queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, toast]);

  // Set up real-time subscription for new conversations
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-conversations')
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
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const createConversation = (participantUserId: string) => {
    return createConversationMutation.mutateAsync(participantUserId);
  };

  const sendMessage = (conversationId: string, content: string) => {
    sendMessageMutation.mutate({ conversationId, content });
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