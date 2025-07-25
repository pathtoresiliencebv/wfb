import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Award, MessageSquare, Eye, Clock, Edit, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const mockUserProfile = {
  id: 'user1',
  username: 'CannabisExpert',
  email: 'expert@example.com',
  avatar: null,
  bio: 'Cannabis onderzoeker en enthousiasteling met 10+ jaar ervaring in de sector. Gespecialiseerd in medicinaal gebruik en teelt technieken. Altijd bereid om kennis te delen!',
  location: 'Brussel, België',
  joinedAt: '2023-02-15',
  lastSeen: '2024-01-20T15:30:00Z',
  isOnline: true,
  role: 'expert',
  reputation: 2840,
  badges: ['Expert', 'CBD Specialist', 'Community Helper', 'Early Adopter'],
  stats: {
    posts: 187,
    topics: 23,
    upvotes: 1240,
    helped: 89,
  },
};

const mockUserPosts = [
  {
    id: 'p1',
    title: 'CBD dosering voor beginners: Een complete gids',
    content: 'Voor iedereen die net begint met CBD, hier een overzicht van de belangrijkste punten om rekening mee te houden bij dosering...',
    category: 'Medicinaal Gebruik',
    createdAt: '2024-01-18T14:20:00Z',
    upvotes: 34,
    replies: 12,
    views: 567,
  },
  {
    id: 'p2',
    title: 'Nieuwe onderzoeksresultaten over terpenen',
    content: 'Ik kwam recent een interessant onderzoek tegen over de rol van terpenen in het entourage effect...',
    category: 'Wetgeving & Nieuws',
    createdAt: '2024-01-15T09:45:00Z',
    upvotes: 28,
    replies: 8,
    views: 423,
  },
  {
    id: 'p3',
    title: 'Tips voor eerste kweek setup',
    content: 'Voor alle beginners die overwegen om te gaan kweken, hier mijn top tips voor een succesvolle eerste setup...',
    category: 'Teelt & Horticultuur',
    createdAt: '2024-01-12T16:10:00Z',
    upvotes: 45,
    replies: 19,
    views: 789,
  },
];

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');

  const isOwnProfile = user?.id === userId;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-BE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug
        </Button>
        <h1 className="font-heading text-2xl font-bold">Gebruikersprofiel</h1>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={mockUserProfile.avatar || undefined} />
                <AvatarFallback className={`${getRoleColor(mockUserProfile.role)} text-white text-lg`}>
                  {getUserInitials(mockUserProfile.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 mb-2">
                {mockUserProfile.isOnline && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
                <span className="text-sm text-muted-foreground">
                  {mockUserProfile.isOnline ? 'Online nu' : getTimeAgo(mockUserProfile.lastSeen)}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-heading text-2xl font-bold">{mockUserProfile.username}</h2>
                    {mockUserProfile.role === 'expert' && (
                      <Badge variant="default" className="gap-1">
                        <Award className="h-3 w-3" />
                        EXPERT
                      </Badge>
                    )}
                    {mockUserProfile.role === 'moderator' && (
                      <Badge variant="secondary" className="gap-1">
                        <Shield className="h-3 w-3" />
                        MOD
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Lid sinds {formatDate(mockUserProfile.joinedAt)}</span>
                    </div>
                    {mockUserProfile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{mockUserProfile.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {isOwnProfile ? (
                  <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Bewerk Profiel
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Stuur Bericht
                  </Button>
                )}
              </div>

              {mockUserProfile.bio && (
                <p className="text-muted-foreground mb-4">{mockUserProfile.bio}</p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {mockUserProfile.badges.map(badge => (
                  <Badge key={badge} variant="outline" className="gap-1">
                    <Award className="h-3 w-3" />
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{mockUserProfile.reputation}</div>
                  <div className="text-sm text-muted-foreground">Reputatie</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{mockUserProfile.stats.posts}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{mockUserProfile.stats.topics}</div>
                  <div className="text-sm text-muted-foreground">Topics</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{mockUserProfile.stats.helped}</div>
                  <div className="text-sm text-muted-foreground">Geholpen</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Recente Posts</TabsTrigger>
          <TabsTrigger value="topics">Topics Gestart</TabsTrigger>
          <TabsTrigger value="activity">Activiteit</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {mockUserPosts.map(post => (
            <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-sm text-muted-foreground space-y-1 ml-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{post.replies}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                    <div className="text-primary font-medium">+{post.upvotes}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Geen topics gevonden</h3>
              <p className="text-muted-foreground">
                Deze gebruiker heeft nog geen topics gestart.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recente Activiteit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">2 uur geleden</span>
                <span>Reageerde op "CBD dosering tips"</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-muted-foreground">1 dag geleden</span>
                <span>Startte topic "Nieuwe onderzoeksresultaten"</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-muted-foreground">3 dagen geleden</span>
                <span>Behaalde badge "Community Helper"</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}