import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowDown } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRetry } from '@/hooks/useRetry';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface PriceListManagerProps {
  supplierId: string;
}

interface MenuItem {
  id: string;
  name: string;
  pricing_tiers: Record<string, number>;
  category?: string;
}

const WEIGHT_OPTIONS = ['25', '50', '100', '200', '500'];

export function PriceListManager({ supplierId }: PriceListManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  const { retry } = useRetry();
  const [categoryName, setCategoryName] = useState('');
  const [localNames, setLocalNames] = useState<Record<string, string>>({});
  const [localCategories, setLocalCategories] = useState<Record<string, string>>({});
  const [localPrices, setLocalPrices] = useState<Record<string, Record<string, string>>>({});
  const [nameTimeouts, setNameTimeouts] = useState<Record<string, NodeJS.Timeout>>({});
  const [categoryTimeouts, setCategoryTimeouts] = useState<Record<string, NodeJS.Timeout>>({});
  const [priceTimeouts, setPriceTimeouts] = useState<Record<string, NodeJS.Timeout>>({});

  // Fetch menu items
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['supplier-menu-items', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_menu_items')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('position', { ascending: true });
      
      if (error) throw error;
      return data as MenuItem[];
    }
  });

  // Add new product mutation
  const addProductMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('supplier_menu_items')
        .insert({
          supplier_id: supplierId,
          name: 'Nieuw Product',
          category: categoryName || null,
          pricing_tiers: { '25': 0, '50': 0, '100': 0, '200': 0, '500': 0 },
          position: menuItems.length
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-menu-items'] });
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: any }) => {
      const { error } = await supabase
        .from('supplier_menu_items')
        .update({ [field]: value })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-menu-items'] });
    },
    onError: (error) => {
      handleError(error, { fallbackMessage: 'Fout bij bijwerken van product' });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('supplier_menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-menu-items'] });
      toast({
        title: "Product verwijderd",
        description: "Het product is succesvol verwijderd."
      });
    }
  });

  // Initialize local state when menu items are loaded
  useEffect(() => {
    if (menuItems.length > 0) {
      const initialNames: Record<string, string> = {};
      const initialCategories: Record<string, string> = {};
      const initialPrices: Record<string, Record<string, string>> = {};
      
      menuItems.forEach(item => {
        initialNames[item.id] = item.name;
        initialCategories[item.id] = item.category || '';
        initialPrices[item.id] = {};
        WEIGHT_OPTIONS.forEach(weight => {
          initialPrices[item.id][weight] = String(item.pricing_tiers?.[weight] || '');
        });
      });
      
      setLocalNames(initialNames);
      setLocalCategories(initialCategories);
      setLocalPrices(initialPrices);
    }
  }, [menuItems]);

  // Debounced name update
  const handleNameChange = useCallback((id: string, name: string) => {
    // Update local state immediately for responsive UI
    setLocalNames(prev => ({ ...prev, [id]: name }));
    
    // Clear existing timeout
    if (nameTimeouts[id]) {
      clearTimeout(nameTimeouts[id]);
    }
    
    // Set new timeout for database update
    const timeoutId = setTimeout(() => {
      retry(() => updateProductMutation.mutateAsync({ id, field: 'name', value: name }))
        .catch(error => handleError(error));
      
      // Remove timeout from state
      setNameTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[id];
        return newTimeouts;
      });
    }, 800); // Increased delay for better stability
    
    setNameTimeouts(prev => ({ ...prev, [id]: timeoutId }));
  }, [updateProductMutation, nameTimeouts, retry, handleError]);

  // Debounced category update
  const handleCategoryChange = useCallback((id: string, category: string) => {
    // Update local state immediately for responsive UI
    setLocalCategories(prev => ({ ...prev, [id]: category }));
    
    // Clear existing timeout
    if (categoryTimeouts[id]) {
      clearTimeout(categoryTimeouts[id]);
    }
    
    // Set new timeout for database update
    const timeoutId = setTimeout(() => {
      retry(() => updateProductMutation.mutateAsync({ id, field: 'category', value: category || null }))
        .catch(error => handleError(error));
      
      // Remove timeout from state
      setCategoryTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[id];
        return newTimeouts;
      });
    }, 800);
    
    setCategoryTimeouts(prev => ({ ...prev, [id]: timeoutId }));
  }, [updateProductMutation, categoryTimeouts, retry, handleError]);

  // Debounced price update
  const handlePriceChange = useCallback((id: string, weight: string, price: string) => {
    // Update local state immediately for responsive UI
    setLocalPrices(prev => ({
      ...prev,
      [id]: { ...prev[id], [weight]: price }
    }));
    
    // Clear existing timeout for this specific field
    const timeoutKey = `${id}-${weight}`;
    if (priceTimeouts[timeoutKey]) {
      clearTimeout(priceTimeouts[timeoutKey]);
    }
    
    // Set new timeout for database update
    const timeoutId = setTimeout(() => {
      const item = menuItems.find(m => m.id === id);
      if (!item) return;

      const numPrice = parseFloat(price) || 0;
      const newPricingTiers = { ...item.pricing_tiers, [weight]: numPrice };
      
      retry(() => updateProductMutation.mutateAsync({ id, field: 'pricing_tiers', value: newPricingTiers }))
        .catch(error => handleError(error));
      
      // Remove timeout from state
      setPriceTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[timeoutKey];
        return newTimeouts;
      });
    }, 600); // Shorter delay for prices
    
    setPriceTimeouts(prev => ({ ...prev, [timeoutKey]: timeoutId }));
  }, [menuItems, updateProductMutation, priceTimeouts, retry, handleError]);

  // Fill down functionality
  const handleFillDown = useCallback((fromIndex: number, weight: string) => {
    const sourceItem = menuItems[fromIndex];
    if (!sourceItem) return;

    const sourcePrice = sourceItem.pricing_tiers?.[weight] || 0;
    
    // Get all items from this index down
    const itemsToUpdate = menuItems.slice(fromIndex + 1);
    
    // Update local state immediately
    const newLocalPrices = { ...localPrices };
    itemsToUpdate.forEach(item => {
      if (!newLocalPrices[item.id]) newLocalPrices[item.id] = {};
      newLocalPrices[item.id][weight] = String(sourcePrice);
    });
    setLocalPrices(newLocalPrices);
    
    // Update database
    itemsToUpdate.forEach(item => {
      const newPricingTiers = { ...item.pricing_tiers, [weight]: sourcePrice };
      retry(() => updateProductMutation.mutateAsync({ 
        id: item.id, 
        field: 'pricing_tiers', 
        value: newPricingTiers 
      })).catch(error => handleError(error));
    });

    toast({
      title: "Waardes doorgetrokken",
      description: `${itemsToUpdate.length} producten bijgewerkt voor ${weight}gr.`
    });
  }, [menuItems, localPrices, updateProductMutation, retry, handleError, toast]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(nameTimeouts).forEach(timeout => clearTimeout(timeout));
      Object.values(categoryTimeouts).forEach(timeout => clearTimeout(timeout));
      Object.values(priceTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [nameTimeouts, categoryTimeouts, priceTimeouts]);

  if (isLoading) {
    return <div className="p-6 text-center">Laden...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Prijslijst</CardTitle>
          <Button 
            onClick={() => addProductMutation.mutate()}
            className="flex items-center gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Product toevoegen
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Name (Optional) */}
        <div>
          <Input
            placeholder="Categorie naam (optioneel)"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Header Row */}
        <div className="grid grid-cols-8 gap-2 p-2 bg-muted rounded-lg text-sm font-medium">
          <div>Product Naam</div>
          <div>Categorie</div>
          <div className="text-center">25gr</div>
          <div className="text-center">50gr</div>
          <div className="text-center">100gr</div>
          <div className="text-center">200gr</div>
          <div className="text-center">500gr</div>
          <div></div>
        </div>

        {/* Product Rows */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-8 gap-2 p-2 border rounded-lg items-center">
              <div>
                <Input
                  value={localNames[item.id] || item.name}
                  onChange={(e) => handleNameChange(item.id, e.target.value)}
                  className="h-8"
                  placeholder="Product naam"
                />
              </div>
              <div>
                <Input
                  value={localCategories[item.id] || ''}
                  onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                  className="h-8"
                  placeholder="Categorie"
                />
              </div>
              
              {WEIGHT_OPTIONS.map((weight) => (
                <div key={weight} className="relative">
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      placeholder="0"
                      value={localPrices[item.id]?.[weight] || ''}
                      onChange={(e) => handlePriceChange(item.id, weight, e.target.value)}
                      className="h-8 text-center"
                    />
                    {index < menuItems.length - 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFillDown(index, weight)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        title="Waarde doortrekken naar rijen eronder"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteProductMutation.mutate(item.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nog geen producten toegevoegd. Klik op "Product toevoegen" om te beginnen.
          </div>
        )}
      </CardContent>
    </Card>
  );
}