
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

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
  const { onlineUsers, getOnlineCount, isLoading } = useOnlineStatus();
  
  // Use mock data when real data is not available
  const displayMembers = onlineUsers.length > 0 ? onlineUsers : onlineMembers;
  const displayCount = onlineUsers.length > 0 ? getOnlineCount() : onlineMembers.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          Leden Online
          <Badge variant="secondary" className="text-xs">
            {displayCount}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-muted rounded w-20" />
                  <div className="h-2 bg-muted rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : onlineUsers.length > 0 ? (
          onlineUsers.slice(0, 6).map((user) => (
            <div key={user.user_id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profiles?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {(user.profiles?.display_name || user.profiles?.username || 'U').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="online-indicator absolute -bottom-1 -right-1" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.profiles?.display_name || user.profiles?.username}
                </p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
          ))
        ) : (
          // Fallback to mock data
          onlineMembers.map((member) => (
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
          ))
        )}
        
        {onlineUsers.length > 6 && (
          <div className="text-xs text-muted-foreground pt-1 text-center">
            +{onlineUsers.length - 6} meer online
          </div>
        )}
      </CardContent>
    </Card>
  );
}
