
import React from 'react';
import { Plus, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PostCard } from './PostCard';
import { RecentActivity } from './RecentActivity';
import { OnlineMembers } from './OnlineMembers';

// Mock data
const mockPosts = [
  {
    id: '1',
    title: 'Nieuwe wetgeving rond CBD in België',
    content: 'Er zijn belangrijke updates over de CBD wetgeving die iedereen moet weten...',
    author: {
      username: 'WetgevingExpert',
      avatar: null,
      isVerified: true,
    },
    category: 'Wetgeving & Nieuws',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    votes: 23,
    replyCount: 8,
    isSticky: true,
  },
  {
    id: '2',
    title: 'CBD olie dosering voor beginners',
    content: 'Voor mensen die net beginnen met CBD olie, hier zijn wat tips...',
    author: {
      username: 'MediUser123',
      avatar: null,
      isVerified: false,
    },
    category: 'Medicinaal Gebruik',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    votes: 15,
    replyCount: 12,
    isSticky: false,
  },
  {
    id: '3',
    title: 'Indoor setup voor beginners',
    content: 'Wat heb je allemaal nodig voor een succesvolle indoor grow?',
    author: {
      username: 'GreenThumb',
      avatar: null,
      isVerified: false,
    },
    category: 'Teelt & Horticultuur',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    votes: 31,
    replyCount: 24,
    isSticky: false,
  },
];

const stats = [
  {
    title: 'Actieve Topics',
    value: '1,234',
    description: 'Deze week',
    icon: MessageSquare,
  },
  {
    title: 'Online Leden',
    value: '89',
    description: 'Nu online',
    icon: Users,
  },
  {
    title: 'Trending',
    value: '#CBD',
    description: 'Populairste tag',
    icon: TrendingUp,
  },
];

export function FeedPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Welcome Card */}
        <Card className="cannabis-gradient text-primary-foreground">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Welkom bij Wietforum België! 🌿
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              De community voor cannabis liefhebbers in België. Deel kennis, ervaringen en 
              houd je op de hoogte van de laatste ontwikkelingen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="gap-2">
              <Plus className="h-4 w-4" />
              Nieuw Topic Starten
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
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

        {/* Recent Posts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold">Recente Activiteit</h2>
            <Button variant="outline" size="sm">
              Alle Topics
            </Button>
          </div>
          
          <div className="space-y-3">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <RecentActivity />
        <Separator />
        <OnlineMembers />
      </div>
    </div>
  );
}
