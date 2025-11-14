import { HeroSection } from './HeroSection';
import { FloatingCannabisLeaf } from '@/components/animations/FloatingCannabisLeaf';
import { ValuePropositionSection } from './ValuePropositionSection';
import { HowItWorksSection } from './HowItWorksSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FAQSection } from '@/components/home/FAQSection';
import { TrustBadgesSection } from './TrustBadgesSection';
import { CTASection } from './CTASection';
import { ModernFeatures } from './ModernFeatures';
import { ForumCategoriesPreview } from '@/components/home/ForumCategoriesPreview';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { Footer } from '@/components/layout/Footer';

export function LandingPage() {
  return <div className="min-h-screen bg-background relative overflow-x-hidden pt-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <FloatingCannabisLeaf size="small" delay={0} />
        <FloatingCannabisLeaf size="small" delay={3} />
        <FloatingCannabisLeaf size="medium" delay={6} />
        <FloatingCannabisLeaf size="small" delay={9} />
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* Forum Categories - Direct onder Hero */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-green-500/15 via-primary/15 to-green-700/10 border-y border-primary/30 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-green-500/15 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '0.25s'
      }} />
        <div className="relative container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <ForumCategoriesPreview />
        </div>
      </section>

      {/* Stats Highlight - GROENE SECTIE */}
      

      {/* Value Proposition - LICHTE SECTIE */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-background via-background/50 to-accent/20 border-y border-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <ValuePropositionSection />
      </section>

      {/* How It Works - GROENE SECTIE */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-green-500/15 via-primary/15 to-green-700/10 border-y border-primary/30 overflow-hidden">
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <HowItWorksSection />
      </section>

      {/* Social Proof Section - LICHTE SECTIE */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-background via-background/50 to-accent/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <SocialProofSection />
        </div>
      </section>

      {/* Modern Features - GROENE SECTIE */}
      <section className="relative z-10 bg-gradient-to-br from-green-950/5 via-background to-green-950/10 border-y border-green-500/10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-green-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.25s' }} />
        <ModernFeatures />
      </section>

      {/* Trust & Safety - LICHTE SECTIE */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 bg-gradient-to-br from-background via-muted/10 to-background overflow-hidden">
        <div className="absolute bottom-1/4 right-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
        <TrustBadgesSection />
      </section>

      {/* Testimonials - GROENE SECTIE */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 bg-gradient-to-br from-green-500/5 via-background to-primary/5 border-y border-green-500/10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <TestimonialsSection />
        </div>
      </section>

      {/* FAQ Section - LICHTE SECTIE */}
      <section className="relative z-10 py-12 sm:py-16 md:py-20 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05),transparent_70%)]" />
        <div className="container relative mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <FAQSection />
          </div>
        </div>
      </section>

      {/* Final CTA - INTENSE GROENE SECTIE */}
      <section className="relative z-10 bg-gradient-to-br from-green-600/20 via-primary/20 to-green-800/15 border-y border-primary/40 py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_70%)]" />
        <div className="relative">
          <CTASection />
        </div>
      </section>

      {/* Footer met alle SEO pagina's */}
      <Footer />
    </div>;
}