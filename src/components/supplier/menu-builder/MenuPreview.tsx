import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Share2, Download, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SupplierMenuSettings } from '@/types/supplier';

interface MenuPreviewProps {
  supplierId: string;
}

export function MenuPreview({ supplierId }: MenuPreviewProps) {
  // Fetch menu settings
  const { data: menuSettings } = useQuery({
    queryKey: ['supplier-menu-settings', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_menu_settings')
        .select('*')
        .eq('supplier_id', supplierId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch categories with pricing
  const { data: categories = [] } = useQuery({
    queryKey: ['supplier-categories-with-pricing', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_categories')
        .select(`
          *,
          supplier_price_lists (
            name,
            pricing_data,
            price_type,
            unit_label
          )
        `)
        .eq('supplier_id', supplierId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch menu items
  const { data: menuItems = [] } = useQuery({
    queryKey: ['supplier-menu-items-preview', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_menu_items')
        .select('*')
        .eq('supplier_id', supplierId)
        .eq('is_available', true)
        .order('position');
      
      if (error) throw error;
      return data;
    }
  });

  const getEffectivePricing = (category: any) => {
    if (category.pricing_model === 'shared' && category.supplier_price_lists) {
      return category.supplier_price_lists.pricing_data;
    }
    return category.category_pricing || {};
  };

  const getUnitLabel = (category: any) => {
    if (category.pricing_model === 'unit') {
      return category.category_pricing?.unit_label || 'stuks';
    }
    if (category.pricing_model === 'shared' && category.supplier_price_lists) {
      return category.supplier_price_lists.unit_label || 'gr';
    }
    return 'gr';
  };

  const categorizedItems = categories.map(category => ({
    ...category,
    items: menuItems.filter(item => item.category_id === category.id),
    pricing: getEffectivePricing(category),
    unitLabel: getUnitLabel(category)
  }));

  const menuUrl = `${window.location.origin}/menu/${supplierId}`;

  return (
    <div className="space-y-6">
      {/* Preview Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Preview</CardTitle>
              <CardDescription>
                Bekijk hoe je menu eruit ziet voor klanten
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {menuSettings?.is_published && (
                <Badge variant="default" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Live
                </Badge>
              )}
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Delen
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporteren
              </Button>
              {menuSettings?.is_published && (
                <Button size="sm" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Bekijk Live
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {menuSettings?.is_published ? (
            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <Globe className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  Je menu is live!
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Deel deze link: <code className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-xs">{menuUrl}</code>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <Globe className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800 dark:text-orange-200">
                  Menu nog niet gepubliceerd
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-300">
                  Ga naar "Menu Instellingen" om je menu te publiceren
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Preview */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Menu Preview Content */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-2">
                {menuSettings?.menu_title || 'Menu Titel'}
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm text-green-600 dark:text-green-300">
                {menuSettings?.contact_info && typeof menuSettings.contact_info === 'object' && menuSettings.contact_info !== null && (
                  <>
                    {(menuSettings.contact_info as any)?.wire && (
                      <span>Wire: {(menuSettings.contact_info as any).wire}</span>
                    )}
                    {(menuSettings.contact_info as any)?.telegram && (
                      <span>Telegram: {(menuSettings.contact_info as any).telegram}</span>
                    )}
                    {(menuSettings.contact_info as any)?.email && (
                      <span>Email: {(menuSettings.contact_info as any).email}</span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorizedItems.map((category) => (
                <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                    <Badge variant="outline">
                      {category.pricing_model === 'shared' && 'Gedeeld'}
                      {category.pricing_model === 'unique' && 'Uniek'}
                      {category.pricing_model === 'unit' && 'Per Eenheid'}
                    </Badge>
                  </div>
                  
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  )}

                  {/* Products */}
                  <div className="space-y-3 mb-4">
                    {category.items.length > 0 ? (
                      category.items.map((item) => (
                        <div key={item.id} className="text-sm">
                          <span className="font-medium">{item.name}</span>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Geen producten toegevoegd</p>
                    )}
                  </div>

                  {/* Pricing */}
                  {Object.keys(category.pricing).length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm">Prijzen</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(category.pricing)
                            .filter(([key]) => key !== 'unit_label')
                            .map(([weight, price]) => (
                            <div key={weight} className="flex justify-between">
                              <span>{weight}{category.unitLabel}</span>
                              <span className="font-medium">€{String(price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            {menuSettings?.footer_message && (
              <div className="text-center mt-8 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  {menuSettings.footer_message}
                </p>
              </div>
            )}

            {/* Empty State */}
            {categorizedItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-medium mb-2">Nog geen categorieën</h3>
                <p className="text-muted-foreground">
                  Ga naar "Categorieën & Producten" om je eerste categorie aan te maken
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}