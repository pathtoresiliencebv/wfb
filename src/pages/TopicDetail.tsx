import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MessageSquare, Eye, Clock, Share2, Flag, Bookmark, 
  Bell, BellOff, Quote, X, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VotingButtons } from '@/components/interactive/VotingButtons';
import { PostActions } from '@/components/interactive/PostActions';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';
import { ModernReplyBox } from '@/components/forum/ModernReplyBox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useVoting } from '@/hooks/useVoting';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useTopicSubscriptions } from '@/hooks/useTopicSubscriptions';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import { cn } from '@/lib/utils';
import { BadgedText } from '@/lib/badgeParser';

interface TopicData {
  id: string;
  title: string;
  content: string;
  view_count: number;
  reply_count: number;
  share_count: number;
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
    avatar_url?: string;
    reputation: number;
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
    avatar_url?: string;
  };
}

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
            share_count,
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
              avatar_url,
              reputation
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

        const { data: repliesData, error: repliesError } = await supabase
          .from('replies')
          .select(`
            id,
            content,
            created_at,
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
          setReplies(repliesData || []);
        }

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
        });

      if (error) throw error;

      toast({
        title: 'Reactie geplaatst',
        description: 'Je reactie is succesvol toegevoegd.',
      });
      
      setReplyContent('');
      
      const { data: repliesData } = await supabase
        .from('replies')
        .select(`
          id,
          content,
          created_at,
          profiles (
            username,
            role,
            avatar_url
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

  const scrollToReplyForm = () => {
    const replyForm = document.getElementById('reply-form');
    replyForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const textarea = replyForm?.querySelector('textarea');
      textarea?.focus();
    }, 500);
  };

  // Helper functions for content processing
  const preserveLineBreaks = (content: string): string => {
    return content.replace(/\n/g, '<br>');
  };

  const parseTagsInContent = (content: string): string => {
    let processed = content;
    
    // Match [tag] pattern - primary colored badge
    processed = processed.replace(/\[([^\]]+)\]/g, (match, tagText) => {
      return `<span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20 mx-1">${tagText}</span>`;
    });
    
    // Match {tag} pattern - success colored badge
    processed = processed.replace(/\{([^\}]+)\}/g, (match, tagText) => {
      return `<span class="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400 ring-1 ring-inset ring-green-500/20 mx-1">${tagText}</span>`;
    });
    
    return processed;
  };

  const processContent = (content: string): string => {
    // Step 1: Preserve line breaks
    let processed = preserveLineBreaks(content);
    
    // Step 2: Parse tags
    processed = parseTagsInContent(processed);
    
    return processed;
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

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: nl 
    });
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

  const topicVotes = getVoteData(topic.id) || {
    id: topic.id,
    currentVote: null,
    upvotes: 0,
    downvotes: 0
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-2 pb-6 space-y-4">
      {/* Topic Card */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={topic.profiles.avatar_url} alt={topic.profiles.username} />
              <AvatarFallback>{getInitials(topic.profiles.username)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              {/* User info met datum en voting in 1 rij */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Element 1: Username */}
                <span className={cn("font-semibold text-sm", getRoleColor(topic.profiles.role))}>
                  {topic.profiles.username}
                </span>
                
                {/* Element 2: Datum */}
                <span className="text-xs text-muted-foreground">
                  {formatDate(topic.created_at)}
                </span>
                
                {/* Element 3: Voting buttons */}
                <div className="ml-auto">
                  <VotingButtons
                    itemId={topic.id}
                    upvotes={topicVotes.upvotes}
                    downvotes={topicVotes.downvotes}
                    currentVote={topicVotes.currentVote}
                    onVote={(voteType) => handleVote(topic.id, voteType, 'topic')}
                    orientation="horizontal"
                    size="sm"
                  />
                </div>
              </div>
              
              {/* Tags */}
              {topic.topic_tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {topic.topic_tags.map(({ tags }) => (
                    <Badge 
                      key={tags.id} 
                      variant="secondary"
                      style={{ backgroundColor: `${tags.color}15`, color: tags.color }}
                    >
                      {tags.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Titel bovenaan in content */}
          <div className="space-y-6">
            <h1 className="text-xl md:text-2xl font-bold">
              <BadgedText text={topic.title} />
            </h1>
            
            <div 
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-strong:text-foreground prose-em:italic prose-ul:list-disc prose-ol:list-decimal prose-li:text-base prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(processContent(topic.content), {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'div', 'span'],
                  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel']
                })
              }}
            />

            {/* Stats links & Actions rechts */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
              {/* Stats links onderin */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {topic.view_count}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {topic.reply_count}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  {topic.share_count || 0}
                </span>
              </div>

              {/* Actions rechts: bookmark, flag (zonder share) */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleBookmark(topic.id, 'topic')}
                  className={isBookmarked(topic.id) ? 'text-primary' : ''}
                  title={isBookmarked(topic.id) ? 'Opgeslagen' : 'Opslaan'}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked(topic.id) ? 'fill-current' : ''}`} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast({
                        title: 'Inloggen vereist',
                        description: 'Je moet ingelogd zijn om content te rapporteren.',
                        variant: 'destructive',
                      });
                      return;
                    }
                    toast({
                      title: 'Content gerapporteerd',
                      description: 'Bedankt voor je melding. We zullen dit bekijken.',
                    });
                  }}
                  title="Rapporteer"
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      {replies.map((reply) => {
        const replyVotes = getVoteData(reply.id) || {
          id: reply.id,
          currentVote: null,
          upvotes: 0,
          downvotes: 0
        };

        return (
          <Card key={reply.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Voting */}
                <div className="flex-shrink-0">
                  <VotingButtons
                    itemId={reply.id}
                    upvotes={replyVotes.upvotes}
                    downvotes={replyVotes.downvotes}
                    currentVote={replyVotes.currentVote}
                    onVote={(voteType) => handleVote(reply.id, voteType, 'reply')}
                    orientation="vertical"
                    size="sm"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={reply.profiles.avatar_url} alt={reply.profiles.username} />
                      <AvatarFallback className="text-xs">
                        {getInitials(reply.profiles.username)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-semibold text-sm", getRoleColor(reply.profiles.role))}>
                          {reply.profiles.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(reply.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-sm prose-p:leading-6 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-strong:text-foreground prose-em:italic prose-ul:list-disc prose-ol:list-decimal prose-li:text-sm prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:p-3 prose-pre:rounded-lg prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(processContent(reply.content), {
                        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'div', 'span'],
                        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'target', 'rel']
                      })
                    }}
                  />

                  {/* Reply Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuoteReply(reply)}
                      className="h-8"
                    >
                      <Quote className="h-3 w-3 mr-1" />
                      Quote
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      Rapporteer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Reply Form */}
      {isAuthenticated ? (
        <div id="reply-form">
          <ModernReplyBox
            user={{
              username: user?.email,
              avatar_url: undefined,
              email: user?.email,
            }}
            replyContent={replyContent}
            onReplyContentChange={setReplyContent}
            onSubmit={handleReply}
            isSubmitting={isReplying}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Je moet ingelogd zijn om te kunnen reageren
            </p>
            <Button onClick={() => navigate('/login')}>
              Inloggen
            </Button>
          </CardContent>
        </Card>
      )}

      {/* FAB */}
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
