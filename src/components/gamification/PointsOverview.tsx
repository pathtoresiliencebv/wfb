import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/hooks/useGamification';
import * as LucideIcons from 'lucide-react';

interface PointsOverviewProps {
  userId?: string;
  showCategories?: boolean;
}

export function PointsOverview({ userId, showCategories = true }: PointsOverviewProps) {
  const { userPoints, pointCategories, isLoading } = useGamification(userId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPoints = userPoints?.reduce((sum, up) => sum + up.points, 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LucideIcons.Star className="w-5 h-5" />
          <span>Points Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {totalPoints.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Points</div>
        </div>

        {showCategories && pointCategories && pointCategories.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Points by Category</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pointCategories.map((category) => {
                const userCategoryPoints = userPoints?.find(up => up.category_id === category.id);
                const points = userCategoryPoints?.points || 0;
                const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Circle;

                return (
                  <div 
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-card rounded-lg border"
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="flex items-center justify-center w-8 h-8 rounded-full"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <IconComponent 
                          size={16} 
                          style={{ color: category.color }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm capitalize">
                          {category.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {category.description}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      style={{ borderColor: category.color, color: category.color }}
                    >
                      {points.toLocaleString()}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}