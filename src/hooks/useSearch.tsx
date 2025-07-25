import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (filters: SearchFilters, types: ('topic' | 'reply' | 'user')[] = ['topic', 'reply', 'user']) => {
    setLoading(true);
    setError(null);

    try {
      const allResults: SearchResult[] = [];

      // Helper function to get date filter
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

      // Search Topics
      if (types.includes('topic')) {
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

        if (filters.query) {
          topicsQuery = topicsQuery.or(`title.ilike.%${filters.query}%,content.ilike.%${filters.query}%`);
        }
        
        if (filters.category !== 'all') {
          topicsQuery = topicsQuery.eq('categories.slug', filters.category);
        }
        
        if (filters.author) {
          topicsQuery = topicsQuery.ilike('profiles.username', `%${filters.author}%`);
        }

        if (filters.dateRange !== 'all') {
          const dateFilter = getDateFilter(filters.dateRange);
          if (dateFilter) {
            topicsQuery = topicsQuery.gte('created_at', dateFilter);
          }
        }

        const { data: topicsData, error: topicsError } = await topicsQuery.limit(50);

        if (topicsError) throw topicsError;

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
      if (types.includes('reply')) {
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

        if (filters.query) {
          repliesQuery = repliesQuery.ilike('content', `%${filters.query}%`);
        }
        
        if (filters.author) {
          repliesQuery = repliesQuery.ilike('profiles.username', `%${filters.author}%`);
        }

        if (filters.dateRange !== 'all') {
          const dateFilter = getDateFilter(filters.dateRange);
          if (dateFilter) {
            repliesQuery = repliesQuery.gte('created_at', dateFilter);
          }
        }

        const { data: repliesData, error: repliesError } = await repliesQuery.limit(50);

        if (repliesError) throw repliesError;

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
      if (types.includes('user')) {
        let usersQuery = supabase
          .from('profiles')
          .select('id, user_id, username, display_name, bio, is_verified, created_at, reputation');

        if (filters.query) {
          usersQuery = usersQuery.or(`username.ilike.%${filters.query}%,display_name.ilike.%${filters.query}%,bio.ilike.%${filters.query}%`);
        }

        const { data: usersData, error: usersError } = await usersQuery.limit(50);

        if (usersError) throw usersError;

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
      allResults.sort((a, b) => {
        // Prioritize title matches over content matches
        if (filters.query && a.title && b.title) {
          const aMatch = a.title.toLowerCase().includes(filters.query.toLowerCase());
          const bMatch = b.title.toLowerCase().includes(filters.query.toLowerCase());
          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;
        }
        
        // Then sort by date
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setResults(allResults);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het zoeken');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults
  };
}