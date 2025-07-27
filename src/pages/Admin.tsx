import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Users, MessageSquare, Shield, TrendingUp, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadingState } from '@/components/ui/loading-spinner';

interface Report {
  id: string;
  reporter_id: string;
  reported_item_id: string;
  reported_item_type: string;
  reason: string;
  description: string;
  status: string;
  created_at: string;
  reporter?: {
    username: string;
  };
}

interface User {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  role: string;
  reputation: number;
  is_verified: boolean;
  created_at: string;
}

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<string>('');

  // Check if user has admin/moderator access
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Geen toegang</h2>
            <p className="text-muted-foreground">
              Je hebt geen beheerderrechten om deze pagina te bekijken.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch reports
  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          profiles!reports_reporter_id_fkey(username)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    },
  });

  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as User[];
    },
  });

  // Update report status
  const updateReportMutation = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: string }) => {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status, 
          resolved_by: user?.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', reportId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast({ title: 'Rapport status bijgewerkt' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: 'Kon rapport status niet bijwerken',
        variant: 'destructive' 
      });
    },
  });

  // Update user role
  const updateUserRoleMutation = useMutation({
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
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: 'Kon gebruikersrol niet bijwerken',
        variant: 'destructive' 
      });
    },
  });

  const handleUpdateReport = (reportId: string, status: string) => {
    updateReportMutation.mutate({ reportId, status });
  };

  const handleUpdateUserRole = (userId: string, role: string) => {
    updateUserRoleMutation.mutate({ userId, role });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Beheer Panel</h1>
        <Badge variant="secondary" className="text-sm">
          Beheer Panel
        </Badge>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Rapporten
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Gebruikers
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerapporteerde Content</CardTitle>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <LoadingState text="Rapporten laden..." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rapporteur</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reden</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports?.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.profiles?.username}</TableCell>
                        <TableCell className="capitalize">{report.reported_item_type}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              report.status === 'resolved' ? 'default' : 
                              report.status === 'rejected' ? 'destructive' : 
                              'secondary'
                            }
                          >
                            {report.status === 'pending' ? 'In behandeling' :
                             report.status === 'resolved' ? 'Opgelost' :
                             'Afgewezen'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(report.created_at).toLocaleDateString('nl-NL')}
                        </TableCell>
                        <TableCell className="space-x-2">
                          {report.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateReport(report.id, 'resolved')}
                                disabled={updateReportMutation.isPending}
                              >
                                Oplossen
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUpdateReport(report.id, 'rejected')}
                                disabled={updateReportMutation.isPending}
                              >
                                Afwijzen
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gebruikersbeheer</CardTitle>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <LoadingState text="Gebruikers laden..." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gebruikersnaam</TableHead>
                      <TableHead>Weergavenaam</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Reputatie</TableHead>
                      <TableHead>Geverifieerd</TableHead>
                      <TableHead>Lid sinds</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.display_name}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              user.role === 'admin' ? 'default' :
                              user.role === 'moderator' ? 'secondary' :
                              'outline'
                            }
                          >
                            {user.role === 'admin' ? 'Beheerder' :
                             user.role === 'moderator' ? 'Moderator' :
                             'Gebruiker'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.reputation}</TableCell>
                        <TableCell>
                          {user.is_verified ? '✅' : '❌'}
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('nl-NL')}
                        </TableCell>
                        <TableCell>
                          {user.user_id !== user?.id && (
                            <Select 
                              onValueChange={(role) => handleUpdateUserRole(user.user_id, role)}
                              defaultValue={user.role}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">Gebruiker</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="admin">Beheerder</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Totaal Gebruikers</span>
                </div>
                <p className="text-2xl font-bold">{users?.length || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Open Rapporten</span>
                </div>
                <p className="text-2xl font-bold">
                  {reports?.filter(r => r.status === 'pending').length || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Moderators</span>
                </div>
                <p className="text-2xl font-bold">
                  {users?.filter(u => ['admin', 'moderator'].includes(u.role)).length || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Avg. Reputatie</span>
                </div>
                <p className="text-2xl font-bold">
                  {users?.length ? Math.round(users.reduce((acc, u) => acc + u.reputation, 0) / users.length) : 0}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}