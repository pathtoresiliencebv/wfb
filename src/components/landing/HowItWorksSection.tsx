import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Search, MessageSquare, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '1',
    title: 'Registreer Gratis',
    description: 'Maak in 30 seconden een account aan. Volledig anoniem en veilig.',
    color: 'bg-blue-500'
  },
  {
    icon: Search,
    step: '2',
    title: 'Verken Topics',
    description: 'Duik in duizenden discussies over kweek, strains, medicinaal gebruik en meer.',
    color: 'bg-green-500'
  },
  {
    icon: MessageSquare,
    step: '3',
    title: 'Deel & Leer',
    description: 'Stel vragen, deel je ervaring en bouw je reputatie in de community.',
    color: 'bg-purple-500'
  }
];

export function HowItWorksSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hoe Werkt Het?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            In 3 simpele stappen ben je onderdeel van de community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center space-y-4">
                    {/* Step Number Badge */}
                    <div className={`${step.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto text-2xl font-bold`}>
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="flex justify-center">
                      <Icon className="h-12 w-12 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <div>
                      <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => navigate('/register')}
            className="text-lg px-10 h-14"
          >
            Start Nu - Het is Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Geen credit card nodig • Direct toegang • 100% gratis
          </p>
        </div>
      </div>
    </section>
  );
}
