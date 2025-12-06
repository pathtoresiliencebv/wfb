import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { WelcomeSection } from './WelcomeSection';
import { RecentActivity } from '@/components/feed/RecentActivity';
import { TopSuppliers } from '@/components/supplier/TopSuppliers';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { FeedLoadingSkeleton } from '@/components/loading/OptimizedLoadingStates';

export function AuthenticatedHome() {
  const isMobile = useIsMobile();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const mainContent = (
    <div className="lg:col-span-3 space-y-4 md:space-y-6">
      <WelcomeSection />
      
      {!isMobile && <TopSuppliers />}
    </div>
  );

  if (isRefreshing) {
    return <FeedLoadingSkeleton />;
  }

  return (
    <div className={isMobile ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6"}>
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          {mainContent}
        </PullToRefresh>
      ) : (
        <>
          {mainContent}
          {/* Sidebar - Recente Activiteit */}
          <div className="space-y-4 md:space-y-6 lg:sticky lg:top-24">
            <RecentActivity />
          </div>
        </>
      )}

    </div>
  );
}
