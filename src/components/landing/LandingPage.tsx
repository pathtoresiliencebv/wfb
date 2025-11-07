import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeroSection } from './HeroSection';
import { FloatingCannabisLeaf } from '@/components/animations/FloatingCannabisLeaf';
import logoMain from '@/assets/wietforum-logo-main.png';
import { ValuePropositionSection } from './ValuePropositionSection';
import { StatsHighlightSection } from './StatsHighlightSection';
import { HowItWorksSection } from './HowItWorksSection';
import { ModernFeatures } from './ModernFeatures';
import { TrendingTopics } from '@/components/home/TrendingTopics';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ForumCategoriesPreview } from '@/components/home/ForumCategoriesPreview';
import { FAQSection } from '@/components/home/FAQSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { TrustBadgesSection } from './TrustBadgesSection';
import { CTASection } from './CTASection';
import { Separator } from '@/components/ui/separator';
export function LandingPage() {
  return <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <FloatingCannabisLeaf size="large" delay={0} />
        <FloatingCannabisLeaf size="medium" delay={5} />
        <FloatingCannabisLeaf size="small" delay={10} />
        <FloatingCannabisLeaf size="medium" delay={15} />
        <FloatingCannabisLeaf size="large" delay={20} />
        <FloatingCannabisLeaf size="small" delay={25} />
      </div>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src={logoMain} alt="Wiet Forum België" className="h-12 w-auto" />
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

      {/* Forum Categories - Direct onder Hero */}
      <section className="relative py-24 bg-gradient-to-br from-green-500/15 via-primary/15 to-green-700/10 border-y border-primary/30 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-green-500/15 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '0.5s'
      }} />
        <div className="relative container mx-auto px-4">
          <ForumCategoriesPreview />
        </div>
      </section>

      {/* Trending Topics */}
      <section className="relative py-20 bg-gradient-to-br from-green-950/5 via-background to-primary/5 border-y border-primary/10 overflow-hidden">
        {/* Decorative blobs matching hero style */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        <div className="container relative mx-auto px-4">
          <TrendingTopics />
        </div>
      </section>

      {/* Stats Highlight - GROENE SECTIE */}
      

      {/* Value Proposition - LICHTE SECTIE */}
      <section className="bg-gradient-to-br from-background via-muted/10 to-background py-20">
        <ValuePropositionSection />
      </section>

      {/* How It Works - DONKERGROENE ACCENT */}
      <section className="bg-gradient-to-br from-green-950/5 via-background to-green-950/10 border-y border-green-500/10 py-20">
        <HowItWorksSection />
      </section>

      {/* Social Proof Section - LICHT */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SocialProofSection />
        </div>
      </section>


      {/* Modern Features - PREMIUM ERVARING */}
      <ModernFeatures />

      {/* Trust & Safety - NEUTRAAL */}
      <section className="bg-background py-16">
        <TrustBadgesSection />
      </section>

      {/* Testimonials - SUBTIEL GROEN */}
      <section className="py-16 bg-gradient-to-br from-green-500/5 via-background to-primary/5 border-y border-green-500/10">
        <div className="container mx-auto px-4">
          <TestimonialsSection />
        </div>
      </section>

      {/* FAQ Section - LICHT */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <FAQSection />
          </div>
        </div>
      </section>

      {/* Final CTA - INTENSE GROENE SECTIE */}
      <section className="relative bg-gradient-to-br from-green-600/20 via-primary/20 to-green-800/15 border-y border-primary/40 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_70%)]" />
        <div className="relative">
          <CTASection />
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
    </div>;
}