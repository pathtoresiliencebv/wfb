import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { MessageCircle, Send, Plus, Search, Users, ArrowLeft, ChevronRight, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMessaging, Conversation, Message } from '@/hooks/useMessaging';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { TypingIndicator } from '@/components/ui/typing-indicator';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { toast } from '@/hooks/use-toast';

interface User {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  is_verified?: boolean;
}

export function MessageCenter() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const {
    conversations,
    conversationsLoading,
    useConversationMessages,
    createConversation,
    sendMessage,
    markConversationAsRead,
    deleteMessage,
    editMessage,
    totalUnreadCount,
    isSendingMessage,
    isCreatingConversation,
    isDeletingMessage,
    isEditingMessage,
  } = useMessaging();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchUsers, setSearchUsers] = useState('');
  const [showConversationView, setShowConversationView] = useState(false); // Mobile conversation view
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const markAsReadTimeoutRef = useRef<NodeJS.Timeout>();

  // Typing indicator
  const { typingUsers, startTyping, stopTyping } = useTypingIndicator(
    undefined,
    selectedConversation || undefined
  );

  const { data: messages, isLoading: messagesLoading } = useConversationMessages(selectedConversation);

  // Fetch users for new conversation
  const { data: availableUsers } = useQuery({
    queryKey: ['available-users', searchUsers],
    queryFn: async (): Promise<User[]> => {
      if (!user) return [];

      let query = supabase
        .from('profiles')
        .select('user_id, username, display_name, avatar_url, is_verified')
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

  // Debounced mark as read function
  const debouncedMarkAsRead = useCallback((conversationId: string) => {
    // Clear previous timeout
    if (markAsReadTimeoutRef.current) {
      clearTimeout(markAsReadTimeoutRef.current);
    }
    
    // Set new timeout - only mark as read after 1 second of inactivity
    markAsReadTimeoutRef.current = setTimeout(() => {
      markConversationAsRead(conversationId);
    }, 1000);
  }, [markConversationAsRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Real-time subscription for current conversation messages
  useEffect(() => {
    if (!selectedConversation || !user) return;

    console.log('[MessageCenter] Setting up realtime for conversation:', selectedConversation);

    const channel = supabase
      .channel(`conversation:${selectedConversation}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        (payload) => {
          console.log('[MessageCenter] Message change in current conversation:', payload);
          // Messages will auto-refresh via the query invalidation in useMessaging
        }
      )
      .subscribe();

    return () => {
      console.log('[MessageCenter] Cleaning up conversation realtime');
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, user]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversation) {
      markConversationAsRead(selectedConversation);
    }
  }, [selectedConversation, markConversationAsRead]);

  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now();
    
    if (conversations) {
      const loadTime = performance.now() - startTime;
      console.log(`[Performance] Conversations loaded in ${loadTime}ms, count: ${conversations.length}`);
      
      if (loadTime > 2000) {
        console.warn('[Performance] Slow conversation loading detected');
      }
    }
  }, [conversations]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !newMessage.trim()) return;

    try {
      console.log('[SEND] Sending message:', { conversationId: selectedConversation });
      
      if (editingMessageId) {
        await editMessage(editingMessageId, newMessage);
        setEditingMessageId(null);
        setEditingContent('');
      } else {
        await sendMessage(selectedConversation, newMessage);
        
        console.log('[SEND] Forcing refetch...');
        await queryClient.refetchQueries({ 
          queryKey: ['messages', selectedConversation],
          exact: true
        });
      }
      
      setNewMessage('');
      stopTyping();
    } catch (error) {
      console.error('[MessageCenter] Error in handleSendMessage:', {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        message: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (confirm('Weet je zeker dat je dit bericht wilt verwijderen?')) {
      try {
        await deleteMessage(messageId);
        toast({
          title: "Bericht verwijderd",
          description: "Je bericht is succesvol verwijderd",
        });
      } catch (error) {
        console.error('Error deleting message:', error);
        toast({
          variant: "destructive",
          title: "Fout",
          description: "Kon bericht niet verwijderen. Probeer het opnieuw.",
        });
      }
    }
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
    setNewMessage(message.content);
  };

  const canModifyMessage = (messageTimestamp: string) => {
    const messageTime = new Date(messageTimestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - messageTime.getTime()) / (1000 * 60);
    return diffInMinutes <= 15;
  };

  const handleCreateConversation = async () => {
    if (!selectedUserId) return;

    console.log('[MessageCenter] Creating conversation with user:', selectedUserId);

    try {
      const conversationId = await createConversation(selectedUserId);
      console.log('[MessageCenter] Conversation created:', conversationId);
      
      const selectedUser = availableUsers?.find(u => u.user_id === selectedUserId);
      
      await queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
      await queryClient.refetchQueries({ queryKey: ['conversations', user?.id] });
      
      console.log('[MessageCenter] Queries refreshed, selecting conversation');
      
      setSelectedConversation(conversationId);
      setIsNewConversationOpen(false);
      setSelectedUserId('');
      setSearchUsers('');
      
      toast({
        title: "Gesprek gestart",
        description: `Gesprek gestart met ${selectedUser?.display_name || selectedUser?.username}`,
      });
      
      // Auto-focus on conversation on mobile
      if (isMobile) {
        setShowConversationView(true);
      }
    } catch (error) {
      console.error('[MessageCenter] Error creating conversation:', {
        error,
        userId: selectedUserId,
        stack: error instanceof Error ? error.stack : undefined,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      toast({
        variant: "destructive",
        title: "Fout",
        description: "Kon gesprek niet starten. Probeer het opnieuw.",
      });
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants?.find(p => p.user_id !== user?.id);
  };

  const formatMessageTime = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: nl });
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    if (isMobile) {
      setShowConversationView(true);
    }
  };

  const handleBackToConversations = () => {
    if (isMobile) {
      setShowConversationView(false);
      setSelectedConversation(null);
    }
  };

  if (conversationsLoading) {
    return (
      <Card className="h-[calc(100vh-4rem)]">
        <CardContent className="p-4 md:p-6 flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <div className="space-y-2">
              <p className="text-foreground font-medium">Berichten laden...</p>
              <p className="text-sm text-muted-foreground">Even geduld aub</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state when no conversations exist
  if (!conversations || conversations.length === 0) {
    return (
      <Card className="h-[calc(100vh-4rem)]">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <div className="text-center space-y-4 max-w-md mx-auto">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Nog geen gesprekken</h3>
              <p className="text-sm text-muted-foreground">
                Begin een nieuw gesprek door een gebruiker te selecteren
              </p>
            </div>
            <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Nieuw gesprek starten
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Nieuw gesprek</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Zoek gebruikers..."
                      value={searchUsers}
                      onChange={(e) => setSearchUsers(e.target.value)}
                      className="min-h-[44px]"
                    />
                  </div>
                  <ScrollArea className="h-[300px] rounded-md border p-2">
                    {availableUsers?.map(u => (
                      <div
                        key={u.user_id}
                        className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                        onClick={() => setSelectedUserId(u.user_id)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={u.avatar_url} />
                          <AvatarFallback>{u.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-sm truncate">{u.display_name || u.username}</p>
                            {u.is_verified && <VerifiedBadge className="h-3.5 w-3.5" />}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
                        </div>
                        {selectedUserId === u.user_id && (
                          <Badge variant="secondary">Geselecteerd</Badge>
                        )}
                      </div>
                    ))}
                  </ScrollArea>
                  <Button
                    onClick={handleCreateConversation}
                    disabled={!selectedUserId || isCreatingConversation}
                    className="w-full min-h-[44px]"
                  >
                    {isCreatingConversation ? 'Starten...' : 'Gesprek starten'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mobile: Show either conversations list or individual conversation
  if (isMobile) {
    if (showConversationView && selectedConversation) {
      // Mobile Conversation View
      const conversation = conversations.find(c => c.id === selectedConversation);
      
      // Show loading if conversation not yet available
      if (!conversation) {
        return (
          <div className="flex flex-col h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-foreground font-medium">Gesprek laden...</p>
              </div>
            </div>
          </div>
        );
      }
      
      const otherParticipant = getOtherParticipant(conversation);

      return (
        <div className="flex flex-col h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">{/* Mobile Conversation View */}
          {/* Mobile Header */}
          <div className="p-3 border-b bg-background flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToConversations}
              className="min-h-[44px] px-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={otherParticipant?.profiles.avatar_url} />
              <AvatarFallback>
                {otherParticipant?.profiles.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate flex items-center gap-1">
                {otherParticipant?.profiles.display_name || otherParticipant?.profiles.username}
                {otherParticipant?.profiles.is_verified && <VerifiedBadge className="h-3.5 w-3.5" />}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                @{otherParticipant?.profiles.username}
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {messagesLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-muted rounded" />
                  ))}
                </div>
              ) : (
                <>
                  {messages?.map((message) => {
                    const isOwnMessage = message.sender_id === user?.id;
                    const canModify = isOwnMessage && canModifyMessage(message.created_at);
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl relative ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground rounded-br-md'
                              : 'bg-muted rounded-bl-md'
                          }`}
                        >
                          <div className="text-sm leading-relaxed">
                            {message.is_deleted ? (
                              <span className="italic opacity-50">[Bericht verwijderd]</span>
                            ) : (
                              message.content
                            )}
                          </div>
                          <div
                            className={`text-xs mt-1 flex items-center gap-1 ${
                              isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}
                          >
                            {formatMessageTime(message.created_at)}
                            {message.is_edited && !message.is_deleted && (
                              <span className="italic">(bewerkt)</span>
                            )}
                          </div>
                          
                          {/* Edit/Delete dropdown */}
                          {canModify && !message.is_deleted && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditMessage(message)}>
                                  <Edit2 className="h-3 w-3 mr-2" />
                                  Bewerken
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteMessage(message.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Verwijderen
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Typing indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex justify-start">
                      <TypingIndicator 
                        usernames={typingUsers.map(u => u.username)} 
                        className="max-w-[85%]"
                      />
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Mobile Message Input */}
          <div className="p-3 border-t bg-background">
            {editingMessageId && (
              <div className="mb-2 px-2 py-1 bg-muted rounded text-xs flex items-center justify-between">
                <span>Bericht bewerken...</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => {
                    setEditingMessageId(null);
                    setNewMessage('');
                  }}
                >
                  Annuleren
                </Button>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  if (e.target.value.length > 0 && !editingMessageId) {
                    startTyping();
                  } else if (e.target.value.length === 0) {
                    stopTyping();
                  }
                }}
                onBlur={stopTyping}
                placeholder="Typ je bericht..."
                className="flex-1 min-h-[44px] max-h-[120px] resize-none text-base"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  } else if (e.key === 'Escape' && editingMessageId) {
                    e.preventDefault();
                    setEditingMessageId(null);
                    setNewMessage('');
                  }
                }}
              />
              <Button
                type="submit"
                disabled={!newMessage.trim() || isSendingMessage || isEditingMessage}
                className="self-end min-h-[44px] px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      );
    }

    // Mobile Conversations List
    return (
      <div className="border rounded-lg overflow-hidden h-[calc(100vh-8rem)] flex flex-col">
        <div className="p-4 border-b bg-background flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Berichten</h3>
            <Dialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="min-h-[44px]">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Nieuw</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md">
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
                      className="pl-10 min-h-[44px]"
                    />
                  </div>
                  
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {availableUsers?.map((availableUser) => (
                        <div
                          key={availableUser.user_id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors min-h-[44px] flex items-center ${
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
                    className="w-full min-h-[44px]"
                  >
                    {isCreatingConversation ? 'Gesprek starten...' : 'Start gesprek'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="divide-y">
          {conversations.length === 0 ? (
            <div className="text-center py-12 px-4 text-muted-foreground">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nog geen gesprekken</h3>
              <p className="text-sm text-muted-foreground mb-6">Start een nieuw gesprek om berichten te versturen</p>
              <Button 
                onClick={() => setIsNewConversationOpen(true)}
                className="min-h-[44px]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nieuw gesprek starten
              </Button>
            </div>
          ) : (
            conversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);

              return (
                <div
                  key={conversation.id}
                  className="p-4 cursor-pointer transition-colors hover:bg-muted/50 active:bg-muted min-h-[80px] flex items-center"
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={otherParticipant?.profiles.avatar_url} />
                      <AvatarFallback>
                        {otherParticipant?.profiles.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-base truncate flex items-center gap-1">
                          {otherParticipant?.profiles.display_name || otherParticipant?.profiles.username}
                          {otherParticipant?.profiles.is_verified && <VerifiedBadge className="h-3.5 w-3.5 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2">
                          {conversation.unread_count! > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {conversation.unread_count}
                            </Badge>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      {conversation.last_message && (
                        <div className="text-sm text-muted-foreground truncate mb-1">
                          {conversation.last_message.content}
                        </div>
                      )}
                      {conversation.last_message_at && (
                        <div className="text-xs text-muted-foreground">
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
        </div>
      </div>
    );
  }

  // Desktop: Original side-by-side layout
  return (
    <div className="flex h-[calc(100vh-4rem)] border rounded-lg overflow-hidden">
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
              <div className="text-center py-8 px-4 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold mb-2">Nog geen gesprekken</h3>
                <p className="text-sm mb-4">Start een nieuw gesprek om te beginnen</p>
                <Button 
                  onClick={() => setIsNewConversationOpen(true)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nieuw gesprek
                </Button>
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
                    onClick={() => handleSelectConversation(conversation.id)}
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
                      <div className="font-medium flex items-center gap-1">
                        {otherParticipant?.profiles.display_name || otherParticipant?.profiles.username}
                        {otherParticipant?.profiles.is_verified && <VerifiedBadge className="h-3.5 w-3.5" />}
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
                  <>
                    {messages?.map((message) => {
                      const isOwnMessage = message.sender_id === user?.id;
                      const canModify = isOwnMessage && canModifyMessage(message.created_at);
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg relative ${
                              isOwnMessage
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="text-sm">
                              {message.is_deleted ? (
                                <span className="italic opacity-50">[Bericht verwijderd]</span>
                              ) : (
                                message.content
                              )}
                            </div>
                            <div
                              className={`text-xs mt-1 flex items-center gap-1 ${
                                isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}
                            >
                              {formatMessageTime(message.created_at)}
                              {message.is_edited && !message.is_deleted && (
                                <span className="italic">(bewerkt)</span>
                              )}
                            </div>
                            
                            {/* Edit/Delete dropdown */}
                            {canModify && !message.is_deleted && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditMessage(message)}>
                                    <Edit2 className="h-3 w-3 mr-2" />
                                    Bewerken
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteMessage(message.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3 mr-2" />
                                    Verwijderen
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Typing indicator */}
                    {typingUsers.length > 0 && (
                      <div className="flex justify-start">
                        <TypingIndicator 
                          usernames={typingUsers.map(u => u.username)} 
                          className="max-w-[70%]"
                        />
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              {editingMessageId && (
                <div className="mb-2 px-2 py-1 bg-muted rounded text-xs flex items-center justify-between">
                  <span>Bericht bewerken...</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => {
                      setEditingMessageId(null);
                      setNewMessage('');
                    }}
                  >
                    Annuleren
                  </Button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    if (e.target.value.length > 0 && !editingMessageId) {
                      startTyping();
                    } else if (e.target.value.length === 0) {
                      stopTyping();
                    }
                  }}
                  onBlur={stopTyping}
                  placeholder="Typ je bericht..."
                  className="flex-1 min-h-[60px] max-h-[120px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    } else if (e.key === 'Escape' && editingMessageId) {
                      e.preventDefault();
                      setEditingMessageId(null);
                      setNewMessage('');
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || isSendingMessage || isEditingMessage}
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