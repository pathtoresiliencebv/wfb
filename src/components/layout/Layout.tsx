
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <EmailVerificationBanner />
          
          <main className="flex-1 overflow-auto">
            <div className={`container mx-auto ${isMobile ? 'p-4' : 'p-6'}`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
