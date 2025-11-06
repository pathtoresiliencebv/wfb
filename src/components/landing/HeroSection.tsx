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
  const MotionButton = prefersReducedMotion ? Button : motion(Button);

  return (
    <section className="relative overflow-hidden">
      {/* Enhanced Background with Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.1),transparent)]" />
      
      <div className="container relative z-10 px-4 py-20 sm:py-24 lg:py-32">
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
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-6 py-2.5 text-sm backdrop-blur-sm shadow-lg"
            {...(!prefersReducedMotion && {
              variants: fadeInUp,
              transition: { delay: 0.1 }
            })}
          >
            <Sparkles className="h-4 w-4 mr-2 text-primary animate-pulse" />
            <span className="font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              De Grootste{' '}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                Cannabis Community
              </span>{' '}
              van België
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
              Ontdek betrouwbare leveranciers, deel kennis met duizenden leden, 
              en blijf op de hoogte van alles rondom cannabis in België.
            </p>
          </MotionDiv>

          {/* Enhanced CTA Buttons */}
          <MotionDiv 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            {...(!prefersReducedMotion && {
              variants: fadeInUp,
              transition: { delay: 0.4 }
            })}
          >
            <MotionButton 
              size="lg" 
              className="group w-full sm:w-auto text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate('/register')}
              {...(!prefersReducedMotion && {
                whileHover: { scale: 1.05 },
                whileTap: tapScale,
                transition: springConfig
              })}
            >
              <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Word Nu Lid - 100% Gratis
            </MotionButton>
            <MotionButton 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-lg px-10 py-7 backdrop-blur-sm border-2"
              onClick={() => navigate('/forums')}
              {...(!prefersReducedMotion && {
                whileHover: { scale: 1.05 },
                whileTap: tapScale,
                transition: springConfig
              })}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Verken de Forums
            </MotionButton>
          </MotionDiv>

          {/* Enhanced Trust Indicators with Stats */}
          <MotionDiv 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-border/50"
            {...(!prefersReducedMotion && {
              variants: staggerContainer,
              transition: { delay: 0.5 }
            })}
          >
            {[
              { icon: Shield, value: '10K+', label: 'Actieve & Veilige Leden', delay: 0.6 },
              { icon: MessageSquare, value: '50K+', label: 'Posts & Discussies', delay: 0.7 },
              { icon: Sparkles, value: '24/7', label: 'Expert Moderatie', delay: 0.8 }
            ].map((stat, index) => (
              <MotionDiv 
                key={index}
                className="flex flex-col items-center space-y-2 cursor-default"
                {...(!prefersReducedMotion && {
                  variants: fadeInUp,
                  whileHover: { scale: 1.1 }
                })}
              >
                <div className="flex items-center gap-2 text-primary mb-1">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
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
