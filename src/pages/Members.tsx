import React, { useState } from 'react';
import { Search, Crown, Shield, Star, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const members = [
  {
    id: '1',
    username: 'CBD_Expert',
    displayName: 'Dr. Sarah Van Damme',
    avatar: null,
    role: 'Expert',
    isVerified: true,
    isOnline: true,
    lastSeen: 'Nu online',
    joinDate: '2023-01-15',
    posts: 342,
    reputation: 1250,
    badges: ['CBD Specialist', 'Trusted Member'],
    location: 'Brussel',
  },
  {
    id: '2',
    username: 'GreenThumb',
    displayName: 'Jan Peeters',
    avatar: null,
    role: 'Moderator',
    isVerified: true,
    isOnline: true,
    lastSeen: '5 min geleden',
    joinDate: '2022-11-08',
    posts: 891,
    reputation: 2100,
    badges: ['Grow Expert', 'Community Leader'],
    location: 'Antwerpen',
  },
  {
    id: '3',
    username: 'MediUser123',
    displayName: 'Emma Claes',
    avatar: null,
    role: 'Lid',
    isVerified: false,
    isOnline: false,
    lastSeen: '2 uur geleden',
    joinDate: '2024-03-22',
    posts: 45,
    reputation: 128,
    badges: ['New Member'],
    location: 'Gent',
  },
  {
    id: '4',
    username: 'LegalEagle',
    displayName: 'Advocaat Thomas',
    avatar: null,
    role: 'Expert',
    isVerified: true,
    isOnline: false,
    lastSeen: '1 dag geleden',
    joinDate: '2023-06-12',
    posts: 167,
    reputation: 890,
    badges: ['Legal Expert', 'Verified Professional'],
    location: 'Leuven',
  },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'Expert':
      return <Star className="h-4 w-4 text-yellow-500" />;
    case 'Moderator':
      return <Shield className="h-4 w-4 text-blue-500" />;
    case 'Admin':
      return <Crown className="h-4 w-4 text-purple-500" />;
    default:
      return <User className="h-4 w-4 text-muted-foreground" />;
  }
};

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'Expert':
      return 'default';
    case 'Moderator':
      return 'secondary';
    case 'Admin':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function Members() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'online' && member.isOnline) ||
                      (activeTab === 'experts' && member.role === 'Expert') ||
                      (activeTab === 'moderators' && member.role === 'Moderator');
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold">Community Leden</h1>
        <p className="text-muted-foreground">
          Ontmoet de {members.length} leden van onze cannabis community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek leden..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Alle Leden</TabsTrigger>
          <TabsTrigger value="online">Online Nu</TabsTrigger>
          <TabsTrigger value="experts">Experts</TabsTrigger>
          <TabsTrigger value="moderators">Moderators</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar || undefined} />
                        <AvatarFallback>
                          {member.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {member.isOnline && (
                        <div className="online-indicator absolute -bottom-1 -right-1" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{member.displayName}</h3>
                        {member.isVerified && (
                          <Star className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        @{member.username}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {getRoleIcon(member.role)}
                        <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs text-muted-foreground mb-3">
                        <div>📍 {member.location}</div>
                        <div>💬 {member.posts} posts</div>
                        <div>⭐ {member.reputation} reputatie</div>
                        <div>🕒 {member.lastSeen}</div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {member.badges.map((badge, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full">
                        Bekijk Profiel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Geen leden gevonden</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}