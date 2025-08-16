import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, MessageSquare, Trophy, Shield, Heart, Scale, CheckCircle, Sparkles, Star, ArrowRight, Zap, Globe, Leaf, Brain, BookOpen, Clock, Award, UserCheck, TrendingUp, Play, ChevronDown, Lightbulb, Coffee, Clock3, Calendar, Camera, Video, Verified, Lock, AlertCircle, HelpCircle } from 'lucide-react';
import wietforumLogoLight from '@/assets/wietforum-logo-light.png';
import wietforumLogoDark from '@/assets/wietforum-logo-dark.png';
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

const communityBenefits = [
  {
    title: 'Expertkennis',
    description: 'Toegang tot medische professionals en ervaren gebruikers',
    icon: Trophy,
    color: 'text-yellow-600'
  },
  {
    title: 'Veilige Omgeving',
    description: 'Gemodereerde discussies binnen legale kaders',
    icon: Shield,
    color: 'text-green-600'
  },
  {
    title: 'Ondersteuning',
    description: 'Hulp en begeleiding van de community',
    icon: Heart,
    color: 'text-red-600'
  }
];

const howItWorksSteps = [
  {
    step: 1,
    title: 'Registreer Gratis',
    description: 'Maak je account aan in minder dan 1 minuut',
    icon: UserCheck,
    color: 'from-green-400 to-blue-500'
  },
  {
    step: 2,
    title: 'Verken de Forums',
    description: 'Ontdek verschillende categorieën en onderwerpen',
    icon: BookOpen,
    color: 'from-blue-400 to-purple-500'
  },
  {
    step: 3,
    title: 'Deel & Leer',
    description: 'Stel vragen, deel kennis en bouw connecties',
    icon: Lightbulb,
    color: 'from-purple-400 to-pink-500'
  },
  {
    step: 4,
    title: 'Groei Mee',
    description: 'Word expert en help anderen in hun journey',
    icon: TrendingUp,
    color: 'from-pink-400 to-red-500'
  }
];

const faqData = [
  {
    question: 'Is Wiet Forum België legaal?',
    answer: 'Ja, alle discussies vinden plaats binnen de kaders van de Belgische wetgeving. We promoten geen illegale activiteiten en focussen op educatie en harm reduction.'
  },
  {
    question: 'Is lidmaatschap gratis?',
    answer: 'Ja, het lidmaatschap is volledig gratis. Alle basisfuncties zijn toegankelijk zonder kosten. We hebben ook premium features voor gebruikers die extra functionaliteiten willen.'
  },
  {
    question: 'Wie kan lid worden?',
    answer: 'Iedereen boven de 18 jaar die geïnteresseerd is in cannabis educatie, medicinaal gebruik, of wetgevingsontwikkelingen kan lid worden.'
  },
  {
    question: 'Hoe wordt de community gemodereerd?',
    answer: 'We hebben 24/7 moderatie door ervaren vrijwilligers en AI-tools. Alle content wordt gecontroleerd op naleving van onze community guidelines en Belgische wetgeving.'
  },
  {
    question: 'Kan ik anoniem blijven?',
    answer: 'Ja, je kunt een pseudoniem gebruiken. We respecteren je privacy en delen nooit persoonlijke informatie zonder toestemming.'
  },
  {
    question: 'Welke onderwerpen kan ik bespreken?',
    answer: 'Medicinaal gebruik, wetgeving, teelt (binnen legale kaders), harm reduction, CBD producten, en algemene cannabis educatie zijn welkom.'
  }
];

const forumCategories = [
  {
    title: 'Medicinaal Gebruik',
    description: 'Informatie over therapeutische toepassingen',
    icon: Heart,
    color: 'text-red-600'
  },
  {
    title: 'Wetgeving & Nieuws',
    description: 'Updates over Belgische cannabis wetgeving',
    icon: Scale,
    color: 'text-blue-600'
  },
  {
    title: 'Community Support',
    description: 'Ondersteuning en ervaringen delen',
    icon: Users,
    color: 'text-green-600'
  }
];

