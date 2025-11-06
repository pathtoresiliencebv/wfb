import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, UserCheck, Clock, Award } from 'lucide-react';

const trustBadges = [
  {
    icon: Shield,
    title: '100% Veilig',
    description: 'End-to-end encryptie voor alle berichten'
  },
  {
    icon: Lock,
    title: 'Privé Platform',
    description: 'Jouw gegevens worden nooit gedeeld'
  },
  {
    icon: Eye,
    title: 'Anoniem',
    description: 'Geen verplichte echte naam of verificatie'
  },
  {
    icon: UserCheck,
    title: 'Geverifieerde Leveranciers',
    description: 'Alle suppliers worden gecontroleerd'
  },
  {
    icon: Clock,
    title: '24/7 Online',
    description: 'Altijd actieve community leden'
  },
  {
    icon: Award,
    title: 'Expert Moderatie',
    description: 'Professionele moderators houden alles veilig'
  }
];

export function TrustBadgesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Jouw Veiligheid Is Onze Prioriteit
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We nemen privacy en veiligheid serieus. Daarom kun je met een gerust hart lid worden.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{badge.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {badge.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">SSL</div>
            <div className="text-sm text-muted-foreground">Encrypted</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">GDPR</div>
            <div className="text-sm text-muted-foreground">Compliant</div>
          </div>
        </div>
      </div>
    </section>
  );
}
