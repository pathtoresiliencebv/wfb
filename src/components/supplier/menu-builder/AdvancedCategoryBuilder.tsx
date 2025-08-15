import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Euro, Trash2, Package, List, Hash } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { SupplierPriceList, PricingModel } from '@/types/menuBuilder';

interface AdvancedCategoryBuilderProps {
  supplierId: string;
}

export function AdvancedCategoryBuilder({ supplierId }: AdvancedCategoryBuilderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  // Fetch price lists
  const { data: priceLists = [] } = useQuery({
    queryKey: ['supplier-price-lists', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_price_lists')
        .select('*')
        .eq('supplier_id', supplierId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data as SupplierPriceList[];
    }
  });

  // Fetch existing categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['supplier-categories', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_categories')
        .select('*')
        .eq('supplier_id', supplierId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    pricing_model: 'unique' as PricingModel,
    price_list_id: '',
    products: [''],
    custom_pricing: {
      '25': 0,
      '50': 0,
      '100': 0,
      '200': 0,
      '500': 0
    },
    unit_label: 'stuks'
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: typeof newCategory) => {
      // Prepare category data based on pricing model
      let categoryData: any = {
        supplier_id: supplierId,
        name: data.name,
        description: data.description,
        pricing_model: data.pricing_model,
        sort_order: categories.length,
        is_active: true
      };

      if (data.pricing_model === 'shared' && data.price_list_id) {
        categoryData.price_list_id = data.price_list_id;
      } else if (data.pricing_model === 'unique') {
        categoryData.category_pricing = data.custom_pricing;
      } else if (data.pricing_model === 'unit') {
        categoryData.category_pricing = data.custom_pricing;
        // Store unit label in category_pricing metadata
        categoryData.category_pricing = {
          ...data.custom_pricing,
          unit_label: data.unit_label
        };
      }

      const { data: category, error } = await supabase
        .from('supplier_categories')
        .insert(categoryData)
        .select()
        .single();
      
      if (error) throw error;

      // Add products to the category
      const productInserts = data.products
        .filter(product => product.trim())
        .map((product, index) => ({
          supplier_id: supplierId,
          category_id: category.id,
          name: product.trim(),
          description: '',
          price: 0,
          use_category_pricing: true,
          position: index,
          is_available: true
        }));

      if (productInserts.length > 0) {
        const { error: productsError } = await supabase
          .from('supplier_menu_items')
          .insert(productInserts);
        
        if (productsError) throw productsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-categories'] });
      queryClient.invalidateQueries({ queryKey: ['supplier-menu-items'] });
      setIsCreating(false);
      setNewCategory({
        name: '',
        description: '',
        pricing_model: 'unique',
        price_list_id: '',
        products: [''],
        custom_pricing: { '25': 0, '50': 0, '100': 0, '200': 0, '500': 0 },
        unit_label: 'stuks'
      });
      toast({
        title: "Categorie aangemaakt",
        description: "Je nieuwe categorie is succesvol aangemaakt."
      });
    }
  });

  const handleAddProduct = () => {
    setNewCategory(prev => ({
      ...prev,
      products: [...prev.products, '']
    }));
  };

  const handleRemoveProduct = (index: number) => {
    setNewCategory(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const handleProductChange = (index: number, value: string) => {
    setNewCategory(prev => ({
      ...prev,
      products: prev.products.map((product, i) => i === index ? value : product)
    }));
  };

  const handlePricingDataChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setNewCategory(prev => ({
      ...prev,
      custom_pricing: { ...prev.custom_pricing, [key]: numValue }
    }));
  };

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Naam vereist",
        description: "Voer een naam in voor je categorie.",
        variant: "destructive"
      });
      return;
    }

    if (newCategory.pricing_model === 'shared' && !newCategory.price_list_id) {
      toast({
        title: "Prijslijst vereist",
        description: "Selecteer een prijslijst voor dit prijsmodel.",
        variant: "destructive"
      });
      return;
    }

    createCategoryMutation.mutate(newCategory);
  };

  const pricingOptions = newCategory.pricing_model === 'unit' 
    ? ['1', '2', '3', '5', '10']
    : ['25', '50', '100', '200', '500'];

  if (isLoading) {
    return <div className="p-6 text-center">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Existing Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Categorieën</CardTitle>
              <CardDescription>
                Beheer je menu categorieën met verschillende prijsmodellen
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nieuwe Categorie
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nog geen categorieën aangemaakt. Maak je eerste categorie aan om te beginnen.
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{category.name}</h3>
                      <Badge variant="outline">
                        {category.pricing_model === 'shared' && 'Gedeelde Prijslijst'}
                        {category.pricing_model === 'unique' && 'Unieke Prijzen'}
                        {category.pricing_model === 'unit' && 'Per Eenheid'}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {category.product_count || 0} producten
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create New Category */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Nieuwe Categorie Aanmaken</CardTitle>
            <CardDescription>
              Kies het juiste prijsmodel voor je categorie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category_name">Categorie Naam</Label>
                <Input
                  id="category_name"
                  placeholder="Bijv. Haze, Kush, Cali, Hasj"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_description">Beschrijving (optioneel)</Label>
                <Textarea
                  id="category_description"
                  placeholder="Korte beschrijving van deze categorie"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>

            {/* Pricing Model Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Prijsmodel Selecteren</Label>
              <RadioGroup
                value={newCategory.pricing_model}
                onValueChange={(value: PricingModel) => 
                  setNewCategory(prev => ({ ...prev, pricing_model: value, price_list_id: '' }))
                }
                className="space-y-4"
              >
                {/* Shared Price List */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="shared" id="shared" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="shared" className="font-medium cursor-pointer flex items-center gap-2">
                      <List className="h-4 w-4" />
                      Gedeelde Prijslijst
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gebruik een bestaande prijslijst die je kunt delen met andere categorieën
                    </p>
                    {newCategory.pricing_model === 'shared' && (
                      <div className="mt-3">
                        <Select
                          value={newCategory.price_list_id}
                          onValueChange={(value) => setNewCategory(prev => ({ ...prev, price_list_id: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer een prijslijst" />
                          </SelectTrigger>
                          <SelectContent>
                            {priceLists.filter(pl => pl.price_type === 'weight').map((priceList) => (
                              <SelectItem key={priceList.id} value={priceList.id}>
                                {priceList.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Unique Category Pricing */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="unique" id="unique" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="unique" className="font-medium cursor-pointer flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Unieke Prijslijst
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Maak specifieke prijzen voor alleen deze categorie
                    </p>
                  </div>
                </div>

                {/* Unit Pricing */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="unit" id="unit" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="unit" className="font-medium cursor-pointer flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Prijs per Eenheid
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Verkoop per stuk/eenheid in plaats van op gewicht
                    </p>
                    {newCategory.pricing_model === 'unit' && (
                      <div className="mt-3">
                        <Label htmlFor="unit_label" className="text-sm">Eenheid Label</Label>
                        <Input
                          id="unit_label"
                          placeholder="Bijv. stuks, cartridges, bollen"
                          value={newCategory.unit_label}
                          onChange={(e) => setNewCategory(prev => ({ ...prev, unit_label: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Custom Pricing for Unique and Unit Models */}
            {(newCategory.pricing_model === 'unique' || newCategory.pricing_model === 'unit') && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Prijzen Instellen</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {pricingOptions.map((option) => (
                    <div key={option} className="space-y-1">
                      <Label className="text-sm">
                        {option}
                        {newCategory.pricing_model === 'unit' 
                          ? ` ${newCategory.unit_label}` 
                          : 'gr'
                        }
                      </Label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="0"
                          className="pl-10"
                          value={newCategory.custom_pricing[option] || ''}
                          onChange={(e) => handlePricingDataChange(option, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Producten</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddProduct}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Product Toevoegen
                </Button>
              </div>
              <div className="space-y-2">
                {newCategory.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Product naam"
                      value={product}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                    />
                    {newCategory.products.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4">
              <Button 
                onClick={handleCreateCategory}
                disabled={createCategoryMutation.isPending}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                {createCategoryMutation.isPending ? 'Aanmaken...' : 'Categorie Aanmaken'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreating(false)}
              >
                Annuleren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
