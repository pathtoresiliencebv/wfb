import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CrownBadge } from '@/components/ui/crown-badge';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';

export const SidebarTopSuppliers: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const { data: topSuppliers, isLoading } = useQuery({
    queryKey: ['sidebar-top-suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_profiles')
        .select(`
          *,
          profiles!inner(username, display_name, avatar_url)
        `)
        .eq('is_active', true)
        .gt('ranking', 0)
        .lte('ranking', 3)
        .order('ranking', { ascending: true })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading || !topSuppliers || topSuppliers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {topSuppliers.map((supplier) => (
        <div
          key={supplier.id}
          className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => navigate(`/aanbod/${supplier.profiles.username}`)}
        >
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={supplier.profiles.avatar_url} />
              <AvatarFallback className="text-xs">
                {getInitials(supplier.business_name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1">
              <CrownBadge rank={supplier.ranking as 1 | 2 | 3} size="sm" />
            </div>
          </div>
          
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                {supplier.business_name}
              </div>
              <div className="text-xs text-muted-foreground">
                #{supplier.ranking}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};