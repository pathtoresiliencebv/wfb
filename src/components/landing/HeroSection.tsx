import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MessageSquare, Shield, Sparkles } from 'lucide-react';
import logoLight from '@/assets/wietforum-logo-light.png';
import logoDark from '@/assets/wietforum-logo-dark.png';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, tapScale, springConfig } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function HeroSection() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const logo = theme === 'dark' ? logoDark : logoLight;
  const prefersReducedMotion = useReducedMotion();

  const MotionDiv = prefersReducedMotion ? 'div' : motion.div;

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Enhanced Background with Modern Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container relative z-10 px-4 py-20 sm:py-24 lg:py-32 w-full">
        <MotionDiv 
          className="mx-auto max-w-5xl text-center space-y-8"
          {...(!prefersReducedMotion && {
            variants: staggerContainer,
            initial: "hidden",
            animate: "visible"
          })}
        >
          {/* Premium Badge */}
          <MotionDiv 
            className="inline-flex items-center rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-2.5 text-sm backdrop-blur-md shadow-xl"
            {...(!prefersReducedMotion && {
              variants: fadeInUp,
              transition: { delay: 0.1 }
            })}
          >
            <Sparkles className="h-4 w-4 mr-2 text-primary animate-pulse" />
            <span className="font-semibold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              België's #1 Cannabis Community
            </span>
          </MotionDiv>

          {/* Logo with Float Animation */}
          <MotionDiv 
            className="flex justify-center"
            {...(!prefersReducedMotion && {
              variants: fadeInUp,
              transition: { delay: 0.2 }
            })}
          >
            <motion.img 
              src={logo} 
              alt="Wiet Forum België" 
              className="h-24 sm:h-32 lg:h-40 w-auto drop-shadow-2xl"
              {...(!prefersReducedMotion && {
                animate: {
                  y: [0, -8, 0],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                },
                whileHover: { scale: 1.05 }
              })}
            />
          </MotionDiv>

          {/* Enhanced Heading with Gradient */}
          <MotionDiv 
            className="space-y-6"
            {...(!prefersReducedMotion && {
              variants: fadeInUp,
              transition: { delay: 0.3 }
            })}
          >
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="text-foreground">De Grootste </span>
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Cannabis Community
              </span>
              <span className="text-foreground"> van België</span>
            </h1>
            <p className="mx-auto max-w-3xl text-lg sm:text-xl text-muted-foreground/90 leading-relaxed">
              Ontdek betrouwbare leveranciers, deel kennis met duizenden leden, 
              en blijf op de hoogte van alles rondom cannabis in België.
            </p>
          </MotionDiv>

          {/* Enhanced CTA Buttons */}
          <MotionDiv 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            {...(!prefersReducedMotion && {
              variants: fadeInUp,
              transition: { delay: 0.4 }
            })}
          >
            <MotionDiv 
              className="inline-block"
              {...(!prefersReducedMotion && {
                whileHover: { scale: 1.05, y: -2 },
                whileTap: tapScale,
                transition: springConfig
              })}
            >
              <Button 
                size="lg" 
                className="group w-full sm:w-auto text-lg px-10 py-7 bg-gradient-to-r from-primary to-secondary hover:shadow-2xl hover:shadow-primary/30 transition-all"
                onClick={() => navigate('/register')}
              >
                <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Word Nu Lid - 100% Gratis
              </Button>
            </MotionDiv>
            <MotionDiv 
              className="inline-block"
              {...(!prefersReducedMotion && {
                whileHover: { scale: 1.05, y: -2 },
                whileTap: tapScale,
                transition: springConfig
              })}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto text-lg px-10 py-7 backdrop-blur-sm border-2 hover:bg-primary/5 hover:border-primary/50"
                onClick={() => navigate('/forums')}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Verken de Forums
              </Button>
            </MotionDiv>
          </MotionDiv>

          {/* Enhanced Trust Indicators with Stats */}
          <MotionDiv 
            className="flex flex-wrap justify-center items-center gap-6 pt-12"
            {...(!prefersReducedMotion && {
              variants: staggerContainer,
              transition: { delay: 0.5 }
            })}
          >
            {[
              { icon: Shield, label: '100% Anoniem & Veilig' },
              { icon: MessageSquare, label: '10.000+ Actieve Leden' },
              { icon: Sparkles, label: 'Geverifieerde Leveranciers' }
            ].map((stat, index) => (
              <MotionDiv 
                key={index}
                className="flex items-center gap-3 px-5 py-3 rounded-full bg-card/60 border border-border/50 backdrop-blur-md shadow-lg hover:shadow-xl transition-all cursor-default"
                {...(!prefersReducedMotion && {
                  variants: fadeInUp,
                  whileHover: { scale: 1.05, y: -2 }
                })}
              >
                <div className="p-2 rounded-full bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">{stat.label}</span>
              </MotionDiv>
            ))}
          </MotionDiv>
        </MotionDiv>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
