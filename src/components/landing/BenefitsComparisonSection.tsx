import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Crown, Users } from 'lucide-react';

const features = [
  { name: 'Toegang tot alle forums', free: true, premium: true },
  { name: 'Onbeperkt berichten plaatsen', free: true, premium: true },
  { name: 'Direct messaging', free: true, premium: true },
  { name: 'Profiel customization', free: true, premium: true },
  { name: 'Badges & Achievements', free: true, premium: true },
  { name: 'Geen advertenties', free: false, premium: true },
  { name: 'Premium badge op profiel', free: false, premium: true },
  { name: 'Vroege toegang tot nieuwe features', free: false, premium: true },
  { name: 'Exclusieve premium forums', free: false, premium: true },
  { name: 'Prioriteit support', free: false, premium: true },
];

export function BenefitsComparisonSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Kies Je Level
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start gratis en upgrade wanneer je wilt voor extra voordelen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <Card className="border-2">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">Gratis Lid</CardTitle>
              <div className="text-3xl font-bold">€0</div>
              <p className="text-muted-foreground">per maand</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  {feature.free ? (
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  )}
                  <span className={feature.free ? '' : 'text-muted-foreground'}>
                    {feature.name}
                  </span>
                </div>
              ))}
              <Button 
                className="w-full mt-6"
                size="lg"
                variant="outline"
                onClick={() => navigate('/register')}
              >
                Word Gratis Lid
              </Button>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="border-2 border-primary relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Binnenkort
              </div>
            </div>

            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <Crown className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">Premium Lid</CardTitle>
              <div className="text-3xl font-bold">€4.99</div>
              <p className="text-muted-foreground">per maand</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  {feature.premium ? (
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  )}
                  <span className={feature.premium ? '' : 'text-muted-foreground'}>
                    {feature.name}
                  </span>
                </div>
              ))}
              <Button 
                className="w-full mt-6"
                size="lg"
                disabled
              >
                Binnenkort Beschikbaar
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          💡 Tip: Start gratis en ontdek de community. Upgrade later als je meer wilt.
        </p>
      </div>
    </section>
  );
}
