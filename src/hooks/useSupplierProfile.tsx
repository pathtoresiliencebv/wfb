import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export const useSupplierProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: supplierProfile, isLoading } = useQuery({
    queryKey: ['supplier-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('supplier_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id && user?.role === 'supplier',
  });

  const createSupplierProfile = useMutation({
    mutationFn: async (profileData: {
      business_name: string;
      description?: string;
      contact_info?: Json;
      stats?: Json;
      features?: string[];
    }) => {
      if (!user?.id) throw new Error('No user ID');

      // First update the user's role to supplier
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'supplier' })
        .eq('user_id', user.id);

      if (roleError) throw roleError;

      // Then create the supplier profile  
      const { error: profileError } = await supabase
        .from('supplier_profiles')
        .insert({
          user_id: user.id,
          business_name: profileData.business_name,
          description: profileData.description || null,
          contact_info: (profileData.contact_info || {}) as Json,
          stats: (profileData.stats || {}) as Json,
          features: profileData.features || [],
          ranking: 0,
          is_active: true,
        });

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-profile'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Leverancier profiel aangemaakt');
    },
    onError: (error) => {
      toast.error('Fout bij aanmaken leverancier profiel');
      console.error(error);
    },
  });

  return {
    supplierProfile,
    isLoading,
    createSupplierProfile,
    isSupplier: user?.role === 'supplier',
  };
};