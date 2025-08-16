import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  ArrowRight, 
  Package, 
  MessageSquare, 
  Search, 
  CheckCircle, 
  CreditCard, 
  Truck, 
  Gift 
} from 'lucide-react';

interface SupplierOrderingProcessProps {
  supplierName: string;
  productName: string;
  descriptions: Record<string, string>;
}

const PROCESS_STEPS = [
  {
    id: 'contact',
    icon: MessageSquare,
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
            const Icon = step.icon;
            return (
              <div 
                key={step.id} 
                className="group relative bg-gradient-to-br from-card to-card/80 rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {index + 1}
                </div>
                
                {/* Icon Circle */}
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                
                {/* Content */}
                <div className="text-center space-y-3">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {getDescription(step.id, step.defaultDescription)}
                  </p>
                </div>
                
                {/* Connection Arrow for Desktop */}
                {index < PROCESS_STEPS.length - 1 && index % 3 !== 2 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                )}
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