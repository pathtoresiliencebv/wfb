import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isFirst = index === 0;
            const isLast = index === PROCESS_STEPS.length - 1;
            
            return (
              <div key={step.id} className="relative group">
                {/* Connection Line */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-6 left-full w-6 h-0.5 bg-gradient-to-r from-primary/30 to-primary/10 z-0" />
                )}
                
                <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-background via-muted/30 to-muted/10 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative z-10">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>
                  
                  {/* Icon Container */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  {/* Step Content */}
                  <h4 className="font-semibold text-base mb-3 text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{getDescription(step)}</p>
                  
                  {/* Decorative Element */}
                  <div className="mt-4 w-12 h-1 bg-gradient-to-r from-primary/30 to-transparent rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Call to Action */}
        <div className="mt-8 text-center p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
          <h3 className="text-lg font-semibold text-foreground mb-2">Klaar om te bestellen?</h3>
          <p className="text-muted-foreground mb-4">Scroll naar boven om contact op te nemen en je bestelling te plaatsen!</p>
          <Button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Start Bestelling
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};