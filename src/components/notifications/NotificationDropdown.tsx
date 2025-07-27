import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, Trash2, MessageSquare, User } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'topic_reply':
      return <MessageSquare className="h-4 w-4" />;
    case 'user_follow':
      return <User className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export function NotificationDropdown() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificaties</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-auto p-1 text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Alles gelezen
            </Button>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="p-4">
            <LoadingSpinner size="sm" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Geen notificaties
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 p-3 cursor-pointer"
                onClick={() => !notification.read_at && markAsRead(notification.id)}
              >
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        !notification.read_at ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.title}
                      </p>
                      
                      {notification.message && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: nl
                        })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!notification.read_at && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}