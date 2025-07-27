import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pin, MessageSquare, Eye, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AdvancedSearch } from '@/components/search/AdvancedSearch';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  slug: string;
}

interface TopicWithAuthor {
  id: string;
  title: string;
  reply_count: number;
  view_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  last_activity_at: string;
  profiles: {
    username: string;
    role: string;
  };
}

export default function ForumCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [category, setCategory] = useState<Category | null>(null);
  const [topics, setTopics] = useState<TopicWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    category: 'all',
    author: '',
    dateRange: 'all',
    tags: [] as string[],
  });

  useEffect(() => {
    const fetchCategoryAndTopics = async () => {
      if (!categoryId) return;

      try {
        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', categoryId)
          .single();

        if (categoryError) {
          console.error('Error fetching category:', categoryError);
          setCategory(null);
        } else {
          setCategory(categoryData);
        }

        // Fetch topics for this category
        const { data: topicsData, error: topicsError } = await supabase
          .from('topics')
          .select(`
            id,
            title,
            reply_count,
            view_count,
            is_pinned,
            is_locked,
            created_at,
            last_activity_at,
            profiles (
              username,
              role
            )
          `)
          .eq('category_id', categoryData?.id)
          .order('is_pinned', { ascending: false })
          .order('last_activity_at', { ascending: false });

        if (topicsError) {
          console.error('Error fetching topics:', topicsError);
        } else {
          setTopics(topicsData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndTopics();
  }, [categoryId]);

  const filteredTopics = topics.filter(topic => {
    if (searchFilters.query && !topic.title.toLowerCase().includes(searchFilters.query.toLowerCase())) {
      return false;
    }
    if (searchFilters.author && !topic.profiles?.username.toLowerCase().includes(searchFilters.author.toLowerCase())) {
      return false;
    }
    return true;
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min geleden`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} uur geleden`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} dag${Math.floor(diffInMinutes / 1440) > 1 ? 'en' : ''} geleden`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Forum categorie niet gevonden</h1>
        <Button onClick={() => navigate('/forums')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar Forums
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/forums')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>
        <div className={`w-12 h-12 rounded-lg ${category.color || 'bg-primary'} flex items-center justify-center`}>
          <MessageSquare className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="font-heading text-3xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
        {isAuthenticated && (
          <Button onClick={() => navigate(`/forums/${categoryId}/new-topic`)}>
            <Plus className="h-4 w-4 mr-2" />
            Nieuw Topic
          </Button>
        )}
      </div>

      <AdvancedSearch />

      {/* Note: Search functionality is now self-contained in AdvancedSearch component */}
      <div className="text-sm text-muted-foreground mb-4">
        Showing topics in {category.name}
      </div>

      {/* Topics List */}
      <div className="space-y-2">
        {filteredTopics.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Geen topics gevonden</h3>
            <p className="text-muted-foreground mb-4">
              {searchFilters.query ? 'Probeer een andere zoekterm.' : 'Wees de eerste om een topic te starten!'}
            </p>
            {isAuthenticated && (
              <Button onClick={() => navigate(`/forums/${categoryId}/new-topic`)}>
                <Plus className="h-4 w-4 mr-2" />
                Maak het eerste topic
              </Button>
            )}
          </Card>
        ) : (
          filteredTopics.map((topic) => (
            <Card key={topic.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Topic Icons */}
                  <div className="flex flex-col items-center gap-1 mt-1">
                    {topic.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Topic Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link 
                          to={`/forums/${categoryId}/topic/${topic.id}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                          {topic.title}
                        </Link>
                        
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span className="font-medium">{topic.profiles?.username}</span>
                          {topic.profiles?.role === 'moderator' && (
                            <Badge variant="secondary" className="text-xs">MOD</Badge>
                          )}
                          {topic.profiles?.role === 'expert' && (
                            <Badge variant="default" className="text-xs">EXPERT</Badge>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-col items-end text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{topic.reply_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{topic.view_count}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(topic.last_activity_at || topic.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
