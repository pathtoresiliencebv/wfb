import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Eye, Clock, User, Flag, Bookmark, Bell, BellOff, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RichTextEditor } from '@/components/rich-text/RichTextEditor';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { VotingButtons } from '@/components/interactive/VotingButtons';
import { PostActions } from '@/components/interactive/PostActions';
import { useVoting } from '@/hooks/useVoting';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useTopicSubscriptions } from '@/hooks/useTopicSubscriptions';
import { ReportModal } from '@/components/moderation/ReportModal';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { BadgedText, parseBadges } from '@/lib/badgeParser';

interface TopicData {
  id: string;
  title: string;
  content: string;
  view_count: number;
  reply_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  categories: {
    name: string;
    slug: string;
  };
  profiles: {
    username: string;
    role: string;
    reputation: number;
    created_at: string;
  };
  topic_tags: Array<{
    tags: {
      id: string;
      name: string;
      color: string;
    };
  }>;
}

interface ReplyData {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    role: string;
  };
}

export default function TopicDetail() {
  const { categoryId, topicId } = useParams<{ categoryId: string; topicId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [topic, setTopic] = useState<TopicData | null>(null);
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyVotes, setReplyVotes] = useState<Record<string, any>>({});


  // Initialize voting data for topic and replies
  const initialVotes: Record<string, any> = {};
  if (topic) {
    initialVotes[topic.id] = {
      id: topic.id,
      type: 'topic' as const,
      currentVote: null,
      upvotes: 0,
      downvotes: 0,
    };
  }
  
  // Add replies to voting data
  replies.forEach(reply => {
    initialVotes[reply.id] = {
      id: reply.id,
      type: 'reply' as const,
      currentVote: null,
      upvotes: 0,
      downvotes: 0,
    };
  });

  const { handleVote, getVoteData } = useVoting(initialVotes);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { isSubscribed, toggleSubscription, isToggling } = useTopicSubscriptions(topicId);

  useEffect(() => {
    const fetchTopicAndReplies = async () => {
      if (!topicId) return;

      try {
        // Fetch topic details
        const { data: topicData, error: topicError } = await supabase
          .from('topics')
          .select(`
            id,
            title,
            content,
            view_count,
            reply_count,
            is_pinned,
            is_locked,
            created_at,
            categories (
              name,
              slug
            ),
            profiles (
              username,
              role,
              reputation,
              created_at
            ),
            topic_tags (
              tags (
                id,
                name,
                color
              )
            )
          `)
          .eq('id', topicId)
          .single();

        if (topicError) {
          console.error('Error fetching topic:', topicError);
          toast({
            title: 'Error',
            description: 'Topic niet gevonden',
            variant: 'destructive',
          });
          navigate('/forums');
          return;
        }

        setTopic(topicData);

        // Fetch replies
        const { data: repliesData, error: repliesError } = await supabase
          .from('replies')
          .select(`
            id,
            content,
            created_at,
            profiles (
              username,
              role
            )
          `)
          .eq('topic_id', topicId)
          .order('created_at', { ascending: true });

        if (repliesError) {
          console.error('Error fetching replies:', repliesError);
        } else {
          setReplies(repliesData || []);
        }

        // Update view count
        await supabase
          .from('topics')
          .update({ view_count: topicData.view_count + 1 })
          .eq('id', topicId);

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicAndReplies();
  }, [topicId, navigate, toast]);

  const handleReply = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Inloggen vereist',
        description: 'Je moet ingelogd zijn om te kunnen reageren.',
        variant: 'destructive',
      });
      return;
    }

    if (!replyContent.trim()) {
      toast({
        title: 'Lege reactie',
        description: 'Voeg wat tekst toe aan je reactie.',
        variant: 'destructive',
      });
      return;
    }

    setIsReplying(true);
    
    try {
      const { error } = await supabase
        .from('replies')
        .insert({
          content: replyContent.trim(),
          topic_id: topicId,
          author_id: user.id,
        });

      if (error) {
        throw error;
      }

      toast({
        title: 'Reactie geplaatst',
        description: 'Je reactie is succesvol toegevoegd.',
      });
      
      setReplyContent('');
      
      // Refresh replies
      const { data: repliesData } = await supabase
        .from('replies')
        .select(`
          id,
          content,
          created_at,
          profiles (
            username,
            role
          )
        `)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      setReplies(repliesData || []);
      
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: 'Error',
        description: 'Er ging iets mis bij het plaatsen van je reactie.',
        variant: 'destructive',
      });
    } finally {
      setIsReplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-BE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'moderator': return 'bg-blue-500';
      case 'expert': return 'bg-green-500';
      case 'admin': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-2/3 mb-4"></div>
          <div className="h-32 bg-muted rounded mb-4"></div>
          <div className="h-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Topic niet gevonden</h1>
        <Button onClick={() => navigate('/forums')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar Forums
        </Button>
      </div>
    );
  }

  const topicVoteData = getVoteData(topic.id);

  return (
    <div className="space-y-3 px-2 sm:px-0">
      {/* Back Button - Altijd bovenaan */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate(`/forums/${categoryId}`)} 
        className="self-start min-h-[44px]"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Terug naar {topic.categories?.name}</span>
        <span className="sm:hidden">Terug</span>
      </Button>

      {/* Breadcrumb BOVEN titel */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <Link 
          to={`/forums/${categoryId}`} 
          className="hover:text-primary"
        >
          {topic.categories?.name}
        </Link>
        <span>•</span>
        <span>Topic</span>
      </div>

      {/* Titel - VOLLEDIG zichtbaar (geen line-clamp) */}
      <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold break-words">
        <BadgedText text={topic.title} />
      </h1>

      {/* Action buttons - Subscribe en Bookmark */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button 
          variant={isSubscribed ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleSubscription(topic.id)}
          disabled={isToggling}
          className="min-h-[44px]"
        >
          {isSubscribed ? (
            <>
              <BellOff className="h-4 w-4 mr-2" />
              Uitschrijven
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Volgen
            </>
          )}
        </Button>
        <Button 
          variant={isBookmarked(topic.id) ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleBookmark(topic.id, 'topic')}
          className="min-h-[44px]"
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked(topic.id) ? 'fill-current' : ''}`} />
        </Button>
        <PostActions
          itemId={topic.id}
          itemType="topic"
          isBookmarked={isBookmarked(topic.id)}
          onBookmark={() => toggleBookmark(topic.id, 'topic')}
        />
      </div>

      {/* Topic Stats & Tags - Compacter */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{topic.view_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{topic.reply_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="hidden sm:inline">{formatDate(topic.created_at)}</span>
            <span className="sm:hidden">{new Date(topic.created_at).toLocaleDateString('nl-BE', { day: 'numeric', month: 'numeric' })}</span>
          </div>
        </div>

        {/* Tags - Compacter */}
        {topic.topic_tags && topic.topic_tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {topic.topic_tags.map(({ tags }) => (
              <Badge 
                key={tags.id} 
                variant="outline" 
                className="text-xs"
                style={{ borderColor: tags.color, color: tags.color }}
              >
                {tags.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Original Post */}
      <Card className="mx-0">
        <CardHeader className="p-4 border-b">
          {/* Author info BOVEN content */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback className={getRoleColor(topic.profiles?.role || 'user')}>
                  {getUserInitials(topic.profiles?.username || 'Anonymous')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{topic.profiles?.username}</span>
                  {topic.profiles?.role === 'moderator' && (
                    <Badge variant="secondary" className="text-xs">MOD</Badge>
                  )}
                  {topic.profiles?.role === 'expert' && (
                    <Badge variant="default" className="text-xs">EXPERT</Badge>
                  )}
                  {topic.profiles?.role === 'supplier' && (
                    <Badge variant="outline" className="text-xs border-purple-500 text-purple-500">LEVERANCIER</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {topic.profiles?.reputation || 0} rep
                </div>
              </div>
            </div>
            <ReportModal itemId={topic.id} itemType="topic">
              <Button variant="ghost" size="sm" className="min-h-[44px] p-2">
                <Flag className="h-4 w-4" />
              </Button>
            </ReportModal>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Content met inline voting voor mobiel */}
          <div className="flex flex-col gap-4">
            {/* Content */}
            <div 
              className="prose prose-sm max-w-none text-sm"
              dangerouslySetInnerHTML={{ 
                __html: parseBadges(topic.content.replace(/\n/g, '<br>')) 
              }}
            />
            
            {/* Voting en actions ONDER content op mobiel */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center">
                {topicVoteData && (
                  <VotingButtons
                    itemId={topic.id}
                    upvotes={topicVoteData.upvotes}
                    downvotes={topicVoteData.downvotes}
                    currentVote={topicVoteData.currentVote}
                    onVote={(voteType) => handleVote(topic.id, voteType, 'topic')}
                    size="sm"
                  />
                )}
              </div>
              <PostActions
                itemId={topic.id}
                itemType="topic"
                isBookmarked={isBookmarked(topic.id)}
                onBookmark={() => toggleBookmark(topic.id, 'topic')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold">
          Reacties ({replies.length})
        </h3>
        
        {replies.map((reply) => (
          <Card key={reply.id}>
            <CardHeader className="p-4 border-b">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className={getRoleColor(reply.profiles?.role || 'user')}>
                      {getUserInitials(reply.profiles?.username || 'Anonymous')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{reply.profiles?.username}</span>
                      {reply.profiles?.role === 'expert' && (
                        <Badge variant="default" className="text-xs">EXPERT</Badge>
                      )}
                      {reply.profiles?.role === 'supplier' && (
                        <Badge variant="outline" className="text-xs border-purple-500 text-purple-500">LEVERANCIER</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(reply.created_at)}
                    </div>
                  </div>
                </div>
                <ReportModal itemId={reply.id} itemType="reply">
                  <Button variant="ghost" size="sm" className="min-h-[44px] p-2">
                    <Flag className="h-4 w-4" />
                  </Button>
                </ReportModal>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                {/* Reply Content */}
                <div 
                  className="text-sm prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: parseBadges(reply.content.replace(/\n/g, '<br>'))
                  }}
                />
                
                {/* Voting ONDER content op mobiel */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center">
                    {getVoteData(reply.id) && (
                      <VotingButtons
                        itemId={reply.id}
                        upvotes={getVoteData(reply.id)?.upvotes || 0}
                        downvotes={getVoteData(reply.id)?.downvotes || 0}
                        currentVote={getVoteData(reply.id)?.currentVote || null}
                        onVote={(voteType) => handleVote(reply.id, voteType, 'reply')}
                        size="sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply Form - Always allow replies unless topic is deleted */}
      {isAuthenticated ? (
        <Card className="mx-0">
          <CardHeader className="p-4">
            <h4 className="font-medium text-base">Reageer op dit topic</h4>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <RichTextEditor
              value={replyContent}
              onChange={setReplyContent}
              placeholder="Deel je gedachten over dit topic..."
              minHeight={150}
              showLivePreview={true}
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setReplyContent('')}
                className="min-h-[44px]"
              >
                Annuleren
              </Button>
              <Button 
                onClick={handleReply} 
                disabled={isReplying}
                className="min-h-[44px]"
              >
                {isReplying ? 'Bezig...' : 'Reageren'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium mb-2">Log in om te reageren</h4>
            <p className="text-muted-foreground mb-4">
              Je moet ingelogd zijn om deel te nemen aan de discussie.
            </p>
            <Button onClick={() => navigate('/login')}>
              Inloggen
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
