import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchParams {
  query?: string;
  category?: string;
  author?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  contentType?: string;
}

interface SearchResult {
  id: string;
  type: 'topic' | 'reply';
  title?: string;
  content: string;
  author: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  created_at: string;
  reply_count?: number;
  view_count?: number;
  topic_id?: string;
  matches?: string[];
}

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const performSearch = async (params: SearchParams) => {
    setSearchLoading(true);
    try {
      // Search in topics
      let topicsQuery = supabase
        .from('topics')
        .select(`
          id,
          title,
          content,
          created_at,
          view_count,
          reply_count,
          profiles!topics_author_id_fkey (
            username,
            display_name,
            avatar_url
          ),
          categories!topics_category_id_fkey (
            name,
            slug
          )
        `);

      if (params.query) {
        topicsQuery = topicsQuery.or(`title.ilike.%${params.query}%,content.ilike.%${params.query}%`);
      }

      if (params.category) {
        topicsQuery = topicsQuery.eq('categories.slug', params.category);
      }

      if (params.dateFrom) {
        topicsQuery = topicsQuery.gte('created_at', params.dateFrom);
      }

      if (params.dateTo) {
        topicsQuery = topicsQuery.lte('created_at', params.dateTo);
      }

      // Search in replies if contentType is 'all' or 'reply'
      let repliesQuery = null;
      if (!params.contentType || params.contentType === 'all' || params.contentType === 'reply') {
        repliesQuery = supabase
          .from('replies')
          .select(`
            id,
            content,
            created_at,
            topic_id,
            profiles!replies_author_id_fkey (
              username,
              display_name,
              avatar_url
            ),
            topics!replies_topic_id_fkey (
              title,
              categories!topics_category_id_fkey (
                name,
                slug
              )
            )
          `);

        if (params.query) {
          repliesQuery = repliesQuery.ilike('content', `%${params.query}%`);
        }

        if (params.dateFrom) {
          repliesQuery = repliesQuery.gte('created_at', params.dateFrom);
        }

        if (params.dateTo) {
          repliesQuery = repliesQuery.lte('created_at', params.dateTo);
        }
      }

      // Execute queries
      const promises = [topicsQuery.limit(10)];
      if (repliesQuery) {
        promises.push(repliesQuery.limit(10));
      }

      const results = await Promise.all(promises);
      const [topicsResult, repliesResult] = results;

      if (topicsResult.error) {
        console.error('Topics search error:', topicsResult.error);
      }

      if (repliesResult && repliesResult.error) {
        console.error('Replies search error:', repliesResult.error);
      }

      // Format results
      const formattedResults: SearchResult[] = [];

      // Add topics
      if (topicsResult.data) {
        topicsResult.data.forEach(topic => {
          formattedResults.push({
            id: topic.id,
            type: 'topic',
            title: topic.title,
            content: topic.content,
            author: topic.profiles,
            category: topic.categories,
            created_at: topic.created_at,
            reply_count: topic.reply_count,
            view_count: topic.view_count
          });
        });
      }

      // Add replies
      if (repliesResult && repliesResult.data) {
        repliesResult.data.forEach((reply: any) => {
          formattedResults.push({
            id: reply.id,
            type: 'reply',
            title: reply.topics?.title || 'Reply',
            content: reply.content,
            author: reply.profiles,
            category: reply.topics?.categories,
            created_at: reply.created_at,
            topic_id: reply.topic_id
          });
        });
      }

      // Sort by relevance and date
      formattedResults.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return {
    searchResults,
    searchLoading,
    performSearch
  };
};