import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Users, MessageSquare, Clock, User, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedSearch } from '@/components/search/AdvancedSearch';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface SearchFilters {
  query: string;
  category: string;
  author: string;
  dateRange: string;
  tags: string[];
}

interface SearchResult {
  type: 'topic' | 'reply' | 'user';
  id: string;
  title?: string;
  content?: string;
  username?: string;
  displayName?: string;
  created_at: string;
  category?: {
    name: string;
    slug: string;
  };
  author?: {
    username: string;
    displayName: string;
    isVerified: boolean;
  };
  stats?: {
    replyCount: number;
    viewCount: number;
  };
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  const initialQuery = searchParams.get('q') || '';
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    category: 'all',
    author: '',
    dateRange: 'all',
    tags: [],
  });

  const performSearch = async (searchFilters: SearchFilters) => {
    setLoading(true);
    setFilters(searchFilters);
    
    // Update URL
    if (searchFilters.query) {
      setSearchParams({ q: searchFilters.query });
    }

    try {
      const allResults: SearchResult[] = [];

      // Search Topics
      if (activeTab === 'all' || activeTab === 'topics') {
        let topicsQuery = supabase
          .from('topics')
          .select(`
            id,
            title,
            content,
            created_at,
            reply_count,
            view_count,
            categories!inner (
              name,
              slug
            ),
            profiles!inner (
              username,
              display_name,
              is_verified
            )
          `);

        if (searchFilters.query) {
          topicsQuery = topicsQuery.or(`title.ilike.%${searchFilters.query}%,content.ilike.%${searchFilters.query}%`);
        }
        
        if (searchFilters.category !== 'all') {
          topicsQuery = topicsQuery.eq('categories.slug', searchFilters.category);
        }
        
        if (searchFilters.author) {
          topicsQuery = topicsQuery.ilike('profiles.username', `%${searchFilters.author}%`);
        }

        if (searchFilters.dateRange !== 'all') {
          const dateFilter = getDateFilter(searchFilters.dateRange);
          if (dateFilter) {
            topicsQuery = topicsQuery.gte('created_at', dateFilter);
          }
        }

        const { data: topicsData } = await topicsQuery.limit(20);

        if (topicsData) {
          const topicResults: SearchResult[] = topicsData.map(topic => ({
            type: 'topic' as const,
            id: topic.id,
            title: topic.title,
            content: topic.content,
            created_at: topic.created_at,
            category: topic.categories,
            author: {
              username: topic.profiles.username,
              displayName: topic.profiles.display_name || topic.profiles.username,
              isVerified: topic.profiles.is_verified
            },
            stats: {
              replyCount: topic.reply_count,
              viewCount: topic.view_count
            }
          }));
          allResults.push(...topicResults);
        }
      }

      // Search Replies
      if (activeTab === 'all' || activeTab === 'replies') {
        let repliesQuery = supabase
          .from('replies')
          .select(`
            id,
            content,
            created_at,
            topics!inner (
              id,
              title,
              categories (
                name,
                slug
              )
            ),
            profiles!inner (
              username,
              display_name,
              is_verified
            )
          `);

        if (searchFilters.query) {
          repliesQuery = repliesQuery.ilike('content', `%${searchFilters.query}%`);
        }
        
        if (searchFilters.author) {
          repliesQuery = repliesQuery.ilike('profiles.username', `%${searchFilters.author}%`);
        }

        if (searchFilters.dateRange !== 'all') {
          const dateFilter = getDateFilter(searchFilters.dateRange);
          if (dateFilter) {
            repliesQuery = repliesQuery.gte('created_at', dateFilter);
          }
        }

        const { data: repliesData } = await repliesQuery.limit(20);

        if (repliesData) {
          const replyResults: SearchResult[] = repliesData.map(reply => ({
            type: 'reply' as const,
            id: reply.id,
            content: reply.content,
            created_at: reply.created_at,
            title: `Re: ${reply.topics.title}`,
            category: reply.topics.categories,
            author: {
              username: reply.profiles.username,
              displayName: reply.profiles.display_name || reply.profiles.username,
              isVerified: reply.profiles.is_verified
            }
          }));
          allResults.push(...replyResults);
        }
      }

      // Search Users
      if (activeTab === 'all' || activeTab === 'users') {
        let usersQuery = supabase
          .from('profiles')
          .select('id, user_id, username, display_name, bio, is_verified, created_at, reputation');

        if (searchFilters.query) {
          usersQuery = usersQuery.or(`username.ilike.%${searchFilters.query}%,display_name.ilike.%${searchFilters.query}%,bio.ilike.%${searchFilters.query}%`);
        }

        const { data: usersData } = await usersQuery.limit(20);

        if (usersData) {
          const userResults: SearchResult[] = usersData.map(user => ({
            type: 'user' as const,
            id: user.id,
            username: user.username,
            displayName: user.display_name || user.username,
            content: user.bio,
            created_at: user.created_at
          }));
          allResults.push(...userResults);
        }
      }

      // Sort results by relevance and date
      allResults.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setResults(allResults);
      setTotalResults(allResults.length);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateFilter = (range: string): string | null => {
    const now = new Date();
    switch (range) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return weekAgo.toISOString();
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return monthAgo.toISOString();
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return yearAgo.toISOString();
      default:
        return null;
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(filters);
    }
  }, [activeTab]);

  const filteredResults = results.filter(result => {
    if (activeTab === 'all') return true;
    return result.type === activeTab.slice(0, -1); // Remove 's' from 'topics', 'replies', 'users'
  });

  const renderSearchResult = (result: SearchResult) => {
    switch (result.type) {
      case 'topic':
        return (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link 
                    to={`/forums/${result.category?.slug}/topic/${result.id}`}
                    className="font-semibold hover:text-primary cursor-pointer line-clamp-2"
                  >
                    {result.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{result.author?.displayName}</span>
                    {result.author?.isVerified && (
                      <Badge variant="secondary" className="text-xs">Geverifieerd</Badge>
                    )}
                    <Clock className="h-3 w-3 ml-2" />
                    <span>{formatDistanceToNow(new Date(result.created_at), { addSuffix: true, locale: nl })}</span>
                  </div>
                </div>
                <Badge variant="outline">{result.category?.name}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground line-clamp-2 mb-3">{result.content}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{result.stats?.replyCount} reacties</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{result.stats?.viewCount} views</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'reply':
        return (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-semibold text-muted-foreground text-sm mb-1">
                    Reactie in: {result.title}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{result.author?.displayName}</span>
                    {result.author?.isVerified && (
                      <Badge variant="secondary" className="text-xs">Geverifieerd</Badge>
                    )}
                    <Clock className="h-3 w-3 ml-2" />
                    <span>{formatDistanceToNow(new Date(result.created_at), { addSuffix: true, locale: nl })}</span>
                  </div>
                </div>
                <Badge variant="outline">{result.category?.name}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground line-clamp-3">{result.content}</p>
            </CardContent>
          </Card>
        );

      case 'user':
        return (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <Link 
                    to={`/members/${result.username}`}
                    className="font-semibold hover:text-primary cursor-pointer"
                  >
                    {result.displayName}
                  </Link>
                  <p className="text-sm text-muted-foreground">@{result.username}</p>
                  {result.content && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{result.content}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold mb-2">Zoeken</h1>
        <p className="text-muted-foreground">
          Doorzoek topics, reacties en leden van de community
        </p>
      </div>

      {/* Search Form */}
      <AdvancedSearch />

      {/* Note: AdvancedSearch now handles its own search state and results */}

      {/* Results */}
      {(filters.query || totalResults > 0) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg font-medium">
                {loading ? 'Zoeken...' : `${totalResults} resultaten gevonden`}
              </span>
              {filters.query && (
                <span className="text-muted-foreground">voor "{filters.query}"</span>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                Alles ({results.length})
              </TabsTrigger>
              <TabsTrigger value="topics">
                <BookOpen size={16} />
                <span className="ml-1">Topics ({results.filter(r => r.type === 'topic').length})</span>
              </TabsTrigger>
              <TabsTrigger value="replies">
                <MessageSquare size={16} />
                <span className="ml-1">Reacties ({results.filter(r => r.type === 'reply').length})</span>
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users size={16} />
                <span className="ml-1">Leden ({results.filter(r => r.type === 'user').length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="space-y-4">
                  {filteredResults.map(renderSearchResult)}
                </div>
              ) : filters.query ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Geen resultaten gevonden</h3>
                    <p className="text-muted-foreground mb-4">
                      Probeer andere zoektermen of pas je filters aan.
                    </p>
                    <Button variant="outline" onClick={() => setFilters({ ...filters, query: '' })}>
                      Filters wissen
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Wat wil je zoeken?</h3>
                    <p className="text-muted-foreground">
                      Voer een zoekterm in om te beginnen met zoeken in topics, reacties en leden.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}