import { Link } from 'react-router-dom';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { HeroSection } from './HeroSection';
import { FloatingCannabisLeaf } from '@/components/animations/FloatingCannabisLeaf';
import { ValuePropositionSection } from './ValuePropositionSection';
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
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <FloatingCannabisLeaf size="small" delay={0} />
        <FloatingCannabisLeaf size="small" delay={3} />
        <FloatingCannabisLeaf size="medium" delay={6} />
        <FloatingCannabisLeaf size="small" delay={9} />
      </div>
      {/* Modern Header */}
      <ModernHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Forum Categories - Direct onder Hero */}
      <section className="relative py-24 bg-gradient-to-br from-green-500/15 via-primary/15 to-green-700/10 border-y border-primary/30 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-green-500/15 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '0.25s'
      }} />
        <div className="relative container mx-auto px-4">
          <ForumCategoriesPreview />
        </div>
      </section>

      {/* Stats Highlight - GROENE SECTIE */}
      

      {/* Value Proposition - LICHTE SECTIE */}
      <section className="relative py-20 bg-gradient-to-br from-background via-background/50 to-accent/20 border-y border-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <ValuePropositionSection />
      </section>

      {/* How It Works - GROENE SECTIE */}
      <section className="relative py-20 bg-gradient-to-br from-green-500/15 via-primary/15 to-green-700/10 border-y border-primary/30 overflow-hidden">
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <HowItWorksSection />
      </section>

      {/* Social Proof Section - LICHTE SECTIE */}
      <section className="relative py-20 bg-gradient-to-br from-background via-background/50 to-accent/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="container mx-auto px-4">
          <SocialProofSection />
        </div>
      </section>

      {/* Modern Features - GROENE SECTIE */}
      <section className="relative bg-gradient-to-br from-green-950/5 via-background to-green-950/10 border-y border-green-500/10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] bg-green-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.25s' }} />
        <ModernFeatures />
      </section>

      {/* Trust & Safety - LICHTE SECTIE */}
      <section className="relative py-16 bg-gradient-to-br from-background via-muted/10 to-background overflow-hidden">
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
        <TrustBadgesSection />
      </section>

      {/* Testimonials - GROENE SECTIE */}
      <section className="relative py-16 bg-gradient-to-br from-green-500/5 via-background to-primary/5 border-y border-green-500/10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="container mx-auto px-4">
          <TestimonialsSection />
        </div>
      </section>

      {/* FAQ Section - LICHTE SECTIE */}
      <section className="relative py-16 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05),transparent_70%)]" />
        <div className="container relative mx-auto px-4">
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