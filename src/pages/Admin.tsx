import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Users, MessageSquare, Shield, TrendingUp, Eye, Settings, FileText, Activity, Database, Search, Filter, MoreHorizontal, Calendar, BarChart3, Download, Trash2, Lock, Unlock, UserCheck, UserX, Star, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadingState } from '@/components/ui/loading-spinner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { SecurityMonitor } from '@/components/security/SecurityMonitor';

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
  bio?: string;
  avatar_url?: string;
}

interface Topic {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  view_count: number;
  created_at: string;
  last_activity_at: string;
  profiles: {
    username: string;
    display_name: string;
  };
  categories: {
    name: string;
    color: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_values: any;
  new_values: any;
  created_at: string;
  profiles?: {
    username: string;
  } | null;
}

function AdminContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

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

  // Fetch users with filtering
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', searchQuery, filterRole],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (searchQuery) {
        query = query.or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`);
      }
      
      if (filterRole !== 'all') {
        query = query.eq('role', filterRole);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as User[];
    },
  });

  // Fetch topics
  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['admin-topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select(`
          *,
          profiles!topics_author_id_fkey(username, display_name),
          categories!topics_category_id_fkey(name, color)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as Topic[];
    },
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch audit logs
  const { data: auditLogs, isLoading: auditLoading } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles!audit_logs_user_id_fkey(username)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as any[];
    },
  });

  // Fetch platform stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersCount, topicsCount, repliesCount, reportsCount] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('topics').select('*', { count: 'exact', head: true }),
        supabase.from('replies').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      return {
        totalUsers: usersCount.count || 0,
        totalTopics: topicsCount.count || 0,
        totalReplies: repliesCount.count || 0,
        pendingReports: reportsCount.count || 0
      };
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

  // Bulk user actions
  const bulkUserActionMutation = useMutation({
    mutationFn: async ({ userIds, action, value }: { userIds: string[]; action: string; value?: any }) => {
      for (const userId of userIds) {
        if (action === 'delete') {
          const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
          if (error) throw error;
        } else if (action === 'verify') {
          const { error } = await supabase.from('profiles').update({ is_verified: true }).eq('user_id', userId);
          if (error) throw error;
        } else if (action === 'unverify') {
          const { error } = await supabase.from('profiles').update({ is_verified: false }).eq('user_id', userId);
          if (error) throw error;
        } else if (action === 'role') {
          const { error } = await supabase.from('profiles').update({ role: value }).eq('user_id', userId);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSelectedUsers([]);
      toast({ title: 'Bulk actie voltooid' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Bulk actie gefaald', variant: 'destructive' });
    },
  });

  // Topic actions
  const topicActionMutation = useMutation({
    mutationFn: async ({ topicId, action }: { topicId: string; action: string }) => {
      if (action === 'pin') {
        const { error } = await supabase.from('topics').update({ is_pinned: true }).eq('id', topicId);
        if (error) throw error;
      } else if (action === 'unpin') {
        const { error } = await supabase.from('topics').update({ is_pinned: false }).eq('id', topicId);
        if (error) throw error;
      } else if (action === 'lock') {
        const { error } = await supabase.from('topics').update({ is_locked: true }).eq('id', topicId);
        if (error) throw error;
      } else if (action === 'unlock') {
        const { error } = await supabase.from('topics').update({ is_locked: false }).eq('id', topicId);
        if (error) throw error;
      } else if (action === 'delete') {
        const { error } = await supabase.from('topics').delete().eq('id', topicId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-topics'] });
      toast({ title: 'Topic actie voltooid' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Topic actie gefaald', variant: 'destructive' });
    },
  });

  // Create category
  const createCategoryMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { error } = await supabase.from('categories').insert({
        name,
        slug,
        description,
        color: '#3b82f6',
        icon: 'MessageSquare',
        is_active: true,
        sort_order: (categories?.length || 0) + 1
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setNewCategoryName('');
      setNewCategoryDescription('');
      toast({ title: 'Categorie aangemaakt' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Kon categorie niet aanmaken', variant: 'destructive' });
    },
  });

  const filteredUsers = users?.filter(u => {
    if (filterStatus === 'verified' && !u.is_verified) return false;
    if (filterStatus === 'unverified' && u.is_verified) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Beheer Panel</h1>
        <Badge variant="secondary" className="text-sm">
          Beheer Panel
        </Badge>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Gebruikers
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Categorieën
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Rapporten
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Audit Log
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            Systeem
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Totaal Gebruikers</span>
                </div>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Totaal Topics</span>
                </div>
                <p className="text-2xl font-bold">{stats?.totalTopics || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Totaal Reacties</span>
                </div>
                <p className="text-2xl font-bold">{stats?.totalReplies || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Openstaande Rapporten</span>
                </div>
                <p className="text-2xl font-bold">{stats?.pendingReports || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Aangemaakte Topics</CardTitle>
              </CardHeader>
              <CardContent>
                {topicsLoading ? (
                  <LoadingState text="Topics laden..." />
                ) : (
                  <div className="space-y-3">
                    {topics?.slice(0, 5).map((topic) => (
                      <div key={topic.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium truncate">{topic.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            door {topic.profiles?.username} • {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: nl })}
                          </p>
                        </div>
                        <Badge variant="secondary">{topic.reply_count} reacties</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nieuwe Gebruikers</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <LoadingState text="Gebruikers laden..." />
                ) : (
                  <div className="space-y-3">
                    {users?.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{user.username}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: nl })}
                            </p>
                          </div>
                        </div>
                        <Badge variant={user.is_verified ? 'default' : 'secondary'}>
                          {user.is_verified ? 'Geverifieerd' : 'Niet geverifieerd'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gebruikersbeheer</CardTitle>
                <div className="flex items-center space-x-2">
                  {selectedUsers.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Bulk Acties ({selectedUsers.length})
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => bulkUserActionMutation.mutate({ userIds: selectedUsers, action: 'verify' })}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Verifiëren
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => bulkUserActionMutation.mutate({ userIds: selectedUsers, action: 'unverify' })}>
                          <UserX className="h-4 w-4 mr-2" />
                          Verificatie intrekken
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => bulkUserActionMutation.mutate({ userIds: selectedUsers, action: 'role', value: 'moderator' })}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Maak moderator
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Verwijderen
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Gebruikers verwijderen</AlertDialogTitle>
                              <AlertDialogDescription>
                                Weet je zeker dat je {selectedUsers.length} gebruiker(s) wilt verwijderen? Deze actie kan niet ongedaan gemaakt worden.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuleren</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => bulkUserActionMutation.mutate({ userIds: selectedUsers, action: 'delete' })}
                              >
                                Verwijderen
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Zoek gebruikers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle rollen</SelectItem>
                    <SelectItem value="user">Gebruiker</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Beheerder</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle statussen</SelectItem>
                    <SelectItem value="verified">Geverifieerd</SelectItem>
                    <SelectItem value="unverified">Niet geverifieerd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <LoadingState text="Gebruikers laden..." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedUsers.length === filteredUsers?.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers(filteredUsers?.map(u => u.user_id) || []);
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Gebruiker</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Reputatie</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Lid sinds</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.user_id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedUsers([...selectedUsers, user.user_id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== user.user_id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-sm text-muted-foreground">{user.display_name}</div>
                            </div>
                          </div>
                        </TableCell>
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
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{user.reputation}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_verified ? 'default' : 'secondary'}>
                            {user.is_verified ? 'Geverifieerd' : 'Niet geverifieerd'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: nl })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Bekijk profiel
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => bulkUserActionMutation.mutate({ 
                                  userIds: [user.user_id], 
                                  action: user.is_verified ? 'unverify' : 'verify' 
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
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content Beheer</CardTitle>
                <div className="flex items-center space-x-2">
                  {selectedTopics.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Bulk Acties ({selectedTopics.length})
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                          selectedTopics.forEach(id => topicActionMutation.mutate({ topicId: id, action: 'pin' }));
                          setSelectedTopics([]);
                        }}>
                          <FileText className="h-4 w-4 mr-2" />
                          Vastprikken
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          selectedTopics.forEach(id => topicActionMutation.mutate({ topicId: id, action: 'lock' }));
                          setSelectedTopics([]);
                        }}>
                          <Lock className="h-4 w-4 mr-2" />
                          Vergrendelen
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Verwijderen
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Topics verwijderen</AlertDialogTitle>
                              <AlertDialogDescription>
                                Weet je zeker dat je {selectedTopics.length} topic(s) wilt verwijderen? Deze actie kan niet ongedaan gemaakt worden.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuleren</AlertDialogCancel>
                              <AlertDialogAction onClick={() => {
                                selectedTopics.forEach(id => topicActionMutation.mutate({ topicId: id, action: 'delete' }));
                                setSelectedTopics([]);
                              }}>
                                Verwijderen
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {topicsLoading ? (
                <LoadingState text="Topics laden..." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedTopics.length === topics?.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTopics(topics?.map(t => t.id) || []);
                            } else {
                              setSelectedTopics([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Titel</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead>Categorie</TableHead>
                      <TableHead>Reacties</TableHead>
                      <TableHead>Weergaven</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topics?.map((topic) => (
                      <TableRow key={topic.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedTopics.includes(topic.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTopics([...selectedTopics, topic.id]);
                              } else {
                                setSelectedTopics(selectedTopics.filter(id => id !== topic.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="max-w-60">
                            <div className="font-medium truncate">{topic.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {topic.is_pinned && <Badge variant="secondary" className="mr-1">Vastgepind</Badge>}
                              {topic.is_locked && <Badge variant="destructive" className="mr-1">Vergrendeld</Badge>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{topic.profiles?.username}</TableCell>
                        <TableCell>
                          <Badge style={{ backgroundColor: topic.categories?.color, color: 'white' }}>
                            {topic.categories?.name}
                          </Badge>
                        </TableCell>
                        <TableCell>{topic.reply_count}</TableCell>
                        <TableCell>{topic.view_count}</TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            {topic.is_pinned && <Badge variant="secondary" className="text-xs">Vastgepind</Badge>}
                            {topic.is_locked && <Badge variant="destructive" className="text-xs">Vergrendeld</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: nl })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Bekijk topic
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => topicActionMutation.mutate({ 
                                  topicId: topic.id, 
                                  action: topic.is_pinned ? 'unpin' : 'pin' 
                                })}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                {topic.is_pinned ? 'Losmaken' : 'Vastprikken'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => topicActionMutation.mutate({ 
                                  topicId: topic.id, 
                                  action: topic.is_locked ? 'unlock' : 'lock' 
                                })}
                              >
                                {topic.is_locked ? (
                                  <>
                                    <Unlock className="h-4 w-4 mr-2" />
                                    Ontgrendelen
                                  </>
                                ) : (
                                  <>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Vergrendelen
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => topicActionMutation.mutate({ topicId: topic.id, action: 'delete' })}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Verwijderen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categorieën Beheer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Bestaande Categorieën</h3>
                  {categoriesLoading ? (
                    <LoadingState text="Categorieën laden..." />
                  ) : (
                    <div className="space-y-3">
                      {categories?.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            <div>
                              <h4 className="font-medium">{category.name}</h4>
                              <p className="text-sm text-muted-foreground">{category.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={category.is_active ? 'default' : 'secondary'}>
                              {category.is_active ? 'Actief' : 'Inactief'}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Bewerken
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Verwijderen
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Nieuwe Categorie Toevoegen</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Naam</label>
                      <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Categorie naam"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Beschrijving</label>
                      <Textarea
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                        placeholder="Categorie beschrijving"
                      />
                    </div>
                    <Button 
                      onClick={() => createCategoryMutation.mutate({ 
                        name: newCategoryName, 
                        description: newCategoryDescription 
                      })}
                      disabled={!newCategoryName || createCategoryMutation.isPending}
                      className="w-full"
                    >
                      Categorie Aanmaken
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                      <TableHead>Beschrijving</TableHead>
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
                          <div className="max-w-40 truncate" title={report.description}>
                            {report.description}
                          </div>
                        </TableCell>
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
                          {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: nl })}
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

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              {auditLoading ? (
                <LoadingState text="Audit logs laden..." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gebruiker</TableHead>
                      <TableHead>Actie</TableHead>
                      <TableHead>Tabel</TableHead>
                      <TableHead>Record ID</TableHead>
                      <TableHead>Datum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.profiles?.username || 'Systeem'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.table_name}</TableCell>
                        <TableCell className="font-mono text-sm">{log.record_id?.slice(0, 8)}...</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: nl })}
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
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Totaal Gebruikers</span>
                </div>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Open Rapporten</span>
                </div>
                <p className="text-2xl font-bold">{stats?.pendingReports || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-500" />
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
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Avg. Reputatie</span>
                </div>
                <p className="text-2xl font-bold">
                  {users?.length ? Math.round(users.reduce((acc, u) => acc + u.reputation, 0) / users.length) : 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gebruikersrollen Verdeling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['user', 'moderator', 'admin'].map((role) => {
                    const count = users?.filter(u => u.role === role).length || 0;
                    const percentage = users?.length ? Math.round((count / users.length) * 100) : 0;
                    return (
                      <div key={role} className="flex items-center justify-between">
                        <span className="capitalize">{role === 'user' ? 'Gebruikers' : role === 'moderator' ? 'Moderators' : 'Beheerders'}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="h-2 bg-primary rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count} ({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Activiteit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Geverifieerde Gebruikers</span>
                    <Badge variant="default">
                      {users?.filter(u => u.is_verified).length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Actieve Categorieën</span>
                    <Badge variant="secondary">
                      {categories?.filter(c => c.is_active).length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vastgepinde Topics</span>
                    <Badge variant="outline">
                      {topics?.filter(t => t.is_pinned).length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vergrendelde Topics</span>
                    <Badge variant="destructive">
                      {topics?.filter(t => t.is_locked).length || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Systeem Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Database className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">Database Status</h3>
                      <p className="text-sm text-muted-foreground">Alle verbindingen actief</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    <Activity className="h-4 w-4 mr-2" />
                    Controleer Status
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Download className="h-8 w-8 text-green-500" />
                    <div>
                      <h3 className="font-semibold">Data Export</h3>
                      <p className="text-sm text-muted-foreground">Exporteer platform data</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-8 w-8 text-orange-500" />
                    <div>
                      <h3 className="font-semibold">Systeem Configuratie</h3>
                      <p className="text-sm text-muted-foreground">Beheer systeeminstellingen</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configureren
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Systeemmededelingen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Systeem aankondiging voor alle gebruikers..."
                  className="min-h-24"
                />
                <div className="flex items-center justify-between">
                  <Select defaultValue="info">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Informatie</SelectItem>
                      <SelectItem value="warning">Waarschuwing</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Verstuur Mededeling
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <SecurityMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Admin() {
  return (
    <AdminRoute requireRole="moderator">
      <AdminContent />
    </AdminRoute>
  );
}