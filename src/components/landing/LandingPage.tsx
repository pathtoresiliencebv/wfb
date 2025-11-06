import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeroSection } from './HeroSection';
import { FeaturesGrid } from './FeaturesGrid';
import { TrendingTopics } from '@/components/home/TrendingTopics';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CommunityHighlights } from '@/components/home/CommunityHighlights';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { PublicActivityPreview } from '@/components/home/PublicActivityPreview';
import { TopSuppliers } from '@/components/supplier/TopSuppliers';
import { ForumCategoriesPreview } from '@/components/home/ForumCategoriesPreview';
import { FAQSection } from '@/components/home/FAQSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { useRealTimeStats } from '@/hooks/useRealTimeStats';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';

export function LandingPage() {
  const { stats, isLoading } = useRealTimeStats();
  const [animatedStats, setAnimatedStats] = useState({
    userCount: 0,
    topicCount: 0,
    expertCount: 0
  });

  // Animate stats on mount
  useEffect(() => {
    if (!isLoading && stats) {
      const duration = 2000; // 2 seconds
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/8721330a-f235-4c3b-9c21-85436a192135.png" 
              alt="Wiet Forum België" 
              className="h-10 w-auto" 
            />
            <span className="font-semibold hidden sm:inline">Wiet Forum België</span>
          </div>
          <div className="flex items-center gap-3">
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
      <HeroSection />

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <CommunityHighlights />
        </div>
      </section>

      {/* Top Suppliers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <TopSuppliers />
        </div>
      </section>

      {/* Forum Categories Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ForumCategoriesPreview />
        </div>
      </section>

      {/* Trending Topics */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <TrendingTopics limit={6} showHeader={true} />
        </div>
      </section>

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <TestimonialsSection />
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <SocialProofSection />
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Recente Topics</h2>
              <p className="text-muted-foreground">
                Bekijk de nieuwste discussies in onze community
              </p>
            </div>
            <PublicActivityPreview />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FAQSection />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klaar Om Te Beginnen?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Sluit je vandaag nog aan bij de grootste cannabis community van België
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Word Gratis Lid
              </Button>
            </Link>
            <Link to="/forums">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Verken Forums
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Over Ons</h3>
              <p className="text-sm text-muted-foreground">
                De grootste cannabis community van België. Een veilige plek voor kennis delen en verbinding.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/forums" className="text-muted-foreground hover:text-foreground">Forums</Link></li>
                <li><Link to="/leaderboard" className="text-muted-foreground hover:text-foreground">Leaderboard</Link></li>
                <li><Link to="/members" className="text-muted-foreground hover:text-foreground">Leden</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Informatie</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Voorwaarden</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Heb je vragen? Neem contact op via onze forums.
              </p>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Wiet Forum België. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
