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
              avatar_url
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

      // Create new conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (convError) throw convError;

      // Add participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: user.id },
          { conversation_id: conversation.id, user_id: participantUserId },
        ]);

      if (participantsError) throw participantsError;

      return conversation.id;
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

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, toast]);

  const createConversation = (participantUserId: string) => {
    return createConversationMutation.mutateAsync(participantUserId);
  };

  const sendMessage = (conversationId: string, content: string) => {
    sendMessageMutation.mutate({ conversationId, content });
  };

  const markConversationAsRead = (conversationId: string) => {
    markConversationAsReadMutation.mutate(conversationId);
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
    totalUnreadCount,
    isSendingMessage: sendMessageMutation.isPending,
    isCreatingConversation: createConversationMutation.isPending,
    isMarkingAsRead: markConversationAsReadMutation.isPending,
  };
}