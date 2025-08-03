import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  Activity,
  Clock,
  Star,
  Shield,
  Calendar,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface AnalyticsData {
  userStats: {
    total: number;
    active: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  contentStats: {
    totalTopics: number;
    totalReplies: number;
    topicsThisWeek: number;
    repliesThisWeek: number;
  };
  activityStats: {
    totalViews: number;
    averageSessionTime: number;
    bounceRate: number;
    dailyActiveUsers: number;
  };
  topCategories: Array<{
    name: string;
    topic_count: number;
    reply_count: number;
  }>;
  recentActivity: Array<{
    user: string;
    action: string;
    time: string;
    details: string;
  }>;
  chartData: {
    dailyPosts: Array<{ date: string; topics: number; replies: number }>;
    userGrowth: Array<{ date: string; users: number }>;
    categoryDistribution: Array<{ name: string; value: number; color: string }>;
  };
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AdminAnalyticsPage() {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Calculate date ranges
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      // Fetch all analytics data in parallel
      const [
        totalUsers,
        activeUsers,
        newUsersWeek,
        newUsersMonth,
        totalTopics,
        totalReplies,
        topicsThisWeek,
        repliesThisWeek,
        topCategories,
        recentActivity
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('user_online_status').select('user_id', { count: 'exact' }).eq('is_online', true),
        supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', weekAgo.toISOString()),
        supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', monthAgo.toISOString()),
        supabase.from('topics').select('id', { count: 'exact' }),
        supabase.from('replies').select('id', { count: 'exact' }),
        supabase.from('topics').select('id', { count: 'exact' }).gte('created_at', weekAgo.toISOString()),
        supabase.from('replies').select('id', { count: 'exact' }).gte('created_at', weekAgo.toISOString()),
        supabase.from('categories').select('name, topic_count, reply_count').order('topic_count', { ascending: false }).limit(5),
        supabase
          .from('activity_feed')
          .select(`
            activity_type,
            activity_data,
            created_at,
            profiles!activity_feed_user_id_fkey(username)
          `)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      // Process chart data
      const dailyPostsData = [];
      const userGrowthData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        
        dailyPostsData.push({
          date: dateStr,
          topics: Math.floor(Math.random() * 20) + 5, // Mock data
          replies: Math.floor(Math.random() * 50) + 10
        });
        
        userGrowthData.push({
          date: dateStr,
          users: Math.floor(Math.random() * 10) + 2
        });
      }

      const categoryColors = topCategories.data?.map((_, index) => COLORS[index % COLORS.length]) || [];
      
      setAnalytics({
        userStats: {
          total: totalUsers.count || 0,
          active: activeUsers.count || 0,
          newThisWeek: newUsersWeek.count || 0,
          newThisMonth: newUsersMonth.count || 0,
        },
        contentStats: {
          totalTopics: totalTopics.count || 0,
          totalReplies: totalReplies.count || 0,
          topicsThisWeek: topicsThisWeek.count || 0,
          repliesThisWeek: repliesThisWeek.count || 0,
        },
        activityStats: {
          totalViews: 15420, // Mock data
          averageSessionTime: 8.5,
          bounceRate: 32.1,
          dailyActiveUsers: activeUsers.count || 0,
        },
        topCategories: topCategories.data || [],
        recentActivity: recentActivity.data?.map(item => ({
          user: 'Gebruiker',
          action: item.activity_type,
          time: item.created_at,
          details: JSON.stringify(item.activity_data)
        })) || [],
        chartData: {
          dailyPosts: dailyPostsData,
          userGrowth: userGrowthData,
          categoryDistribution: topCategories.data?.map((cat, index) => ({
            name: cat.name,
            value: cat.topic_count,
            color: categoryColors[index]
          })) || []
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Fout bij laden analytics",
        description: "Er is een fout opgetreden bij het laden van de analytics gegevens.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'topic_created': return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'reply_created': return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'user_login': return <Users className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics & Statistieken</h2>
          <p className="text-muted-foreground">
            Bekijk gedetailleerde statistieken over gebruikersactiviteit en forum prestaties.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics & Statistieken</h2>
          <p className="text-muted-foreground">
            Bekijk gedetailleerde statistieken over gebruikersactiviteit en forum prestaties.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Laatste 7 dagen</SelectItem>
              <SelectItem value="30d">Laatste 30 dagen</SelectItem>
              <SelectItem value="90d">Laatste 90 dagen</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Vernieuwen
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Totaal Gebruikers</p>
                <p className="text-2xl font-bold">{analytics.userStats.total.toLocaleString()}</p>
                <Badge variant="outline" className="mt-1">
                  +{analytics.userStats.newThisWeek} deze week
                </Badge>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actieve Gebruikers</p>
                <p className="text-2xl font-bold">{analytics.userStats.active}</p>
                <Badge variant="outline" className="mt-1 text-green-600 border-green-200">
                  Nu online
                </Badge>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Totaal Topics</p>
                <p className="text-2xl font-bold">{analytics.contentStats.totalTopics.toLocaleString()}</p>
                <Badge variant="outline" className="mt-1">
                  +{analytics.contentStats.topicsThisWeek} deze week
                </Badge>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Totaal Reacties</p>
                <p className="text-2xl font-bold">{analytics.contentStats.totalReplies.toLocaleString()}</p>
                <Badge variant="outline" className="mt-1">
                  +{analytics.contentStats.repliesThisWeek} deze week
                </Badge>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dagelijkse Posts</CardTitle>
            <CardDescription>Topics en reacties per dag</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.chartData.dailyPosts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="topics" fill="#10b981" name="Topics" />
                <Bar dataKey="replies" fill="#3b82f6" name="Reacties" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorie Verdeling</CardTitle>
            <CardDescription>Topics per categorie</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.chartData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.chartData.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recente Activiteit</CardTitle>
            <CardDescription>Laatste forum activiteiten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.slice(0, 8).map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  {getActivityIcon(activity.action)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.user}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action.replace('_', ' ')} • {formatDistanceToNow(new Date(activity.time), { addSuffix: true, locale: nl })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Categorieën</CardTitle>
            <CardDescription>Meest actieve forum categorieën</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.topic_count} topics • {category.reply_count} reacties
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {category.topic_count + category.reply_count} total
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Belangrijke forum performance indicatoren</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{analytics.activityStats.totalViews.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Totaal Weergaven</p>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{analytics.activityStats.averageSessionTime}m</p>
              <p className="text-sm text-muted-foreground">Gem. Sessietijd</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{analytics.activityStats.bounceRate}%</p>
              <p className="text-sm text-muted-foreground">Bounce Rate</p>
            </div>
            <div className="text-center">
              <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{analytics.activityStats.dailyActiveUsers}</p>
              <p className="text-sm text-muted-foreground">Dagelijks Actief</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}