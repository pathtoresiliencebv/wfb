
import React, { useEffect, useState } from 'react';
import { Plus, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PostCard } from './PostCard';
import { RecentActivity } from './RecentActivity';
import { OnlineMembers } from './OnlineMembers';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const mockPosts = [
  {
    id: '1',
    title: 'Nieuwe wetgeving rond CBD in België',
    content: 'Er zijn belangrijke updates over de CBD wetgeving die iedereen moet weten...',
    author: {
      username: 'WetgevingExpert',
      avatar: null,
      isVerified: true,
    },
    category: 'Wetgeving & Nieuws',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    votes: 23,
    replyCount: 8,
    isSticky: true,
  },
  {
    id: '2',
    title: 'CBD olie dosering voor beginners',
    content: 'Voor mensen die net beginnen met CBD olie, hier zijn wat tips...',
    author: {
      username: 'MediUser123',
      avatar: null,
      isVerified: false,
    },
    category: 'Medicinaal Gebruik',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    votes: 15,
    replyCount: 12,
    isSticky: false,
  },
  {
    id: '3',
    title: 'Indoor setup voor beginners',
    content: 'Wat heb je allemaal nodig voor een succesvolle indoor grow?',
    author: {
      username: 'GreenThumb',
      avatar: null,
      isVerified: false,
    },
    category: 'Teelt & Horticultuur',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    votes: 31,
    replyCount: 24,
    isSticky: false,
  },
];

const stats = [
  {
    title: 'Actieve Topics',
    value: '1,234',
    description: 'Deze week',
    icon: MessageSquare,
  },
  {
    title: 'Online Leden',
    value: '89',
    description: 'Nu online',
    icon: Users,
  },
  {
    title: 'Trending',
    value: '#CBD',
    description: 'Populairste tag',
    icon: TrendingUp,
  },
];

export function FeedPage() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [recentTopics, setRecentTopics] = useState(mockPosts);
  const [stats, setStats] = useState([
    {
      title: 'Actieve Topics',
      value: '...',
      description: 'Deze week',
      icon: MessageSquare,
    },
    {
      title: 'Online Leden',
      value: '...',
      description: 'Nu online',
      icon: Users,
    },
    {
      title: 'Trending',
      value: '#CBD',
      description: 'Populairste tag',
      icon: TrendingUp,
    },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent topics with author info and categories
        const { data: topics, error: topicsError } = await supabase
          .from('topics')
          .select(`
            *,
            profiles!topics_author_id_fkey(username, avatar_url, is_verified),
            categories(name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (topicsError) throw topicsError;

        // Transform data to match PostCard interface
        if (topics) {
          const transformedTopics = topics.map(topic => ({
            id: topic.id,
            title: topic.title,
            content: topic.content,
            author: {
              username: topic.profiles?.username || 'Anonymous',
              avatar: topic.profiles?.avatar_url || null,
              isVerified: topic.profiles?.is_verified || false,
            },
            category: topic.categories?.name || 'General',
            createdAt: new Date(topic.created_at),
            votes: 0, // Will be calculated from votes table
            replyCount: topic.reply_count || 0,
            isSticky: topic.is_pinned || false,
          }));
          setRecentTopics(transformedTopics);
        }

        // Fetch stats correctly using count
        const { count: topicCount } = await supabase
          .from('topics')
          .select('*', { count: 'exact', head: true });

        const { count: profileCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get online users count (users active in last 30 minutes)
        const { count: onlineCount } = await supabase
          .from('user_online_status')
          .select('*', { count: 'exact', head: true })
          .eq('is_online', true)
          .gte('last_seen', new Date(Date.now() - 30 * 60 * 1000).toISOString());

        setStats([
          {
            title: 'Actieve Topics',
            value: topicCount?.toString() || '0',
            description: 'Totaal',
            icon: MessageSquare,
          },
          {
            title: 'Online Leden',
            value: onlineCount?.toString() || '0',
            description: 'Nu online',
            icon: Users,
          },
          {
            title: 'Leden',
            value: profileCount?.toString() || '0',
            description: 'Geregistreerd',
            icon: TrendingUp,
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    // Re-fetch dashboard data
    // fetchDashboardData();
  };

  if (!user) {
    return null; // This should not happen as LandingPage handles non-authenticated users
  }

  const mainContent = (
    <div className="lg:col-span-3 space-y-6">
      {/* Welcome Card - only show on desktop */}
      {!isMobile && (
        <Card className="cannabis-gradient text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Welkom bij Wietforum België! 🌿
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              De community voor cannabis liefhebbers in België. Deel kennis, ervaringen en 
              houd je op de hoogte van de laatste ontwikkelingen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="gap-2" asChild>
              <a href="/create-topic">
                <Plus className="h-4 w-4" />
                Nieuw Topic Starten
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center p-6">
              <stat.icon className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold">Recente Activiteit</h2>
          <Button variant="outline" size="sm" asChild>
            <a href="/forums">
              Alle Topics
            </a>
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentTopics.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content with Pull to Refresh on Mobile */}
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          {mainContent}
        </PullToRefresh>
      ) : (
        mainContent
      )}

      {/* Sidebar - Hidden on mobile */}
      <div className={`space-y-6 ${isMobile ? 'hidden' : ''}`}>
        <RecentActivity />
        <Separator />
        <OnlineMembers />
      </div>

      {/* Mobile FAB for creating topics */}
      {isMobile && (
        <FloatingActionButton onClick={() => setShowCreateDialog(true)} />
      )}

      {/* Mobile Create Topic Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nieuw Topic</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Button 
              onClick={() => {
                window.location.href = '/create-topic';
                setShowCreateDialog(false);
              }}
              className="w-full"
            >
              Ga naar Topic Creator
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
