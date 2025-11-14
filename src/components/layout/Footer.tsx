import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const logo = '/lovable-uploads/8721330a-f235-4c3b-9c21-85436a192135.png';
  
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Over Ons met Logo */}
          <div className="flex flex-col items-start">
            <img 
              src={logo} 
              alt="Wiet Forum België" 
              className="h-12 w-auto mb-4 object-contain"
            />
            <h3 className="heading-card mb-3">Over Ons</h3>
            <p className="text-small">
              De grootste cannabis community van België. Een veilige plek voor kennis delen en verbinding.
            </p>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="heading-card mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/forums" className="text-small hover:text-primary transition-colors">
                  Forums
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-small hover:text-primary transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/members" className="text-small hover:text-primary transition-colors">
                  Leden
                </Link>
              </li>
              <li>
                <Link to="/gamification" className="text-small hover:text-primary transition-colors">
                  Gamification
                </Link>
              </li>
            </ul>
          </div>

          {/* Cannabis België SEO Pages */}
          <div>
            <h3 className="heading-card mb-4">Cannabis België</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cannabis-belgie" className="text-small hover:text-primary transition-colors font-medium">
                  🌿 Complete Gids
                </Link>
              </li>
              <li className="text-xs text-muted-foreground font-semibold mt-3 mb-1">Provincies:</li>
              <li>
                <Link to="/cannabis-belgie/antwerpen" className="text-small hover:text-primary transition-colors">
                  Antwerpen
                </Link>
              </li>
              <li>
                <Link to="/cannabis-belgie/oost-vlaanderen" className="text-small hover:text-primary transition-colors">
                  Oost-Vlaanderen
                </Link>
              </li>
              <li>
                <Link to="/cannabis-belgie/west-vlaanderen" className="text-small hover:text-primary transition-colors">
                  West-Vlaanderen
                </Link>
              </li>
              <li>
                <Link to="/cannabis-belgie/vlaams-brabant" className="text-small hover:text-primary transition-colors">
                  Vlaams-Brabant
                </Link>
              </li>
              <li>
                <Link to="/cannabis-belgie/limburg" className="text-small hover:text-primary transition-colors">
                  Limburg
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Leveranciers */}
          <div>
            <h3 className="heading-card mb-4">Top Leveranciers</h3>
            <div className="space-y-2">
              {displaySuppliers.length > 0 ? (
                displaySuppliers.map((supplier, index) => (
                  <Link
                    key={supplier.id}
                    to={`/aanbod/${supplier.profiles.username}`}
                    className="block text-small hover:text-primary transition-colors hover:font-medium"
                  >
                    {index + 1}. {supplier.business_name}
                  </Link>
                ))
              ) : (
                <p className="text-small">Binnenkort beschikbaar</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Belangrijke Steden:</h4>
              <ul className="space-y-1">
                <li>
                  <Link to="/cannabis-belgie/antwerpen/antwerpen" className="text-xs hover:text-primary transition-colors">
                    Antwerpen
                  </Link>
                </li>
                <li>
                  <Link to="/cannabis-belgie/oost-vlaanderen/gent" className="text-xs hover:text-primary transition-colors">
                    Gent
                  </Link>
                </li>
                <li>
                  <Link to="/cannabis-belgie/west-vlaanderen/brugge" className="text-xs hover:text-primary transition-colors">
                    Brugge
                  </Link>
                </li>
                <li>
                  <Link to="/cannabis-belgie/vlaams-brabant/leuven" className="text-xs hover:text-primary transition-colors">
                    Leuven
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Informatie & SEO */}
          <div>
            <h3 className="heading-card mb-4">Informatie</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-small hover:text-primary transition-colors">
                  Voorwaarden
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-small hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-small hover:text-primary transition-colors font-medium">
                  🗺️ Sitemap
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Meer Steden:</h4>
              <div className="grid grid-cols-2 gap-1">
                <Link to="/cannabis-belgie/west-vlaanderen/kortrijk" className="text-xs hover:text-primary transition-colors">
                  Kortrijk
                </Link>
                <Link to="/cannabis-belgie/limburg/hasselt" className="text-xs hover:text-primary transition-colors">
                  Hasselt
                </Link>
                <Link to="/cannabis-belgie/antwerpen/mechelen" className="text-xs hover:text-primary transition-colors">
                  Mechelen
                </Link>
                <Link to="/cannabis-belgie/oost-vlaanderen/aalst" className="text-xs hover:text-primary transition-colors">
                  Aalst
                </Link>
                <Link to="/cannabis-belgie/west-vlaanderen/oostende" className="text-xs hover:text-primary transition-colors">
                  Oostende
                </Link>
                <Link to="/cannabis-belgie/limburg/genk" className="text-xs hover:text-primary transition-colors">
                  Genk
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-small">
            © 2024 Wiet Forum België. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}