
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const onlineMembers = [
  {
    id: '1',
    username: 'CBD_Expert',
    avatar: null,
    status: 'online',
    role: 'Expert',
  },
  {
    id: '2',
    username: 'GreenThumb',
    avatar: null,
    status: 'online',
    role: 'Moderator',
  },
  {
    id: '3',
    username: 'NewGrower',
    avatar: null,
    status: 'online',
    role: 'Lid',
  },
  {
    id: '4',
    username: 'MediUser',
    avatar: null,
    status: 'online',
    role: 'Lid',
  },
];

export function OnlineMembers() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          Leden Online
          <Badge variant="secondary" className="text-xs">
            {onlineMembers.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {onlineMembers.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar || undefined} />
                <AvatarFallback className="text-xs">
                  {member.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="online-indicator absolute -bottom-1 -right-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {member.username}
              </p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
