import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Menu, ShoppingCart, MapPin, Package, CheckCircle } from 'lucide-react';

interface SupplierOrderingProcessProps {
  supplierName: string;
  productName: string;
  descriptions: Record<string, string>;
}

const PROCESS_STEPS = [
  {
    id: 'contact',
    icon: MessageCircle,
    title: 'Contact Opnemen',
    defaultDescription: 'Neem contact op via Telegram, Wire of stuur een bericht.'
  },
  {
    id: 'menu',
    icon: Menu,
    title: 'Menukaart Bekijken',
    defaultDescription: 'Bekijk onze uitgebreide menukaart met alle beschikbare producten.'
  },
  {
    id: 'order',
    icon: ShoppingCart,
    title: 'Bestelling Plaatsen',
    defaultDescription: 'Geef door wat je wilt bestellen en in welke hoeveelheden.'
  },
  {
    id: 'address',
    icon: MapPin,
    title: 'Adresgegevens Delen',
    defaultDescription: 'Deel je bezorgadres en contactgegevens voor de levering.'
  },
  {
    id: 'delivery',
    icon: Package,
    title: 'Bezorging Plannen',
    defaultDescription: 'We plannen de bezorging op een voor jou geschikt moment.'
  },
  {
    id: 'complete',
    icon: CheckCircle,
    title: 'Bestelling Ontvangen',
    defaultDescription: 'Ontvang je bestelling en geniet van de kwaliteit!'
  }
];

export const SupplierOrderingProcess: React.FC<SupplierOrderingProcessProps> = ({
  supplierName,
  productName,
  descriptions
}) => {
  const getDescription = (step: typeof PROCESS_STEPS[0]) => {
    return descriptions[step.id] || step.defaultDescription;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Hoe kun je {productName} bestellen bij {supplierName}?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative">
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/30">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 relative">
                    <Icon className="h-6 w-6 text-primary" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-2">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{getDescription(step)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};