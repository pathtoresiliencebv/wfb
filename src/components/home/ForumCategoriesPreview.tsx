import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  image_url: string;
  topic_count: number;
}

export function ForumCategoriesPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('topic_count', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data as Category[];
    },
  });

  const MotionDiv = prefersReducedMotion ? 'div' : motion.div;
  const MotionCard = prefersReducedMotion ? Card : motion(Card);
  const MotionButton = prefersReducedMotion ? Button : motion(Button);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[280px] rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!categories?.length) return null;

  return (
    <div className="space-y-8">
      <MotionDiv 
        className="text-center space-y-3"
        {...(!prefersReducedMotion && {
          initial: { opacity: 0, y: 30 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
          transition: { duration: 0.5 }
        })}
      >
        <h2 className="text-3xl sm:text-4xl font-bold font-heading">
          Verken Onze <span className="text-primary">Forum Categorieën</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Van kweektips tot wetgeving - vind antwoorden op al je vragen
        </p>
      </MotionDiv>

      <motion.div 
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        {...(!prefersReducedMotion && {
          variants: staggerContainer,
          initial: "hidden",
          animate: isInView ? "visible" : "hidden"
        })}
      >
        {categories.map((category, index) => (
          <Link key={category.id} to={`/forums/${category.slug}`}>
            <MotionCard 
              className="group relative h-[300px] overflow-hidden transition-all duration-300 border-2 hover:border-primary/50"
              {...(!prefersReducedMotion && {
                variants: fadeInUp,
                transition: { delay: index * 0.1 },
                whileHover: { 
                  scale: 1.03,
                  boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.3)'
                }
              })}
            >
              {/* Enhanced Background with Better Gradient */}
              <motion.div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: category.image_url ? `url(${category.image_url})` : 'none',
                  backgroundColor: category.color || 'hsl(var(--muted))'
                }}
                {...(!prefersReducedMotion && {
                  whileHover: { scale: 1.1 },
                  transition: { duration: 0.3 }
                })}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/20" />
              </motion.div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6">
                {/* Enhanced Icon with Glow Effect */}
                <motion.div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                  style={{ 
                    backgroundColor: `${category.color}30`,
                    color: category.color,
                    boxShadow: `0 4px 14px ${category.color}40`
                  }}
                  {...(!prefersReducedMotion && {
                    whileHover: { 
                      rotate: [0, -10, 10, 0],
                      scale: 1.1,
                      transition: { duration: 0.5 }
                    }
                  })}
                >
                  {category.icon || '📁'}
                </motion.div>

                {/* Enhanced Text Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <motion.div
                      {...(!prefersReducedMotion && {
                        whileHover: { scale: 1.1 }
                      })}
                    >
                      <Badge 
                        variant="secondary" 
                        className="backdrop-blur-sm"
                        style={{
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                          borderColor: `${category.color}40`
                        }}
                      >
                        {category.topic_count} topics
                      </Badge>
                    </motion.div>
                    <motion.div
                      {...(!prefersReducedMotion && {
                        animate: { x: [0, 5, 0] },
                        transition: { 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      })}
                    >
                      <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </MotionCard>
          </Link>
        ))}
      </motion.div>

      <MotionDiv 
        className="text-center pt-4"
        {...(!prefersReducedMotion && {
          initial: { opacity: 0, y: 20 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
          transition: { delay: 0.5, duration: 0.5 }
        })}
      >
        <Link to="/forums">
          <MotionButton 
            size="lg" 
            variant="outline" 
            className="group"
            {...(!prefersReducedMotion && {
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 }
            })}
          >
            Bekijk Alle Categorieën
            <motion.div
              {...(!prefersReducedMotion && {
                animate: { x: [0, 5, 0] },
                transition: { 
                  duration: 1.5,
                  repeat: Infinity
                }
              })}
            >
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.div>
          </MotionButton>
        </Link>
      </MotionDiv>
    </div>
  );
}
