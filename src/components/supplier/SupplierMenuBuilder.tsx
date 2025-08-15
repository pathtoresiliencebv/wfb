import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Package, Euro, Settings, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SupplierMenuItem, SupplierCategory } from '@/types/supplier';

interface SupplierMenuBuilderProps {
  supplierId: string;
}

export const SupplierMenuBuilder: React.FC<SupplierMenuBuilderProps> = ({ supplierId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newItemData, setNewItemData] = useState({
    name: '',
    description: '',
    pricing_tiers: {} as Record<string, number>,
    category_id: '',
    is_available: true,
    in_stock: true,
    use_category_pricing: false,
  });
  
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: '',
    category_pricing: {} as Record<string, number>,
  });
  
  const [editingCategoryPricing, setEditingCategoryPricing] = useState<string | null>(null);
  const [editPricing, setEditPricing] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [] } = useQuery<SupplierCategory[]>({
    queryKey: ['supplier-categories', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_categories')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('sort_order');
      if (error) throw error;
      return data as SupplierCategory[];
    }
  });

  // Initialize edit pricing when editing category changes
  React.useEffect(() => {
    if (editingCategoryPricing) {
      const category = categories.find(c => c.id === editingCategoryPricing);
      setEditPricing(category?.category_pricing || {});
    }
  }, [editingCategoryPricing, categories]);

  // Fetch menu items
  const { data: menuItems = [] } = useQuery<SupplierMenuItem[]>({
    queryKey: ['supplier-menu-items', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_menu_items')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('position');
      if (error) throw error;
      return data as SupplierMenuItem[];
    }
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (category: typeof newCategoryData) => {
      const { data, error } = await supabase
        .from('supplier_categories')
        .insert({
          supplier_id: supplierId,
          name: category.name,
          description: category.description,
          category_pricing: category.category_pricing,
          sort_order: categories.length
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-categories'] });
      setNewCategoryData({ name: '', description: '', category_pricing: {} });
      toast({ title: 'Categorie toegevoegd!' });
    }
  });

  // Update category pricing mutation
  const updateCategoryPricingMutation = useMutation({
    mutationFn: async ({ categoryId, pricing }: { categoryId: string; pricing: Record<string, number> }) => {
      const { error } = await supabase
        .from('supplier_categories')
        .update({ category_pricing: pricing })
        .eq('id', categoryId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-categories'] });
      setEditingCategoryPricing(null);
      toast({ title: 'Categorie prijzen bijgewerkt!' });
    }
  });

  // Create menu item mutation
  const createItemMutation = useMutation({
    mutationFn: async (item: typeof newItemData) => {
      const { data, error } = await supabase
        .from('supplier_menu_items')
        .insert({
          supplier_id: supplierId,
          name: item.name,
          description: item.description,
          pricing_tiers: item.use_category_pricing ? {} : item.pricing_tiers,
          category_id: item.category_id || null,
          is_available: item.is_available,
          in_stock: item.in_stock,
          use_category_pricing: item.use_category_pricing,
          position: menuItems.length
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-menu-items'] });
      setNewItemData({
        name: '',
        description: '',
        pricing_tiers: {},
        category_id: '',
        is_available: true,
        in_stock: true,
        use_category_pricing: false,
      });
      toast({ title: 'Product toegevoegd!' });
    }
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('supplier_menu_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-menu-items'] });
      toast({ title: 'Product verwijderd!' });
    }
  });

  const weightOptions = ['10g', '25g', '50g', '100g', '200g'];

  const handlePriceChange = (weight: string, price: string, isCategory = false) => {
    const numPrice = parseFloat(price) || 0;
    if (isCategory) {
      setNewCategoryData(prev => ({
        ...prev,
        category_pricing: { ...prev.category_pricing, [weight]: numPrice }
      }));
    } else {
      setNewItemData(prev => ({
        ...prev,
        pricing_tiers: { ...prev.pricing_tiers, [weight]: numPrice }
      }));
    }
  };

  const selectedCategoryData = categories.find(cat => cat.id === newItemData.category_id);
  const showCategoryPricingOption = selectedCategoryData && selectedCategoryData.category_pricing && Object.keys(selectedCategoryData.category_pricing).length > 0;

  const filteredItems = selectedCategory 
    ? menuItems.filter(item => item.category_id === selectedCategory)
    : menuItems;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Menukaart Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Management */}
        <div>
          <h3 className="font-semibold mb-3">Categorieën Beheren</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              Alle Items
            </Button>
            {categories.map(category => (
              <div key={category.id} className="flex items-center gap-1">
                <Button
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                  {category.category_pricing && Object.keys(category.category_pricing).length > 0 && (
                    <Target className="h-3 w-3 ml-1" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingCategoryPricing(category.id)}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add New Category */}
          <div className="space-y-3 p-4 border rounded-lg">
            <h4 className="font-medium">Nieuwe Categorie</h4>
            <div className="grid gap-3">
              <Input
                placeholder="Categorie naam (bijv. Haze, Kush)"
                value={newCategoryData.name}
                onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
              />
              <Textarea
                placeholder="Beschrijving (optioneel)"
                value={newCategoryData.description}
                onChange={(e) => setNewCategoryData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
              
              {/* Category Pricing */}
              <div>
                <Label className="text-sm font-medium">Standaard Prijzen voor deze Categorie (optioneel)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Stel eenmalig prijzen in die alle producten in deze categorie gebruiken
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {weightOptions.map(weight => (
                    <div key={weight}>
                      <Label htmlFor={`cat-price-${weight}`} className="text-xs text-muted-foreground">
                        {weight}
                      </Label>
                      <div className="relative">
                        <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          id={`cat-price-${weight}`}
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-7 text-sm"
                          placeholder="0.00"
                          value={newCategoryData.category_pricing[weight] || ''}
                          onChange={(e) => handlePriceChange(weight, e.target.value, true)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={() => createCategoryMutation.mutate(newCategoryData)}
                disabled={!newCategoryData.name.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Categorie Toevoegen
              </Button>
            </div>
          </div>
        </div>

        {/* Category Pricing Editor Modal */}
        {editingCategoryPricing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Categorie Prijzen Bewerken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {weightOptions.map(weight => (
                    <div key={weight}>
                      <Label className="text-xs text-muted-foreground">{weight}</Label>
                      <div className="relative">
                        <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-7 text-sm"
                          value={editPricing[weight] || ''}
                          onChange={(e) => setEditPricing(prev => ({ 
                            ...prev, 
                            [weight]: parseFloat(e.target.value) || 0 
                          }))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => updateCategoryPricingMutation.mutate({
                      categoryId: editingCategoryPricing,
                      pricing: editPricing
                    })}
                  >
                    Opslaan
                  </Button>
                  <Button variant="outline" onClick={() => setEditingCategoryPricing(null)}>
                    Annuleren
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Separator />

        {/* Add New Item */}
        <div>
          <h3 className="font-semibold mb-3">Nieuw Product Toevoegen</h3>
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="item-name">Productnaam</Label>
                <Input
                  id="item-name"
                  value={newItemData.name}
                  onChange={(e) => setNewItemData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Bijv. OG Kush, Purple Haze"
                />
              </div>
              <div>
                <Label htmlFor="item-category">Categorie</Label>
                <select
                  id="item-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={newItemData.category_id}
                  onChange={(e) => setNewItemData(prev => ({ 
                    ...prev, 
                    category_id: e.target.value,
                    use_category_pricing: false // Reset when category changes
                  }))}
                >
                  <option value="">Geen categorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                      {category.category_pricing && Object.keys(category.category_pricing).length > 0 && ' 🎯'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category pricing toggle */}
            {showCategoryPricingOption && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Gebruik categorie prijzen</Label>
                    <p className="text-xs text-muted-foreground">
                      Gebruik de standaard prijzen van "{selectedCategoryData.name}"
                    </p>
                  </div>
                  <Switch
                    checked={newItemData.use_category_pricing}
                    onCheckedChange={(checked) => setNewItemData(prev => ({ 
                      ...prev, 
                      use_category_pricing: checked,
                      pricing_tiers: checked ? {} : prev.pricing_tiers
                    }))}
                  />
                </div>
                {newItemData.use_category_pricing && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(selectedCategoryData.category_pricing || {}).map(([weight, price]) => (
                      <Badge key={weight} variant="secondary" className="text-xs">
                        {weight}: €{Number(price).toFixed(2)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="item-description">Beschrijving</Label>
              <Textarea
                id="item-description"
                value={newItemData.description}
                onChange={(e) => setNewItemData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Beschrijf het product..."
                rows={2}
              />
            </div>

            {/* Individual Pricing (only show if not using category pricing) */}
            {!newItemData.use_category_pricing && (
              <div>
                <Label>Prijzen per gewicht</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {weightOptions.map(weight => (
                    <div key={weight}>
                      <Label htmlFor={`price-${weight}`} className="text-xs text-muted-foreground">
                        {weight}
                      </Label>
                      <div className="relative">
                        <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          id={`price-${weight}`}
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-7 text-sm"
                          placeholder="0.00"
                          value={newItemData.pricing_tiers[weight] || ''}
                          onChange={(e) => handlePriceChange(weight, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={newItemData.is_available}
                  onCheckedChange={(checked) => setNewItemData(prev => ({ ...prev, is_available: checked }))}
                />
                <Label htmlFor="available">Beschikbaar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="in-stock"
                  checked={newItemData.in_stock}
                  onCheckedChange={(checked) => setNewItemData(prev => ({ ...prev, in_stock: checked }))}
                />
                <Label htmlFor="in-stock">Op voorraad</Label>
              </div>
            </div>

            <Button 
              onClick={() => createItemMutation.mutate(newItemData)}
              disabled={!newItemData.name.trim() || (!newItemData.use_category_pricing && Object.keys(newItemData.pricing_tiers).length === 0)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Product Toevoegen
            </Button>
          </div>
        </div>

        <Separator />

        {/* Menu Items List */}
        <div>
          <h3 className="font-semibold mb-3">Huidige Menu Items</h3>
          {filteredItems.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nog geen items toegevoegd.</p>
          ) : (
            <div className="grid gap-3">
              {filteredItems.map(item => {
                const category = categories.find(c => c.id === item.category_id);
                const effectivePricing = item.use_category_pricing && category?.category_pricing 
                  ? category.category_pricing 
                  : item.pricing_tiers;

                return (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{item.name}</h4>
                        {item.use_category_pricing && <Badge variant="secondary" className="text-xs">Categorie prijzen</Badge>}
                        {!item.is_available && <Badge variant="secondary">Niet beschikbaar</Badge>}
                        {!item.in_stock && <Badge variant="destructive">Uitverkocht</Badge>}
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(effectivePricing || {}).map(([weight, price]) => (
                          <Badge key={weight} variant="outline" className="text-xs">
                            {weight}: €{Number(price).toFixed(2)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteItemMutation.mutate(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};