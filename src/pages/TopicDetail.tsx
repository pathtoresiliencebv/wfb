import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MoreVertical, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InlineRichTextEditor } from '@/components/rich-text/InlineRichTextEditor';
import { ActionButtonGrid } from '@/components/forum/ActionButtonGrid';
import { ReplyThread } from '@/components/forum/ReplyThread';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useVoting } from '@/hooks/useVoting';
import { useTopicSubscriptions } from '@/hooks/useTopicSubscriptions';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TopicData {
  id: string;
  title: string;
  content: string;
  view_count: number;
  reply_count: number;
  created_at: string;
  categories: {
    name: string;
    slug: string;
  };
  profiles: {
    username: string;
    role: string;
    avatar_url?: string;
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
  depth?: number;
  parent_reply_id?: string;
  profiles?: {
    username: string;
    role: string;
    avatar_url?: string | null;
  };
  replies?: ReplyData[];
}

type SortOption = 'newest' | 'oldest' | 'top';

export default function TopicDetail() {
  const { categoryId, topicId } = useParams<{ categoryId: string; topicId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [topic, setTopic] = useState<TopicData | null>(null);
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFAB, setShowFAB] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

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

  const { handleVote, getVoteData } = useVoting(initialVotes);
  const { isSubscribed, toggleSubscription } = useTopicSubscriptions(topicId);

  useEffect(() => {
    const fetchTopicAndReplies = async () => {
      if (!topicId) return;

      try {
        const { data: topicData, error: topicError } = await supabase
          .from('topics')
          .select(`
            id,
            title,
            content,
            view_count,
            reply_count,
            created_at,
            categories (
              name,
              slug
            ),
            profiles (
              username,
              role,
              avatar_url
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
            parent_reply_id,
            depth,
            profiles (
              username,
              role,
              avatar_url
            )
          `)
          .eq('topic_id', topicId)
          .order('created_at', { ascending: true });

        if (repliesError) {
          console.error('Error fetching replies:', repliesError);
        } else {
          // Build threaded structure
          const threadedReplies = buildThreadStructure(repliesData || []);
          setReplies(threadedReplies);
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

  // Build threaded reply structure
  const buildThreadStructure = (flatReplies: ReplyData[]): ReplyData[] => {
    const repliesMap = new Map<string, ReplyData>();
    const rootReplies: ReplyData[] = [];

    // First pass: create map and initialize replies array
    flatReplies.forEach(reply => {
      repliesMap.set(reply.id, { ...reply, replies: [] });
    });

    // Second pass: build tree structure
    flatReplies.forEach(reply => {
      const replyNode = repliesMap.get(reply.id)!;
      if (reply.parent_reply_id) {
        const parent = repliesMap.get(reply.parent_reply_id);
        if (parent) {
          if (!parent.replies) parent.replies = [];
          parent.replies.push(replyNode);
        } else {
          rootReplies.push(replyNode);
        }
      } else {
        rootReplies.push(replyNode);
      }
    });

    return rootReplies;
  };

  // Sort replies based on selected option
  const sortReplies = (repliesToSort: ReplyData[]): ReplyData[] => {
    const sorted = [...repliesToSort];
    
    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case 'top':
        return sorted.sort((a, b) => {
          // Sort by creation date for now (can be enhanced with vote counts later)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      case 'newest':
      default:
        return sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  };

  useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      const replyForm = document.getElementById('reply-form');
      if (!replyForm) return;
      
      const rect = replyForm.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      setShowFAB(!isVisible);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

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
          parent_reply_id: replyingToId,
        });

      if (error) throw error;

      toast({
        title: 'Reactie geplaatst',
        description: 'Je reactie is succesvol toegevoegd.',
      });
      
      setReplyContent('');
      setReplyingToId(null);
      
      // Refresh replies
      const { data: repliesData } = await supabase
        .from('replies')
        .select(`
          id,
          content,
          created_at,
          parent_reply_id,
          depth,
          profiles (
            username,
            role,
            avatar_url
          )
        `)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      const threadedReplies = buildThreadStructure(repliesData || []);
      setReplies(threadedReplies);
      
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

  const handleQuoteReply = (reply: ReplyData) => {
    const username = reply.profiles?.username || 'Anonymous';
    const cleanContent = reply.content
      .replace(/<[^>]*>/g, '')
      .split('\n')
      .map(line => `> ${line}`)
      .join('\n');
    
    const quoteText = `**${username} schreef:**\n${cleanContent}\n\n`;
    setReplyContent(prev => prev ? `${prev}\n\n${quoteText}` : quoteText);
    
    const replyForm = document.getElementById('reply-form');
    replyForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
      const textarea = replyForm?.querySelector('textarea');
      textarea?.focus();
    }, 500);
  };

  const handleReplyTo = (replyId: string) => {
    setReplyingToId(replyId);
    const replyForm = document.getElementById('reply-form');
    replyForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
      const textarea = replyForm?.querySelector('textarea');
      textarea?.focus();
    }, 500);
  };

  const handleTopicVote = async () => {
    if (!topic) return;
    await handleVote(topic.id, 'up', 'topic');
  };

  const handleReplyVote = async (replyId: string, voteType: 'up' | 'down') => {
    await handleVote(replyId, voteType, 'reply');
  };

  const scrollToReplyForm = () => {
    const replyForm = document.getElementById('reply-form');
    replyForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const textarea = replyForm?.querySelector('textarea');
      textarea?.focus();
    }, 500);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'admin': return 'text-destructive';
      case 'moderator': return 'text-primary';
      case 'supplier': return 'text-success';
      default: return 'text-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Topic niet gevonden</h2>
        <Button onClick={() => navigate('/forums')}>
          Terug naar forums
        </Button>
      </div>
    );
  }

  const topicVotes = getVoteData(topic.id);
  const sortedReplies = sortReplies(replies);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/forums/${categoryId}`)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {!isMobile && 'Terug'}
        </Button>
        
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Topic Post */}
      <Card className="overflow-hidden">
        <div className="p-6 space-y-4">
          {/* Author Info */}
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={topic.profiles.avatar_url} alt={topic.profiles.username} />
              <AvatarFallback>{getInitials(topic.profiles.username)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("font-semibold", getRoleColor(topic.profiles.role))}>
                  {topic.profiles.username}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(topic.created_at), { 
                    addSuffix: true, 
                    locale: nl 
                  })}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold mt-2 text-foreground">
                {topic.title}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div 
            className="prose prose-sm md:prose-base dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(topic.content) 
            }}
          />

          {/* Tags */}
          {topic.topic_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {topic.topic_tags.map(({ tags }) => (
                <Badge 
                  key={tags.id} 
                  variant="secondary"
                  style={{ backgroundColor: `${tags.color}15`, color: tags.color }}
                  className="border-0"
                >
                  {tags.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Grid */}
          <ActionButtonGrid
            upvotes={topicVotes.upvotes}
            replyCount={topic.reply_count}
            currentVote={topicVotes.currentVote}
            onVote={handleTopicVote}
            onReply={scrollToReplyForm}
          />
        </div>
      </Card>

      {/* Sort Tabs */}
      {replies.length > 0 && (
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="newest">Nieuwste</TabsTrigger>
            <TabsTrigger value="oldest">Oudste</TabsTrigger>
            <TabsTrigger value="top">Top</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Replies - Threaded */}
      {replies.length > 0 && (
        <Card className="overflow-hidden">
          {sortedReplies.map((reply) => (
            <ReplyThread
              key={reply.id}
              reply={reply as any}
              currentUserId={user?.id}
              onQuote={handleQuoteReply}
              onReply={handleReplyTo}
              onVote={handleReplyVote}
            />
          ))}
        </Card>
      )}

      {/* Reply Form */}
      {isAuthenticated ? (
        <Card id="reply-form" className="overflow-hidden">
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {getInitials(user?.email || 'U')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {replyingToId ? 'Reageren op bericht' : 'Schrijf een reactie'}
              </span>
            </div>

            <InlineRichTextEditor
              value={replyContent}
              onChange={setReplyContent}
              placeholder="Deel je gedachten..."
            />

            <div className="flex justify-between items-center pt-2">
              {replyingToId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingToId(null)}
                >
                  Annuleer antwoord
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button 
                  variant="ghost" 
                  onClick={() => setReplyContent('')}
                  disabled={isReplying || !replyContent.trim()}
                >
                  Annuleren
                </Button>
                <Button 
                  onClick={handleReply} 
                  disabled={isReplying || !replyContent.trim()}
                >
                  {isReplying ? 'Plaatsen...' : 'Reageren'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Je moet ingelogd zijn om te kunnen reageren
          </p>
          <Button onClick={() => navigate('/login')}>
            Inloggen
          </Button>
        </Card>
      )}

      {/* Floating Action Button */}
      {isMobile && isAuthenticated && showFAB && (
        <FloatingActionButton
          onClick={scrollToReplyForm}
          icon={<MessageSquare className="h-6 w-6" />}
          size="md"
          className="bottom-20"
        />
      )}
    </div>
  );
}
