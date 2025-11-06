import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  MessageCircle, 
  BookOpen, 
  Shield, 
  Zap, 
  Award,
  TrendingUp,
  Heart
} from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: 'Actieve Community',
    description: 'Verbind met duizenden gelijkgestemden in België',
    color: 'text-blue-500'
  },
  {
    icon: MessageCircle,
    title: 'Expert Advies',
    description: 'Krijg antwoorden van ervaren kwekers en gebruikers',
    color: 'text-green-500'
  },
  {
    icon: BookOpen,
    title: 'Kennisbank',
    description: 'Toegang tot uitgebreide guides en tutorials',
    color: 'text-purple-500'
  },
  {
    icon: Shield,
    title: '100% Privé',
    description: 'Anoniem lid worden, volledige privacy gegarandeerd',
    color: 'text-red-500'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Blijf op de hoogte van nieuwe topics en reacties',
    color: 'text-yellow-500'
  },
  {
    icon: Award,
    title: 'Gamification',
    description: 'Verdien badges en climb de leaderboard',
    color: 'text-orange-500'
  },
  {
    icon: TrendingUp,
    title: 'Markttoegang',
    description: 'Direct contact met geverifieerde leveranciers',
    color: 'text-pink-500'
  },
  {
    icon: Heart,
    title: 'Gratis & Open',
    description: 'Altijd gratis toegang tot de basis features',
    color: 'text-cyan-500'
  }
];

export function ValuePropositionSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Waarom Wiet Forum België?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            De meest complete cannabis community van België. Alles wat je nodig hebt op één plek.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`${benefit.color} bg-background rounded-full w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
