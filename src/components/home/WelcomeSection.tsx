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
import { motion } from 'framer-motion';

export function WelcomeSection() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const greeting = useTimeBasedGreeting();
  const { data: stats, isLoading } = useUserStats(user?.id);
  const dailyTip = getDailyTip();
  
  // Don't show welcome section on mobile
  if (isMobile) {
    return null;
  }

  const displayName = (user?.user_metadata as any)?.username || user?.email?.split('@')[0] || 'Gebruiker';

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
      <CardHeader>
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="heading-section text-2xl mb-1">
              {greeting}, {displayName}! 👋
            </h2>
            <p className="text-muted-foreground">Fijn je weer te zien in de community!</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Avatar className="h-16 w-16 border-4 border-primary/30 shadow-lg">
              <AvatarImage src={(user?.user_metadata as any)?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Daily Tip Section */}
        <motion.div 
          className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="flex items-center gap-2 mb-2 font-semibold text-primary">
            <Lightbulb className="w-5 h-5" />
            💡 Cannabis Tip van de Dag
          </h3>
          <p className="text-sm text-foreground/80">{dailyTip}</p>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div 
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {userStats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <stat.icon className={`mx-auto mb-2 w-6 h-6 ${stat.color}`} />
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? (
                  <span className="inline-block w-12 h-6 bg-muted animate-pulse rounded" />
                ) : (
                  <AnimatedCounter end={stat.value} />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="flex gap-3 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button className="flex-1 gap-2 shadow-md hover:shadow-lg transition-all" asChild>
            <Link to="/create-topic">
              <Plus className="w-4 h-4" />
              Nieuw Topic
            </Link>
          </Button>
          <Button variant="outline" className="flex-1 gap-2 hover:bg-primary/10" asChild>
            <Link to="/forums">
              <MessageSquare className="w-4 h-4" />
              Verken Forums
            </Link>
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
