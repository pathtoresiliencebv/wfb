import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, ShoppingCart, CreditCard, Truck, RotateCcw, MapPin, Package, Clock } from 'lucide-react';

interface SupplierFAQProps {
  supplierName: string;
  deliveryAreas?: string[];
  minimumOrder?: number;
}

export const SupplierFAQ: React.FC<SupplierFAQProps> = ({
  supplierName,
  deliveryAreas,
  minimumOrder
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <HelpCircle className="h-6 w-6 text-primary" />
          Veelgestelde Vragen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Hoe plaats ik een bestelling?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p className="leading-relaxed">
                Bestellen bij {supplierName} is eenvoudig! Bekijk eerst onze menukaart om je producten te selecteren. 
                Neem vervolgens contact met ons op via Wire of Telegram. Deel je gewenste producten, hoeveelheden, en 
                leveringsadres. Wij bevestigen je bestelling en coördineren de bezorging met je.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Welke betaalmethoden accepteren jullie?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p className="leading-relaxed">
                We accepteren verschillende betaalmethoden voor je gemak en privacy. Dit omvat contante betaling bij levering, 
                cryptocurrency (Bitcoin, Ethereum), en bankoverschrijving. De specifieke betaalmethoden bespreken we bij het 
                bevestigen van je bestelling.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Hoe lang duurt de levering?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p className="leading-relaxed">
                De levertijd is afhankelijk van je locatie en de beschikbaarheid van producten. Gemiddeld leveren we binnen 24-48 uur 
                na bevestiging van je bestelling. Voor urgente bestellingen kunnen we vaak een snellere levering regelen. 
                We houden je via Wire of Telegram op de hoogte van de verwachte levertijd.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Is de bezorging discreet?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p className="leading-relaxed">
                Absoluut! Bij {supplierName} begrijpen we het belang van privacy en discretie. Alle bestellingen worden verpakt 
                in neutrale, ondoorzichtige verpakkingen zonder merkherkenning of indicatie van de inhoud. Onze bezorgers zijn 
                professioneel en discreet, en we respecteren altijd je privacy.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Kan ik mijn bestelling annuleren of wijzigen?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p className="leading-relaxed">
                Je kunt je bestelling annuleren of wijzigen voordat deze is verzonden. Neem zo snel mogelijk contact met ons op 
                via Wire of Telegram als je aanpassingen wilt maken. Let op: zodra de bezorging is onderweg, kunnen we helaas geen 
                wijzigingen meer doorvoeren. Bij annulering na verzending kunnen er kosten in rekening worden gebracht.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Wat als ik niet tevreden ben met mijn bestelling?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p className="leading-relaxed">
                Klanttevredenheid staat bij ons voorop. Als je niet tevreden bent met je bestelling, neem dan binnen 24 uur na levering 
                contact met ons op. We beoordelen elke situatie individueel en streven ernaar een passende oplossing te vinden, 
                zoals vervanging of terugbetaling, afhankelijk van de omstandigheden.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Leveren jullie in mijn regio?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {deliveryAreas && deliveryAreas.length > 0 ? (
                <div>
                  <p className="leading-relaxed mb-3">
                    We leveren momenteel in de volgende gebieden:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {deliveryAreas.map((area, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                  <p className="leading-relaxed mt-3">
                    Staat je locatie er niet bij? Neem contact met ons op - we breiden ons levergebied regelmatig uit!
                  </p>
                </div>
              ) : (
                <p className="leading-relaxed">
                  We leveren in heel België. Neem contact met ons op om te bevestigen of we in jouw specifieke regio leveren. 
                  Vermeld je postcode of stad, en we laten je direct weten of levering mogelijk is.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>

          {minimumOrder && minimumOrder > 0 && (
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Is er een minimum bestelbedrag?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="leading-relaxed">
                  Ja, ons minimum bestelbedrag is €{minimumOrder}. Dit helpt ons om de kosten van discrete, betrouwbare bezorging 
                  te dekken en hoogwaardige service te garanderen. Voor vragen over je bestelling kun je altijd contact met ons opnemen.
                </p>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};