import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CrownBadge } from '@/components/ui/crown-badge';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const SupplierRankingManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['admin-suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_profiles')
        .select(`
          *,
          profiles!inner(username, display_name, avatar_url)
        `)
        .eq('is_active', true)
        .order('ranking', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const updateRankingMutation = useMutation({
    mutationFn: async ({ supplierId, newRanking }: { supplierId: string; newRanking: number }) => {
      const { error } = await supabase
        .from('supplier_profiles')
        .update({ ranking: newRanking })
        .eq('id', supplierId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['sidebar-top-suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['top-suppliers'] });
      toast({
        title: "Ranking bijgewerkt",
        description: "De leverancier ranking is succesvol aangepast.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Fout",
        description: "Er is een fout opgetreden bij het bijwerken van de ranking.",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ supplierId, isActive }: { supplierId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('supplier_profiles')
        .update({ is_active: isActive })
        .eq('id', supplierId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['sidebar-top-suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['top-suppliers'] });
      toast({
        title: "Status bijgewerkt",
        description: "De leverancier status is succesvol aangepast.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Fout",
        description: "Er is een fout opgetreden bij het bijwerken van de status.",
      });
    },
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRankBadgeVariant = (ranking: number) => {
    switch (ranking) {
      case 1: return 'default';
      case 2: return 'secondary';
      case 3: return 'outline';
      default: return 'destructive';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leverancier Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Laden...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leverancier Rankings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Beheer de rankings van leveranciers. Alleen rankings 1-3 worden getoond in de sidebar.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {suppliers?.map((supplier) => (
          <div
            key={supplier.id}
            className="flex items-center gap-4 p-4 border rounded-lg bg-card"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={supplier.profiles.avatar_url} />
                  <AvatarFallback>
                    {getInitials(supplier.business_name)}
                  </AvatarFallback>
                </Avatar>
                {supplier.ranking >= 1 && supplier.ranking <= 3 && (
                  <div className="absolute -top-1 -right-1">
                    <CrownBadge rank={supplier.ranking as 1 | 2 | 3} size="sm" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="font-medium">{supplier.business_name}</div>
                <div className="text-sm text-muted-foreground">
                  @{supplier.profiles.username}
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getRankBadgeVariant(supplier.ranking)}>
                    Ranking: {supplier.ranking}
                  </Badge>
                  <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                    {supplier.is_active ? 'Actief' : 'Inactief'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Select
                value={supplier.ranking.toString()}
                onValueChange={(value) => {
                  updateRankingMutation.mutate({
                    supplierId: supplier.id,
                    newRanking: parseInt(value),
                  });
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Geen</SelectItem>
                  <SelectItem value="1">🥇 1</SelectItem>
                  <SelectItem value="2">🥈 2</SelectItem>
                  <SelectItem value="3">🥉 3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant={supplier.is_active ? "outline" : "default"}
                size="sm"
                onClick={() => {
                  toggleActiveMutation.mutate({
                    supplierId: supplier.id,
                    isActive: !supplier.is_active,
                  });
                }}
              >
                {supplier.is_active ? 'Deactiveren' : 'Activeren'}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};