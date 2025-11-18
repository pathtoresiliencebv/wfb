import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CrownBadge } from '@/components/ui/crown-badge';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const FeedTopSuppliers = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['feedTopSuppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_profiles')
        .select(`
          id,
          business_name,
          logo_image,
          ranking,
          theme_color,
          stats,
          user_id,
          profiles!supplier_profiles_user_id_fkey(username)
        `)
        .eq('is_active', true)
        .order('ranking', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    staleTime: 300000, // 5 minutes
  });

  if (isLoading || suppliers.length === 0) return null;

  return (
    <Card className="overflow-hidden border-primary/20">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary fill-primary" />
            <h3 className="font-heading font-bold text-foreground">Top Leveranciers</h3>
          </div>
          <ChevronRight 
            className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate('/forums')}
          />
        </div>
      </div>
      
      <CardContent className="p-0">
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} divide-y md:divide-y-0 md:divide-x`}>
          {suppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              onClick={() => navigate(`/aanbod/${supplier.profiles?.username}`)}
              className="p-4 hover:bg-accent/50 cursor-pointer transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                    {supplier.logo_image ? (
                      <AvatarImage src={supplier.logo_image} alt={supplier.business_name} />
                    ) : (
                      <AvatarFallback style={{ backgroundColor: supplier.theme_color || '#10b981' }}>
                        {supplier.business_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <CrownBadge rank={1} />
                    </div>
                  )}
                  {index === 1 && (
                    <div className="absolute -top-2 -right-2">
                      <CrownBadge rank={2} />
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute -top-2 -right-2">
                      <CrownBadge rank={3} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                    {supplier.business_name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      {(supplier.stats as any)?.rating || '5.0'}
                    </span>
                    <span>•</span>
                    <span>{(supplier.stats as any)?.customer_count || 0} klanten</span>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
