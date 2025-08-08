import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Folder, Tag, Plus, Edit, Trash2, Save, X, 
  MessageSquare, TrendingUp, Eye, Settings, Hash, Image
} from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  color: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  topic_count: number;
  reply_count: number;
  created_at: string;
}

interface TagData {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  color: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export default function AdminCategories() {
  const [activeTab, setActiveTab] = useState('categories');
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    slug: '',
    color: '#10b981',
    icon: 'folder',
    image_url: '',
    sort_order: 0
  });

  const [newTag, setNewTag] = useState({
    name: '',
    description: '',
    slug: '',
    color: '#10b981'
  });

  const queryClient = useQueryClient();

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
    }
  });

  // Fetch tags
  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ['admin-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return data as TagData[];
    }
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: typeof newCategory) => {
      const { error } = await supabase
        .from('categories')
        .insert([{
          ...categoryData,
          is_active: true,
          topic_count: 0,
          reply_count: 0
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Categorie aangemaakt');
      setIsCreateCategoryOpen(false);
      setNewCategory({ name: '', description: '', slug: '', color: '#10b981', icon: 'folder', image_url: '', sort_order: 0 });
    },
    onError: (error) => {
      toast.error('Fout bij aanmaken categorie');
      console.error('Error creating category:', error);
    }
  });

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: async (tagData: typeof newTag) => {
      const { error } = await supabase
        .from('tags')
        .insert([{
          ...tagData,
          usage_count: 0
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      toast.success('Tag aangemaakt');
      setIsCreateTagOpen(false);
      setNewTag({ name: '', description: '', slug: '', color: '#10b981' });
    },
    onError: (error) => {
      toast.error('Fout bij aanmaken tag');
      console.error('Error creating tag:', error);
    }
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Category> & { id: string }) => {
      const { error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Categorie bijgewerkt');
      setEditingCategory(null);
    },
    onError: (error) => {
      toast.error('Fout bij bijwerken categorie');
      console.error('Error updating category:', error);
    }
  });

  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<TagData> & { id: string }) => {
      const { error } = await supabase
        .from('tags')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      toast.success('Tag bijgewerkt');
      setEditingTag(null);
    },
    onError: (error) => {
      toast.error('Fout bij bijwerken tag');
      console.error('Error updating tag:', error);
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Categorie verwijderd');
    },
    onError: (error) => {
      toast.error('Fout bij verwijderen categorie');
      console.error('Error deleting category:', error);
    }
  });

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tags'] });
      toast.success('Tag verwijderd');
    },
    onError: (error) => {
      toast.error('Fout bij verwijderen tag');
      console.error('Error deleting tag:', error);
    }
  });

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const totalCategories = categories?.length || 0;
  const activeCategories = categories?.filter(c => c.is_active).length || 0;
  const totalTags = tags?.length || 0;
  const totalTopics = categories?.reduce((sum, cat) => sum + cat.topic_count, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories & Tags</h1>
          <p className="text-muted-foreground">Beheer forum structuur en organisatie</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorieën</CardTitle>
            <Folder className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">{activeCategories} actief</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags</CardTitle>
            <Tag className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTags}</div>
            <p className="text-xs text-muted-foreground">Beschikbare labels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Topics</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTopics}</div>
            <p className="text-xs text-muted-foreground">Over alle categorieën</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meest Gebruikt</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tags?.[0]?.usage_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {tags?.[0]?.name || 'Geen tags'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="categories">Categorieën</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Forum Categorieën</h2>
            <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nieuwe Categorie
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Categorie Aanmaken</DialogTitle>
                  <DialogDescription>
                    Maak een nieuwe forum categorie aan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cat-name">Naam</Label>
                    <Input
                      id="cat-name"
                      value={newCategory.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setNewCategory(prev => ({
                          ...prev,
                          name,
                          slug: generateSlug(name)
                        }));
                      }}
                      placeholder="Categorie naam"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cat-slug">Slug</Label>
                    <Input
                      id="cat-slug"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="categorie-slug"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cat-description">Beschrijving</Label>
                    <Textarea
                      id="cat-description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Beschrijving van de categorie"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cat-color">Kleur</Label>
                    <Input
                      id="cat-color"
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Categorie Afbeelding</Label>
                    <ImageUpload
                      value={newCategory.image_url}
                      onImageUploaded={(url) => setNewCategory(prev => ({ ...prev, image_url: url }))}
                      onImageRemoved={() => setNewCategory(prev => ({ ...prev, image_url: '' }))}
                      showPreview={true}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>
                    Annuleren
                  </Button>
                  <Button 
                    onClick={() => createCategoryMutation.mutate(newCategory)}
                    disabled={createCategoryMutation.isPending || !newCategory.name}
                  >
                    Aanmaken
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              {categoriesLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Afbeelding</TableHead>
                      <TableHead>Naam</TableHead>
                      <TableHead>Beschrijving</TableHead>
                      <TableHead>Topics</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories?.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                            {category.image_url ? (
                              <img 
                                src={category.image_url} 
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Image className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color || '#10b981' }}
                            />
                            <div>
                              <div className="font-medium">{category.name}</div>
                              <div className="text-sm text-muted-foreground">/{category.slug}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {category.description || 'Geen beschrijving'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            {category.topic_count}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={category.is_active ? 'default' : 'secondary'}>
                            {category.is_active ? 'Actief' : 'Inactief'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Categorie Verwijderen</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Weet je zeker dat je "{category.name}" wilt verwijderen? 
                                    Deze actie kan niet ongedaan worden gemaakt.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteCategoryMutation.mutate(category.id)}
                                  >
                                    Verwijderen
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Content Tags</h2>
            <Dialog open={isCreateTagOpen} onOpenChange={setIsCreateTagOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nieuwe Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tag Aanmaken</DialogTitle>
                  <DialogDescription>
                    Maak een nieuwe content tag aan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tag-name">Naam</Label>
                    <Input
                      id="tag-name"
                      value={newTag.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setNewTag(prev => ({
                          ...prev,
                          name,
                          slug: generateSlug(name)
                        }));
                      }}
                      placeholder="Tag naam"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tag-slug">Slug</Label>
                    <Input
                      id="tag-slug"
                      value={newTag.slug}
                      onChange={(e) => setNewTag(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="tag-slug"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tag-description">Beschrijving</Label>
                    <Textarea
                      id="tag-description"
                      value={newTag.description}
                      onChange={(e) => setNewTag(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Beschrijving van de tag"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tag-color">Kleur</Label>
                    <Input
                      id="tag-color"
                      type="color"
                      value={newTag.color}
                      onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateTagOpen(false)}>
                    Annuleren
                  </Button>
                  <Button 
                    onClick={() => createTagMutation.mutate(newTag)}
                    disabled={createTagMutation.isPending || !newTag.name}
                  >
                    Aanmaken
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              {tagsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Naam</TableHead>
                      <TableHead>Beschrijving</TableHead>
                      <TableHead>Gebruik</TableHead>
                      <TableHead>Aangemaakt</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags?.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Badge 
                              style={{ backgroundColor: tag.color }}
                              className="text-white"
                            >
                              <Hash className="h-3 w-3 mr-1" />
                              {tag.name}
                            </Badge>
                            <div className="text-sm text-muted-foreground">/{tag.slug}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {tag.description || 'Geen beschrijving'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            {tag.usage_count}x gebruikt
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(tag.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingTag(tag)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Tag Verwijderen</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Weet je zeker dat je "#{tag.name}" wilt verwijderen? 
                                    Deze actie kan niet ongedaan worden gemaakt.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteTagMutation.mutate(tag.id)}
                                  >
                                    Verwijderen
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Category Dialog */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Categorie Bewerken</DialogTitle>
              <DialogDescription>
                Bewerk de instellingen van "{editingCategory.name}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Naam</Label>
                <Input
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )}
                />
              </div>
              <div>
                <Label>Beschrijving</Label>
                <Textarea
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                />
              </div>
              <div>
                <Label>Categorie Afbeelding</Label>
                <ImageUpload
                  value={editingCategory.image_url || ''}
                  onImageUploaded={(url) => setEditingCategory(prev => 
                    prev ? { ...prev, image_url: url } : null
                  )}
                  onImageRemoved={() => setEditingCategory(prev => 
                    prev ? { ...prev, image_url: null } : null
                  )}
                  showPreview={true}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select 
                  value={editingCategory.is_active ? 'active' : 'inactive'}
                  onValueChange={(value) => setEditingCategory(prev => 
                    prev ? { ...prev, is_active: value === 'active' } : null
                  )}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actief</SelectItem>
                    <SelectItem value="inactive">Inactief</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Annuleren
              </Button>
              <Button 
                onClick={() => {
                  if (editingCategory) {
                    updateCategoryMutation.mutate(editingCategory);
                  }
                }}
              >
                Opslaan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Tag Dialog */}
      {editingTag && (
        <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tag Bewerken</DialogTitle>
              <DialogDescription>
                Bewerk de instellingen van "#{editingTag.name}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Naam</Label>
                <Input
                  value={editingTag.name}
                  onChange={(e) => setEditingTag(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )}
                />
              </div>
              <div>
                <Label>Beschrijving</Label>
                <Textarea
                  value={editingTag.description || ''}
                  onChange={(e) => setEditingTag(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                />
              </div>
              <div>
                <Label>Kleur</Label>
                <Input
                  type="color"
                  value={editingTag.color}
                  onChange={(e) => setEditingTag(prev => 
                    prev ? { ...prev, color: e.target.value } : null
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTag(null)}>
                Annuleren
              </Button>
              <Button 
                onClick={() => {
                  if (editingTag) {
                    updateTagMutation.mutate(editingTag);
                  }
                }}
              >
                Opslaan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}