import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CrownBadge } from '@/components/ui/crown-badge';
import { 
  Store, Search, Crown, Settings, MoreHorizontal, 
  Star, Users, TrendingUp, Edit, Eye, ToggleLeft, ToggleRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { SupplierProfile, SupplierStats } from '@/types/supplier';

export default function AdminSuppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRanking, setEditingRanking] = useState<number>(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch suppliers
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['admin-suppliers', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('supplier_profiles')
        .select(`
          *,
          profiles!inner(username, display_name, avatar_url, reputation)
        `)
        .order('ranking', { ascending: true })
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`business_name.ilike.%${searchTerm}%,profiles.username.ilike.%${searchTerm}%`);
      }

      if (statusFilter === 'active') {
        query = query.eq('is_active', true);
      } else if (statusFilter === 'inactive') {
        query = query.eq('is_active', false);
      } else if (statusFilter === 'ranked') {
        query = query.gt('ranking', 0);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SupplierProfile[];
    }
  });

  // Update supplier ranking mutation
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
      queryClient.invalidateQueries({ queryKey: ['top-suppliers'] });
      toast({ title: 'Ranking bijgewerkt', description: 'Leverancier ranking is succesvol bijgewerkt.' });
      setIsEditDialogOpen(false);
      setSelectedSupplier(null);
    },
    onError: (error) => {
      toast({ 
        title: 'Fout bij bijwerken', 
        description: 'Er is een fout opgetreden bij het bijwerken van de ranking.',
        variant: 'destructive' 
      });
      console.error('Error updating ranking:', error);
    }
  });

  // Toggle supplier status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ supplierId, isActive }: { supplierId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('supplier_profiles')
        .update({ is_active: isActive })
        .eq('id', supplierId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['top-suppliers'] });
      toast({ title: 'Status bijgewerkt', description: 'Leverancier status is succesvol bijgewerkt.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Fout bij bijwerken', 
        description: 'Er is een fout opgetreden bij het bijwerken van de status.',
        variant: 'destructive' 
      });
      console.error('Error updating status:', error);
    }
  });

  const getRankingText = (ranking: number) => {
    switch (ranking) {
      case 1: return 'Gouden Leverancier';
      case 2: return 'Zilveren Leverancier'; 
      case 3: return 'Bronzen Leverancier';
      default: return ranking > 0 ? `Ranking ${ranking}` : 'Geen ranking';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEditSupplier = (supplier: SupplierProfile) => {
    setSelectedSupplier(supplier);
    setEditingRanking(supplier.ranking);
    setIsEditDialogOpen(true);
  };

  const handleSaveSupplier = () => {
    if (selectedSupplier && editingRanking !== selectedSupplier.ranking) {
      updateRankingMutation.mutate({
        supplierId: selectedSupplier.id,
        newRanking: editingRanking
      });
    } else {
      setIsEditDialogOpen(false);
      setSelectedSupplier(null);
    }
  };

  const filteredSuppliers = suppliers || [];

  // Calculate statistics
  const totalSuppliers = filteredSuppliers.length;
  const activeSuppliers = filteredSuppliers.filter(s => s.is_active).length;
  const rankedSuppliers = filteredSuppliers.filter(s => s.ranking > 0).length;
  const topSuppliers = filteredSuppliers.filter(s => s.ranking > 0 && s.ranking <= 3).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leveranciers Beheer</h1>
          <p className="text-muted-foreground">Beheer alle leveranciers, rankings en status</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {totalSuppliers} leveranciers
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Leveranciers</CardTitle>
            <Store className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">Geregistreerde leveranciers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actief</CardTitle>
            <ToggleRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              {totalSuppliers > 0 ? Math.round((activeSuppliers / totalSuppliers) * 100) : 0}% van totaal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gerangschikt</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rankedSuppliers}</div>
            <p className="text-xs text-muted-foreground">Met ranking positie</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top 3</CardTitle>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topSuppliers}</div>
            <p className="text-xs text-muted-foreground">Goud, zilver, brons</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Zoeken & Filteren
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Zoeken</Label>
              <Input
                id="search"
                placeholder="Zoek op bedrijfsnaam of gebruikersnaam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="w-48">
              <Label htmlFor="status-filter">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="active">Actief</SelectItem>
                  <SelectItem value="inactive">Inactief</SelectItem>
                  <SelectItem value="ranked">Gerangschikt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leveranciers Overzicht</CardTitle>
          <CardDescription>Beheer alle geregistreerde leveranciers</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leverancier</TableHead>
                  <TableHead>Statistieken</TableHead>
                  <TableHead>Ranking</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aangemaakt</TableHead>
                  <TableHead>Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={supplier.profiles.avatar_url} />
                          <AvatarFallback>
                            {getInitials(supplier.business_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{supplier.business_name}</span>
                            {supplier.ranking > 0 && supplier.ranking <= 3 && (
                              <CrownBadge rank={supplier.ranking as 1 | 2 | 3} size="sm" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            @{supplier.profiles.username}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        {(supplier.stats as SupplierStats).customers && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {(supplier.stats as SupplierStats).customers}+ klanten
                          </div>
                        )}
                        {(supplier.stats as SupplierStats).rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {(supplier.stats as SupplierStats).rating} rating
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplier.ranking > 0 ? 'default' : 'secondary'}>
                        {getRankingText(supplier.ranking)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                        {supplier.is_active ? 'Actief' : 'Inactief'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(supplier.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSupplier(supplier)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            toggleStatusMutation.mutate({
                              supplierId: supplier.id,
                              isActive: !supplier.is_active
                            });
                          }}
                          disabled={toggleStatusMutation.isPending}
                        >
                          {supplier.is_active ? (
                            <ToggleLeft className="h-4 w-4" />
                          ) : (
                            <ToggleRight className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/leverancier/${supplier.profiles.username}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredSuppliers.length === 0 && (
            <div className="text-center py-8">
              <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Geen leveranciers gevonden</h3>
              <p className="text-muted-foreground">
                Probeer je zoekterm aan te passen of filters te wijzigen.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setSelectedSupplier(null);
          setEditingRanking(0);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leverancier Bewerken</DialogTitle>
            <DialogDescription>
              Bewerk de ranking van {selectedSupplier?.business_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="supplier-ranking">Ranking</Label>
              <Select 
                value={editingRanking.toString()} 
                onValueChange={(value) => setEditingRanking(parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Geen ranking</SelectItem>
                  <SelectItem value="1">1 - Gouden Leverancier</SelectItem>
                  <SelectItem value="2">2 - Zilveren Leverancier</SelectItem>
                  <SelectItem value="3">3 - Bronzen Leverancier</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Ranking 1-3 krijgen kronen (goud/zilver/brons) en verschijnen in de Top 3.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuleren
            </Button>
            <Button 
              onClick={handleSaveSupplier}
              disabled={updateRankingMutation.isPending}
            >
              Opslaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}