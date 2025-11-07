import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp, Eye, MessageSquare } from 'lucide-react';
import { useTrendingTopics } from '@/hooks/useTrendingTopics';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TrendingTopicsProps {
  limit?: number;
  showHeader?: boolean;
}

export function TrendingTopics({ limit = 6, showHeader = true }: TrendingTopicsProps) {
  const { topics, isLoading } = useTrendingTopics(limit);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const MotionDiv = prefersReducedMotion ? 'div' : motion.div;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showHeader && <Skeleton className="h-8 w-48" />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <MotionDiv 
          className="flex items-center gap-2"
          {...(!prefersReducedMotion && {
            initial: { opacity: 0, x: -30 },
            animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 },
            transition: { duration: 0.5 }
          })}
        >
          <motion.div
            {...(!prefersReducedMotion && {
              animate: { 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              },
              transition: { 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            })}
          >
            <TrendingUp className="h-6 w-6 text-primary" />
          </motion.div>
          <h2 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Trending
            </span>
            <span className="text-foreground"> Topics</span>
          </h2>
        </MotionDiv>
      )}
      
      <motion.div 
        ref={ref}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        {...(!prefersReducedMotion && {
          variants: staggerContainer,
          initial: "hidden",
          animate: isInView ? "visible" : "hidden"
        })}
      >
        {topics.map((topic, index) => (
          <MotionDiv
            key={topic.id}
            {...(!prefersReducedMotion && {
              variants: fadeInUp,
              transition: { delay: index * 0.08 },
              whileHover: { 
                scale: 1.02,
                boxShadow: '0 20px 40px -12px hsl(var(--primary) / 0.2)'
              }
            })}
          >
            <Card className="group relative overflow-hidden transition-all duration-300 border-2 border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
              {/* Groene gradient overlay - verschijnt bij hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Groene glow spot - subtiel in top-right corner */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content wrapper met relative positioning */}
              <div className="relative z-10">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-2">
                      <Link 
                        to={`/topic/${topic.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {topic.title}
                      </Link>
                    </CardTitle>
                  </div>
                  <motion.div
                    {...(!prefersReducedMotion && {
                      whileHover: { scale: 1.05 }
                    })}
                  >
                    <Badge 
                      variant="secondary" 
                      className="w-fit mt-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 hover:from-primary/20 hover:to-secondary/20 transition-all"
                    >
                      {topic.categories.name}
                    </Badge>
                  </motion.div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topic.profiles && (
                    <motion.div 
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                      {...(!prefersReducedMotion && {
                        whileHover: { x: 5 }
                      })}
                    >
                      <Avatar className="h-6 w-6 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                        <AvatarImage src={topic.profiles.avatar_url || undefined} />
                        <AvatarFallback>
                          {(topic.profiles.display_name || topic.profiles.username || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">
                        {topic.profiles.display_name || topic.profiles.username}
                      </span>
                    </motion.div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <motion.div 
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                      {...(!prefersReducedMotion && {
                        whileHover: { scale: 1.1 }
                      })}
                    >
                      <Eye className="h-4 w-4" />
                      <span>{topic.view_count}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                      {...(!prefersReducedMotion && {
                        whileHover: { scale: 1.1 }
                      })}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{topic.reply_count}</span>
                    </motion.div>
                    <span className="ml-auto text-xs">
                      {formatDistanceToNow(new Date(topic.created_at), { 
                        addSuffix: true,
                        locale: nl 
                      })}
                    </span>
                  </div>
                </CardContent>
              </div>
            </Card>
          </MotionDiv>
        ))}
      </motion.div>
      
      <MotionDiv 
        className="text-center"
        {...(!prefersReducedMotion && {
          initial: { opacity: 0, y: 20 },
          animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
          transition: { delay: 0.5 }
        })}
      >
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/30 transition-all"
        >
          <Link 
            to="/forums"
            className="inline-flex items-center gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            Bekijk alle topics
          </Link>
        </Button>
      </MotionDiv>
    </div>
  );
}
