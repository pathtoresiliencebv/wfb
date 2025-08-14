import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Edit, Package, Euro, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SupplierMenuBuilderProps {
  supplierId: string;
}

interface SupplierCategory {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  pricing_tiers: Record<string, number>;
  weight_options: string[];
  category_id?: string;
  is_available: boolean;
  in_stock: boolean;
  image_url?: string;
  position: number;
}

export const SupplierMenuBuilder: React.FC<SupplierMenuBuilderProps> = ({ supplierId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    pricing_tiers: {} as Record<string, number>,
    category_id: '',
    is_available: true,
    in_stock: true
  });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
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
      return data;
    }
  });

  // Fetch menu items
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ['supplier-menu-items', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_menu_items')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('position');
      if (error) throw error;
      return data;
    }
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (category: { name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('supplier_categories')
        .insert({
          supplier_id: supplierId,
          name: category.name,
          description: category.description,
          sort_order: categories.length
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-categories'] });
      setNewCategory({ name: '', description: '' });
      toast({ title: 'Categorie toegevoegd!' });
    }
  });

  // Create menu item mutation
  const createItemMutation = useMutation({
    mutationFn: async (item: typeof newItem) => {
      const { data, error } = await supabase
        .from('supplier_menu_items')
        .insert({
          supplier_id: supplierId,
          name: item.name,
          description: item.description,
          pricing_tiers: item.pricing_tiers,
          category_id: item.category_id || null,
          is_available: item.is_available,
          in_stock: item.in_stock,
          position: menuItems.length
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-menu-items'] });
      setNewItem({
        name: '',
        description: '',
        pricing_tiers: {},
        category_id: '',
        is_available: true,
        in_stock: true
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

  const weightOptions = ['1g', '2.5g', '5g', '10g', '25g', '50g', '100g'];

  const handlePriceChange = (weight: string, price: string) => {
    const numPrice = parseFloat(price) || 0;
    setNewItem(prev => ({
      ...prev,
      pricing_tiers: { ...prev.pricing_tiers, [weight]: numPrice }
    }));
  };

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
          <h3 className="font-semibold mb-3">Categorieën</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              Alle Items
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Add New Category */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Nieuwe categorie naam"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
            />
            <Button 
              onClick={() => createCategoryMutation.mutate(newCategory)}
              disabled={!newCategory.name.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Bijv. OG Kush"
                />
              </div>
              <div>
                <Label htmlFor="item-category">Categorie</Label>
                <select
                  id="item-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newItem.category_id}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category_id: e.target.value }))}
                >
                  <option value="">Geen categorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="item-description">Beschrijving</Label>
              <Textarea
                id="item-description"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Beschrijf het product..."
                rows={2}
              />
            </div>

            {/* Pricing Grid */}
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
                        value={newItem.pricing_tiers[weight] || ''}
                        onChange={(e) => handlePriceChange(weight, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={newItem.is_available}
                  onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, is_available: checked }))}
                />
                <Label htmlFor="available">Beschikbaar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="in-stock"
                  checked={newItem.in_stock}
                  onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, in_stock: checked }))}
                />
                <Label htmlFor="in-stock">Op voorraad</Label>
              </div>
            </div>

            <Button 
              onClick={() => createItemMutation.mutate(newItem)}
              disabled={!newItem.name.trim() || Object.keys(newItem.pricing_tiers).length === 0}
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
              {filteredItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {!item.is_available && <Badge variant="secondary">Niet beschikbaar</Badge>}
                      {!item.in_stock && <Badge variant="destructive">Uitverkocht</Badge>}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(item.pricing_tiers || {}).map(([weight, price]) => (
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
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};