import { Home, Users, MessageSquare, User, Store, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuButton {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  action?: () => void;
}

export function MobileBottomNavigation() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Don't show on desktop
  if (!isMobile) return null;

  const isHomepage = location.pathname === '/';
  const currentPath = location.pathname;

  // Homepage configuration for unauthenticated users
  if (isHomepage && !user) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
        <div className="flex w-full">
          <Button
            onClick={() => navigate('/register')}
            className="flex-1 h-16 rounded-none border-r border-border"
            variant="ghost"
          >
            <div className="flex flex-col items-center gap-1">
              <User className="h-5 w-5" />
              <span className="text-xs">Registreren</span>
            </div>
          </Button>
          <Button
            onClick={() => navigate('/login')}
            className="flex-1 h-16 rounded-none"
            variant="ghost"
          >
            <div className="flex flex-col items-center gap-1">
              <Lock className="h-5 w-5" />
              <span className="text-xs">Inloggen</span>
            </div>
          </Button>
        </div>
      </div>
    );
  }

  // Don't show if user is not authenticated (except on homepage)
  if (!user) return null;

  // Configure menu based on user role
  let menuButtons: MenuButton[] = [];

  if (user.role === 'admin') {
    // Admin menu
    menuButtons = [
      { icon: Home, label: 'Feed', path: '/' },
      { icon: Users, label: 'Forums', path: '/forums' },
      { icon: MessageSquare, label: 'Messages', path: '/messages' },
      { icon: Lock, label: 'Admin', path: '/admin' },
    ];
  } else if (user.role === 'supplier') {
    // Supplier menu: Replace Settings with Supplier (keep 4 buttons)
    menuButtons = [
      { icon: Home, label: 'Feed', path: '/' },
      { icon: Users, label: 'Forums', path: '/forums' },
      { icon: MessageSquare, label: 'Messages', path: '/messages' },
      { icon: Store, label: 'Supplier', path: '/supplier-dashboard' },
    ];
  } else {
    // Standard user/moderator menu
    menuButtons = [
      { icon: Home, label: 'Feed', path: '/' },
      { icon: Users, label: 'Forums', path: '/forums' },
      { icon: MessageSquare, label: 'Messages', path: '/messages' },
      { icon: User, label: 'Settings', path: '/settings' },
    ];
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
      <div className="flex w-full">
        {menuButtons.map((button, index) => {
          const Icon = button.icon;
          const active = isActive(button.path);
          
          return (
            <Button
              key={button.path}
              onClick={button.action || (() => navigate(button.path))}
              className={cn(
                "flex-1 h-16 rounded-none",
                index < menuButtons.length - 1 && "border-r border-border",
                active && "bg-muted text-primary"
              )}
              variant="ghost"
            >
              <div className="flex flex-col items-center gap-1">
                <Icon className={cn("h-5 w-5", active && "text-primary")} />
                <span className={cn("text-xs", active && "text-primary font-medium")}>
                  {button.label}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}