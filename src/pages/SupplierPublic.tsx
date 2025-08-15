import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SupplierHeader } from '@/components/supplier/SupplierHeader';
import { SupplierStats } from '@/components/supplier/SupplierStats';
import { SupplierFeatures } from '@/components/supplier/SupplierFeatures';
import { SupplierMenu } from '@/components/supplier/SupplierMenu';
import { SupplierUSPSection } from '@/components/supplier/SupplierUSPSection';
import { SupplierOrderingProcess } from '@/components/supplier/SupplierOrderingProcess';
import { SupplierContactSection } from '@/components/supplier/SupplierContactSection';
import { Loader2, MessageCircle, Send, Star, MapPin, Clock, Package } from 'lucide-react';
import { SupplierProfile } from '@/types/supplier';

export default function SupplierPublic() {
  const { username } = useParams<{ username: string }>();

  // Fetch supplier by username
  const { data: supplier, isLoading } = useQuery({
    queryKey: ['public-supplier', username],
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
      return {
        ...data,
        contact_info: data.contact_info || {},
        stats: data.stats || {},
        features: data.features || [],
        delivery_areas: data.delivery_areas || [],
        why_choose_us: data.why_choose_us || []
      } as SupplierProfile;
    },
    enabled: !!username
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!supplier) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="text-center p-12">
              <h2 className="text-xl font-semibold mb-2">Leverancier Niet Gevonden</h2>
              <p className="text-muted-foreground">
                De leverancier die je zoekt bestaat niet of is niet actief.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative">
          <SupplierHeader supplier={supplier} isOwner={false} onEdit={() => {}} />
          
          {/* Floating Contact Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {supplier.contact_info?.telegram && (
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => window.open(`https://t.me/${supplier.contact_info.telegram.replace('@', '')}`)}
              >
                <Send className="h-4 w-4 mr-2" />
                Telegram
              </Button>
            )}
            {supplier.contact_info?.wire && (
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.open(`https://wire.com/${supplier.contact_info.wire.replace('@', '')}`)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Wire
              </Button>
            )}
          </div>
        </div>

        <div className="container mx-auto p-6 space-y-8">
          {/* Stats */}
          <SupplierStats supplier={supplier} />

          {/* Features & Services */}
          <SupplierFeatures supplier={supplier} />

          <Separator />

          {/* Menu Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold">{supplier.business_name} Menukaart</h2>
            </div>
            <SupplierMenu supplierId={supplier.id} />
          </div>

          <Separator />

          {/* USP Section */}
          <SupplierUSPSection 
            supplierName={supplier.business_name} 
            descriptions={(supplier.why_choose_us_descriptions as Record<string, string>) || {}}
            stats={supplier.stats}
          />

          <Separator />

          {/* Ordering Process */}
          <SupplierOrderingProcess 
            supplierName={supplier.business_name}
            productName={supplier.product_name || 'producten'}
            descriptions={(supplier.ordering_process_descriptions as Record<string, string>) || {}}
          />

          <Separator />

          {/* Contact Section */}
          <SupplierContactSection 
            supplierName={supplier.business_name}
            description={supplier.contact_description}
            contactInfo={{
              wire: supplier.contact_info?.wire,
              telegram: supplier.contact_info?.telegram,
              email: supplier.contact_info?.email
            }}
          />
        </div>
      </div>
    </Layout>
  );
}