import React, { useState, useEffect } from 'react';
import { Search, Crown, Shield, Star, User, Loader2, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  is_online: boolean;
  last_seen: string;
  topics_count: number;
  replies_count: number;
  badges: string[];
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'supplier':
      return <Star className="h-4 w-4 text-primary" />;
    case 'moderator':
      return <Shield className="h-4 w-4 text-primary" />;
    case 'admin':
      return <Crown className="h-4 w-4 text-destructive" />;
    default:
      return <User className="h-4 w-4 text-muted-foreground" />;
  }
};

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'supplier':
      return 'default';
    case 'moderator':
      return 'secondary';
    case 'admin':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('reputation', { ascending: false });

      if (profilesError) throw profilesError;

      if (!profiles) {
        setMembers([]);
        setFilteredMembers([]);
        setLoading(false);
        return;
      }

      // Fetch online status for all users
      const { data: onlineStatuses } = await supabase
        .from('user_online_status')
        .select('user_id, is_online, last_seen')
        .in('user_id', profiles.map(p => p.user_id));

      // Create a map for quick lookup
      const onlineMap = new Map(
        onlineStatuses?.map(s => [s.user_id, s]) || []
      );

      // Fetch topics and replies counts
      const memberPromises = profiles.map(async (profile) => {
        const [topicsResult, repliesResult, achievementsResult] = await Promise.all([
          supabase
            .from('topics')
            .select('id', { count: 'exact', head: true })
            .eq('author_id', profile.user_id),
          supabase
            .from('replies')
            .select('id', { count: 'exact', head: true })
            .eq('author_id', profile.user_id),
          supabase
            .from('user_achievements')
            .select('achievements(name)')
            .eq('user_id', profile.user_id)
            .limit(3)
        ]);

        const onlineStatus = onlineMap.get(profile.user_id);

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
          is_online: onlineStatus?.is_online || false,
          last_seen: onlineStatus?.last_seen || profile.created_at,
          topics_count: topicsResult.count || 0,
          replies_count: repliesResult.count || 0,
          badges: achievementsResult.data?.map(a => a.achievements?.name).filter(Boolean) || []
        } as Member;
      });

      const membersData = await Promise.all(memberPromises);
      setMembers(membersData);
      setFilteredMembers(membersData);
    } catch (error: any) {
      console.error('Error fetching members:', error);
      toast.error('Kon leden niet laden');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    filterMembers(value, activeTab);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    filterMembers(searchQuery, tab);
  };

  const filterMembers = (query: string, tab: string) => {
    let filtered = [...members];

    // Apply tab filter
    if (tab === 'users') {
      filtered = filtered.filter(m => m.role === 'user');
    } else if (tab === 'online') {
      filtered = filtered.filter(m => m.is_online);
    } else if (tab === 'suppliers') {
      filtered = filtered.filter(m => m.role === 'supplier');
    } else if (tab === 'moderators') {
      filtered = filtered.filter(m => m.role === 'moderator' || m.role === 'admin');
    }

    // Apply search filter
    if (query.trim()) {
      filtered = filtered.filter(member =>
        member.username.toLowerCase().includes(query.toLowerCase()) ||
        member.display_name?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredMembers(filtered);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Zojuist online';
    if (diffInHours < 24) return `${diffInHours} uur geleden`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dag${diffInDays > 1 ? 'en' : ''} geleden`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">Community Leden</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {loading ? 'Laden...' : `Ontmoet de ${filteredMembers.length} leden van onze cannabis community`}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Zoek leden..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="all">Alle</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="online">Online</TabsTrigger>
          <TabsTrigger value="suppliers">Shops</TabsTrigger>
          <TabsTrigger value="moderators">Mods</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Geen leden gevonden</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar_url || undefined} />
                          <AvatarFallback>
                            {member.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {member.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">
                            {member.display_name || member.username}
                          </h3>
                          {member.is_verified && (
                            <Star className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          @{member.username}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          {getRoleIcon(member.role)}
                          <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs capitalize">
                            {member.role}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            <span>{member.topics_count + member.replies_count} posts</span>
                          </div>
                          <div>⭐ {member.reputation} reputatie</div>
                          <div>🕒 {member.is_online ? 'Online nu' : getTimeAgo(member.last_seen)}</div>
                        </div>
                        
                        {member.badges.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {member.badges.slice(0, 2).map((badge, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate(`/profile/${member.user_id}`)}
                        >
                          Bekijk Profiel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}