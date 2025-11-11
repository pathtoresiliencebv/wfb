import { Plus, MessageSquare, Lightbulb, FileText, Trophy, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useTimeBasedGreeting } from '@/hooks/useTimeBasedGreeting';
import { useUserStats } from '@/hooks/useUserStats';
import { getDailyTip } from '@/lib/cannabisTips';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { Link } from 'react-router-dom';

export function WelcomeSection() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const greeting = useTimeBasedGreeting();
  const { data: stats, isLoading } = useUserStats(user?.id);
  const dailyTip = getDailyTip();

  const displayName = user?.email?.split('@')[0] || 'Gebruiker';

  const userStats = [
    {
      icon: FileText,
      value: stats?.topicCount || 0,
      label: 'Jouw Posts',
      color: 'text-blue-500'
    },
    {
      icon: Trophy,
      value: stats?.reputation || 0,
      label: 'Reputatie',
      color: 'text-primary'
    },
    {
      icon: TrendingUp,
      value: stats?.rank || 0,
      label: `Rank (van ${stats?.totalMembers || 0})`,
      color: 'text-purple-500'
    }
  ];

  return (
    <Card className="gradient-hero border-primary/20">
      <CardHeader className={isMobile ? "pb-3" : ""}>
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className={`heading-section mb-1 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {greeting}, {displayName}! 👋
            </h2>
            {!isMobile && (
              <p className="text-muted-foreground">Fijn je weer te zien in de community!</p>
            )}
          </div>
          <div>
            <Avatar className={`border-4 border-primary/30 shadow-lg ${isMobile ? 'h-12 w-12' : 'h-16 w-16'}`}>
              <AvatarImage src="" />
              <AvatarFallback className={`bg-primary/10 text-primary font-semibold ${isMobile ? 'text-base' : 'text-xl'}`}>
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={isMobile ? "space-y-3 pt-3" : "space-y-4"}>
        {/* Daily Tip Section */}
        {!isMobile && (
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10">
            <h3 className="flex items-center gap-2 mb-2 font-semibold text-primary">
              <Lightbulb className="w-5 h-5" />
              💡 Cannabis Tip van de Dag
            </h3>
            <p className="text-sm text-foreground/80">{dailyTip}</p>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className={`grid gap-2 ${isMobile ? 'grid-cols-3' : 'grid-cols-3 gap-3'}`}>
          {userStats.map((stat, index) => (
            <div 
              key={stat.label}
              className={`text-center rounded-lg bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 ${isMobile ? 'p-2' : 'p-4'}`}
            >
              <stat.icon className={`mx-auto mb-1 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'} ${stat.color}`} />
              <div className={`font-bold text-foreground ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                {isLoading ? (
                  <span className="inline-block w-8 h-4 bg-muted rounded" />
                ) : (
                  <AnimatedCounter end={stat.value} />
                )}
              </div>
              <p className={`text-muted-foreground mt-0.5 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className={`flex gap-2 ${isMobile ? 'pt-1' : 'gap-3 pt-2'}`}>
          <Button className={`flex-1 gap-2 shadow-md hover:shadow-lg transition-all ${isMobile ? 'text-sm h-9' : ''}`} asChild>
            <Link to="/create-topic">
              <Plus className="w-4 h-4" />
              {isMobile ? 'Nieuw' : 'Nieuw Topic'}
            </Link>
          </Button>
          <Button variant="outline" className={`flex-1 gap-2 hover:bg-primary/10 ${isMobile ? 'text-sm h-9' : ''}`} asChild>
            <Link to="/forums">
              <MessageSquare className="w-4 h-4" />
              {isMobile ? 'Forums' : 'Verken Forums'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
