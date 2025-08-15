import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Tag } from 'lucide-react';

interface AutoCategoryManagerProps {
  supplierId: string;
}

interface CategoryData {
  category: string;
  product_count: number;
}

export function AutoCategoryManager({ supplierId }: AutoCategoryManagerProps) {
  // Fetch unique categories with product counts
  const { data: categories, isLoading } = useQuery({
    queryKey: ['supplier-categories', supplierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_menu_items')
        .select('category')
        .eq('supplier_id', supplierId)
        .not('category', 'is', null)
        .neq('category', '');

      if (error) throw error;

      // Count products per category
      const categoryCount: Record<string, number> = {};
      data.forEach(item => {
        if (item.category) {
          categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
        }
      });

      return Object.entries(categoryCount).map(([category, count]) => ({
        category,
        product_count: count
      }));
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Categorieën laden...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Gedetecteerde Categorieën
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Geen categorieën gevonden</h3>
            <p className="text-muted-foreground mb-4">
              Voeg eerst producten toe in de Prijslijsten tab en geef ze categorieën.
            </p>
            <p className="text-sm text-muted-foreground">
              Categorieën worden automatisch herkend uit je prijslijst.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Automatisch Gedetecteerde Categorieën
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Deze categorieën zijn automatisch herkend uit je prijslijst. 
            Je kunt categorieën aanpassen in de Prijslijsten tab.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((categoryData) => (
              <Card key={categoryData.category} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-lg">{categoryData.category}</h3>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {categoryData.product_count}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {categoryData.product_count} {categoryData.product_count === 1 ? 'product' : 'producten'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">💡 Categorie Management:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Categorieën worden automatisch gedetecteerd uit je prijslijst</li>
            <li>• Ga naar de Prijslijsten tab om categorieën aan te passen</li>
            <li>• Populaire categorieën: Haze, Kush, Indica, Sativa, Hybrid</li>
            <li>• Houd categorienamen consistent voor een professionele uitstraling</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}