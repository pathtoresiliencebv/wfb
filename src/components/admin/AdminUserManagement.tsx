import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, Search, Filter, MoreHorizontal, Shield, UserCheck, UserX, Crown, Trash2, Ban, CheckCircle, XCircle, Store } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface User {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  role: string;
  reputation: number;
  is_verified: boolean;
  created_at: string;
  avatar_url?: string;
  bio?: string;
}

export function AdminUserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users with filters
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchQuery, roleFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`);
      }

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Apply status filter client-side
      let filteredData = data || [];
      if (statusFilter === 'verified') {
        filteredData = filteredData.filter(user => user.is_verified);
      } else if (statusFilter === 'unverified') {
        filteredData = filteredData.filter(user => !user.is_verified);
      }

      return filteredData as User[];
    },
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('user_id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'Gebruikersrol bijgewerkt' });
    },
    onError: () => {
      toast({ 
        title: 'Fout', 
        description: 'Kon gebruikersrol niet bijwerken',
        variant: 'destructive' 
      });
    },
  });

  // Toggle verification mutation
  const toggleVerificationMutation = useMutation({
    mutationFn: async ({ userId, verified }: { userId: string; verified: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: verified })
        .eq('user_id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'Verificatiestatus bijgewerkt' });
    },
    onError: () => {
      toast({ 
        title: 'Fout', 
        description: 'Kon verificatiestatus niet bijwerken',
        variant: 'destructive' 
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'Gebruiker verwijderd' });
    },
    onError: () => {
      toast({ 
        title: 'Fout', 
        description: 'Kon gebruiker niet verwijderen',
        variant: 'destructive' 
      });
    },
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500 text-white';
      case 'moderator': return 'bg-blue-500 text-white';
      case 'supplier': return 'bg-purple-500 text-white';
      case 'verified': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3" />;
      case 'moderator': return <Shield className="h-3 w-3" />;
      case 'supplier': return <Store className="h-3 w-3" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gebruikers Beheer
        </CardTitle>
        <CardDescription>
          Beheer gebruikersaccounts, rollen en verificaties
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoek gebruikers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter op rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle rollen</SelectItem>
              <SelectItem value="admin">Beheerders</SelectItem>
              <SelectItem value="moderator">Moderators</SelectItem>
              <SelectItem value="supplier">Leveranciers</SelectItem>
              <SelectItem value="verified">Geverifieerd</SelectItem>
              <SelectItem value="user">Gebruikers</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter op status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle statussen</SelectItem>
              <SelectItem value="verified">Geverifieerd</SelectItem>
              <SelectItem value="unverified">Niet geverifieerd</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gebruiker</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Reputatie</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lid sinds</TableHead>
                <TableHead className="w-[100px]">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.display_name || user.username}</div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      <div className="flex items-center gap-1">
                        {getRoleIcon(user.role)}
                        {user.role}
                      </div>
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium">{user.reputation}</span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {user.is_verified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">
                        {user.is_verified ? 'Geverifieerd' : 'Niet geverifieerd'}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.created_at), { 
                        addSuffix: true,
                        locale: nl 
                      })}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Gebruiker verwijderen</AlertDialogTitle>
                            <AlertDialogDescription>
                              Weet je zeker dat je {user.username} wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteUserMutation.mutate(user.user_id)}
                            >
                              Verwijderen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => toggleVerificationMutation.mutate({
                            userId: user.user_id,
                            verified: !user.is_verified
                          })}
                        >
                          {user.is_verified ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Verificatie intrekken
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Verifiëren
                            </>
                          )}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          onClick={() => updateRoleMutation.mutate({
                            userId: user.user_id,
                            role: user.role === 'moderator' ? 'user' : 'moderator'
                          })}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          {user.role === 'moderator' ? 'Moderator rechten intrekken' : 'Maak moderator'}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => updateRoleMutation.mutate({
                            userId: user.user_id,
                            role: user.role === 'supplier' ? 'user' : 'supplier'
                          })}
                        >
                          <Store className="h-4 w-4 mr-2" />
                          {user.role === 'supplier' ? 'Leverancier rechten intrekken' : 'Maak leverancier'}
                        </DropdownMenuItem>
                        
                        {user.role !== 'admin' && (
                          <DropdownMenuItem 
                            onClick={() => updateRoleMutation.mutate({
                              userId: user.user_id,
                              role: user.role === 'admin' ? 'user' : 'admin'
                            })}
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            Maak beheerder
                          </DropdownMenuItem>
                        )}
                        
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {users?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Geen gebruikers gevonden</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}