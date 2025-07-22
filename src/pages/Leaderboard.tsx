import React from 'react';
import { Trophy, Star, TrendingUp, Award, Medal, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const topContributors = [
  {
    rank: 1,
    username: 'GreenThumb',
    displayName: 'Jan Peeters',
    avatar: null,
    points: 2100,
    posts: 891,
    helpfulAnswers: 156,
    badges: ['Grow Expert', 'Community Leader', 'Top Contributor'],
    level: 'Cannabis Guru',
    nextLevelPoints: 2500,
  },
  {
    rank: 2,
    username: 'CBD_Expert',
    displayName: 'Dr. Sarah Van Damme',
    avatar: null,
    points: 1250,
    posts: 342,
    helpfulAnswers: 89,
    badges: ['CBD Specialist', 'Trusted Member', 'Expert'],
    level: 'Knowledge Master',
    nextLevelPoints: 1500,
  },
  {
    rank: 3,
    username: 'LegalEagle',
    displayName: 'Advocaat Thomas',
    avatar: null,
    points: 890,
    posts: 167,
    helpfulAnswers: 45,
    badges: ['Legal Expert', 'Verified Professional'],
    level: 'Trusted Advisor',
    nextLevelPoints: 1000,
  },
];

const achievements = [
  {
    title: 'Eerste Post',
    description: 'Maak je eerste forum post',
    icon: Star,
    rarity: 'common',
    earned: true,
  },
  {
    title: 'Helpende Hand',
    description: 'Krijg 10 likes op je reacties',
    icon: Award,
    rarity: 'uncommon',
    earned: true,
  },
  {
    title: 'Expert Status',
    description: 'Word geverifieerd als expert',
    icon: Medal,
    rarity: 'rare',
    earned: false,
  },
  {
    title: 'Community Champion',
    description: 'Bereik 1000 reputatiepunten',
    icon: Crown,
    rarity: 'legendary',
    earned: false,
  },
];

const weeklyStats = [
  { label: 'Meest Actieve Poster', value: 'GreenThumb', subValue: '23 posts' },
  { label: 'Meeste Likes Ontvangen', value: 'CBD_Expert', subValue: '89 likes' },
  { label: 'Nieuwste Expert', value: 'MediResearcher', subValue: 'Deze week' },
  { label: 'Rising Star', value: 'NewGrower2024', subValue: '+45 punten' },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  }
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'text-gray-500';
    case 'uncommon':
      return 'text-green-500';
    case 'rare':
      return 'text-blue-500';
    case 'legendary':
      return 'text-purple-500';
    default:
      return 'text-muted-foreground';
  }
};

export default function Leaderboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-heading text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">
            Onze meest waardevolle community leden
          </p>
        </div>
      </div>

      <Tabs defaultValue="contributors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contributors">Top Contributors</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="weekly">Deze Week</TabsTrigger>
        </TabsList>

        <TabsContent value="contributors" className="space-y-6">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topContributors.slice(0, 3).map((user) => (
              <Card key={user.rank} className={`${user.rank === 1 ? 'cannabis-gradient text-primary-foreground' : ''}`}>
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-2">
                    {getRankIcon(user.rank)}
                  </div>
                  <Avatar className="h-16 w-16 mx-auto mb-2">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback>
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className={`text-lg ${user.rank === 1 ? 'text-primary-foreground' : ''}`}>
                    {user.displayName}
                  </CardTitle>
                  <CardDescription className={user.rank === 1 ? 'text-primary-foreground/80' : ''}>
                    @{user.username}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div>
                    <div className={`text-2xl font-bold ${user.rank === 1 ? 'text-primary-foreground' : 'text-primary'}`}>
                      {user.points}
                    </div>
                    <div className={`text-sm ${user.rank === 1 ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      punten
                    </div>
                  </div>
                  
                  <Badge variant={user.rank === 1 ? 'secondary' : 'outline'} className="text-xs">
                    {user.level}
                  </Badge>
                  
                  <div className="space-y-1">
                    <div className={`text-xs ${user.rank === 1 ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      Progress naar volgend level
                    </div>
                    <Progress 
                      value={(user.points / user.nextLevelPoints) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className={`grid grid-cols-2 gap-2 text-xs ${user.rank === 1 ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    <div>
                      <div className="font-medium">{user.posts}</div>
                      <div>Posts</div>
                    </div>
                    <div>
                      <div className="font-medium">{user.helpfulAnswers}</div>
                      <div>Helpful</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Volledige Ranglijst</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...topContributors, ...Array(7).fill(null).map((_, i) => ({
                  rank: i + 4,
                  username: `User${i + 4}`,
                  displayName: `Gebruiker ${i + 4}`,
                  avatar: null,
                  points: 800 - (i * 100),
                  posts: 150 - (i * 15),
                  level: 'Active Member',
                }))].map((user) => (
                  <div key={user.rank} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 text-center">
                      {user.rank <= 3 ? getRankIcon(user.rank) : (
                        <span className="text-lg font-bold text-muted-foreground">#{user.rank}</span>
                      )}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="font-medium">{user.displayName}</div>
                      <div className="text-sm text-muted-foreground">@{user.username}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-primary">{user.points}</div>
                      <div className="text-xs text-muted-foreground">{user.posts} posts</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <Card key={index} className={`${achievement.earned ? 'border-primary' : 'opacity-60'}`}>
                <CardContent className="p-6 text-center">
                  <achievement.icon className={`h-12 w-12 mx-auto mb-3 ${achievement.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                  <h3 className={`font-medium mb-2 ${getRarityColor(achievement.rarity)}`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>
                  <Badge variant={achievement.earned ? 'default' : 'outline'} className="text-xs">
                    {achievement.earned ? 'Behaald' : 'Vergrendeld'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weeklyStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-medium mb-1">{stat.label}</h3>
                  <div className="text-lg font-bold text-primary">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.subValue}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}