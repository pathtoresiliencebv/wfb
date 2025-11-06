import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, MessageSquare } from 'lucide-react';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Urgency Badge */}
          <div className="flex justify-center">
            <div className="bg-primary/20 text-primary px-6 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Sluit je aan bij 1000+ actieve leden
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Klaar Om De Community Te Joinen?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Word vandaag nog lid en krijg direct toegang tot duizenden discussies, 
              expert advies en geverifieerde leveranciers.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="text-lg px-10 h-14 shadow-xl hover:shadow-2xl transition-all"
            >
              Word Nu Lid - 100% Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/forums')}
              className="text-lg px-10 h-14"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Bekijk Forums Eerst
            </Button>
          </div>

          {/* Social Proof */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>23 mensen registreerden zich de laatste 24 uur</span>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Geen credit card nodig</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Direct toegang</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Altijd gratis</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-muted-foreground italic">
            "De beste beslissing die ik gemaakt heb. Eindelijk een veilige plek 
            om openlijk over cannabis te praten in België!" - Recent lid
          </p>
        </div>
      </div>
    </section>
  );
}
