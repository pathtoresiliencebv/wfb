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
  Truck
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Layout } from '@/components/layout/Layout';
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
                  {supplier.description}
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

          {/* Menu / Prijzen */}
          <Card>
            <CardHeader>
              <CardTitle>Menukaart / Prijzen</CardTitle>
            </CardHeader>
            <CardContent>
              <SupplierMenu supplierId={supplier.id} />
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact opnemen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(supplier.contact_info as SupplierContact).wire && (
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Wire</p>
                      <p className="text-sm text-muted-foreground">{(supplier.contact_info as SupplierContact).wire}</p>
                    </div>
                  </div>
                )}
                
                {(supplier.contact_info as SupplierContact).telegram && (
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Telegram</p>
                      <p className="text-sm text-muted-foreground">{(supplier.contact_info as SupplierContact).telegram}</p>
                    </div>
                  </div>
                )}
                
                {(supplier.contact_info as SupplierContact).email && (
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{(supplier.contact_info as SupplierContact).email}</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button size="lg" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Verstuur Bericht
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