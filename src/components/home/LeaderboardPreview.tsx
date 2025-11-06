import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { Skeleton } from '@/components/ui/skeleton';

export function LeaderboardPreview() {
  const { leaderboard, isLoading } = useGamification();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const topFive = leaderboard?.slice(0, 5) || [];

  if (topFive.length === 0) {
    return null;
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-orange-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <CardTitle>Top Leden</CardTitle>
          </div>
          <Link to="/leaderboard" className="text-sm text-primary hover:underline">
            Volledig
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {topFive.map((user, index) => (
          <div key={user.user_id} className="flex items-center gap-3">
            <span className={`text-lg font-bold w-6 ${getRankColor(index + 1)}`}>
              #{index + 1}
            </span>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profile?.avatar_url} />
              <AvatarFallback>
                {(user.profile?.display_name || user.profile?.username || 'U').charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {user.profile?.display_name || user.profile?.username}
              </p>
              <p className="text-xs text-muted-foreground">
                Level {user.current_level}
              </p>
            </div>
            
            <Badge variant="secondary">
              {user.total_xp} XP
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
