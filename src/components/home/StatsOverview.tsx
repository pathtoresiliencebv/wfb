import { MessageSquare, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export function StatsOverview() {
  const { data: stats = [], isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center p-6">
              <Skeleton className="h-8 w-8 mr-4" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
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
  );
}