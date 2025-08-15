import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupplierMenuItem } from '@/types/supplier';
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

  if (isLoading) return <div className="text-muted-foreground">Menukaart laden...</div>;

  if (!items || items.length === 0) {
    return <div className="text-muted-foreground text-sm">Nog geen items beschikbaar.</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium flex items-center gap-2">
              {item.name}
              {item.category && (
                <Badge variant="secondary" className="text-xs">{item.category}</Badge>
              )}
            </div>
          </div>
          {item.description && (
            <div className="text-sm text-muted-foreground mb-2">{item.description}</div>
          )}
          <div className="space-y-1">
            {/* Show pricing tiers if available */}
            {item.pricing_tiers && typeof item.pricing_tiers === 'object' && Object.keys(item.pricing_tiers).length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {Object.entries(item.pricing_tiers).map(([weight, price]) => (
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
  );
};

export default SupplierMenu;