import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Search, MessageSquare, ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInUp, scaleIn } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const steps = [
  {
    icon: UserPlus,
    step: '1',
    title: 'Registreer Gratis',
    description: 'Maak in 30 seconden een account aan. Volledig anoniem en veilig.',
    color: 'bg-blue-500'
  },
  {
    icon: Search,
    step: '2',
    title: 'Verken Topics',
    description: 'Duik in duizenden discussies over kweek, strains, medicinaal gebruik en meer.',
    color: 'bg-green-500'
  },
  {
    icon: MessageSquare,
    step: '3',
    title: 'Deel & Leer',
    description: 'Stel vragen, deel je ervaring en bouw je reputatie in de community.',
    color: 'bg-purple-500'
  }
];

export function HowItWorksSection() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  const MotionDiv = prefersReducedMotion ? 'div' : motion.div;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <MotionDiv 
          className="text-center mb-16"
          {...(!prefersReducedMotion && {
            initial: { opacity: 0, y: 30 },
            animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
            transition: { duration: 0.5 }
          })}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hoe Werkt Het?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            In 3 simpele stappen ben je onderdeel van de community
          </p>
        </MotionDiv>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <MotionDiv 
                key={index} 
                className="relative"
                {...(!prefersReducedMotion && {
                  variants: scaleIn,
                  initial: "hidden",
                  animate: isInView ? "visible" : "hidden",
                  transition: { delay: index * 0.2 }
                })}
              >
                <MotionDiv
                  {...(!prefersReducedMotion && {
                    whileHover: { 
                      scale: 1.05,
                      boxShadow: '0 20px 40px -12px hsl(var(--primary) / 0.25)'
                    }
                  })}
                >
                  <Card className="h-full">
                  <CardContent className="p-8 text-center space-y-4">
                    {/* Step Number Badge */}
                    <motion.div 
                      className={`${step.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto text-2xl font-bold`}
                      {...(!prefersReducedMotion && {
                        animate: { 
                          scale: [1, 1.1, 1],
                        },
                        transition: { 
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3
                        }
                      })}
                    >
                      {step.step}
                    </motion.div>
                    
                    {/* Icon */}
                    <motion.div 
                      className="flex justify-center"
                      {...(!prefersReducedMotion && {
                        whileHover: { 
                          y: -10,
                          transition: { type: 'spring', stiffness: 300 }
                        }
                      })}
                    >
                      <Icon className="h-12 w-12 text-primary" />
                    </motion.div>
                    
                    {/* Content */}
                    <div>
                      <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                </MotionDiv>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <motion.div 
                    className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"
                    {...(!prefersReducedMotion && {
                      animate: { 
                        x: [0, 5, 0],
                        opacity: [0.5, 1, 0.5]
                      },
                      transition: { 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    })}
                  >
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </motion.div>
                )}
              </MotionDiv>
            );
          })}
        </div>

        <MotionDiv 
          className="text-center"
          {...(!prefersReducedMotion && {
            initial: { opacity: 0, y: 20 },
            animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
            transition: { delay: 0.8 }
          })}
        >
          <MotionDiv
            className="inline-block"
            {...(!prefersReducedMotion && {
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 }
            })}
          >
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="text-lg px-10 h-14"
            >
              Start Nu - Het is Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </MotionDiv>
          <p className="text-sm text-muted-foreground mt-4">
            Geen credit card nodig • Direct toegang • 100% gratis
          </p>
        </MotionDiv>
      </div>
    </section>
  );
}
