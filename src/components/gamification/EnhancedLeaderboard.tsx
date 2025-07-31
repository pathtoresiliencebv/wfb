import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/hooks/useGamification';
import { useAuth } from '@/contexts/AuthContext';
import * as LucideIcons from 'lucide-react';

interface EnhancedLeaderboardProps {
  limit?: number;
  showUserPosition?: boolean;
}

export function EnhancedLeaderboard({ limit = 10, showUserPosition = true }: EnhancedLeaderboardProps) {
  const { leaderboard, userLevel, levelDefinitions, isLoading } = useGamification();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('xp');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedLeaderboard = leaderboard?.slice(0, limit) || [];
  const userPosition = leaderboard?.findIndex(entry => entry.user_id === user?.id) + 1 || 0;
  const userEntry = leaderboard?.find(entry => entry.user_id === user?.id);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <LucideIcons.Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <LucideIcons.Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <LucideIcons.Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const getLevelInfo = (levelNumber: number) => {
    return levelDefinitions?.find(ld => ld.level_number === levelNumber);
  };

  const getUserInitials = (username: string) => {
    return username?.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LucideIcons.Trophy className="w-5 h-5" />
          <span>Community Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="xp">Experience Points</TabsTrigger>
            <TabsTrigger value="level">Level Ranking</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-4">
            {/* Top 3 Podium */}
            {displayedLeaderboard.length >= 3 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-4 text-center">Top Contributors</h3>
                <div className="flex items-end justify-center space-x-4">
                  {/* 2nd Place */}
                  <div className="text-center">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-4 border-gray-300">
                        <AvatarImage src={displayedLeaderboard[1]?.profile?.avatar_url} />
                        <AvatarFallback>
                          {getUserInitials(displayedLeaderboard[1]?.profile?.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2">
                        {getRankIcon(2)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="font-semibold text-sm">
                        {displayedLeaderboard[1]?.profile?.display_name || displayedLeaderboard[1]?.profile?.username}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {displayedLeaderboard[1]?.total_xp.toLocaleString()} XP
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {displayedLeaderboard[1]?.level_title}
                      </div>
                    </div>
                  </div>

                  {/* 1st Place */}
                  <div className="text-center">
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-4 border-yellow-400">
                        <AvatarImage src={displayedLeaderboard[0]?.profile?.avatar_url} />
                        <AvatarFallback>
                          {getUserInitials(displayedLeaderboard[0]?.profile?.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-3 -right-3">
                        {getRankIcon(1)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="font-bold">
                        {displayedLeaderboard[0]?.profile?.display_name || displayedLeaderboard[0]?.profile?.username}
                      </div>
                      <div className="text-sm font-semibold text-yellow-600">
                        {displayedLeaderboard[0]?.total_xp.toLocaleString()} XP
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {displayedLeaderboard[0]?.level_title}
                      </div>
                    </div>
                  </div>

                  {/* 3rd Place */}
                  <div className="text-center">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-4 border-amber-600">
                        <AvatarImage src={displayedLeaderboard[2]?.profile?.avatar_url} />
                        <AvatarFallback>
                          {getUserInitials(displayedLeaderboard[2]?.profile?.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2">
                        {getRankIcon(3)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="font-semibold text-sm">
                        {displayedLeaderboard[2]?.profile?.display_name || displayedLeaderboard[2]?.profile?.username}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {displayedLeaderboard[2]?.total_xp.toLocaleString()} XP
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {displayedLeaderboard[2]?.level_title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Full Rankings List */}
            <div className="space-y-2">
              <h3 className="font-semibold mb-3">Full Rankings</h3>
              {displayedLeaderboard.map((entry, index) => {
                const rank = index + 1;
                const levelInfo = getLevelInfo(entry.current_level);
                const isCurrentUser = entry.user_id === user?.id;

                return (
                  <div 
                    key={entry.user_id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                      isCurrentUser ? 'bg-primary/10 border-primary/20' : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getRankIcon(rank)}
                    </div>

                    <Avatar className="w-10 h-10">
                      <AvatarImage src={entry.profile?.avatar_url} />
                      <AvatarFallback>
                        {getUserInitials(entry.profile?.username)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium truncate">
                          {entry.profile?.display_name || entry.profile?.username}
                        </div>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{entry.total_xp.toLocaleString()} XP</span>
                        <span>•</span>
                        <span>{entry.level_title}</span>
                        {levelInfo && (
                          <>
                            <span>•</span>
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ borderColor: levelInfo.color, color: levelInfo.color }}
                            >
                              Lvl {entry.current_level}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current User Position (if not in top rankings) */}
            {showUserPosition && userPosition > limit && userEntry && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Your Position</h4>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex-shrink-0">
                    {getRankIcon(userPosition)}
                  </div>

                  <Avatar className="w-10 h-10">
                    <AvatarImage src={userEntry.profile?.avatar_url} />
                    <AvatarFallback>
                      {getUserInitials(userEntry.profile?.username)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="font-medium">
                      {userEntry.profile?.display_name || userEntry.profile?.username}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {userEntry.total_xp.toLocaleString()} XP • {userEntry.level_title}
                    </div>
                  </div>

                  <Badge variant="outline">You</Badge>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}