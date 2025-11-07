import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { WelcomeSection } from './WelcomeSection';
import { RecentActivity } from '@/components/feed/RecentActivity';
import { TopSuppliers } from '@/components/supplier/TopSuppliers';
import { RecentPosts } from './RecentPosts';
import { TrendingTopics } from './TrendingTopics';
import { SuggestedTopics } from './SuggestedTopics';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FeedLoadingSkeleton } from '@/components/loading/OptimizedLoadingStates';
import { PresentationTab } from './PresentationTab';

export function AuthenticatedHome() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const mainContent = (
    <div className="lg:col-span-3 space-y-4 md:space-y-6">
      <WelcomeSection />
      
      <TopSuppliers />
      
      <RecentPosts />
      
      <TrendingTopics limit={6} showHeader={true} />
      
      <SuggestedTopics />
    </div>
  );

  if (isRefreshing) {
    return <FeedLoadingSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          {mainContent}
        </PullToRefresh>
      ) : (
        mainContent
      )}

      {/* Sidebar - Recente Activiteit + Presentatie */}
      <div className={`space-y-4 md:space-y-6 ${isMobile ? 'hidden' : 'lg:sticky lg:top-24'}`}>
        <RecentActivity />
        <PresentationTab />
      </div>

      {/* Mobile FAB for creating topics */}
      {isMobile && (
        <FloatingActionButton onClick={() => setShowCreateDialog(true)} />
      )}

      {/* Mobile Create Topic Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nieuw Topic</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Button 
              onClick={() => {
                navigate('/create-topic');
                setShowCreateDialog(false);
              }}
              className="w-full"
            >
              Ga naar Topic Creator
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
