import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/hooks/useGamification';
import * as LucideIcons from 'lucide-react';

interface RewardsStoreProps {
  userId?: string;
}

export function RewardsStore({ userId }: RewardsStoreProps) {
  const { 
    rewards, 
    userRewards, 
    userLevel, 
    userPoints, 
    canClaimReward, 
    claimReward, 
    isLoading 
  } = useGamification(userId);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const rewardCategories = [
    { value: 'all', label: 'All Rewards' },
    { value: 'badge', label: 'Badges' },
    { value: 'title', label: 'Titles' },
    { value: 'special_privilege', label: 'Privileges' },
    { value: 'cosmetic', label: 'Cosmetics' },
  ];

  const filteredRewards = rewards?.filter(reward => 
    selectedCategory === 'all' || reward.reward_type === selectedCategory
  ) || [];

  const claimedRewardIds = userRewards?.map(ur => ur.reward_id) || [];

  const handleClaimReward = (rewardId: string) => {
    const reward = rewards?.find(r => r.id === rewardId);
    if (!reward) return;

    const categoryPoints: { [key: string]: number } = {};
    userPoints?.forEach(up => {
      categoryPoints[up.category_id] = up.points;
    });

    claimReward({ rewardId, categoryPoints });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LucideIcons.Gift className="w-5 h-5" />
          <span>Rewards Store</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {rewardCategories.map(category => (
              <TabsTrigger key={category.value} value={category.value} className="text-xs">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRewards.map((reward) => {
                const isOwned = claimedRewardIds.includes(reward.id);
                const canClaim = canClaimReward(reward as any);
                const IconComponent = (LucideIcons as any)[reward.icon] || LucideIcons.Gift;

                return (
                  <Card key={reward.id} className={`transition-all ${isOwned ? 'ring-2 ring-green-500' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div 
                          className="flex items-center justify-center w-10 h-10 rounded-full"
                          style={{ backgroundColor: `${reward.cost_category?.color || '#10b981'}20` }}
                        >
                          <IconComponent 
                            size={20} 
                            style={{ color: reward.cost_category?.color || '#10b981' }}
                          />
                        </div>
                        <Badge 
                          variant={isOwned ? 'default' : 'outline'}
                          className={isOwned ? 'bg-green-500' : ''}
                        >
                          {isOwned ? 'Owned' : reward.reward_type}
                        </Badge>
                      </div>

                      <h3 className="font-semibold mb-2">{reward.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {reward.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Cost:</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-semibold">{reward.cost_points}</span>
                            <span className="text-muted-foreground">
                              {reward.cost_category?.name || 'points'}
                            </span>
                          </div>
                        </div>
                        
                        {reward.required_level > 1 && (
                          <div className="flex items-center justify-between text-sm">
                            <span>Required Level:</span>
                            <Badge variant="outline">
                              Level {reward.required_level}
                            </Badge>
                          </div>
                        )}

                        {reward.is_limited && (
                          <div className="flex items-center justify-between text-sm">
                            <span>Available:</span>
                            <span className="text-orange-500">
                              {(reward.max_claims || 0) - reward.current_claims} left
                            </span>
                          </div>
                        )}
                      </div>

                      <Button 
                        className="w-full"
                        disabled={isOwned || !canClaim}
                        onClick={() => handleClaimReward(reward.id)}
                        variant={isOwned ? 'outline' : canClaim ? 'default' : 'secondary'}
                      >
                        {isOwned ? (
                          <>
                            <LucideIcons.Check className="w-4 h-4 mr-2" />
                            Owned
                          </>
                        ) : canClaim ? (
                          <>
                            <LucideIcons.ShoppingCart className="w-4 h-4 mr-2" />
                            Claim Reward
                          </>
                        ) : (
                          <>
                            <LucideIcons.Lock className="w-4 h-4 mr-2" />
                            {userLevel && userLevel.current_level < reward.required_level 
                              ? `Need Level ${reward.required_level}`
                              : 'Insufficient Points'
                            }
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredRewards.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <LucideIcons.Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No rewards available in this category</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}