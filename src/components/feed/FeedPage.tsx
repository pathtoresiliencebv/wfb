
import React, { useEffect, useState } from 'react';
import { Plus, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PostCard } from './PostCard';
import { RecentActivity } from './RecentActivity';
import { OnlineMembers } from './OnlineMembers';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { FeedTopSuppliers } from '@/components/supplier/FeedTopSuppliers';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FeedLoadingSkeleton } from '@/components/loading/OptimizedLoadingStates';
import { useQuery } from '@tanstack/react-query';

// Empty state message component
const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <Card className="p-8 text-center">
    <div className="space-y-2">
      <h3 className="font-semibold text-muted-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </Card>
);

export function FeedPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Fetch recent topics with React Query
  const { data: recentTopics = [], isLoading: topicsLoading } = useQuery({
    queryKey: ['recentTopics'],
    queryFn: async () => {
      const { data: topics, error } = await supabase
        .from('topics')
        .select(`
          *,
          profiles!topics_author_id_fkey(username, avatar_url, is_verified),
          categories(name, slug)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      return topics?.map(topic => ({
        id: topic.id,
        title: topic.title,
        content: topic.content || '',
        author: {
          username: topic.profiles?.username || 'Anonymous',
          avatar: topic.profiles?.avatar_url || null,
          isVerified: topic.profiles?.is_verified || false,
        },
        category: topic.categories?.name || 'General',
        categorySlug: topic.categories?.slug || '',
        createdAt: new Date(topic.created_at),
        votes: 0,
        replyCount: topic.reply_count || 0,
        isSticky: topic.is_pinned || false,
      })) || [];
    },
    staleTime: 60000, // 1 minute
  });

  // Fetch stats with React Query
  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const [topicCountResult, profileCountResult, onlineCountResult] = await Promise.all([
        supabase.from('topics').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('user_online_status')
          .select('*', { count: 'exact', head: true })
          .eq('is_online', true)
          .gte('last_seen', new Date(Date.now() - 30 * 60 * 1000).toISOString())
      ]);

      return [
        {
          title: 'Actieve Topics',
          value: topicCountResult.count?.toString() || '0',
          description: 'Totaal',
          icon: MessageSquare,
        },
        {
          title: 'Online Leden',
          value: onlineCountResult.count?.toString() || '0',
          description: 'Nu online',
          icon: Users,
        },
        {
          title: 'Leden',
          value: profileCountResult.count?.toString() || '0',
          description: 'Geregistreerd',
          icon: TrendingUp,
        },
      ];
    },
    staleTime: 300000, // 5 minutes
  });

  const isLoading = topicsLoading || statsLoading;

  const handleRefresh = async () => {
    // Re-fetch dashboard data
    // fetchDashboardData();
  };

  if (!user) {
    return null; // This should not happen as LandingPage handles non-authenticated users
  }

  if (isLoading) {
    return <FeedLoadingSkeleton />;
  }

  const mainContent = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      {/* Welcome Card - only show on desktop */}
      {!isMobile && (
        <Card className="cannabis-gradient text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Welkom bij Wiet Forum België! 🌿
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              De community voor cannabis liefhebbers in België. Deel kennis, ervaringen en 
              houd je op de hoogte van de laatste ontwikkelingen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="gap-2" onClick={() => navigate('/create-topic')}>
              <Plus className="h-4 w-4" />
              Nieuw Topic Starten
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Top Leveranciers - Desktop only */}
      {!isMobile && <FeedTopSuppliers />}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          <Button variant="outline" size="sm" onClick={() => navigate('/forums')}>
            Alle Topics
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentTopics.length > 0 ? (
            recentTopics.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <EmptyState
              title="Geen recente topics"
              description="Er zijn nog geen topics aangemaakt. Wees de eerste om een topic te starten!"
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={isMobile ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-4 gap-6"}>
      {/* Main Content with Pull to Refresh on Mobile */}
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="space-y-4 pt-2">
            {mainContent}
          </div>
        </PullToRefresh>
      ) : (
        <>
          <div className="lg:col-span-3">
            {mainContent}
          </div>
          {/* Sidebar - Hidden on mobile */}
          <div className="space-y-6">
            <RecentActivity />
            <Separator />
            <OnlineMembers />
          </div>
        </>
      )}

    </div>
  );
}
