import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, MessageSquare, Award } from 'lucide-react';

interface OnboardingWelcomeProps {
  username: string;
  onComplete: () => void;
}

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({
  username,
  onComplete
}) => {
  const features = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Verbind met de Community",
      description: "Ontdek een community van gelijkgestemde cannabisliefhebbers"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Deel je Ervaringen",
      description: "Bespreek strains, groei tips en interessante onderwerpen"
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "Verdien Reputatie",
      description: "Krijg waardering voor je bijdragen aan discussies"
    }
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Welkom, {username}!</CardTitle>
          <p className="text-sm text-muted-foreground">
            Je account is succesvol aangemaakt. Hier is wat je kunt doen:
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                {feature.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
          
          <div className="pt-4">
            <Button onClick={onComplete} className="w-full">
              Begin met verkennen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};