import { Home, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SettingsBreadcrumbProps {
  activeTab?: string;
  className?: string;
}

export function SettingsBreadcrumb({ activeTab, className }: SettingsBreadcrumbProps) {
  const navigate = useNavigate();

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'profile': return 'Profiel';
      case 'security': return 'Beveiliging';
      case 'privacy': return 'Privacy';
      default: return 'Instellingen';
    }
  };

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground mb-6", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="h-auto p-0 font-normal hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4 mr-1" />
        Home
      </Button>
      
      <ChevronRight className="h-4 w-4" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/settings')}
        className="h-auto p-0 font-normal hover:text-foreground transition-colors"
      >
        Instellingen
      </Button>
      
      {activeTab && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">
            {getTabLabel(activeTab)}
          </span>
        </>
      )}
    </nav>
  );
}