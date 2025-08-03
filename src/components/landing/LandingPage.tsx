import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, MessageSquare, Trophy, Shield, Heart, Scale, CheckCircle, Sparkles, Star, ArrowRight, Zap, Globe } from 'lucide-react';
import wietforumLogoLight from '@/assets/wietforum-logo-light.png';
import { useTheme } from '@/contexts/ThemeContext';
import { useRealTimeStats } from '@/hooks/useRealTimeStats';

const getStatsArray = (stats: any, isLoading: boolean) => [
  { label: 'Actieve Leden', value: isLoading ? '...' : stats.userCount.toLocaleString(), icon: Users },
  { label: 'Forum Topics', value: isLoading ? '...' : stats.topicCount.toLocaleString(), icon: MessageSquare },
  { label: 'Expert Adviseurs', value: isLoading ? '...' : stats.expertCount.toString(), icon: Trophy },
  { label: 'Veilige Community', value: stats.verifiedCommunity, icon: Shield },
];

const features = [
  {
    title: 'Medicinaal Gebruik',
    description: 'Delen van ervaringen en kennis over medicinale cannabis voor therapeutische doeleinden',
    icon: Heart,
    color: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
  },
  {
    title: 'Wetgeving & Nieuws',
    description: 'Blijf op de hoogte van de laatste ontwikkelingen en wetswijzigingen in België',
    icon: Scale,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
  },
  {
    title: 'Veilige Community',
    description: 'Een gemodereerde, veilige ruimte voor vragen, tips en ondersteuning',
    icon: CheckCircle,
    color: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400'
  }
];

const whyChooseUs = [
  {
    title: 'Expert Community',
    description: 'Toegang tot erkende experts en ervaren gebruikers die hun kennis graag delen',
    icon: Trophy,
  },
  {
    title: 'Veilig & Legaal',
    description: 'Alle discussies vinden plaats binnen de kaders van de Belgische wetgeving',
    icon: Shield,
  },
  {
    title: 'Actieve Moderatie',
    description: '24/7 moderatie zorgt voor een respectvolle en constructieve omgeving',
    icon: CheckCircle,
  },
  {
    title: 'Gratis & Toegankelijk',
    description: 'Volledig gratis toegang tot alle forums en functies voor elk lid',
    icon: Heart,
  }
];

const testimonials = [
  {
    name: 'Dr. Sarah Van Damme',
    role: 'Geneeskunde Specialist',
    content: 'Een onmisbare bron voor patiënten die meer willen weten over medicinale cannabis. De kwaliteit van de discussies is uitzonderlijk.',
    rating: 5,
  },
  {
    name: 'Thomas M.',
    role: 'Community Member',
    content: 'Eindelijk een plaats waar ik open kan praten over cannabis zonder oordeel. De community is zeer ondersteunend en informatief.',
    rating: 5,
  },
  {
    name: 'Jan Peeters',
    role: 'Expert Grower',
    content: 'De teelt-sectie heeft mij enorm geholpen bij mijn eerste indoor setup. Dankzij de community ben ik nu een succesvolle kweker.',
    rating: 5,
  }
];

export function LandingPage() {
  const { theme } = useTheme();
  const { stats, isLoading } = useRealTimeStats();
  const logoSrc = wietforumLogoLight;
  
  const statsArray = getStatsArray(stats, isLoading);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center">
            <img src={logoSrc} alt="Logo" className="h-10 w-10 object-contain" />
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
          <h1 className="mb-6 font-heading text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
            Welkom bij{' '}
            <span className="cannabis-gradient bg-clip-text text-transparent">
              Wiet Forum België
            </span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            De grootste en meest vertrouwde cannabis community van België. 
            Deel kennis, ervaringen en verbind met gelijkgestemden in een gemodereerde, 
            veilige en informatieve omgeving.
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
            {statsArray.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <stat.icon className="h-6 w-6" />
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mx-auto mb-1" />
                ) : (
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                )}
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-6 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="mb-4 font-heading text-3xl font-bold">
            Waarom Wiet Forum België?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meer dan alleen een forum - wij zijn dé community die je nodig hebt voor je cannabis journey
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
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
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
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

      {/* Testimonials Section */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="mb-4 font-heading text-3xl font-bold">
              Wat Onze Leden Zeggen
            </h2>
            <p className="text-lg text-muted-foreground">
              Ontdek waarom duizenden Belgen vertrouwen op onze community
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-sm mb-4 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Forum Activity Preview */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="mb-4 font-heading text-3xl font-bold">
            Recente Community Activiteit
          </h2>
          <p className="text-lg text-muted-foreground">
            Zie waar onze community over praat
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Medicinaal</Badge>
                <span className="text-xs text-muted-foreground">2 uur geleden</span>
              </div>
              <CardTitle className="text-lg">Dosering CBD olie voor beginners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Tips en ervaringen voor wie net start met CBD...
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>12 reacties</span>
                <span>24 upvotes</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Wetgeving</Badge>
                <span className="text-xs text-muted-foreground">4 uur geleden</span>
              </div>
              <CardTitle className="text-lg">Nieuwe updates CBD wetgeving 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Belangrijke wijzigingen in de Belgian law...
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>8 reacties</span>
                <span>31 upvotes</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Teelt</Badge>
                <span className="text-xs text-muted-foreground">6 uur geleden</span>
              </div>
              <CardTitle className="text-lg">Indoor setup tips voor beginners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Alles wat je moet weten voor je eerste grow...
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>19 reacties</span>
                <span>45 upvotes</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link to="/forums">
            <Button variant="outline" size="lg" className="gap-2">
              Bekijk Alle Discussies
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Community Stats Highlight */}
      <section className="border-y bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="mb-4 font-heading text-3xl font-bold">
              Groeiende Community
            </h2>
            <p className="text-lg text-muted-foreground">
              Word onderdeel van België's grootste cannabis community
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-bold text-primary">98%</span>
              </div>
              <p className="text-sm text-muted-foreground">Tevredenheid</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-bold text-primary">24/7</span>
              </div>
              <p className="text-sm text-muted-foreground">Online Support</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-bold text-primary">&lt;1min</span>
              </div>
              <p className="text-sm text-muted-foreground">Gemiddelde Response</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-8 w-8 text-primary mr-2" />
                <span className="text-3xl font-bold text-primary">50+</span>
              </div>
              <p className="text-sm text-muted-foreground">Experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="container mx-auto px-6 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold">
              Blijf Op De Hoogte
            </h2>
            <p className="mb-6 text-lg opacity-90">
              Ontvang wekelijks de belangrijkste updates uit de cannabis wereld
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Je email adres"
                className="flex-1 px-4 py-2 rounded-md text-foreground"
              />
              <Button variant="secondary" size="lg">
                Aanmelden
              </Button>
            </div>
            <p className="mt-4 text-xs opacity-75">
              We respecteren je privacy. Geen spam, alleen waardevolle content.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold">
            Klaar om deel uit te maken van de community?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Sluit je aan bij {isLoading ? 'duizenden' : stats.userCount > 0 ? `${stats.userCount}+` : 'onze'} Belgen die hun kennis en ervaringen delen
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Sparkles className="h-4 w-4" />
                Gratis Registreren
              </Button>
            </Link>
            <Link to="/gamification">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                <Trophy className="h-4 w-4" />
                Bekijk Gamification
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center">
              <img src={logoSrc} alt="Logo" className="h-6 w-6 object-contain" />
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