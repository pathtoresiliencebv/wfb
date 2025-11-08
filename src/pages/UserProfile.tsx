import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Award, MessageSquare, Eye, Clock, Edit, MessageCircle, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { BadgedText } from '@/lib/badgeParser';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const { profile, stats, posts, topics, activity, loading, error, fetchUserData } = useUserProfile();

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug
          </Button>
          <h1 className="font-heading text-2xl font-bold">Gebruikersprofiel</h1>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug
          </Button>
          <h1 className="font-heading text-2xl font-bold">Gebruikersprofiel</h1>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {error || 'Gebruiker niet gevonden'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6">
            <div className="flex flex-col items-center text-center w-full sm:w-auto">
              <Avatar className="h-20 sm:h-24 w-20 sm:w-24 mb-3 sm:mb-4">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className={`${getRoleColor(profile.role)} text-white text-base sm:text-lg`}>
                  {getUserInitials(profile.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 mb-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Lid sinds {formatDate(profile.created_at)}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-heading text-2xl font-bold">
                      {profile.display_name || profile.username}
                    </h2>
                    {profile.role === 'expert' && (
                      <Badge variant="default" className="gap-1">
                        <Award className="h-3 w-3" />
                        EXPERT
                      </Badge>
                    )}
                    {profile.role === 'moderator' && (
                      <Badge variant="secondary" className="gap-1">
                        <Shield className="h-3 w-3" />
                        MOD
                      </Badge>
                    )}
                    {profile.is_verified && (
                      <Badge variant="outline" className="gap-1">
                        <Award className="h-3 w-3" />
                        VERIFIED
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>@{profile.username}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Lid sinds {formatDate(profile.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                {isOwnProfile ? (
                  <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Bewerk Profiel
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => navigate('/messages')}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Stuur Bericht
                  </Button>
                )}
              </div>

              {profile.bio && (
                <p className="text-muted-foreground mb-4">
                  <BadgedText text={profile.bio} />
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{profile.reputation}</div>
                  <div className="text-sm text-muted-foreground">Reputatie</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">
                    {stats ? stats.topics_count + stats.replies_count : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{stats?.topics_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Topics</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-primary">{stats?.achievements_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Prestaties</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="posts" className="text-xs sm:text-sm py-2 sm:py-2.5">Recente Posts</TabsTrigger>
          <TabsTrigger value="topics" className="text-xs sm:text-sm py-2 sm:py-2.5">Topics Gestart</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm py-2 sm:py-2.5">Activiteit</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {posts.length > 0 ? posts.map(post => (
            <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {post.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {post.category && (
                        <Badge variant="outline" className="text-xs">
                          {post.category.name}
                        </Badge>
                      )}
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-sm text-muted-foreground space-y-1 ml-4">
                    <div className="flex items-center gap-4">
                      {post.reply_count !== undefined && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{post.reply_count}</span>
                        </div>
                      )}
                      {post.view_count !== undefined && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.view_count}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-primary font-medium">+{post.upvotes}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Geen posts gevonden</h3>
                <p className="text-muted-foreground">
                  Deze gebruiker heeft nog geen posts gemaakt.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          {topics.length > 0 ? topics.map(topic => (
            <Card key={topic.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium hover:text-primary transition-colors mb-2">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {topic.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {topic.category && (
                        <Badge variant="outline" className="text-xs">
                          {topic.category.name}
                        </Badge>
                      )}
                      <span>{formatDate(topic.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-sm text-muted-foreground space-y-1 ml-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{topic.reply_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{topic.view_count || 0}</span>
                      </div>
                    </div>
                    <div className="text-primary font-medium">+{topic.upvotes}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Geen topics gevonden</h3>
                <p className="text-muted-foreground">
                  Deze gebruiker heeft nog geen topics gestart.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recente Activiteit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activity.length > 0 ? activity.map(item => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    item.activity_type === 'topic_created' ? 'bg-blue-500' :
                    item.activity_type === 'reply_created' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`}></div>
                  <span className="text-muted-foreground">
                    {getTimeAgo(item.created_at)}
                  </span>
                  <span>
                    {item.activity_type === 'topic_created' && 'Startte een nieuw topic'}
                    {item.activity_type === 'reply_created' && 'Reageerde op een topic'}
                    {item.activity_type === 'achievement_earned' && 'Behaalde een prestatie'}
                  </span>
                </div>
              )) : (
                <p className="text-muted-foreground text-center py-4">
                  Nog geen activiteit zichtbaar
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}