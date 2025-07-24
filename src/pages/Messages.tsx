import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Send, Plus, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface Conversation {
  id: string;
  last_message_at: string;
  last_message?: {
    content: string;
    sender_username: string;
  };
  other_participant?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
  unread_count: number;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

interface Profile {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string;
}

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadConversations();
      setupRealtimeSubscription();
    }
  }, [user]);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as any;
            if (newMessage.conversation_id === selectedConversation) {
              loadMessages(selectedConversation);
            }
            loadConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadConversations = async () => {
    try {
      // Get user's conversations
      const { data: userConversations, error: convError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user?.id);

      if (convError) throw convError;

      if (!userConversations || userConversations.length === 0) {
        setConversations([]);
        return;
      }

      const conversationIds = userConversations.map(uc => uc.conversation_id);

      // Get conversation details
      const { data: conversationDetails, error: detailsError } = await supabase
        .from('conversations')
        .select('id, last_message_at')
        .in('id', conversationIds)
        .order('last_message_at', { ascending: false });

      if (detailsError) throw detailsError;

      // Process each conversation
      const processedConversations = await Promise.all(
        conversationDetails?.map(async (conversation) => {
          // Get other participant
          const { data: otherParticipantData } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conversation.id)
            .neq('user_id', user?.id)
            .single();

          let otherParticipantProfile = null;
          if (otherParticipantData) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username, display_name, avatar_url')
              .eq('user_id', otherParticipantData.user_id)
              .single();
            otherParticipantProfile = profileData;
          }

          // Get last message
          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('content, sender_id')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          let lastMessageSender = null;
          if (lastMessageData) {
            const { data: senderData } = await supabase
              .from('profiles')
              .select('username')
              .eq('user_id', lastMessageData.sender_id)
              .single();
            lastMessageSender = senderData;
          }

          return {
            id: conversation.id,
            last_message_at: conversation.last_message_at,
            last_message: lastMessageData ? {
              content: lastMessageData.content,
              sender_username: lastMessageSender?.username || 'Unknown'
            } : undefined,
            other_participant: otherParticipantProfile ? {
              username: otherParticipantProfile.username,
              display_name: otherParticipantProfile.display_name,
              avatar_url: otherParticipantProfile.avatar_url
            } : undefined,
            unread_count: 0
          };
        }) || []
      );

      setConversations(processedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Fout",
        description: "Kon gesprekken niet laden",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, content, created_at, sender_id')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get sender profiles for all messages
      const messagesWithSenders = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('username, display_name, avatar_url')
            .eq('user_id', msg.sender_id)
            .single();

          return {
            ...msg,
            sender: {
              username: senderProfile?.username || '',
              display_name: senderProfile?.display_name || '',
              avatar_url: senderProfile?.avatar_url || ''
            }
          };
        })
      );

      setMessages(messagesWithSenders);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Fout",
        description: "Kon berichten niet laden",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: user?.id,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Fout",
        description: "Kon bericht niet versturen",
        variant: "destructive"
      });
    }
  };

  const searchUsers = async (username: string) => {
    if (!username.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, display_name, avatar_url')
        .ilike('username', `%${username}%`)
        .neq('user_id', user?.id)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const startConversation = async (otherUserId: string) => {
    try {
      // Check if conversation already exists
      const { data: userConversations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user?.id);

      if (userConversations) {
        for (const conv of userConversations) {
          const { data: otherParticipants } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conv.conversation_id)
            .neq('user_id', user?.id);

          if (otherParticipants?.some(p => p.user_id === otherUserId)) {
            setSelectedConversation(conv.conversation_id);
            loadMessages(conv.conversation_id);
            setShowNewConversation(false);
            return;
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
      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: user?.id },
          { conversation_id: conversation.id, user_id: otherUserId }
        ]);

      if (participantError) throw participantError;

      setSelectedConversation(conversation.id);
      setShowNewConversation(false);
      loadConversations();
      
      toast({
        title: "Succes",
        description: "Nieuw gesprek gestart"
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Fout",
        description: "Kon gesprek niet starten",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="flex h-[calc(100vh-200px)] gap-4">
      {/* Conversations List */}
      <Card className="w-1/3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Berichten
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setShowNewConversation(!showNewConversation)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {showNewConversation && (
            <div className="p-4 border-b">
              <Input
                placeholder="Zoek gebruiker..."
                value={searchUsername}
                onChange={(e) => {
                  setSearchUsername(e.target.value);
                  searchUsers(e.target.value);
                }}
              />
              {searchResults.length > 0 && (
                <div className="mt-2 space-y-2">
                  {searchResults.map((profile) => (
                    <div
                      key={profile.user_id}
                      className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => startConversation(profile.user_id)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile.avatar_url} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{profile.display_name || profile.username}</p>
                        <p className="text-xs text-muted-foreground">@{profile.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <ScrollArea className="h-[500px]">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Laden...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Geen gesprekken gevonden
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted transition-colors ${
                    selectedConversation === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={conversation.other_participant?.avatar_url} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">
                          {conversation.other_participant?.display_name || 
                           conversation.other_participant?.username}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.last_message_at), { 
                            addSuffix: true, 
                            locale: nl 
                          })}
                        </span>
                      </div>
                      {conversation.last_message && (
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message.content}
                        </p>
                      )}
                    </div>
                    {conversation.unread_count > 0 && (
                      <Badge variant="default" className="text-xs">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Messages View */}
      <Card className="flex-1">
        {selectedConversation ? (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={selectedConv?.other_participant?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                {selectedConv?.other_participant?.display_name || 
                 selectedConv?.other_participant?.username}
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col h-full p-0">
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Nog geen berichten in dit gesprek
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender_id === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatDistanceToNow(new Date(message.created_at), { 
                              addSuffix: true, 
                              locale: nl 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
              
              <Separator />
              <div className="p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Typ je bericht..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="min-h-[60px]"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecteer een gesprek om berichten te bekijken</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}