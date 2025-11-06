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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="text-center border-2 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-card to-card/50"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {isLoading ? '...' : stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
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
