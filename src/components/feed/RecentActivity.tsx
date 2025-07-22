
import React from 'react';
import { MessageSquare, ThumbsUp, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const activities = [
  {
    id: '1',
    type: 'comment',
    user: 'CBD_Expert',
    action: 'reageerde op',
    target: 'CBD dosering voor beginners',
    time: '2 min geleden',
    icon: MessageSquare,
  },
  {
    id: '2',
    type: 'like',
    user: 'GreenGuru',
    action: 'likte',
    target: 'Indoor setup tips',
    time: '5 min geleden',
    icon: ThumbsUp,
  },
  {
    id: '3',
    type: 'join',
    user: 'NewUser2024',
    action: 'werd lid van',
    target: 'de community',
    time: '15 min geleden',
    icon: UserPlus,
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Recente Activiteit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
              <activity.icon className="h-3 w-3 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{activity.user}</span>
                {' '}{activity.action}{' '}
                <span className="font-medium text-foreground">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
