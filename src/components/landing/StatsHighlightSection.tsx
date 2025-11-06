import { useRealTimeStats } from '@/hooks/useRealTimeStats';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageSquare, TrendingUp, Award } from 'lucide-react';

export function StatsHighlightSection() {
  const { stats, isLoading } = useRealTimeStats();

  const displayStats = [
    {
      icon: Users,
      label: 'Actieve Leden',
      value: stats?.userCount || 0,
      suffix: '+',
      color: 'text-blue-500'
    },
    {
      icon: MessageSquare,
      label: 'Forum Topics',
      value: stats?.topicCount || 0,
      suffix: '+',
      color: 'text-green-500'
    },
    {
      icon: TrendingUp,
      label: 'Dagelijkse Activiteit',
      value: Math.round((stats?.topicCount || 0) / 30),
      suffix: '+',
      color: 'text-purple-500'
    },
    {
      icon: Award,
      label: 'Expert Leden',
      value: stats?.expertCount || 0,
      suffix: '',
      color: 'text-orange-500'
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6 space-y-2">
                  <div className="flex justify-center">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold">
                    {isLoading ? '...' : stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
