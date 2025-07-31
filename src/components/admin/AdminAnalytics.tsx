import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Users, MessageSquare, FileText, TrendingUp, Activity, Calendar, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { nl } from 'date-fns/locale';

interface PlatformStats {
  totalUsers: number;
  totalTopics: number;
  totalReplies: number;
  totalVotes: number;
  newUsersToday: number;
  newTopicsToday: number;
  newRepliesToday: number;
  activeUsersToday: number;
}

interface ChartData {
  date: string;
  users: number;
  topics: number;
  replies: number;
}

export function AdminAnalytics() {
  // Fetch platform statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-analytics-stats'],
    queryFn: async (): Promise<PlatformStats> => {
      const today = new Date();
      const startToday = startOfDay(today);
      const endToday = endOfDay(today);

      const [
        totalUsersQuery,
        totalTopicsQuery,
        totalRepliesQuery,
        totalVotesQuery,
        newUsersTodayQuery,
        newTopicsTodayQuery,
        newRepliesTodayQuery,
        activeUsersTodayQuery
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('topics').select('*', { count: 'exact', head: true }),
        supabase.from('replies').select('*', { count: 'exact', head: true }),
        supabase.from('votes').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
          .gte('created_at', startToday.toISOString())
          .lte('created_at', endToday.toISOString()),
        supabase.from('topics').select('*', { count: 'exact', head: true })
          .gte('created_at', startToday.toISOString())
          .lte('created_at', endToday.toISOString()),
        supabase.from('replies').select('*', { count: 'exact', head: true })
          .gte('created_at', startToday.toISOString())
          .lte('created_at', endToday.toISOString()),
        supabase.from('user_online_status').select('*', { count: 'exact', head: true })
          .eq('is_online', true)
      ]);

      return {
        totalUsers: totalUsersQuery.count || 0,
        totalTopics: totalTopicsQuery.count || 0,
        totalReplies: totalRepliesQuery.count || 0,
        totalVotes: totalVotesQuery.count || 0,
        newUsersToday: newUsersTodayQuery.count || 0,
        newTopicsToday: newTopicsTodayQuery.count || 0,
        newRepliesToday: newRepliesTodayQuery.count || 0,
        activeUsersToday: activeUsersTodayQuery.count || 0,
      };
    },
  });

  // Fetch 7-day trend data
  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ['admin-analytics-trends'],
    queryFn: async (): Promise<ChartData[]> => {
      const data: ChartData[] = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const startDay = startOfDay(date);
        const endDay = endOfDay(date);
        
        const [usersQuery, topicsQuery, repliesQuery] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true })
            .gte('created_at', startDay.toISOString())
            .lte('created_at', endDay.toISOString()),
          supabase.from('topics').select('*', { count: 'exact', head: true })
            .gte('created_at', startDay.toISOString())
            .lte('created_at', endDay.toISOString()),
          supabase.from('replies').select('*', { count: 'exact', head: true })
            .gte('created_at', startDay.toISOString())
            .lte('created_at', endDay.toISOString()),
        ]);

        data.push({
          date: format(date, 'dd MMM', { locale: nl }),
          users: usersQuery.count || 0,
          topics: topicsQuery.count || 0,
          replies: repliesQuery.count || 0,
        });
      }
      
      return data;
    },
  });

  // Fetch top categories
  const { data: topCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-analytics-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select(`
          category_id,
          categories!topics_category_id_fkey (
            name,
            color
          )
        `);

      if (error) throw error;

      // Count topics per category
      const categoryCount = (data || []).reduce((acc, topic) => {
        const categoryName = topic.categories?.name || 'Onbekend';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(categoryCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    },
  });

  if (statsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-muted rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
          <CardDescription>
            Overzicht van platform statistieken en trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overzicht</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="engagement">Betrokkenheid</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Totaal Gebruikers</span>
                    </div>
                    <p className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      +{stats?.newUsersToday} vandaag
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Totaal Topics</span>
                    </div>
                    <p className="text-2xl font-bold">{stats?.totalTopics.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      +{stats?.newTopicsToday} vandaag
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Totaal Reacties</span>
                    </div>
                    <p className="text-2xl font-bold">{stats?.totalReplies.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      +{stats?.newRepliesToday} vandaag
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Online Nu</span>
                    </div>
                    <p className="text-2xl font-bold">{stats?.activeUsersToday.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      actieve gebruikers
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Populairste Categorieën</CardTitle>
                  <CardDescription>
                    Categorieën met de meeste topics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {categoriesLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-8 bg-muted rounded" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topCategories?.map((category, index) => (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(category.count / (topCategories[0]?.count || 1)) * 100} 
                              className="w-24" 
                            />
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {category.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>7-Dagen Trend</CardTitle>
                  <CardDescription>
                    Activiteit van de afgelopen week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {trendLoading ? (
                    <div className="animate-pulse">
                      <div className="h-64 bg-muted rounded" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {trendData?.map((day) => (
                        <div key={day.date} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{day.date}</span>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3 text-primary" />
                              <span>{day.users} gebruikers</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3 text-green-500" />
                              <span>{day.topics} topics</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-3 w-3 text-blue-500" />
                              <span>{day.replies} reacties</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Betrokkenheidsmetrics</CardTitle>
                  <CardDescription>
                    Hoe actief zijn gebruikers op het platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Gemiddelde reacties per topic</span>
                        <span className="text-lg font-bold">
                          {stats && stats.totalTopics > 0 
                            ? (stats.totalReplies / stats.totalTopics).toFixed(1)
                            : '0'
                          }
                        </span>
                      </div>
                      <Progress 
                        value={stats && stats.totalTopics > 0 
                          ? Math.min((stats.totalReplies / stats.totalTopics) * 10, 100)
                          : 0
                        } 
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Totaal stemmen</span>
                        <span className="text-lg font-bold">{stats?.totalVotes.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={stats && stats.totalUsers > 0 
                          ? Math.min((stats.totalVotes / stats.totalUsers) * 5, 100)
                          : 0
                        } 
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">Platform Gezondheid</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-500">
                          {stats && stats.totalUsers > 0 && stats.activeUsersToday > 0
                            ? Math.round((stats.activeUsersToday / stats.totalUsers) * 100)
                            : 0
                          }%
                        </div>
                        <div className="text-sm text-muted-foreground">Dagelijks actief</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-500">
                          {stats && stats.totalUsers > 0 && stats.newUsersToday > 0
                            ? Math.round((stats.newUsersToday / stats.totalUsers) * 100)
                            : 0
                          }%
                        </div>
                        <div className="text-sm text-muted-foreground">Groei vandaag</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-500">
                          {stats && stats.totalTopics > 0 && stats.totalReplies > 0
                            ? Math.round((stats.totalReplies / (stats.totalTopics + stats.totalReplies)) * 100)
                            : 0
                          }%
                        </div>
                        <div className="text-sm text-muted-foreground">Reactie ratio</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}