import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, Wifi, WifiOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { useMessaging } from '@/hooks/useMessaging';
export function Header() {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const {
    totalUnreadCount
  } = useMessaging();
  const logo = '/lovable-uploads/8721330a-f235-4c3b-9c21-85436a192135.png';
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };
  return <header className="sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 md:h-16 items-center px-2 sm:px-4">
        <SidebarTrigger className="mr-2 md:mr-4 p-2" />
        
        {/* Logo */}
        <Link to="/" className="mr-3 md:mr-6 flex items-center shrink-0">
          <img src={logo} alt="Wiet Forum België" className="h-8 md:h-10 w-auto object-contain transition-opacity hover:opacity-80" />
        </Link>
        
        {/* Primary navigation (desktop) - only show for logged-in users */}
        {user && <nav aria-label="Hoofdnavigatie" className="hidden lg:flex items-center gap-1 mr-4">
            {[{
          title: 'Feed',
          to: '/'
        }, {
          title: 'Forums',
          to: '/forums'
        }, {
          title: 'Leden',
          to: '/members'
        }, {
          title: 'Berichten',
          to: '/messages',
          badge: totalUnreadCount
        }, {
          title: 'Leaderboard',
          to: '/leaderboard'
        }].map(item => <Link key={item.to} to={item.to} className="px-2 lg:px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 whitespace-nowrap relative border-b-2 border-transparent hover:border-primary/50">
                {item.title}
                {item.badge !== undefined && item.badge !== null && item.badge > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center text-xs px-1">
                    {item.badge > 9 ? '9+' : item.badge}
                  </Badge>}
              </Link>)}
          </nav>}
        
        {/* Search */}
        

        {/* Actions */}
        <div className="flex items-center space-x-1 md:space-x-2 ml-auto">
          {/* Online/Offline indicator - hide on small mobile */}
          <div className="hidden sm:flex items-center gap-1 text-xs">
            {isOnline ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
            <span className={`${isOnline ? "text-green-500" : "text-red-500"} hidden md:inline`}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          
          <ThemeToggle />
          
          {/* Notifications */}
          {user && <NotificationDropdown />}

          {/* User Menu - No registration buttons on public pages */}
          {user && <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8 md:h-9 md:w-9">
                    <AvatarImage src={user.avatar || undefined} alt={user.username} />
                    <AvatarFallback className="text-xs md:text-sm">
                      {getUserInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-[110] bg-popover border mr-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none truncate">{user.displayName || user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`/members/${user.username}`} className="flex items-center min-h-[44px] cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profiel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center min-h-[44px] cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Instellingen
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center min-h-[44px] cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Uitloggen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>}
        </div>
      </div>
    </header>;
}