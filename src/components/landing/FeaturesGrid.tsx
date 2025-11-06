import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  Users, 
  Shield, 
  Award,
  BookOpen,
  TrendingUp,
  Lock,
  Zap,
  Heart,
  Search,
  Bell,
  Star
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const features = [
  {
    icon: MessageSquare,
    title: 'Actieve Forums',
    description: 'Dagelijkse discussies over alle aspecten van cannabis - van medicinaal gebruik tot kweektips',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Users,
    title: 'Gepassioneerde Community',
    description: 'Maak contact met duizenden gelijkgestemde Belgen die hun ervaringen en kennis delen',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Shield,
    title: 'Expert Moderatie',
    description: 'Professioneel gemodereerd door ervaren teamleden voor een veilige en respectvolle omgeving',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Award,
    title: 'Geverifieerde Leveranciers',
    description: 'Ontdek betrouwbare leveranciers met echte reviews en transparante ratings',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: BookOpen,
    title: 'Kennisbank',
    description: 'Toegang tot uitgebreide guides over wetgeving, medicinaal gebruik en kweektechnieken',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Laatste Nieuws',
    description: 'Blijf op de hoogte van de nieuwste ontwikkelingen in cannabiswetgeving en onderzoek',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Lock,
    title: 'Privacy & Veiligheid',
    description: 'Jouw gegevens zijn veilig met geavanceerde encryptie en privacybescherming',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    icon: Zap,
    title: 'Gamification',
    description: 'Verdien punten, badges en rewards door actief deel te nemen aan de community',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Heart,
    title: 'Ondersteunende Sfeer',
    description: 'Een oordeelvrije ruimte waar iedereen welkom is om vragen te stellen en te leren',
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
  },
  {
    icon: Search,
    title: 'Geavanceerde Zoekfunctie',
    description: 'Vind snel antwoorden met onze krachtige zoekfunctie en uitgebreide tags',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: Bell,
    title: 'Real-time Notificaties',
    description: 'Blijf op de hoogte van nieuwe reacties, berichten en updates in topics die je volgt',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
  {
    icon: Star,
    title: 'Premium Features',
    description: 'Toegang tot exclusieve content, private messaging en geavanceerde forum features',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
];

export function FeaturesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const MotionDiv = prefersReducedMotion ? 'div' : motion.div;
  const MotionCard = prefersReducedMotion ? Card : motion(Card);

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <MotionDiv 
          className="text-center mb-16 space-y-4"
          {...(!prefersReducedMotion && {
            initial: { opacity: 0, y: 30 },
            animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
            transition: { duration: 0.5 }
          })}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading">
            Alles Wat Je <span className="text-primary">Nodig Hebt</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ontdek alle features die Wiet Forum België de beste cannabis community van België maken
          </p>
        </MotionDiv>

        <motion.div 
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          {...(!prefersReducedMotion && {
            variants: staggerContainer,
            initial: "hidden",
            animate: isInView ? "visible" : "hidden"
          })}
        >
          {features.map((feature, index) => (
            <MotionCard 
              key={index} 
              className="group transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-to-br from-card to-card/50"
              {...(!prefersReducedMotion && {
                variants: fadeInUp,
                transition: { delay: index * 0.05 },
                whileHover: { 
                  scale: 1.05,
                  boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.25)'
                }
              })}
            >
              <CardContent className="pt-6 space-y-4">
                <MotionDiv 
                  className={`inline-flex p-4 rounded-2xl ${feature.bgColor} shadow-lg`}
                  {...(!prefersReducedMotion && {
                    whileHover: { 
                      rotate: 5, 
                      scale: 1.15 
                    }
                  })}
                >
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </MotionDiv>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </MotionCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
