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
      <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-secondary/5">
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />
          
          <SupplierHeader supplier={supplier} isOwner={false} onEdit={() => {}} />
          
          {/* Enhanced Floating Contact Buttons */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-3">
            {supplier.contact_info?.telegram && (
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => window.open(`https://t.me/${supplier.contact_info.telegram.replace('@', '')}`)}
              >
                <Send className="h-5 w-5 mr-2" />
                Telegram
              </Button>
            )}
            {supplier.contact_info?.wire && (
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => window.open(`https://wire.com/${supplier.contact_info.wire.replace('@', '')}`)}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Wire
              </Button>
            )}
          </div>
        </div>

        <div className="container mx-auto p-6 space-y-12">
          {/* Enhanced Menu Section */}
          <div className="relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <Package className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {supplier.business_name} Menukaart
                </h2>
                <Package className="h-8 w-8 text-primary" />
              </div>
              {supplier.description && (
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
                  {supplier.description}
                </p>
              )}
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="bg-gradient-to-r from-card/50 to-card/30 rounded-2xl p-8 border border-border/50 shadow-lg">
            <SupplierStats supplier={supplier} />
          </div>

          <Separator className="my-12" />

          {/* Enhanced Features Section */}
          <div className="bg-gradient-to-l from-card/50 to-card/30 rounded-2xl p-8 border border-border/50 shadow-lg">
            <SupplierFeatures supplier={supplier} />
          </div>

          <Separator className="my-12" />

          {/* Enhanced Menu Section */}
          <div className="relative">
            <SupplierMenu supplierId={supplier.id} />
          </div>

          <Separator className="my-12" />

          {/* Enhanced USP Section */}
          <div className="bg-gradient-to-br from-primary/5 via-card/80 to-secondary/5 rounded-2xl p-8 border border-primary/20 shadow-lg">
            <SupplierUSPSection 
              supplierName={supplier.business_name} 
              descriptions={(supplier.why_choose_us_descriptions as Record<string, string>) || {}}
              stats={supplier.stats}
            />
          </div>

          <Separator className="my-12" />

          {/* Enhanced Ordering Process */}
          <div className="relative">
            <SupplierOrderingProcess 
              supplierName={supplier.business_name}
              productName={supplier.product_name || 'producten'}
              descriptions={(supplier.ordering_process_descriptions as Record<string, string>) || {}}
            />
          </div>

          <Separator className="my-12" />

          {/* Enhanced Contact Section */}
          <div data-contact-section className="bg-gradient-to-tr from-secondary/5 via-card/80 to-primary/5 rounded-2xl p-8 border border-secondary/20 shadow-lg">
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
      </div>
    </Layout>
  );
}