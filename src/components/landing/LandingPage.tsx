import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeroSection } from './HeroSection';
import { ValuePropositionSection } from './ValuePropositionSection';
import { StatsHighlightSection } from './StatsHighlightSection';
import { HowItWorksSection } from './HowItWorksSection';
import { FeaturesGrid } from './FeaturesGrid';
import { TrendingTopics } from '@/components/home/TrendingTopics';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { TopSuppliers } from '@/components/supplier/TopSuppliers';
import { ForumCategoriesPreview } from '@/components/home/ForumCategoriesPreview';
import { FAQSection } from '@/components/home/FAQSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { TrustBadgesSection } from './TrustBadgesSection';
import { CTASection } from './CTASection';
import { Separator } from '@/components/ui/separator';

export function LandingPage() {
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

      {/* Stats Highlight */}
      <StatsHighlightSection />

      {/* Value Proposition */}
      <ValuePropositionSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Social Proof Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <SocialProofSection />
        </div>
      </section>

      {/* Forum Categories Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ForumCategoriesPreview />
        </div>
      </section>

      {/* Trending Topics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <TrendingTopics limit={6} showHeader={true} />
        </div>
      </section>

      {/* Top Suppliers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <TopSuppliers />
        </div>
      </section>

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Trust & Safety */}
      <TrustBadgesSection />

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <TestimonialsSection />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FAQSection />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection />

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
