import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageSquare, Search, MoreHorizontal, Pin, Lock, Move, Trash2, Eye, User, Calendar, ArrowUpDown } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

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
    display_name?: string;
  };
  categories: {
    name: string;
    color?: string;
  };
}

interface Category {
  id: string;
  name: string;
  color?: string;
}

export function TopicManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch topics with filters
  const { data: topics, isLoading } = useQuery({
    queryKey: ['admin-topics', searchQuery, categoryFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('topics')
        .select(`
          *,
          profiles (username, display_name),
          categories (name, color)
        `)
        .order('last_activity_at', { ascending: false });

      if (searchQuery.trim()) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category_id', categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Apply status filter client-side
      let filteredData = data || [];
      if (statusFilter === 'pinned') {
        filteredData = filteredData.filter(topic => topic.is_pinned);
      } else if (statusFilter === 'locked') {
        filteredData = filteredData.filter(topic => topic.is_locked);
      }

      return filteredData as Topic[];
    },
  });

  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, color')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
  });

  // Update topic mutation
  const updateTopicMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Topic> }) => {
      const { error } = await supabase
        .from('topics')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-topics'] });
      toast({ title: 'Topic bijgewerkt' });
    },
    onError: () => {
      toast({ 
        title: 'Fout', 
        description: 'Kon topic niet bijwerken',
        variant: 'destructive' 
      });
    },
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ topicIds, updates }: { topicIds: string[]; updates: Partial<Topic> }) => {
      const { error } = await supabase
        .from('topics')
        .update(updates)
        .in('id', topicIds);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-topics'] });
      setSelectedTopics(new Set());
      toast({ title: 'Topics bijgewerkt' });
    },
    onError: () => {
      toast({ 
        title: 'Fout', 
        description: 'Kon topics niet bijwerken',
        variant: 'destructive' 
      });
    },
  });

  // Delete topic mutation
  const deleteTopicMutation = useMutation({
    mutationFn: async (topicIds: string[]) => {
      const { error } = await supabase
        .from('topics')
        .delete()
        .in('id', topicIds);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-topics'] });
      setSelectedTopics(new Set());
      toast({ title: 'Topics verwijderd' });
    },
    onError: () => {
      toast({ 
        title: 'Fout', 
        description: 'Kon topics niet verwijderen',
        variant: 'destructive' 
      });
    },
  });

  const toggleTopicSelection = (topicId: string) => {
    const newSelection = new Set(selectedTopics);
    if (newSelection.has(topicId)) {
      newSelection.delete(topicId);
    } else {
      newSelection.add(topicId);
    }
    setSelectedTopics(newSelection);
  };

  const selectAllTopics = () => {
    if (selectedTopics.size === topics?.length) {
      setSelectedTopics(new Set());
    } else {
      setSelectedTopics(new Set(topics?.map(t => t.id) || []));
    }
  };

  const handleSingleAction = (topic: Topic, action: string) => {
    const updates: Partial<Topic> = {};
    
    switch (action) {
      case 'pin':
        updates.is_pinned = !topic.is_pinned;
        break;
      case 'lock':
        updates.is_locked = !topic.is_locked;
        break;
    }
    
    updateTopicMutation.mutate({ id: topic.id, updates });
  };

  const handleBulkAction = (action: string, value?: any) => {
    if (selectedTopics.size === 0) return;
    
    const topicIds = Array.from(selectedTopics);
    const updates: Partial<Topic> = {};
    
    switch (action) {
      case 'pin':
        updates.is_pinned = true;
        break;
      case 'unpin':
        updates.is_pinned = false;
        break;
      case 'lock':
        updates.is_locked = true;
        break;
      case 'unlock':
        updates.is_locked = false;
        break;
      case 'move':
        updates.category_id = value;
        break;
      case 'delete':
        deleteTopicMutation.mutate(topicIds);
        return;
    }
    
    bulkUpdateMutation.mutate({ topicIds, updates });
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
          <MessageSquare className="h-5 w-5" />
          Topic Beheer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zoek topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter op categorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle categorieën</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter op status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle statussen</SelectItem>
              <SelectItem value="pinned">Vastgepind</SelectItem>
              <SelectItem value="locked">Vergrendeld</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedTopics.size > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
            <span className="text-sm font-medium">
              {selectedTopics.size} topic(s) geselecteerd
            </span>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('pin')}>
                <Pin className="h-3 w-3 mr-1" />
                Vastpinnen
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('lock')}>
                <Lock className="h-3 w-3 mr-1" />
                Vergrendelen
              </Button>
              <Select onValueChange={(value) => handleBulkAction('move', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Verplaats naar..." />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Verwijderen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Topics verwijderen</AlertDialogTitle>
                    <AlertDialogDescription>
                      Weet je zeker dat je {selectedTopics.size} topic(s) wilt verwijderen?
                      Deze actie kan niet ongedaan worden gemaakt.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuleren</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleBulkAction('delete')}>
                      Verwijderen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

        {/* Topics Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedTopics.size === topics?.length && topics?.length > 0}
                    onCheckedChange={selectAllTopics}
                  />
                </TableHead>
                <TableHead>Titel</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Statistieken</TableHead>
                <TableHead>Laatste activiteit</TableHead>
                <TableHead className="w-[100px]">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics?.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTopics.has(topic.id)}
                      onCheckedChange={() => toggleTopicSelection(topic.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <div className="font-medium truncate">{topic.title}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {topic.content.substring(0, 100)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">
                        {topic.profiles.display_name || topic.profiles.username}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      style={{ 
                        backgroundColor: topic.categories.color + '20',
                        borderColor: topic.categories.color 
                      }}
                    >
                      {topic.categories.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {topic.is_pinned && (
                        <Badge variant="secondary" className="text-xs">
                          <Pin className="h-3 w-3 mr-1" />
                          Vastgepind
                        </Badge>
                      )}
                      {topic.is_locked && (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Vergrendeld
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span>{topic.reply_count} replies</span>
                      <span>{topic.view_count} views</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(topic.last_activity_at), {
                          addSuffix: true,
                          locale: nl
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(`https://wfb.pathtoresilience.dev/topic/${topic.id}`, '_blank', 'noopener,noreferrer')}>
                          <Eye className="h-4 w-4 mr-2" />
                          Bekijken
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSingleAction(topic, 'pin')}>
                          <Pin className="h-4 w-4 mr-2" />
                          {topic.is_pinned ? 'Losmaken' : 'Vastpinnen'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSingleAction(topic, 'lock')}>
                          <Lock className="h-4 w-4 mr-2" />
                          {topic.is_locked ? 'Ontgrendelen' : 'Vergrendelen'}
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
                              <AlertDialogTitle>Topic verwijderen</AlertDialogTitle>
                              <AlertDialogDescription>
                                Weet je zeker dat je "{topic.title}" wilt verwijderen?
                                Deze actie kan niet ongedaan worden gemaakt.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuleren</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => deleteTopicMutation.mutate([topic.id])}
                              >
                                Verwijderen
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {topics?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Geen topics gevonden</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}