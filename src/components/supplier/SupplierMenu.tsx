import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupplierMenuItem, SupplierCategory } from '@/types/supplier';
import { Badge } from '@/components/ui/badge';

interface SupplierMenuProps {
  supplierId: string;
}

export const SupplierMenu: React.FC<SupplierMenuProps> = ({ supplierId }) => {
  const { data: items, isLoading } = useQuery<SupplierMenuItem[]>({
    queryKey: ['public-supplier-menu', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_menu_items')
        .select('*')
        .eq('supplier_id', supplierId)
        .eq('is_available', true)
        .order('position', { ascending: true })
        .order('price', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!supplierId,
  });

  const { data: categories } = useQuery<SupplierCategory[]>({
    queryKey: ['public-supplier-categories', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_categories')
        .select('*')
        .eq('supplier_id', supplierId)
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data || [];
    },
    enabled: !!supplierId,
  });

  if (isLoading) return <div className="text-muted-foreground">Menukaart laden...</div>;

  if (!items || items.length === 0) {
    return <div className="text-muted-foreground text-sm">Nog geen items beschikbaar.</div>;
  }

  // Group items by category
  const itemsWithCategoryPricing = items.map(item => {
    const category = categories?.find(c => c.id === item.category_id);
    const effectivePricing = item.use_category_pricing && category?.category_pricing 
      ? category.category_pricing 
      : item.pricing_tiers;
    
    return {
      ...item,
      effectivePricing,
      categoryData: category
    };
  });

  const categorizedItems = categories?.reduce((acc, category) => {
    const categoryItems = itemsWithCategoryPricing.filter(item => 
      item.category_id === category.id && item.use_category_pricing
    );
    if (categoryItems.length > 0) {
      acc[category.id] = {
        category,
        items: categoryItems
      };
    }
    return acc;
  }, {} as Record<string, { category: SupplierCategory; items: typeof itemsWithCategoryPricing }>) || {};

  const individualItems = itemsWithCategoryPricing.filter(item => !item.use_category_pricing);

  return (
    <div className="space-y-6">
      {/* Categorized Items (with category pricing) */}
      {Object.values(categorizedItems).map(({ category, items: categoryItems }) => (
        <div key={category.id} className="space-y-3">
          {/* Category Header */}
          <div className="border-b pb-3">
            <h3 className="text-lg font-semibold">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
            )}
            
            {/* Category Pricing Display */}
            {category.category_pricing && Object.keys(category.category_pricing).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(category.category_pricing).map(([weight, price]) => (
                  <Badge key={weight} variant="default" className="text-xs">
                    {weight}: €{Number(price).toFixed(2)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {/* Category Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryItems.map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-muted/30">
                <div className="font-medium">{item.name}</div>
                {item.description && (
                  <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Individual Items (with own pricing) */}
      {individualItems.length > 0 && (
        <div className="space-y-3">
          {Object.keys(categorizedItems).length > 0 && (
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold">Overige Producten</h3>
            </div>
          )}
          
          {individualItems.map((item) => (
            <div key={item.id} className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium flex items-center gap-2">
                  {item.name}
                  {item.categoryData && (
                    <Badge variant="secondary" className="text-xs">{item.categoryData.name}</Badge>
                  )}
                </div>
              </div>
              {item.description && (
                <div className="text-sm text-muted-foreground mb-2">{item.description}</div>
              )}
              <div className="space-y-1">
                {/* Show pricing tiers if available */}
                {item.effectivePricing && typeof item.effectivePricing === 'object' && Object.keys(item.effectivePricing).length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(item.effectivePricing).map(([weight, price]) => (
                      <Badge key={weight} variant="outline" className="text-xs">
                        {weight}: €{Number(price).toFixed(2)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  /* Fallback to simple price display */
                  <div className="text-right font-semibold">
                    € {Number(item.price).toFixed(2)}
                    {item.unit && <span className="text-sm text-muted-foreground"> / {item.unit}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplierMenu;