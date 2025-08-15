import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupplierStats } from '@/types/supplier';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CrownBadge } from '@/components/ui/crown-badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TopSuppliers: React.FC = () => {
  const navigate = useNavigate();

  const { data: topSuppliers, isLoading } = useQuery({
    queryKey: ['top-suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_profiles')
        .select(`
          *,
          profiles!inner(username, display_name, avatar_url, reputation)
        `)
        .eq('is_active', true)
        .gt('ranking', 0)
        .order('ranking', { ascending: true })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRankText = (rank: number) => {
    switch (rank) {
      case 1: return 'Gouden Leverancier';
      case 2: return 'Zilveren Leverancier';
      case 3: return 'Bronzen Leverancier';
      default: return 'Top Leverancier';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 3 Leveranciers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Laden...</div>
        </CardContent>
      </Card>
    );
  }

  if (!topSuppliers || topSuppliers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 3 Leveranciers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Nog geen gerangschikte leveranciers
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top 3 Leveranciers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <CrownBadge rank={supplier.ranking as 1 | 2 | 3} size="md" />
              
              <Avatar className="h-10 w-10">
                <AvatarImage src={supplier.profiles.avatar_url} />
                <AvatarFallback>
                  {getInitials(supplier.business_name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="font-medium">{supplier.business_name}</div>
                <div className="text-sm text-muted-foreground">
                  {getRankText(supplier.ranking)}
                </div>
                
                <div className="flex items-center gap-4 mt-1">
                  {(supplier.stats as SupplierStats).rating && (
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      {(supplier.stats as SupplierStats).rating}
                    </div>
                  )}
                  {(supplier.stats as SupplierStats).customers && (
                    <div className="flex items-center gap-1 text-xs">
                      <Users className="h-3 w-3 text-primary" />
                      {(supplier.stats as SupplierStats).customers}+ klanten
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/aanbod/${supplier.profiles.username}`)}
            >
              Bekijk
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};