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

      if (error) throw error;
      return data || [];
    },
  });

  // Filter suppliers with ranking > 0 first, then fill with others
  const rankedSuppliers = topSuppliers.filter(s => s.ranking > 0);
  const otherSuppliers = topSuppliers.filter(s => s.ranking === 0);
  const displaySuppliers = [...rankedSuppliers, ...otherSuppliers].slice(0, 3);

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Top Leveranciers */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Top Leveranciers</h3>
            <div className="space-y-2">
              {displaySuppliers.length > 0 ? (
                displaySuppliers.map((supplier, index) => (
                  <Link
                    key={supplier.id}
                    to={`/aanbod-${supplier.profiles.username}`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
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
            <h3 className="font-semibold text-foreground mb-4">WietForum Info</h3>
            <div className="space-y-2">
              <Link
                to="/over"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Over
              </Link>
              <Link
                to="/faq"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/blog"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Extra */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Extra</h3>
            <div className="space-y-2">
              <Link
                to="/moonrocks"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Moonrocks kopen
              </Link>
              <Link
                to="/weetgod"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Weetgod menu
              </Link>
              <Link
                to="/suppliers"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Wiet online kopen
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-6">
          <p className="text-sm text-muted-foreground text-center">
            © 2024 WietForum. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}