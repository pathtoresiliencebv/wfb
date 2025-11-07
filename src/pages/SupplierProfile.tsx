import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupplierStats, SupplierContact } from '@/types/supplier';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CrownBadge } from '@/components/ui/crown-badge';
import { 
  Star, 
  Users, 
  Clock, 
  CheckCircle, 
  MessageCircle, 
  Phone,
  Mail,
  Shield,
  Truck,
  MapPin,
  Package,
  Euro,
  Calendar,
  Zap,
  Award,
  Check
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Layout } from '@/components/layout/Layout';
import { BadgedText } from '@/lib/badgeParser';
import { Skeleton } from '@/components/ui/skeleton';
import { SupplierMenu } from '@/components/supplier/SupplierMenu';

export const SupplierProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  const { data: supplier, isLoading, error } = useQuery({
    queryKey: ['supplier-profile', username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_profiles')
        .select(`
          *,
          profiles!inner(username, display_name, avatar_url, reputation)
        `)
        .eq('profiles.username', username)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!username,
  });

  React.useEffect(() => {
    if ((supplier as any)?.business_name) {
      document.title = `${(supplier as any).business_name} - Leverancier | Wiet Forum België`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', (supplier as any).description || `Bekijk ${(supplier as any).business_name} leverancier profiel op Wiet Forum België.`);
      }
    }
  }, [supplier]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !supplier) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">
              Leverancier niet gevonden
            </h1>
            <p className="text-muted-foreground">
              Deze leverancier bestaat niet of is niet meer actief.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRankBadge = () => {
    if (supplier.ranking === 0) return null;
    if (supplier.ranking <= 3) {
      return <CrownBadge rank={supplier.ranking as 1 | 2 | 3} size="lg" />;
    }
    return <CrownBadge size="lg" />;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header Section */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={supplier.profiles.avatar_url} />
                  <AvatarFallback className="text-xl">
                    {getInitials(supplier.business_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{supplier.business_name}</h1>
                    {getRankBadge()}
                  </div>
                  <p className="text-lg text-muted-foreground mb-3">
                    @{supplier.profiles.username}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Geverifieerde Leverancier
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Star className="h-3 w-3" />
                      {supplier.profiles.reputation} reputatie
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {supplier.description && (
            <Card>
              <CardHeader>
                <CardTitle>Over {supplier.business_name}</CardTitle>
              </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          <BadgedText text={supplier.description} />
        </p>
      </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(supplier.stats as SupplierStats).customers && (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">{(supplier.stats as SupplierStats).customers}+</div>
                <p className="text-sm text-muted-foreground">Tevreden Klanten</p>
              </CardContent>
            </Card>
          )}
            
          {(supplier.stats as SupplierStats).rating && (
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-yellow-500 fill-current mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">{(supplier.stats as SupplierStats).rating}</div>
                <p className="text-sm text-muted-foreground">Gemiddelde Rating</p>
              </CardContent>
            </Card>
          )}
            
          {(supplier.stats as SupplierStats).delivery_time && (
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">{(supplier.stats as SupplierStats).delivery_time}</div>
                <p className="text-sm text-muted-foreground">Bezorgtijd</p>
              </CardContent>
            </Card>
          )}
            
          {(supplier.stats as SupplierStats).success_rate && (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">{(supplier.stats as SupplierStats).success_rate}%</div>
                <p className="text-sm text-muted-foreground">Succesvolle Leveringen</p>
              </CardContent>
            </Card>
          )}
          </div>

          {/* Wie is [Supplier]? Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Wie is {supplier.business_name}?
              </CardTitle>
            </CardHeader>
      <CardContent className="space-y-4">
        {supplier.description && (
          <p className="text-muted-foreground leading-relaxed">
            <BadgedText text={supplier.description} />
          </p>
        )}
              
              {/* Features Section */}
              {supplier.features && supplier.features.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Waarom kiezen voor {supplier.business_name}?
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {supplier.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {supplier.delivery_areas && supplier.delivery_areas.length > 0 && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-medium">{supplier.delivery_areas.length}</div>
                    <div className="text-sm text-muted-foreground">Bezorggebieden</div>
                  </div>
                )}
                
                {supplier.minimum_order && supplier.minimum_order > 0 && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Euro className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-medium">€{supplier.minimum_order}</div>
                    <div className="text-sm text-muted-foreground">Minimum bestelling</div>
                  </div>
                )}

                {supplier.delivery_fee !== undefined && (
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="font-medium">
                      {supplier.delivery_fee === 0 ? 'Gratis' : `€${supplier.delivery_fee}`}
                    </div>
                    <div className="text-sm text-muted-foreground">Bezorgkosten</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Menu / Prijzen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Menukaart & Prijzen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SupplierMenu supplierId={supplier.id} />
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Contact & Bestellen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Contact Description */}
                {supplier.contact_description && (
                  <p className="text-muted-foreground text-center bg-muted/30 p-4 rounded-lg">
                    {supplier.contact_description}
                  </p>
                )}

                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(supplier.contact_info as SupplierContact).wire && (
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                      <img src="/src/assets/icons/wire.webp" alt="Wire" className="h-8 w-8" />
                      <div>
                        <p className="font-medium">Wire</p>
                        <p className="text-sm text-muted-foreground">{(supplier.contact_info as SupplierContact).wire}</p>
                      </div>
                    </div>
                  )}
                  
                  {(supplier.contact_info as SupplierContact).telegram && (
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                      <img src="/src/assets/icons/telegram.webp" alt="Telegram" className="h-8 w-8" />
                      <div>
                        <p className="font-medium">Telegram</p>
                        <p className="text-sm text-muted-foreground">{(supplier.contact_info as SupplierContact).telegram}</p>
                      </div>
                    </div>
                  )}
                  
                  {(supplier.contact_info as SupplierContact).email && (
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                      <Mail className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{(supplier.contact_info as SupplierContact).email}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ordering Process */}
                <div className="bg-primary/5 rounded-lg p-6">
                  <h4 className="font-semibold mb-4 text-center">Bestelproces</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <img src="/src/assets/icons/zoeken.webp" alt="Zoeken" className="h-12 w-12 mx-auto mb-2" />
                      <div className="text-sm font-medium">1. Kiezen</div>
                      <div className="text-xs text-muted-foreground">Selecteer producten</div>
                    </div>
                    <div className="text-center">
                      <img src="/src/assets/icons/afspraak.webp" alt="Contact" className="h-12 w-12 mx-auto mb-2" />
                      <div className="text-sm font-medium">2. Contact</div>
                      <div className="text-xs text-muted-foreground">Neem contact op</div>
                    </div>
                    <div className="text-center">
                      <img src="/src/assets/icons/akkoord.webp" alt="Akkoord" className="h-12 w-12 mx-auto mb-2" />
                      <div className="text-sm font-medium">3. Akkoord</div>
                      <div className="text-xs text-muted-foreground">Bevestig bestelling</div>
                    </div>
                    <div className="text-center">
                      <img src="/src/assets/icons/betalen.webp" alt="Betalen" className="h-12 w-12 mx-auto mb-2" />
                      <div className="text-sm font-medium">4. Betalen</div>
                      <div className="text-xs text-muted-foreground">Veilige betaling</div>
                    </div>
                    <div className="text-center">
                      <img src="/src/assets/icons/bezorgen.webp" alt="Bezorgen" className="h-12 w-12 mx-auto mb-2" />
                      <div className="text-sm font-medium">5. Ontvangen</div>
                      <div className="text-xs text-muted-foreground">Discrete levering</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button size="lg" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Gesprek
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};