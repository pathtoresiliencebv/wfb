import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Shield, Star, Truck, Users } from 'lucide-react';

interface SupplierUSPSectionProps {
  supplierName: string;
  descriptions: Record<string, string>;
  stats?: {
    customers?: number;
    rating?: number;
    delivery_time?: string;
    success_rate?: number;
  };
}

const USP_ITEMS = [
  {
    id: 'experience',
    icon: Star,
    title: 'Ruim {{years}} jaar actief',
    defaultDescription: 'Jarenlange ervaring in de branche met tevreden klanten.'
  },
  {
    id: 'delivery',
    icon: Truck,
    title: 'Levert {{days}} dagen per week',
    defaultDescription: 'Betrouwbare en snelle levering door de week.'
  },
  {
    id: 'appointments',
    icon: Clock,
    title: 'Gemaakte afspraken na',
    defaultDescription: 'We houden ons altijd aan gemaakte afspraken en tijden.'
  },
  {
    id: 'quality',
    icon: Shield,
    title: 'Kwaliteit gegarandeerd',
    defaultDescription: 'Alleen de beste kwaliteit producten voor onze klanten.'
  },
  {
    id: 'service',
    icon: Users,
    title: 'Persoonlijke service',
    defaultDescription: 'Elke klant krijgt persoonlijke aandacht en service.'
  },
  {
    id: 'reliability',
    icon: CheckCircle,
    title: 'Betrouwbare leverancier',
    defaultDescription: 'Al jaren een betrouwbare partner voor onze klanten.'
  }
];

export const SupplierUSPSection: React.FC<SupplierUSPSectionProps> = ({
  supplierName,
  descriptions,
  stats
}) => {
  const getTitle = (item: typeof USP_ITEMS[0]) => {
    let title = item.title;
    
    // Replace placeholders with actual data
    if (item.id === 'experience') {
      // Calculate years since creation or use a default
      const years = '5'; // Could be calculated from supplier creation date
      title = title.replace('{{years}}', years);
    }
    
    if (item.id === 'delivery') {
      const days = '7'; // Could come from supplier settings
      title = title.replace('{{days}}', days);
    }
    
    return title;
  };

  const getDescription = (item: typeof USP_ITEMS[0]) => {
    return descriptions[item.id] || item.defaultDescription;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          Waarom bestellen bij {supplierName}?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {USP_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{getTitle(item)}</h4>
                  <p className="text-xs text-muted-foreground">{getDescription(item)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};