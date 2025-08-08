import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Store, User } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  role: string;
  avatar_url?: string;
}

interface AssignSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignSupplierDialog({ open, onOpenChange }: AssignSupplierDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch non-supplier users
  const { data: users, isLoading } = useQuery({
    queryKey: ['assignable-users', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('role', 'supplier')
        .order('username');

      if (searchQuery.trim()) {
        query = query.or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as User[];
    },
    enabled: open
  });

  // Assign supplier mutation
  const assignSupplierMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUser) throw new Error('No user selected');
      
      // Start transaction-like operations
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'supplier' })
        .eq('user_id', selectedUser.user_id);
      
      if (roleError) throw roleError;

      // Create supplier profile
      const { error: supplierError } = await supabase
        .from('supplier_profiles')
        .insert({
          user_id: selectedUser.user_id,
          business_name: businessName || selectedUser.display_name || selectedUser.username,
          description: description || null,
          contact_info: {},
          stats: {},
          features: [],
          ranking: 0,
          is_active: true
        });

      if (supplierError) throw supplierError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ 
        title: 'Leverancier toegewezen', 
        description: `${selectedUser?.username} is nu een leverancier.` 
      });
      handleClose();
    },
    onError: (error) => {
      toast({ 
        title: 'Fout', 
        description: 'Er is een fout opgetreden bij het toewijzen van leverancier rechten.',
        variant: 'destructive' 
      });
      console.error('Error assigning supplier:', error);
    }
  });

  const handleClose = () => {
    setSelectedUser(null);
    setBusinessName('');
    setDescription('');
    setSearchQuery('');
    onOpenChange(false);
  };

  const handleAssign = () => {
    if (!selectedUser || !businessName.trim()) return;
    assignSupplierMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Leverancier Toewijzen
          </DialogTitle>
          <DialogDescription>
            Selecteer een gebruiker en wijs deze leverancier rechten toe
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Search */}
          <div>
            <Label htmlFor="user-search">Zoek Gebruiker</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="user-search"
                placeholder="Zoek op gebruikersnaam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* User Selection */}
          <div className="max-h-48 overflow-y-auto border rounded-md">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Laden...</div>
            ) : users?.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Geen gebruikers gevonden
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {users?.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-muted ${
                      selectedUser?.id === user.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => {
                      setSelectedUser(user);
                      setBusinessName(user.display_name || user.username);
                    }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">
                        {user.display_name || user.username}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{user.username}
                      </div>
                    </div>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected User Details */}
          {selectedUser && (
            <div className="space-y-4 p-4 border rounded-md bg-muted/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatar_url} />
                  <AvatarFallback>
                    {selectedUser.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {selectedUser.display_name || selectedUser.username}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @{selectedUser.username}
                  </div>
                </div>
                <Badge variant="outline">{selectedUser.role}</Badge>
              </div>

              <div>
                <Label htmlFor="business-name">Bedrijfsnaam *</Label>
                <Input
                  id="business-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Voer bedrijfsnaam in..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Beschrijving (optioneel)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschrijf de leverancier..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuleren
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={!selectedUser || !businessName.trim() || assignSupplierMutation.isPending}
          >
            {assignSupplierMutation.isPending ? 'Toewijzen...' : 'Leverancier Toewijzen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}