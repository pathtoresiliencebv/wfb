import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupplierMenuItem, SupplierCategory } from '@/types/supplier';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Leaf, Star } from 'lucide-react';

interface SupplierMenuProps {
  supplierId: string;
}

// Helper function to format and sort pricing tiers
const formatPricingTiers = (pricingTiers: Record<string, number> | any): Array<{weight: string, price: number, sortOrder: number}> => {
  if (!pricingTiers || typeof pricingTiers !== 'object') return [];
  
  const tiers = Object.entries(pricingTiers)
    .filter(([weight, price]) => price && Number(price) > 0)
    .map(([weight, price]) => {
      const numericWeight = parseInt(weight.replace(/[^\d]/g, ''));
      return {
        weight: `${numericWeight}gr`,
        price: Number(price),
        sortOrder: numericWeight
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
    
  return tiers;
};

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
    <div className="max-w-4xl mx-auto">
      {/* Menu Card Header */}
      <Card className="border-2 border-primary/20 shadow-lg mb-6">
        <CardHeader className="text-center border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Leaf className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold text-foreground">Menukaart</CardTitle>
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">Verse producten, eerlijke prijzen</p>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Categorized Items (with category pricing) */}
          {validCategorizedItems.map(({ category, items: categoryItems }, index) => (
            <div key={category.id} className={index > 0 ? "mt-12" : ""}>
              {/* Category Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
                  <Star className="h-5 w-5 text-primary" />
                  <h3 className="text-2xl font-bold text-primary">{category.name}</h3>
                  <Star className="h-5 w-5 text-primary" />
                </div>
                {category.description && (
                  <p className="text-muted-foreground mt-3 text-lg italic">{category.description}</p>
                )}
              </div>

              {/* Description Lines */}
              {category.description_lines && Array.isArray(category.description_lines) && category.description_lines.length > 0 && (
                <div className="mb-6 text-center">
                  <div className="inline-block space-y-2">
                    {category.description_lines.map((line, index) => (
                      <div key={index} className="text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        <span className="italic">{line}</span>
                        <div className="w-1 h-1 bg-primary rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Items with Pricing */}
              <div className="space-y-4">
                {categoryItems.map((item) => {
                  const pricingTiers = formatPricingTiers(category.category_pricing);
                  return (
                    <div key={item.id} className="border-b border-dotted border-border pb-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-foreground">{item.name}</h4>
                          {item.description && (
                            <p className="text-muted-foreground text-sm mt-1 italic">{item.description}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="space-y-1">
                            {pricingTiers.map((tier) => (
                              <div key={tier.weight} className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground min-w-[45px]">{tier.weight}</span>
                                <div className="flex-1 border-b border-dotted border-border mx-2" style={{minWidth: '60px'}} />
                                <span className="text-lg font-bold text-primary min-w-[70px]">€{tier.price.toFixed(0)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Individual Items (with own pricing) */}
          {validIndividualItems.length > 0 && (
            <div className={validCategorizedItems.length > 0 ? "mt-12" : ""}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-secondary/10 rounded-full border border-secondary/20">
                  <Package className="h-5 w-5 text-secondary-foreground" />
                  <h3 className="text-2xl font-bold text-secondary-foreground">Specialiteiten</h3>
                  <Package className="h-5 w-5 text-secondary-foreground" />
                </div>
              </div>
              
              <div className="space-y-4">
                {validIndividualItems.map((item) => {
                  const pricingTiers = formatPricingTiers(item.effectivePricing);
                  return (
                    <div key={item.id} className="border-b border-dotted border-border pb-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-semibold text-foreground">{item.name}</h4>
                            {item.categoryData && (
                              <Badge variant="outline" className="text-xs">{item.categoryData.name}</Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-muted-foreground text-sm italic">{item.description}</p>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0 text-right">
                          {pricingTiers.length > 0 ? (
                            <div className="space-y-1">
                              {pricingTiers.map((tier) => (
                                <div key={tier.weight} className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-muted-foreground min-w-[45px]">{tier.weight}</span>
                                  <div className="flex-1 border-b border-dotted border-border mx-2" style={{minWidth: '60px'}} />
                                  <span className="text-lg font-bold text-primary min-w-[70px]">€{tier.price.toFixed(0)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-muted-foreground">{item.unit || 'stuk'}</span>
                              <div className="flex-1 border-b border-dotted border-border mx-2" style={{minWidth: '60px'}} />
                              <span className="text-lg font-bold text-primary">€{Number(item.price).toFixed(0)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierMenu;