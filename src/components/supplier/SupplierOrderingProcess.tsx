import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowRight, Package, MessageSquare, MessageCircle, Search, CheckCircle, CreditCard, Truck, Gift, LucideIcon } from 'lucide-react';

interface SupplierOrderingProcessProps {
  supplierName: string;
  productName: string;
  descriptions: Record<string, string>;
}

const PROCESS_STEPS: Array<{
  id: string;
  icon: LucideIcon;
  title: string;
  defaultDescription: string;
}> = [
  {
    id: 'contact',
    icon: MessageCircle,
    title: 'Maak Contact',
    defaultDescription: 'Neem contact op via Wire of Telegram voor je bestelling'
  },
  {
    id: 'menu',
    icon: Search,
    title: 'Zoek & Selecteer',
    defaultDescription: 'Bekijk onze menukaart en kies je favoriete producten'
  },
  {
    id: 'order',
    icon: CheckCircle,
    title: 'Bevestig Bestelling',
    defaultDescription: 'Bevestig je bestelling en leveringsdetails'
  },
  {
    id: 'address',
    icon: CreditCard,
    title: 'Betaal & Adres',
    defaultDescription: 'Betaal via onze veilige betaalmethoden en geef je adres door'
  },
  {
    id: 'delivery',
    icon: Truck,
    title: 'Discrete Bezorging',
    defaultDescription: 'Je bestelling wordt discreet aan huis bezorgd'
  },
  {
    id: 'complete',
    icon: Gift,
    title: 'Ontvang & Geniet',
    defaultDescription: 'Geniet van je hoogwaardige producten'
  }
];

export const SupplierOrderingProcess: React.FC<SupplierOrderingProcessProps> = ({
  supplierName,
  productName,
  descriptions
}) => {
  const getDescription = (stepId: string, defaultDescription: string) => {
    return descriptions[stepId] || defaultDescription;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
        <CardTitle className="flex items-center gap-3 text-2xl text-center justify-center">
          <ShoppingCart className="h-6 w-6 text-primary" />
          Hoe kun je {productName} bestellen bij {supplierName}?
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {/* Process Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PROCESS_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div 
                key={step.id} 
                className="group relative bg-gradient-to-br from-card via-card/95 to-card/80 rounded-2xl p-6 border border-border shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.05] hover:-translate-y-1"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-xl ring-4 ring-background group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                
                {/* Icon Circle with Lucide Icon */}
                <div className="w-24 h-24 mx-auto mb-5 bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 rounded-3xl flex items-center justify-center group-hover:from-primary/30 group-hover:via-primary/25 group-hover:to-primary/20 transition-all duration-500 group-hover:scale-110 shadow-lg">
                  <StepIcon className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
              
              {/* Content */}
              <div className="text-center space-y-3">
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getDescription(step.id, step.defaultDescription)}
                </p>
              </div>
              
              {/* Connection Arrow for Desktop */}
              {index < PROCESS_STEPS.length - 1 && index % 3 !== 2 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary/30 to-primary/20 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </div>
              )}
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>
        
        {/* Call to Action Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Package className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">
                  Klaar om te bestellen bij {supplierName}?
                </h3>
                <Package className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">
                Scroll naar boven en bekijk onze {productName} of neem direct contact op via de knoppen!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Bekijk Menukaart
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const contactSection = document.querySelector('[data-contact-section]');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-lg font-semibold transition-all duration-300"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Direct Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};