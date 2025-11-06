import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageSquare, Trophy, TrendingUp } from 'lucide-react';
import { useRealTimeStats } from '@/hooks/useRealTimeStats';
import { Skeleton } from '@/components/ui/skeleton';

export function CommunityHighlights() {
  const { stats, isLoading } = useRealTimeStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const highlights = [
    {
      icon: Users,
      label: 'Actieve Leden',
      value: stats?.userCount || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: MessageSquare,
      label: 'Forum Posts',
      value: stats?.topicCount || 0,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Trophy,
      label: 'Behaalde Badges',
      value: '250+',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Dagelijkse Posts',
      value: '50+',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Community in Cijfers</h2>
        <p className="text-muted-foreground">
          Een levendige en groeiende community
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {highlights.map((highlight, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className={`inline-flex p-3 rounded-full ${highlight.bgColor} mb-3`}>
                <highlight.icon className={`h-6 w-6 ${highlight.color}`} />
              </div>
              <h3 className="text-3xl font-bold mb-1">
                {typeof highlight.value === 'number' 
                  ? highlight.value.toLocaleString('nl-BE')
                  : highlight.value
                }
              </h3>
              <p className="text-sm text-muted-foreground">{highlight.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