const trustIndicators = [
  { label: 'SSL Beveiligd', icon: Lock },
  { label: 'GDPR Compliant', icon: Shield },
  { label: 'Medisch Gereviewed', icon: Heart },
  { label: '24/7 Moderatie', icon: Clock },
  { label: 'Geen Spam', icon: CheckCircle },
  { label: 'Privacy Gegarandeerd', icon: UserCheck }
];

export function LandingPage() {
  const { theme } = useTheme();
  const { stats, isLoading } = useRealTimeStats();
  const logoSrc = theme === 'dark' ? wietforumLogoDark : wietforumLogoLight;
  
  const [animatedStats, setAnimatedStats] = useState({
    userCount: 0,
    topicCount: 0,
    expertCount: 0
  });
  
  // Animate stats when they load
  useEffect(() => {
    if (!isLoading && stats) {
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setAnimatedStats({
          userCount: Math.floor(stats.userCount * easeOut),
          topicCount: Math.floor(stats.topicCount * easeOut),
          expertCount: Math.floor(stats.expertCount * easeOut)
        });
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedStats({
            userCount: stats.userCount,
            topicCount: stats.topicCount,
            expertCount: stats.expertCount
          });
        }
      }, stepTime);
      
      return () => clearInterval(interval);
    }
  }, [stats, isLoading]);
  
  const statsArray = getStatsArray({ ...stats, ...animatedStats }, isLoading);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/9c1ecf21-29b6-472d-99d4-0fa9b793fc22.png" alt="Wiet Forum België Logo" className="h-48 w-auto object-contain" />
            <span className="font-heading text-xl font-bold text-foreground hidden sm:block">
              Wiet Forum België
            </span>
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
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-background"></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.3),transparent_50%)]"></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.2),transparent_50%)]"></div>
        
        <div className="relative container mx-auto px-6 py-20 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-6 text-sm px-4 py-2 shadow-lg">
                🇧🇪 #1 Cannabis Community in België • {isLoading ? '1000+' : `${stats?.userCount || 1000}+`} Actieve Leden
              </Badge>
            </div>
            
            <div className="flex flex-col items-center mb-8 animate-scale-in">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-3xl scale-150"></div>
                <img 
                  src="/lovable-uploads/9c1ecf21-29b6-472d-99d4-0fa9b793fc22.png" 
                  alt="Wiet Forum België Logo" 
                  className="relative h-72 w-auto object-contain hover:scale-105 transition-transform duration-300" 
                />
              </div>
              
              <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-7xl text-foreground text-center leading-tight">
                Welkom bij{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Wiet Forum België
                </span>
              </h1>
            </div>
            
            <p className="mb-10 text-xl text-muted-foreground sm:text-2xl max-w-3xl mx-auto leading-relaxed">
              🌿 De grootste en meest vertrouwde cannabis community van België. 
              Deel kennis, ervaringen en verbind met gelijkgestemden in een gemodereerde, 
              veilige en informatieve omgeving.
            </p>
            
            <div className="flex flex-col gap-6 sm:flex-row sm:justify-center mb-12">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-primary-muted hover:scale-105">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Word Lid van de Community
                </Button>
              </Link>
              <Link to="/forums">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Bekijk Forums
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              {trustIndicators.slice(0, 3).map((indicator, index) => (
                <div key={index} className="flex items-center gap-1 bg-background/50 px-3 py-1 rounded-full backdrop-blur">
                  <indicator.icon className="h-4 w-4 text-primary" />
                  <span>{indicator.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="relative border-y bg-gradient-to-r from-muted/50 via-background to-muted/50">
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Live Community Statistieken</h2>
            <p className="text-muted-foreground">Zie onze groeiende community in real-time</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 max-w-4xl mx-auto">
            {statsArray.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto">
                    <stat.icon className="h-8 w-8" />
                  </div>
                </div>
                {isLoading ? (
                  <Skeleton className="h-10 w-20 mx-auto mb-2" />
                ) : (
                  <div className="text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </div>
                )}
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Real-time indicator */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-background/80 px-4 py-2 rounded-full backdrop-blur shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live geüpdatet</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Play className="mr-2 h-4 w-4" />
              Zo Werkt Het
            </Badge>
            <h2 className="mb-6 font-heading text-4xl font-bold">
              Van Nieuweling tot Expert in 4 Stappen
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Begin je reis in de cannabis community en word onderdeel van België's meest vertrouwde platform
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="relative text-center group">
                {/* Connection line */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 z-0"></div>
                )}
                
                <div className="relative z-10">
                  <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="h-10 w-10" />
                  </div>
                  
                  <div className="absolute -top-2 -right-2 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {step.step}
                  </div>
                  
                  <h3 className="mb-3 font-semibold text-xl group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/register">
              <Button size="lg" className="shadow-xl hover:shadow-2xl transition-all duration-300">
                Start Nu Je Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-6 py-20 bg-muted/30">
        <div className="text-center mb-16">
          <h2 className="mb-6 font-heading text-4xl font-bold">
            Waarom Wiet Forum België?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meer dan alleen een forum - wij zijn dé community die je nodig hebt voor je cannabis journey
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {whyChooseUs.map((item, index) => (
            <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-background/50 backdrop-blur">
              <CardContent className="p-8">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <item.icon className="h-10 w-10" />
                </div>
                <h3 className="mb-4 font-semibold text-xl group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Highlights Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Award className="mr-2 h-4 w-4" />
              Community Spotlights
            </Badge>
            <h2 className="mb-6 font-heading text-4xl font-bold">
              Verken Onze Forum Categorieën
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ontdek de verschillende onderwerpen waar onze community over praat
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {forumCategories.map((category, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/50">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="relative p-8 text-center">
                  <div className="mb-6">
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-xl mb-3">{category.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{category.description}</p>
                  
                  <Link to="/forums">
                    <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      Verken Categorie
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="mb-6 font-heading text-4xl font-bold">
            Ontdek Onze Community Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Alles wat je nodig hebt voor een veilige en informatieve cannabis ervaring, samengebracht op één platform
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-background to-muted/30">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <CardHeader className="relative pb-4">
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
                <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Leer meer <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="relative border-y bg-gradient-to-br from-muted/50 via-background to-muted/30 overflow-hidden">
         <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--primary)/0.1),transparent_50%)]"></div>
         <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--secondary)/0.1),transparent_50%)]"></div>
        
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Heart className="mr-2 h-4 w-4" />
              Community Reviews
            </Badge>
            <h2 className="mb-6 font-heading text-4xl font-bold">
              Waarom Onze Community?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ontdek waarom meer dan {isLoading ? '1000' : stats?.userCount || 1000}+ Belgen kiezen voor onze veilige cannabis community
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {communityBenefits.map((benefit, index) => (
              <Card key={index} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-background/80 backdrop-blur overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <CardContent className="relative p-8 text-center">
                  <div className="mb-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{benefit.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">{benefit.description}</p>
                  
                  <Link to="/register">
                    <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      Ontdek Meer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Word onderdeel van deze geweldige community</p>
            <Link to="/register">
              <Button size="lg" variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Lees Meer Reviews
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <HelpCircle className="mr-2 h-4 w-4" />
            Veelgestelde Vragen
          </Badge>
          <h2 className="mb-6 font-heading text-4xl font-bold">
            Alles Wat Je Wilt Weten
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Krijg antwoorden op de meest gestelde vragen over onze cannabis community
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-background/50 backdrop-blur shadow-sm">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Nog meer vragen?</p>
            <Link to="/forums">
              <Button variant="outline">
                Stel je Vraag in de Community
                <MessageSquare className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Signup */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary-muted to-secondary overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.05),transparent_70%)]"></div>
        
        <div className="relative container mx-auto px-6">
          <Card className="bg-white/10 backdrop-blur border-white/20 text-white shadow-2xl max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <Leaf className="h-16 w-16 mx-auto mb-4 text-white" />
              </div>
              
              <h2 className="mb-4 font-heading text-4xl font-bold">
                Blijf Op De Hoogte
              </h2>
              <p className="mb-8 text-xl opacity-90 leading-relaxed">
                📧 Ontvang wekelijks de belangrijkste updates uit de cannabis wereld, 
                nieuwe wetgeving, en exclusieve community highlights
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
                <input 
                  type="email" 
                  placeholder="Je email adres"
                  className="flex-1 px-6 py-3 rounded-lg text-foreground bg-white/90 backdrop-blur border-0 shadow-lg text-lg"
                />
                <Button variant="secondary" size="lg" className="px-8 py-3 text-lg font-semibold shadow-lg hover:scale-105 transition-transform">
                  Aanmelden
                </Button>
              </div>
              
              <div className="flex justify-center gap-6 text-sm opacity-75 mb-6">
                {trustIndicators.slice(3).map((indicator, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <indicator.icon className="h-4 w-4" />
                    <span>{indicator.label}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-sm opacity-75">
                ✅ Gratis • ✅ Geen spam • ✅ Makkelijk uitschrijven
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]"></div>
        
        <div className="relative container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6">
              <Sparkles className="mr-2 h-4 w-4" />
              Word Lid Nu
            </Badge>
            
            <h2 className="mb-6 font-heading text-5xl font-bold leading-tight">
              Klaar om deel uit te maken van{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                België's #1 Cannabis Community?
              </span>
            </h2>
            
            <p className="mb-10 text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Sluit je aan bij {isLoading ? 'meer dan 1000' : stats?.userCount > 0 ? `${stats.userCount}+` : 'onze groeiende groep'} Belgen 
              die hun kennis, ervaringen en passie voor cannabis delen in een veilige, ondersteunende omgeving
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-primary to-primary-muted hover:scale-105">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Start Je Journey - Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/forums">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Verken Community
                </Button>
              </Link>
            </div>
            
            {/* Final trust indicators */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">100% Gratis</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Veilig & Privé</p>
              </div>
              <div className="text-center md:col-span-1 col-span-2">
                <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">24/7 Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative border-t bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-6 py-16">
          <div className="grid gap-12 md:grid-cols-4 mb-12">
            <div className="space-y-6 md:col-span-2">
              <div className="flex items-center gap-4">
                <img src={logoSrc} alt="Wiet Forum België Logo" className="h-12 w-auto object-contain" />
                <div>
                  <span className="font-heading font-bold text-xl">Wiet Forum België</span>
                  <p className="text-sm text-muted-foreground">Cannabis Community</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                De grootste, veiligste en meest vertrouwde cannabis community van België. 
                Waar kennis wordt gedeeld, vragen worden beantwoord en connecties worden gemaakt.
              </p>
              <div className="flex flex-wrap gap-3">
                {trustIndicators.map((indicator, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <indicator.icon className="mr-1 h-3 w-3" />
                    {indicator.label}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Community</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/forums" className="hover:text-primary transition-colors flex items-center gap-2"><MessageSquare className="h-4 w-4" />Forums</Link></li>
                <li><Link to="/members" className="hover:text-primary transition-colors flex items-center gap-2"><Users className="h-4 w-4" />Leden</Link></li>
                <li><Link to="/leaderboard" className="hover:text-primary transition-colors flex items-center gap-2"><Trophy className="h-4 w-4" />Leaderboard</Link></li>
                <li><Link to="/search" className="hover:text-primary transition-colors flex items-center gap-2"><BookOpen className="h-4 w-4" />Zoeken</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Ondersteuning</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><HelpCircle className="h-4 w-4" />FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><Shield className="h-4 w-4" />Guidelines</a></li>
                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><AlertCircle className="h-4 w-4" />Rapporteer</a></li>
                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><Lock className="h-4 w-4" />Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                &copy; 2024 Wiet Forum België. Alle rechten voorbehouden.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Leaf className="h-4 w-4 text-primary" />
                  Educatief
                </span>
                <span className="flex items-center gap-1">
                  <Scale className="h-4 w-4 text-primary" />
                  Legaal
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-primary" />
                  Veilig
                </span>
              </div>
            </div>
            
            <div className="text-center mt-6 text-sm text-muted-foreground">
              <p>
                🇧🇪 Trots gemaakt in België • 🌿 Voor cannabis educatie • 🔒 Jouw privacy gegarandeerd
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}