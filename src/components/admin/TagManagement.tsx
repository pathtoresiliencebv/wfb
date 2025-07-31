import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Tag, MoreHorizontal, Edit, Trash2, TrendingUp, Hash } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

interface TagData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export function TagManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTag, setNewTag] = useState({
    name: '',
    description: '',
    color: '#10b981'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tags
  const { data: tags, isLoading } = useQuery({
    queryKey: ['admin-tags', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('tags')
        .select('*')
        .order('usage_count', { ascending: false });

      if (searchQuery.trim()) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TagData[];
    },
  });

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: async (tagData: typeof newTag) => {
      const slug = tagData.name.toLowerCase().replace(/\s+/g, '-');
      
      const { error } = await supabase
        .from('tags')
        .insert({
          name: tagData.name,
          slug,
          description: tagData.description,
          color: tagData.color,
          usage_count: 0
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      setIsCreateDialogOpen(false);
      setNewTag({ name: '', description: '', color: '#10b981' });
      toast({ title: 'Tag aangemaakt' });
    },
    onError: () => {
      toast({ 
        title: 'Fout', 
        description: 'Kon tag niet aanmaken',
        variant: 'destructive' 
      });
    },
  });

  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TagData> }) => {
      if (updates.name) {
        updates.slug = updates.name.toLowerCase().replace(/\s+/g, '-');
      }
      
      const { error } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      setEditingTag(null);
      toast({ title: 'Tag bijgewerkt' });
    },
    onError: () => {
      toast({ 
        title: 'Fout', 
        description: 'Kon tag niet bijwerken',
        variant: 'destructive' 
      });
    },
  });

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: async (id: string) => {
      // First delete related topic_tags
      await supabase
        .from('topic_tags')
        .delete()
        .eq('tag_id', id);
      
      // Then delete the tag
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      toast({ title: 'Tag verwijderd' });
    },
    onError: () => {
      toast({ 
        title: 'Fout', 
        description: 'Kon tag niet verwijderen',
        variant: 'destructive' 
      });
    },
  });

  // Merge tags mutation
  const mergeTagsMutation = useMutation({
    mutationFn: async ({ sourceId, targetId }: { sourceId: string; targetId: string }) => {
      // Update all topic_tags to use the target tag
      await supabase
        .from('topic_tags')
        .update({ tag_id: targetId })
        .eq('tag_id', sourceId);
      
      // Delete the source tag
      await supabase
        .from('tags')
        .delete()
        .eq('id', sourceId);
      
      // Update target tag usage count
      const { data: topicTags } = await supabase
        .from('topic_tags')
        .select('id')
        .eq('tag_id', targetId);
      
      await supabase
        .from('tags')
        .update({ usage_count: topicTags?.length || 0 })
        .eq('id', targetId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      toast({ title: 'Tags samengevoegd' });
    },
    onError: () => {
      toast({ 
        title: 'Fout', 
        description: 'Kon tags niet samenvoegen',
        variant: 'destructive' 
      });
    },
  });

  const handleCreateTag = () => {
    if (!newTag.name.trim()) {
      toast({ 
        title: 'Fout', 
        description: 'Tag naam is verplicht',
        variant: 'destructive' 
      });
      return;
    }
    createTagMutation.mutate(newTag);
  };

  const handleUpdateTag = (tag: TagData, updates: Partial<TagData>) => {
    updateTagMutation.mutate({ id: tag.id, updates });
  };

  const filteredTags = tags?.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tag Beheer
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nieuwe Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nieuwe Tag Aanmaken</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Naam</Label>
                  <Input
                    id="name"
                    value={newTag.name}
                    onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                    placeholder="Tag naam"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Beschrijving</Label>
                  <Textarea
                    id="description"
                    value={newTag.description}
                    onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                    placeholder="Tag beschrijving"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Kleur</Label>
                  <Input
                    id="color"
                    type="color"
                    value={newTag.color}
                    onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuleren
                  </Button>
                  <Button onClick={handleCreateTag}>
                    Aanmaken
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4">
          <Input
            placeholder="Zoek tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        {/* Popular Tags Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Populaire Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags
              ?.filter(tag => tag.usage_count > 0)
              .slice(0, 10)
              .map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="px-3 py-1"
                  style={{ 
                    backgroundColor: tag.color + '20',
                    borderColor: tag.color 
                  }}
                >
                  <Hash className="h-3 w-3 mr-1" />
                  {tag.name} ({tag.usage_count})
                </Badge>
              ))}
          </div>
        </div>

        {/* Tags Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Beschrijving</TableHead>
                <TableHead>Gebruik</TableHead>
                <TableHead>Aangemaakt</TableHead>
                <TableHead className="w-[100px]">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTags?.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-sm" 
                        style={{ backgroundColor: tag.color }}
                      />
                      <div>
                        <div className="font-medium">#{tag.name}</div>
                        <div className="text-sm text-muted-foreground">{tag.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md truncate">
                      {tag.description || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{tag.usage_count} topics</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(tag.created_at), { 
                        addSuffix: true,
                        locale: nl 
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingTag(tag)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Bewerken
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Verwijderen
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tag verwijderen</AlertDialogTitle>
                              <AlertDialogDescription>
                                Weet je zeker dat je "#{tag.name}" wilt verwijderen? 
                                Deze tag wordt verwijderd van alle topics.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuleren</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => deleteTagMutation.mutate(tag.id)}
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

        {filteredTags?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Geen tags gevonden</p>
          </div>
        )}

        {/* Edit Tag Dialog */}
        {editingTag && (
          <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tag Bewerken</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Naam</Label>
                  <Input
                    id="edit-name"
                    value={editingTag.name}
                    onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Beschrijving</Label>
                  <Textarea
                    id="edit-description"
                    value={editingTag.description || ''}
                    onChange={(e) => setEditingTag({ ...editingTag, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-color">Kleur</Label>
                  <Input
                    id="edit-color"
                    type="color"
                    value={editingTag.color}
                    onChange={(e) => setEditingTag({ ...editingTag, color: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingTag(null)}>
                    Annuleren
                  </Button>
                  <Button onClick={() => handleUpdateTag(editingTag, editingTag)}>
                    Opslaan
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}