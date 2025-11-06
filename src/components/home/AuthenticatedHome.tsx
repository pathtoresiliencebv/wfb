import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { FloatingActionButton } from '@/components/mobile/FloatingActionButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RecentActivity } from '@/components/feed/RecentActivity';
import { OnlineMembers } from '@/components/feed/OnlineMembers';
import { FeedLoadingSkeleton } from '@/components/loading/OptimizedLoadingStates';
import { WelcomeSection } from './WelcomeSection';
import { StatsOverview } from './StatsOverview';
import { RecentPosts } from './RecentPosts';
import { QuickActionsPanel } from './QuickActionsPanel';
import { TopSuppliers } from '@/components/supplier/TopSuppliers';
import { TrendingTopics } from './TrendingTopics';
import { SuggestedTopics } from './SuggestedTopics';
import { LeaderboardPreview } from './LeaderboardPreview';
import { AchievementsShowcase } from './AchievementsShowcase';

export function AuthenticatedHome() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const mainContent = (
    <div className="lg:col-span-3 space-y-6">
      <QuickActionsPanel />
      <WelcomeSection />
      <div className="grid md:grid-cols-2 gap-6">
        <StatsOverview />
        <AchievementsShowcase />
      </div>
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content with Pull to Refresh on Mobile */}
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          {mainContent}
        </PullToRefresh>
      ) : (
        mainContent
      )}

      {/* Sidebar - Hidden on mobile */}
      <div className={`space-y-6 ${isMobile ? 'hidden' : ''}`}>
        <LeaderboardPreview />
        <Separator />
        <RecentActivity />
        <Separator />
        <OnlineMembers />
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