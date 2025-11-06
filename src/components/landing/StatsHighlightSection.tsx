import { useRealTimeStats } from '@/hooks/useRealTimeStats';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageSquare, TrendingUp, Award } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { fadeInUp, staggerContainer, hoverScale, bouncySpring } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function StatsHighlightSection() {
  const { stats, isLoading } = useRealTimeStats();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  const displayStats = [
    {
      icon: Users,
      label: 'Actieve Leden',
      value: stats?.userCount || 0,
      suffix: '+',
      color: 'text-blue-500'
    },
    {
      icon: MessageSquare,
      label: 'Forum Topics',
      value: stats?.topicCount || 0,
      suffix: '+',
      color: 'text-green-500'
    },
    {
      icon: TrendingUp,
      label: 'Dagelijkse Activiteit',
      value: Math.round((stats?.topicCount || 0) / 30),
      suffix: '+',
      color: 'text-purple-500'
    },
    {
      icon: Award,
      label: 'Expert Leden',
      value: stats?.expertCount || 0,
      suffix: '',
      color: 'text-orange-500'
    }
  ];

  const MotionCard = prefersReducedMotion ? Card : motion(Card);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
          {...(!prefersReducedMotion && {
            variants: staggerContainer,
            initial: "hidden",
            animate: isInView ? "visible" : "hidden"
          })}
        >
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <MotionCard 
                key={index} 
                className="text-center border-2 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-card to-card/50"
                {...(!prefersReducedMotion && {
                  variants: fadeInUp,
                  transition: { delay: index * 0.1 },
                  whileHover: { 
                    scale: 1.08,
                    boxShadow: '0 20px 40px -12px hsl(var(--primary) / 0.3)'
                  }
                })}
              >
                <CardContent className="p-6 space-y-3">
                  <motion.div 
                    className="flex justify-center"
                    {...(!prefersReducedMotion && {
                      whileHover: { 
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.5 }
                      }
                    })}
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </motion.div>
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix} 
                    isLoading={isLoading}
                    inView={isInView}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </MotionCard>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedCounter({ 
  value, 
  suffix, 
  isLoading, 
  inView,
  prefersReducedMotion 
}: { 
  value: number; 
  suffix: string; 
  isLoading: boolean;
  inView: boolean;
  prefersReducedMotion: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView || isLoading || prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let startTime: number | null = null;
    const duration = 1500; // 1.5 seconds
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeProgress);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, inView, isLoading, prefersReducedMotion]);

  return (
    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {isLoading ? '...' : displayValue}{suffix}
    </div>
  );
}
