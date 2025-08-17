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
      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Top Leveranciers */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Top Leveranciers</h3>
            <div className="space-y-2">
              {displaySuppliers.length > 0 ? (
                displaySuppliers.map((supplier, index) => (
                  <Link
                    key={supplier.id}
                    to={`/aanbod/${supplier.profiles.username}`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center truncate"
                  >
                    {index + 1}. {supplier.business_name}
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Binnenkort beschikbaar</p>
              )}
            </div>
          </div>

          {/* WietForum Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">WietForum Info</h3>
            <div className="space-y-2">
              <Link
                to="/over"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
              >
                Over
              </Link>
              <Link
                to="/faq"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
              >
                FAQ
              </Link>
              <Link
                to="/blog"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Extra */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Extra</h3>
            <div className="space-y-2">
              <Link
                to="/moonrocks"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
              >
                Moonrocks kopen
              </Link>
              <Link
                to="/weetgod"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
              >
                Weetgod menu
              </Link>
              <Link
                to="/suppliers"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
              >
                Wiet online kopen
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-6 md:mt-8 pt-4 md:pt-6">
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            © 2024 WietForum. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}