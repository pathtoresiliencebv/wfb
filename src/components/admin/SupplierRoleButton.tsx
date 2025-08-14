import React from 'react';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SupplierRoleButtonProps {
  userId: string;
  currentRole: string;
  username: string;
}

export function SupplierRoleButton({ userId, currentRole, username }: SupplierRoleButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const assignSupplierRoleMutation = useMutation({
    mutationFn: async () => {
      // Update user role to supplier
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'supplier' })
        .eq('user_id', userId);

      if (roleError) throw roleError;

      // Create supplier profile
      const { error: profileError } = await supabase
        .from('supplier_profiles')
        .insert({
          user_id: userId,
          business_name: username,
          description: null,
          contact_info: {},
          stats: {},
          features: [],
          ranking: 0,
          is_active: true,
        });

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Leverancier rol toegewezen',
        description: `${username} is nu een leverancier.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Fout',
        description: 'Kon leverancier rol niet toewijzen.',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  const removeSupplierRoleMutation = useMutation({
    mutationFn: async () => {
      // Remove supplier profile
      const { error: profileError } = await supabase
        .from('supplier_profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Update user role back to user
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('user_id', userId);

      if (roleError) throw roleError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Leverancier rol ingetrokken',
        description: `${username} is geen leverancier meer.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Fout',
        description: 'Kon leverancier rol niet intrekken.',
        variant: 'destructive',
      });
      console.error(error);
    },
  });

  const isSupplier = currentRole === 'supplier';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        if (isSupplier) {
          removeSupplierRoleMutation.mutate();
        } else {
          assignSupplierRoleMutation.mutate();
        }
      }}
      disabled={assignSupplierRoleMutation.isPending || removeSupplierRoleMutation.isPending}
      className="flex items-center gap-1"
    >
      <Store className="h-3 w-3" />
      {isSupplier ? 'Intrekken' : 'Maak leverancier'}
    </Button>
  );
}