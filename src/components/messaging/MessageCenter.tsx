import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Send, Plus, Search, Users } from 'lucide-react';
import { useMessaging, Conversation, Message } from '@/hooks/useMessaging';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface User {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
}

export function MessageCenter() {
  const { user } = useAuth();
  const {
    conversations,
    conversationsLoading,
    useConversationMessages,
    createConversation,
    sendMessage,
    markConversationAsRead,
    totalUnreadCount,
    isSendingMessage,
    isCreatingConversation,
  } = useMessaging();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchUsers, setSearchUsers] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading: messagesLoading } = useConversationMessages(selectedConversation);

  // Fetch users for new conversation
  const { data: availableUsers } = useQuery({
    queryKey: ['available-users', searchUsers],
    queryFn: async (): Promise<User[]> => {
      if (!user) return [];

      let query = supabase
        .from('profiles')
        .select('user_id, username, display_name, avatar_url')
        .neq('user_id', user.id)
        .limit(20);

      if (searchUsers.trim()) {
        query = query.or(`username.ilike.%${searchUsers}%,display_name.ilike.%${searchUsers}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: isNewConversationOpen,
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversation) {
      markConversationAsRead(selectedConversation);
    }
  }, [selectedConversation, markConversationAsRead]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !newMessage.trim()) return;

    sendMessage(selectedConversation, newMessage);
    setNewMessage('');
  };

  const handleCreateConversation = async () => {
    if (!selectedUserId) return;

    try {
      const conversationId = await createConversation(selectedUserId);
      setSelectedConversation(conversationId);
      setIsNewConversationOpen(false);
      setSelectedUserId('');
      setSearchUsers('');
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants?.find(p => p.user_id !== user?.id);
  };

  const formatMessageTime = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: nl });
  };

  if (conversationsLoading) {
    return (
      <Card className="h-[600px]">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-muted rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-muted/20">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Berichten</h3>
            <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nieuw gesprek starten</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Zoek gebruikers..."
                      value={searchUsers}
                      onChange={(e) => setSearchUsers(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {availableUsers?.map((availableUser) => (
                        <div
                          key={availableUser.user_id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedUserId === availableUser.user_id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedUserId(availableUser.user_id)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={availableUser.avatar_url} />
                              <AvatarFallback>
                                {availableUser.username.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">
                                {availableUser.display_name || availableUser.username}
                              </div>
                              <div className="text-xs opacity-70">@{availableUser.username}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <Button
                    onClick={handleCreateConversation}
                    disabled={!selectedUserId || isCreatingConversation}
                    className="w-full"
                  >
                    {isCreatingConversation ? 'Gesprek starten...' : 'Start gesprek'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nog geen gesprekken</p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                const isActive = selectedConversation === conversation.id;

                return (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={otherParticipant?.profiles.avatar_url} />
                        <AvatarFallback>
                          {otherParticipant?.profiles.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm truncate">
                            {otherParticipant?.profiles.display_name || otherParticipant?.profiles.username}
                          </div>
                          {conversation.unread_count! > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                        {conversation.last_message && (
                          <div className="text-xs opacity-70 truncate">
                            {conversation.last_message.content}
                          </div>
                        )}
                        {conversation.last_message_at && (
                          <div className="text-xs opacity-50">
                            {formatMessageTime(conversation.last_message_at)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-background">
              {(() => {
                const conversation = conversations.find(c => c.id === selectedConversation);
                const otherParticipant = conversation ? getOtherParticipant(conversation) : null;
                
                return (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={otherParticipant?.profiles.avatar_url} />
                      <AvatarFallback>
                        {otherParticipant?.profiles.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {otherParticipant?.profiles.display_name || otherParticipant?.profiles.username}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{otherParticipant?.profiles.username}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messagesLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-12 bg-muted rounded" />
                    ))}
                  </div>
                ) : (
                  messages?.map((message) => {
                    const isOwnMessage = message.sender_id === user?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          <div
                            className={`text-xs mt-1 ${
                              isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}
                          >
                            {formatMessageTime(message.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Typ je bericht..."
                  className="flex-1 min-h-[60px] max-h-[120px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || isSendingMessage}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Selecteer een gesprek</h3>
              <p>Kies een gesprek uit de lijst om berichten te bekijken</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}