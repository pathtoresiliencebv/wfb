import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MessageSquare, Shield, Sparkles } from 'lucide-react';
import logoLight from '@/assets/wietforum-logo-light.png';
import logoDark from '@/assets/wietforum-logo-dark.png';
import { useTheme } from '@/contexts/ThemeContext';

export function HeroSection() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const logo = theme === 'dark' ? logoDark : logoLight;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <Badge variant="secondary" className="mx-auto w-fit px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2 inline" />
            #1 Cannabis Community in België
          </Badge>

          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="Wiet Forum België" 
              className="h-20 md:h-24 w-auto"
            />
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Dé Cannabis Community
              <span className="block text-primary mt-2">van België</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sluit je aan bij duizenden leden die kennis delen over cannabis, 
              medicinaal gebruik, kweektips en de nieuwste ontwikkelingen in België.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="text-lg px-8 h-14"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Word Nu Lid - Gratis
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/forums')}
              className="text-lg px-8 h-14"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Verken Forums
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>100% Veilig & Privé</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span>Actieve Community</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Expert Moderatie</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
