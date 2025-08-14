import React, { useState } from 'react';
import { Search, Crown, Shield, Star, User, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMembers } from '@/hooks/useMembers';
import { useNavigate } from 'react-router-dom';


const getRoleIcon = (role: string) => {
  switch (role) {
    case 'supplier':
      return <Star className="h-4 w-4 text-purple-500" />;
    case 'moderator':
      return <Shield className="h-4 w-4 text-blue-500" />;
    case 'admin':
      return <Crown className="h-4 w-4 text-red-500" />;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { members, loading, error, searchMembers, filterByRole, filterByOnlineStatus } = useMembers();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    searchMembers(value);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'all') {
      searchMembers(searchQuery);
    } else if (tab === 'online') {
      filterByOnlineStatus(true);
    } else if (tab === 'suppliers') {
      filterByRole('supplier');
    } else if (tab === 'moderators') {
      filterByRole('moderator');
    }
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
    <div className="space-y-6">
      {/* Header */}
        <div>
        <h1 className="font-heading text-3xl font-bold">Community Leden</h1>
        <p className="text-muted-foreground">
          {loading ? 'Laden...' : `Ontmoet de ${members.length} leden van onze cannabis community`}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek leden..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">Alle Leden</TabsTrigger>
          <TabsTrigger value="online">Online Nu</TabsTrigger>
          <TabsTrigger value="suppliers">Leveranciers</TabsTrigger>
          <TabsTrigger value="moderators">Moderators</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback>
                          {member.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {member.online_status?.is_online && (
                        <div className="online-indicator absolute -bottom-1 -right-1" />
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
                        <div>💬 {member.stats?.total_posts || 0} posts</div>
                        <div>⭐ {member.reputation} reputatie</div>
                        <div>🕒 {member.online_status?.is_online ? 'Online nu' : getTimeAgo(member.online_status?.last_seen || member.created_at)}</div>
                      </div>
                      
                      {member.badges && member.badges.length > 0 && (
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
          
          {!loading && members.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Geen leden gevonden</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}