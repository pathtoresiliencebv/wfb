import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SupplierStats {
  menuItemsCount: number;
  customersCount: number;
  rating: number;
  deliveryRate: number;
}

export const useSupplierStats = (supplierId: string | undefined) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['supplier-stats', supplierId],
    queryFn: async () => {
      if (!supplierId) return null;

      // Count menu items
      const { count: menuItemsCount } = await supabase
        .from('supplier_menu_items')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', supplierId)
        .eq('is_available', true);

      // Get supplier profile for stats
      const { data: profile } = await supabase
        .from('supplier_profiles')
        .select('stats')
        .eq('id', supplierId)
        .single();

      const statsData = profile?.stats as any || {};

      return {
        menuItemsCount: menuItemsCount || 0,
        customersCount: statsData.customers || 0,
        rating: statsData.rating || 0,
        deliveryRate: 100, // Always 100% for now
      } as SupplierStats;
    },
    enabled: !!supplierId,
  });

  return {
    stats,
    isLoading,
  };
};
