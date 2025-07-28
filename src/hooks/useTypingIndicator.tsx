import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TypingUser {
  user_id: string;
  username: string;
  topic_id?: string;
  conversation_id?: string;
}

export function useTypingIndicator(topicId?: string, conversationId?: string) {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  let typingTimeout: NodeJS.Timeout;

  // Send typing indicator
  const startTyping = useCallback(() => {
    if (!user) return;
    
    setIsTyping(true);
    
    const channel = topicId 
      ? `typing:topic:${topicId}`
      : conversationId 
      ? `typing:conversation:${conversationId}`
      : null;
    
    if (!channel) return;

    // Send typing event
    supabase.channel(channel).send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        user_id: user.id,
        username: user.email?.split('@')[0] || 'Gebruiker',
        is_typing: true,
        topic_id: topicId,
        conversation_id: conversationId
      }
    });

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeout = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [user, topicId, conversationId]);

  const stopTyping = useCallback(() => {
    if (!user) return;
    
    setIsTyping(false);
    
    const channel = topicId 
      ? `typing:topic:${topicId}`
      : conversationId 
      ? `typing:conversation:${conversationId}`
      : null;
    
    if (!channel) return;

    // Send stop typing event
    supabase.channel(channel).send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        user_id: user.id,
        username: user.email?.split('@')[0] || 'Gebruiker',
        is_typing: false,
        topic_id: topicId,
        conversation_id: conversationId
      }
    });

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
  }, [user, topicId, conversationId]);

  // Listen for typing indicators
  useEffect(() => {
    if (!topicId && !conversationId) return;

    const channel = topicId 
      ? `typing:topic:${topicId}`
      : `typing:conversation:${conversationId}`;

    const subscription = supabase
      .channel(channel)
      .on('broadcast', { event: 'typing' }, (payload) => {
        const typingData = payload.payload as TypingUser & { is_typing: boolean };
        
        // Don't show own typing indicator
        if (typingData.user_id === user?.id) return;

        setTypingUsers(prev => {
          const filtered = prev.filter(u => u.user_id !== typingData.user_id);
          
          if (typingData.is_typing) {
            return [...filtered, {
              user_id: typingData.user_id,
              username: typingData.username,
              topic_id: typingData.topic_id,
              conversation_id: typingData.conversation_id
            }];
          } else {
            return filtered;
          }
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [topicId, conversationId, user?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      stopTyping();
    };
  }, [stopTyping]);

  return {
    typingUsers,
    isTyping,
    startTyping,
    stopTyping
  };
}