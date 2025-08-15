import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowRight, Package } from 'lucide-react';
import zoekenIcon from '@/assets/icons/zoeken.webp';
import afspraakIcon from '@/assets/icons/afspraak.webp';
import akkoordIcon from '@/assets/icons/akkoord.webp';
import betalenIcon from '@/assets/icons/betalen.webp';
import bezorgenIcon from '@/assets/icons/bezorgen.webp';
import ontvangenIcon from '@/assets/icons/ontvangen.webp';

interface SupplierOrderingProcessProps {
  supplierName: string;
  productName: string;
  descriptions: Record<string, string>;
}

const PROCESS_STEPS = [
  {
    id: 'search',
    icon: zoekenIcon,
    title: 'Zoek & Selecteer',
    defaultDescription: 'Bekijk onze menukaart en kies je favoriete producten'
  },
  {
    id: 'contact',
    icon: afspraakIcon,
    title: 'Maak Afspraak',
    defaultDescription: 'Neem contact op via Wire of Telegram voor je bestelling'
  },
  {
    id: 'agree',
    icon: akkoordIcon,
    title: 'Bevestig Bestelling',
    defaultDescription: 'Bevestig je bestelling en leveringsdetails'
  },
  {
    id: 'payment',
    icon: betalenIcon,
    title: 'Betaal Veilig',
    defaultDescription: 'Betaal via onze veilige betaalmethoden'
  },
  {
    id: 'delivery',
    icon: bezorgenIcon,
    title: 'Discrete Bezorging',
    defaultDescription: 'Je bestelling wordt discreet aan huis bezorgd'
  },
  {
    id: 'receive',
    icon: ontvangenIcon,
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ShoppingCart className="h-6 w-6 text-green-600" />
          Hoe kun je {productName} bestellen bij {supplierName}?
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Interactive Process Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-green-300 to-green-200"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {PROCESS_STEPS.map((step, index) => (
              <div 
                key={step.id} 
                className="group hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent group-hover:border-green-300 group-hover:shadow-xl">
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                      Stap {index + 1}
                    </span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-green-200">
                    <img 
                      src={step.icon} 
                      alt={step.title}
                      className="w-12 h-12 object-contain filter brightness-0 invert"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-green-700">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {getDescription(step.id, step.defaultDescription)}
                    </p>
                  </div>
                  
                  {/* Interactive Arrow */}
                  {index < PROCESS_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-20">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-3">
                Klaar om te bestellen bij {supplierName}?
              </h3>
              <p className="text-green-100 mb-6 text-lg">
                Scroll naar boven en bekijk onze {productName} of neem direct contact op!
              </p>
              <Button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Package className="h-5 w-5 mr-2" />
                Start je bestelling nu
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};