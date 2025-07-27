import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Eye, Clock, User, Flag, Bookmark } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/forums/${categoryId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar {topic.categories?.name}
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link to={`/forums/${categoryId}`} className="text-sm text-muted-foreground hover:text-primary">
              {topic.categories?.name}
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Topic</span>
          </div>
          <h1 className="font-heading text-2xl font-bold">{topic.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={isBookmarked(topic.id) ? "default" : "outline"} 
            size="sm"
            onClick={() => toggleBookmark(topic.id, 'topic')}
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
      </div>

      {/* Topic Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{topic.view_count} views</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{topic.reply_count} reacties</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{formatDate(topic.created_at)}</span>
        </div>
      </div>

      {/* Original Post */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={getRoleColor(topic.profiles?.role || 'user')}>
                  {getUserInitials(topic.profiles?.username || 'Anonymous')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{topic.profiles?.username}</span>
                  {topic.profiles?.role === 'moderator' && (
                    <Badge variant="secondary" className="text-xs">MOD</Badge>
                  )}
                  {topic.profiles?.role === 'expert' && (
                    <Badge variant="default" className="text-xs">EXPERT</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {topic.profiles?.reputation || 0} reputatie • Lid sinds {new Date(topic.profiles?.created_at || topic.created_at).getFullYear()}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            {/* Vote Section */}
            <div className="flex flex-col items-center min-w-[4rem]">
              {topicVoteData && (
                <VotingButtons
                  itemId={topic.id}
                  upvotes={topicVoteData.upvotes}
                  downvotes={topicVoteData.downvotes}
                  currentVote={topicVoteData.currentVote}
                  onVote={(voteType) => handleVote(topic.id, voteType, 'topic')}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div 
                className="prose prose-sm max-w-none mb-6 text-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: topic.content.replace(/\n/g, '<br>') 
                }}
              />
              
              <div className="flex items-center justify-end">
                <PostActions
                  itemId={topic.id}
                  itemType="topic"
                  isBookmarked={isBookmarked(topic.id)}
                  onBookmark={() => toggleBookmark(topic.id, 'topic')}
                />
              </div>
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
            <CardHeader className="border-b pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={getRoleColor(reply.profiles?.role || 'user')}>
                      {getUserInitials(reply.profiles?.username || 'Anonymous')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{reply.profiles?.username}</span>
                      {reply.profiles?.role === 'expert' && (
                        <Badge variant="default" className="text-xs">EXPERT</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(reply.created_at)}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Flag className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex gap-4">
                {/* Vote Section for Reply */}
                <div className="flex flex-col items-center min-w-[3rem]">
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
                
                {/* Reply Content */}
                <div className="flex-1">
                  <div 
                    className="text-sm prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: reply.content.replace(/\n/g, '<br>') 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply Form */}
      {isAuthenticated ? (
        <Card>
          <CardHeader>
            <h4 className="font-medium">Reageer op dit topic</h4>
          </CardHeader>
          <CardContent className="space-y-4">
            <RichTextEditor
              value={replyContent}
              onChange={setReplyContent}
              placeholder="Deel je gedachten over dit topic..."
              minHeight={120}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReplyContent('')}>
                Annuleren
              </Button>
              <Button onClick={handleReply} disabled={isReplying}>
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
