import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

export function Footer() {
  const { data: topSuppliers = [] } = useQuery({
    queryKey: ['footer-top-suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_profiles')
        .select(`
          id,
          business_name,
          ranking,
          profiles!inner (
            username
          )
        `)
        .eq('is_active', true)
        .order('ranking', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Footer supplier query error:', error);
        throw error;
      }
      
      console.log('Footer suppliers data:', data);
      return data || [];
    },
  });

  // Filter suppliers with ranking > 0 first, then fill with others
  const rankedSuppliers = topSuppliers.filter(s => s.ranking > 0);
  const otherSuppliers = topSuppliers.filter(s => s.ranking === 0);
  const displaySuppliers = [...rankedSuppliers, ...otherSuppliers].slice(0, 3);

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Top Leveranciers - Centered */}
        <div className="max-w-md mx-auto text-center">
          <h3 className="font-semibold text-foreground mb-4 md:mb-6 text-base md:text-lg">Top Leveranciers</h3>
          <div className="space-y-2">
            {displaySuppliers.length > 0 ? (
              displaySuppliers.map((supplier, index) => (
                <Link
                  key={supplier.id}
                  to={`/aanbod/${supplier.profiles.username}`}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center justify-center hover:font-medium"
                >
                  {index + 1}. {supplier.business_name}
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Binnenkort beschikbaar</p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 md:mt-12 pt-6 md:pt-8">
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            © 2024 WietForum. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}