import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const testimonials = [
  {
    id: 1,
    name: 'Jan Vermeulen',
    role: 'Medical Cannabis Patient',
    avatar: '',
    rating: 5,
    text: 'Eindelijk een Belgisch platform waar ik betrouwbare informatie vind over medicinale cannabis. De community is behulpzaam en de moderatie zorgt voor kwaliteit.',
  },
  {
    id: 2,
    name: 'Sophie De Smet',
    role: 'Recreational User',
    avatar: '',
    rating: 5,
    text: 'De leveranciers op dit platform zijn geverifieerd en betrouwbaar. Ik voel me veilig om hier contacten te leggen en informatie uit te wisselen.',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Cannabis Grower',
    avatar: '',
    rating: 5,
    text: 'Als kweeker waardeer ik de uitgebreide discussies over strains en kweektechnieken. Het niveau van kennis hier is indrukwekkend!',
  },
  {
    id: 4,
    name: 'Lisa Peeters',
    role: 'Community Member',
    avatar: '',
    rating: 5,
    text: 'De gamification maakt het forum extra leuk. Je wordt beloond voor actieve deelname en het helpen van anderen. Geweldige community!',
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const MotionDiv = prefersReducedMotion ? 'div' : motion.div;

  return (
    <div className="space-y-6">
      <MotionDiv 
        className="text-center space-y-2"
        {...(!prefersReducedMotion && {
          initial: { opacity: 0, y: 30 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
          transition: { duration: 0.5 }
        })}
      >
        <h2 className="text-3xl font-bold">Wat Onze Community Zegt</h2>
        <p className="text-muted-foreground">
          Echte ervaringen van onze actieve leden
        </p>
      </MotionDiv>

      <motion.div 
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        {...(!prefersReducedMotion && {
          variants: staggerContainer,
          initial: "hidden",
          animate: isInView ? "visible" : "hidden"
        })}
      >
        {testimonials.map((testimonial, index) => (
          <MotionDiv
            key={testimonial.id}
            {...(!prefersReducedMotion && {
              variants: fadeInUp,
              transition: { delay: index * 0.1 },
              whileHover: { 
                scale: 1.02,
                boxShadow: '0 20px 40px -12px hsl(var(--primary) / 0.2)'
              }
            })}
          >
            <Card className="relative">
            <CardContent className="pt-6">
              <motion.div
                {...(!prefersReducedMotion && {
                  animate: { 
                    rotate: [0, 5, -5, 0],
                    opacity: [0.2, 0.3, 0.2]
                  },
                  transition: { 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                })}
              >
                <Quote className="absolute top-4 right-4 h-8 w-8 text-muted-foreground/20" />
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-4 mb-4"
                {...(!prefersReducedMotion && {
                  whileHover: { x: 5 }
                })}
              >
                <motion.div
                  {...(!prefersReducedMotion && {
                    whileHover: { scale: 1.1, rotate: 5 }
                  })}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    {...(!prefersReducedMotion && {
                      initial: { scale: 0, rotate: -180 },
                      animate: isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 },
                      transition: { 
                        delay: index * 0.1 + i * 0.1,
                        type: 'spring',
                        stiffness: 200
                      }
                    })}
                  >
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </motion.div>
                ))}
              </div>

              <p className="text-muted-foreground italic">
                "{testimonial.text}"
              </p>
            </CardContent>
          </Card>
          </MotionDiv>
        ))}
      </motion.div>
    </div>
  );
}
