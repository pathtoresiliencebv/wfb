
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner';
import { MobileBottomNavigation } from '@/components/mobile/MobileBottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user } = useAuth();
  const isHome = location.pathname === '/';
  const showAppHeader = !(isHome && !user); // Don't show header on homepage for unauthenticated users
  const showSidebar = !(isHome && !user);
  const mainInnerClass = showSidebar 
    ? `container mx-auto ${isMobile ? 'px-3 sm:px-4 py-4 pb-20' : 'px-6 py-6'}` 
    : `${isMobile ? 'pb-20' : 'p-0'}`;

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full bg-background">
        {showSidebar && <AppSidebar />}
        
        <div className="flex-1 flex flex-col min-w-0">
          {showAppHeader && <Header />}
          <EmailVerificationBanner />
          
          <main className="flex-1 overflow-auto">
            <div className={mainInnerClass}>
              {children}
            </div>
          </main>
        </div>
        
        <MobileBottomNavigation />
      </div>
    </SidebarProvider>
  );
}
