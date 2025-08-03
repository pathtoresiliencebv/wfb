import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, MessageSquare, Shield, TrendingUp, AlertTriangle, Settings, 
  Activity, Clock, Eye, ThumbsUp, Flag, UserCheck 
} from 'lucide-react';
import { useRealTimeStats } from '@/hooks/useRealTimeStats';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export default function AdminDashboard() {
  const { stats, isLoading } = useRealTimeStats();

  // Fetch recent activity
  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_feed')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch pending reports
  const { data: pendingReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-pending-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const dashboardStats = [
    {
      title: 'Totaal Gebruikers',
      value: isLoading ? '...' : stats.userCount.toLocaleString(),
      description: 'Geregistreerde leden',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      title: 'Forum Topics',
      value: isLoading ? '...' : stats.topicCount.toLocaleString(),
      description: 'Actieve discussies',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      title: 'Moderatie Queue',
      value: reportsLoading ? '...' : pendingReports?.length.toString() || '0',
      description: 'Wacht op review',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950'
    },
    {
      title: 'Expert Adviseurs',
      value: isLoading ? '...' : stats.expertCount.toString(),
      description: 'Actieve experts',
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950'
    }
  ];

  const quickActions = [
    { title: 'Gebruikers Beheren', href: '/admin/users', icon: Users },
    { title: 'Content Modereren', href: '/admin/moderation', icon: Shield },
    { title: 'Categorieën', href: '/admin/categories', icon: MessageSquare },
    { title: 'Beveiliging', href: '/admin/security', icon: AlertTriangle }
  ];

  const getActivityTypeDisplay = (type: string) => {
    const types: Record<string, { label: string; icon: any; color: string }> = {
      'topic_created': { label: 'Topic aangemaakt', icon: MessageSquare, color: 'text-blue-600' },
      'reply_created': { label: 'Reactie geplaatst', icon: MessageSquare, color: 'text-green-600' },
      'user_registered': { label: 'Nieuwe registratie', icon: Users, color: 'text-purple-600' },
      'achievement_earned': { label: 'Prestatie behaald', icon: TrendingUp, color: 'text-yellow-600' }
    };
    return types[type] || { label: type, icon: Activity, color: 'text-gray-600' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welkom terug, beheer je community effectief</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Instellingen
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Snelle Acties</CardTitle>
            <CardDescription>Veelgebruikte beheerfuncties</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start h-12"
                asChild
              >
                <a href={action.href}>
                  <action.icon className="h-4 w-4 mr-3" />
                  {action.title}
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recente Activiteit
            </CardTitle>
            <CardDescription>Laatste community acties</CardDescription>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const typeDisplay = getActivityTypeDisplay(activity.activity_type);
                  const IconComponent = typeDisplay.icon;
                  
                  return (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-full bg-muted`}>
                        <IconComponent className={`h-3 w-3 ${typeDisplay.color}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">
                            Gebruiker
                          </span>
                          <span className="text-muted-foreground ml-1">
                            {typeDisplay.label}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Geen recente activiteit</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Reports & System Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Openstaande Meldingen
            </CardTitle>
            <CardDescription>Content die moderatie vereist</CardDescription>
          </CardHeader>
          <CardContent>
            {reportsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : pendingReports && pendingReports.length > 0 ? (
              <div className="space-y-3">
                {pendingReports.slice(0, 5).map((report) => (
                  <div key={report.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="mb-1">
                          {report.reason}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {report.description || 'Geen beschrijving'}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {report.reported_item_type}
                      </Badge>
                    </div>
                  </div>
                ))}
                {pendingReports.length > 5 && (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="/admin/moderation">
                      Bekijk alle {pendingReports.length} meldingen
                    </a>
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Geen openstaande meldingen</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Systeem Status
            </CardTitle>
            <CardDescription>Platform gezondheid en metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Server Status</span>
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database Status</span>
                <Badge variant="default" className="bg-green-500">Gezond</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Actieve Sessies</span>
                <span className="text-sm font-medium">{isLoading ? '...' : '247'}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="/admin/analytics">
                  Uitgebreide Analytics
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}