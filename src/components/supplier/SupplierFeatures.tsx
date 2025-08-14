import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Leaf, Shield, Clock, Package, Truck } from 'lucide-react';
import { SupplierProfile } from '@/types/supplier';

interface SupplierFeaturesProps {
  supplier: SupplierProfile;
}

export const SupplierFeatures: React.FC<SupplierFeaturesProps> = ({ supplier }) => {
  const defaultFeatures = [
    'Volledig gruisloos geleverd',
    'Discrete verpakking',
    'Snelle bezorging',
    'Hoogste kwaliteit',
    'Betrouwbare service',
    '24/7 bereikbaar'
  ];

  const features = supplier.features?.length ? supplier.features : defaultFeatures;
  const whyChooseUs = supplier.why_choose_us?.length ? supplier.why_choose_us : [
    'Jarenlange ervaring in de cannabisbranche',
    'Rechtstreeks van kwekers uit Californië en Nederland',
    'Uitgebreide kwaliteitscontrole op alle producten',
    'Discrete en veilige bezorging aan huis',
    'Persoonlijke service en advies op maat'
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Service Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Onze Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Why Choose Us */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Waarom Kiezen Voor Ons?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Info */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-600" />
            Bezorginformatie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Minimum Bestelling
              </h4>
              <p className="text-2xl font-bold text-green-600">
                €{supplier.minimum_order || 25}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Bezorgkosten
              </h4>
              <p className="text-2xl font-bold text-green-600">
                {supplier.delivery_fee === 0 ? 'Gratis' : `€${supplier.delivery_fee}`}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Bezorggebieden</h4>
              <div className="flex flex-wrap gap-1">
                {supplier.delivery_areas?.length ? (
                  supplier.delivery_areas.slice(0, 6).map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Heel België
                  </Badge>
                )}
                {supplier.delivery_areas && supplier.delivery_areas.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{supplier.delivery_areas.length - 6} meer
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};