import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Member {
  id: string;
  user_id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  role: string;
  reputation: number;
  is_verified: boolean;
  created_at: string;
  bio?: string;
  online_status?: {
    is_online: boolean;
    last_seen: string;
  };
  stats?: {
    topics_count: number;
    replies_count: number;
    total_posts: number;
  };
  badges?: string[];
}

interface UseMembersReturn {
  members: Member[];
  loading: boolean;
  error: string | null;
  searchMembers: (query: string) => void;
  filterByRole: (role: string) => void;
  filterByOnlineStatus: (online: boolean) => void;
  refreshMembers: () => Promise<void>;
}

export const useMembers = (): UseMembersReturn => {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch profiles with online status
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_online_status (
            is_online,
            last_seen
          )
        `)
        .order('reputation', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user stats for each member
      const membersWithStats = await Promise.all(
        profilesData.map(async (profile) => {
          const [topicsResult, repliesResult] = await Promise.all([
            supabase
              .from('topics')
              .select('id')
              .eq('author_id', profile.user_id),
            supabase
              .from('replies')
              .select('id')
              .eq('author_id', profile.user_id)
          ]);

          const topicsCount = topicsResult.data?.length || 0;
          const repliesCount = repliesResult.data?.length || 0;

          // Get user badges (simplified - using achievements)
          const { data: achievements } = await supabase
            .from('user_achievements')
            .select(`
              achievements (
                name
              )
            `)
            .eq('user_id', profile.user_id)
            .limit(3);

          const badges = achievements?.map(a => a.achievements?.name).filter(Boolean) || [];

          return {
            id: profile.id,
            user_id: profile.user_id,
            username: profile.username,
            display_name: profile.display_name,
            avatar_url: profile.avatar_url,
            role: profile.role,
            reputation: profile.reputation,
            is_verified: profile.is_verified,
            created_at: profile.created_at,
            bio: profile.bio,
            online_status: Array.isArray(profile.user_online_status) && profile.user_online_status.length > 0
              ? { is_online: profile.user_online_status[0].is_online, last_seen: profile.user_online_status[0].last_seen }
              : { is_online: false, last_seen: profile.created_at },
            stats: {
              topics_count: topicsCount,
              replies_count: repliesCount,
              total_posts: topicsCount + repliesCount
            },
            badges
          };
        })
      );

      setAllMembers(membersWithStats);
      setMembers(membersWithStats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch members');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchMembers = (query: string) => {
    if (!query.trim()) {
      setMembers(allMembers);
      return;
    }

    const filtered = allMembers.filter(member =>
      member.username.toLowerCase().includes(query.toLowerCase()) ||
      member.display_name?.toLowerCase().includes(query.toLowerCase())
    );
    setMembers(filtered);
  };

  const filterByRole = (role: string) => {
    if (role === 'all') {
      setMembers(allMembers);
      return;
    }

    const filtered = allMembers.filter(member => 
      member.role.toLowerCase() === role.toLowerCase()
    );
    setMembers(filtered);
  };

  const filterByOnlineStatus = (online: boolean) => {
    const filtered = allMembers.filter(member => 
      member.online_status?.is_online === online
    );
    setMembers(filtered);
  };

  const refreshMembers = async () => {
    await fetchMembers();
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    error,
    searchMembers,
    filterByRole,
    filterByOnlineStatus,
    refreshMembers
  };
};