import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  role: string;
  reputation: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  topics_count: number;
  replies_count: number;
  total_upvotes: number;
  achievements_count: number;
}

interface UserPost {
  id: string;
  title?: string;
  content: string;
  type: 'topic' | 'reply';
  category?: { name: string; slug: string };
  created_at: string;
  reply_count?: number;
  view_count?: number;
  upvotes: number;
  topic_id?: string;
}

interface UserActivity {
  id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
}

interface UseUserProfileReturn {
  profile: UserProfile | null;
  stats: UserStats | null;
  posts: UserPost[];
  topics: UserPost[];
  activity: UserActivity[];
  loading: boolean;
  error: string | null;
  fetchUserData: (userId: string) => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [topics, setTopics] = useState<UserPost[]>([]);
  const [activity, setActivity] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch user stats
      const [topicsResult, repliesResult, votesResult, achievementsResult] = await Promise.all([
        supabase
          .from('topics')
          .select('id')
          .eq('author_id', userId),
        supabase
          .from('replies')
          .select('id')
          .eq('author_id', userId),
        supabase
          .from('votes')
          .select('vote_type')
          .eq('vote_type', 'up')
          .or(`item_id.in.(${await getItemIds(userId)})`),
        supabase
          .from('user_achievements')
          .select('id')
          .eq('user_id', userId)
      ]);

      const userStats: UserStats = {
        topics_count: topicsResult.data?.length || 0,
        replies_count: repliesResult.data?.length || 0,
        total_upvotes: votesResult.data?.length || 0,
        achievements_count: achievementsResult.data?.length || 0
      };
      setStats(userStats);

      // Fetch user's recent posts (topics and replies)
      const { data: userTopics } = await supabase
        .from('topics')
        .select(`
          id,
          title,
          content,
          created_at,
          view_count,
          reply_count,
          categories!topics_category_id_fkey (
            name,
            slug
          )
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: userReplies } = await supabase
        .from('replies')
        .select(`
          id,
          content,
          created_at,
          topic_id,
          topics!replies_topic_id_fkey (
            title,
            categories!topics_category_id_fkey (
              name,
              slug
            )
          )
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get vote counts for posts
      const allTopicIds = userTopics?.map(t => t.id) || [];
      const allReplyIds = userReplies?.map(r => r.id) || [];
      
      const [topicVotes, replyVotes] = await Promise.all([
        allTopicIds.length > 0 ? supabase
          .from('votes')
          .select('item_id, vote_type')
          .eq('item_type', 'topic')
          .in('item_id', allTopicIds)
          .eq('vote_type', 'up') : { data: [] },
        allReplyIds.length > 0 ? supabase
          .from('votes')
          .select('item_id, vote_type')
          .eq('item_type', 'reply')
          .in('item_id', allReplyIds)
          .eq('vote_type', 'up') : { data: [] }
      ]);

      // Format topics
      const formattedTopics: UserPost[] = userTopics?.map(topic => ({
        id: topic.id,
        title: topic.title,
        content: topic.content,
        type: 'topic' as const,
        category: topic.categories,
        created_at: topic.created_at,
        reply_count: topic.reply_count,
        view_count: topic.view_count,
        upvotes: topicVotes.data?.filter(v => v.item_id === topic.id).length || 0
      })) || [];

      // Format replies
      const formattedReplies: UserPost[] = userReplies?.map(reply => ({
        id: reply.id,
        title: reply.topics?.title || 'Reply',
        content: reply.content,
        type: 'reply' as const,
        category: reply.topics?.categories,
        created_at: reply.created_at,
        topic_id: reply.topic_id,
        upvotes: replyVotes.data?.filter(v => v.item_id === reply.id).length || 0
      })) || [];

      // Combine and sort posts
      const allPosts = [...formattedTopics, ...formattedReplies]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setPosts(allPosts);
      setTopics(formattedTopics);

      // Fetch user activity
      const { data: activityData } = await supabase
        .from('activity_feed')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      setActivity(activityData || []);

    } catch (err: any) {
      setError(err.message || 'Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get item IDs for vote counting
  const getItemIds = async (userId: string): Promise<string> => {
    const [topics, replies] = await Promise.all([
      supabase.from('topics').select('id').eq('author_id', userId),
      supabase.from('replies').select('id').eq('author_id', userId)
    ]);
    
    const topicIds = topics.data?.map(t => t.id) || [];
    const replyIds = replies.data?.map(r => r.id) || [];
    
    return [...topicIds, ...replyIds].join(',');
  };

  return {
    profile,
    stats,
    posts,
    topics,
    activity,
    loading,
    error,
    fetchUserData
  };
};