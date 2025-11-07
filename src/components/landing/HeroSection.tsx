import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TypingText } from '@/components/animations/TypingText';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
export function HeroSection() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const {
    scrollY
  } = useScroll();
  const logo = '/lovable-uploads/8721330a-f235-4c3b-9c21-85436a192135.png';

  // Parallax effect for background elements
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -75]);
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  return <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
      {/* Animated Background Blobs with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div style={{
        y: y1
      }} className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <motion.div style={{
        y: y2
      }} className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.4, 0.2]
      }} transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }} />
      </div>

      {/* Main Content */}
      <motion.div className="container relative z-10 px-4 py-20 sm:py-24" variants={containerVariants} initial="hidden" animate="visible">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Premium Badge */}
          <motion.div variants={itemVariants}>
            <Badge className="inline-flex items-center gap-2 px-6 py-2.5 text-sm bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-slate-50">
                België's #1 Cannabis Community
              </span>
            </Badge>
          </motion.div>

          {/* Logo with Animation */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.img src={logo} alt="Wiet Forum België" className="h-24 sm:h-32 lg:h-40 w-auto drop-shadow-2xl" animate={prefersReducedMotion ? {} : {
            y: [0, -8, 0]
          }} transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }} whileHover={{
            scale: 1.05
          }} />
          </motion.div>

          {/* Headline with Typing Animation */}
          <motion.div variants={itemVariants}>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              België's Grootste{' '}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                <TypingText texts={['Cannabis Community', 'Kennis Platform', 'Leveranciers Netwerk']} speed={100} pauseDuration={3000} />
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ontdek betrouwbare leveranciers, deel kennis met duizenden leden, 
              en blijf op de hoogte van alles rondom cannabis in België.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center" variants={itemVariants}>
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden" onClick={() => navigate('/register')}>
              <span className="relative z-10 flex items-center gap-2">
                Word Nu Lid - 100% Gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" whileHover={{
              scale: 1.05
            }} transition={{
              duration: 0.3
            }} />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-primary/10 group" onClick={() => navigate('/forums')}>
              <span className="flex items-center gap-2">
                Verken de Forums
                <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </Button>
          </motion.div>

          {/* Trust Indicators with Animated Counters */}
          <motion.div className="flex flex-wrap justify-center items-center gap-6 pt-8" variants={containerVariants}>
            <motion.div className="flex items-center gap-3 px-5 py-3 rounded-full bg-card/60 border border-border/50 backdrop-blur-md shadow-lg" variants={itemVariants} whileHover={{
            scale: 1.05
          }} transition={{
            type: "spring",
            stiffness: 300
          }}>
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-sm sm:text-base font-medium">100% Anoniem & Veilig</span>
            </motion.div>
            <motion.div className="flex items-center gap-3 px-5 py-3 rounded-full bg-card/60 border border-border/50 backdrop-blur-md shadow-lg" variants={itemVariants} whileHover={{
            scale: 1.05
          }} transition={{
            type: "spring",
            stiffness: 300
          }}>
              <Users className="w-6 h-6 text-primary" />
              <span className="text-sm sm:text-base font-medium">
                <AnimatedCounter end={10000} suffix="+" /> Actieve Leden
              </span>
            </motion.div>
            <motion.div className="flex items-center gap-3 px-5 py-3 rounded-full bg-card/60 border border-border/50 backdrop-blur-md shadow-lg" variants={itemVariants} whileHover={{
            scale: 1.05
          }} transition={{
            type: "spring",
            stiffness: 300
          }}>
              <MessageSquare className="w-6 h-6 text-primary" />
              <span className="text-sm sm:text-base font-medium">Dagelijks Nieuwe Discussies</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>;
}