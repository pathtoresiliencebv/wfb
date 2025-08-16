import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupplierMenuItem, SupplierCategory } from '@/types/supplier';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Star } from 'lucide-react';

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

  const { data: categories = [] } = useQuery<SupplierCategory[]>({
    queryKey: ['public-supplier-categories', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_categories')
        .select('*')
        .eq('supplier_id', supplierId)
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return (data || []) as SupplierCategory[];
    },
    enabled: !!supplierId,
  });

  if (isLoading) return <div className="text-muted-foreground">Menukaart laden...</div>;

  if (!items || items.length === 0) {
    return <div className="text-muted-foreground text-sm">Nog geen items beschikbaar.</div>;
  }

  // Group items by category
  const itemsWithCategoryPricing = items.map(item => {
    const category = categories.find(c => c.id === item.category_id);
    const effectivePricing = item.use_category_pricing && category?.category_pricing 
      ? category.category_pricing 
      : item.pricing_tiers;
    
    return {
      ...item,
      effectivePricing,
      categoryData: category
    };
  });

  const categorizedItems = categories.reduce((acc, category) => {
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
  }, {} as Record<string, { category: SupplierCategory; items: typeof itemsWithCategoryPricing }>);

  const individualItems = itemsWithCategoryPricing.filter(item => !item.use_category_pricing);

  // Filter out items and categories with no pricing or empty data
  const validCategorizedItems = Object.values(categorizedItems).filter(({ category }) => 
    category.category_pricing && Object.keys(category.category_pricing).length > 0
  );
  
  const validIndividualItems = individualItems.filter(item => 
    (item.effectivePricing && Object.keys(item.effectivePricing).length > 0) || item.price > 0
  );

  if (validCategorizedItems.length === 0 && validIndividualItems.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nog geen menukaart beschikbaar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categorized Items (with category pricing) */}
      {validCategorizedItems.map(({ category, items: categoryItems }) => (
        <Card key={category.id} className="overflow-hidden">
          <CardContent className="p-6">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  {category.product_count && category.product_count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {category.product_count} soorten
                    </Badge>
                  )}
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                )}
              </div>
            </div>

            {/* Description Lines */}
            {category.description_lines && Array.isArray(category.description_lines) && category.description_lines.length > 0 && (
              <div className="mb-4 space-y-1">
                {category.description_lines.map((line, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <Star className="h-3 w-3 text-primary flex-shrink-0" />
                    {line}
                  </div>
                ))}
              </div>
            )}

            {/* Category Pricing Display */}
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-3">Prijzen voor alle {category.name.toLowerCase()}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(category.category_pricing).map(([weight, price]) => (
                  <div key={weight} className="bg-background rounded-lg p-3 text-center border">
                    <div className="text-sm font-medium text-muted-foreground">{weight}gr</div>
                    <div className="text-lg font-bold text-primary">€{Number(price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Items */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Beschikbare varianten:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categoryItems.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg bg-muted/30 border">
                    <div className="font-medium text-sm">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Individual Items (with own pricing) */}
      {validIndividualItems.length > 0 && (
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Package className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Individuele Producten</h3>
            </div>
            
            <div className="space-y-4">
              {validIndividualItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{item.name}</h4>
                        {item.categoryData && (
                          <Badge variant="outline" className="text-xs">{item.categoryData.name}</Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      {item.effectivePricing && typeof item.effectivePricing === 'object' && Object.keys(item.effectivePricing).length > 0 ? (
                        <div className="flex flex-wrap gap-2 justify-end">
                          {Object.entries(item.effectivePricing).map(([weight, price]) => (
                            <div key={weight} className="bg-primary/10 rounded-lg px-3 py-1 text-center min-w-[80px]">
                              <div className="text-xs font-medium text-muted-foreground">{weight}</div>
                              <div className="text-sm font-bold text-primary">€{Number(price).toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-primary/10 rounded-lg px-4 py-2 text-center">
                          <div className="text-lg font-bold text-primary">€{Number(item.price).toFixed(2)}</div>
                          {item.unit && <div className="text-xs text-muted-foreground">per {item.unit}</div>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupplierMenu;