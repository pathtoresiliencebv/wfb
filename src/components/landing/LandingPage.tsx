import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Trophy, Shield, Heart, Scale } from 'lucide-react';
import wietforumLogoDark from '@/assets/wietforum-logo-dark.png';
import wietforumLogoGreen from '@/assets/wietforum-logo-green.png';
import { useTheme } from '@/contexts/ThemeContext';

const stats = [
  { label: 'Actieve Leden', value: '2,547', icon: Users },
  { label: 'Forum Topics', value: '8,432', icon: MessageSquare },
  { label: 'Expert Adviseurs', value: '156', icon: Trophy },
  { label: 'Veilige Community', value: '100%', icon: Shield },
];

const features = [
  {
    title: 'Medicinaal Gebruik',
    description: 'Delen van ervaringen en kennis over medicinale cannabis',
    icon: Heart,
    color: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
  },
  {
    title: 'Wetgeving & Nieuws',
    description: 'Blijf op de hoogte van de laatste ontwikkelingen in België',
    icon: Scale,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
  },
  {
    title: 'Community Support',
    description: 'Een veilige ruimte voor vragen en ondersteuning',
    icon: Users,
    color: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400'
  }
];

export function LandingPage() {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? wietforumLogoGreen : wietforumLogoDark;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Wietforum België" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="font-heading text-lg font-bold">Wietforum</h1>
              <p className="text-xs text-muted-foreground">België</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Inloggen</Button>
            </Link>
            <Link to="/register">
              <Button>Registreren</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <Badge variant="secondary" className="mb-6">
            🇧🇪 #1 Cannabis Community in België
          </Badge>
          <h1 className="mb-6 font-heading text-4xl font-bold tracking-tight sm:text-6xl">
            Welkom bij{' '}
            <span className="cannabis-gradient bg-gradient-to-r bg-clip-text text-transparent">
              Wietforum België
            </span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            De grootste en meest vertrouwde cannabis community van België. 
            Deel kennis, ervaringen en verbind met gelijkgestemden in een veilige omgeving.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Word Lid van de Community
              </Button>
            </Link>
            <Link to="/forums">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Bekijk Forums
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="mb-4 font-heading text-3xl font-bold">
            Ontdek Onze Community
          </h2>
          <p className="text-lg text-muted-foreground">
            Alles wat je nodig hebt voor een veilige en informatieve cannabis ervaring
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardHeader>
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold">
            Klaar om deel uit te maken van de community?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Sluit je aan bij duizenden Belgen die hun kennis en ervaringen delen
          </p>
          <Link to="/register">
            <Button size="lg">
              Gratis Registreren
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt="Wietforum België" className="h-6 w-6 object-contain" />
              <span className="font-semibold">Wietforum België</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground">Voorwaarden</Link>
              <Link to="/contact" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}