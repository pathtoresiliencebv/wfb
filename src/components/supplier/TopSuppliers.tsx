import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupplierStats } from '@/types/supplier';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CrownBadge } from '@/components/ui/crown-badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInUp, slideInLeft } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const TopSuppliers: React.FC = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();

  const { data: topSuppliers, isLoading } = useQuery({
    queryKey: ['top-suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_profiles')
        .select(`
          *,
          profiles!inner(username, display_name, avatar_url, reputation)
        `)
        .eq('is_active', true)
        .gt('ranking', 0)
        .order('ranking', { ascending: true })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRankText = (rank: number) => {
    switch (rank) {
      case 1: return 'Gouden Leverancier';
      case 2: return 'Zilveren Leverancier';
      case 3: return 'Bronzen Leverancier';
      default: return 'Top Leverancier';
    }
  };

  const MotionCard = prefersReducedMotion ? Card : motion(Card);
  const MotionDiv = prefersReducedMotion ? 'div' : motion.div;
  const MotionButton = prefersReducedMotion ? Button : motion(Button);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 3 Leveranciers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Laden...</div>
        </CardContent>
      </Card>
    );
  }

  if (!topSuppliers || topSuppliers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 3 Leveranciers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Nog geen gerangschikte leveranciers
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <MotionCard
      ref={ref}
      {...(!prefersReducedMotion && {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
        transition: { duration: 0.5 }
      })}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <motion.div
            {...(!prefersReducedMotion && {
              animate: { 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1]
              },
              transition: { 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            })}
          >
            <Trophy className="h-5 w-5 text-yellow-500" />
          </motion.div>
          Top 3 Leveranciers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topSuppliers.map((supplier, index) => (
          <MotionDiv
            key={supplier.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            {...(!prefersReducedMotion && {
              variants: slideInLeft,
              initial: "hidden",
              animate: isInView ? "visible" : "hidden",
              transition: { delay: index * 0.1 },
              whileHover: { 
                scale: 1.02,
                x: 5
              }
            })}
          >
            <div className="flex items-center gap-3 flex-1">
              <motion.div
                {...(!prefersReducedMotion && {
                  whileHover: { 
                    rotate: [0, -15, 15, 0],
                    scale: 1.1,
                    transition: { duration: 0.5 }
                  }
                })}
              >
                <CrownBadge rank={supplier.ranking as 1 | 2 | 3} size="md" />
              </motion.div>
              
              <motion.div
                {...(!prefersReducedMotion && {
                  whileHover: { scale: 1.1 }
                })}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={supplier.profiles.avatar_url} />
                  <AvatarFallback>
                    {getInitials(supplier.business_name)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              <div className="flex-1">
                <div className="font-medium">{supplier.business_name}</div>
                <div className="text-sm text-muted-foreground">
                  {getRankText(supplier.ranking)}
                </div>
                
                <div className="flex items-center gap-4 mt-1">
                  {(supplier.stats as SupplierStats).rating && (
                    <motion.div 
                      className="flex items-center gap-1 text-xs"
                      {...(!prefersReducedMotion && {
                        whileHover: { scale: 1.1 }
                      })}
                    >
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      {(supplier.stats as SupplierStats).rating}
                    </motion.div>
                  )}
                  {(supplier.stats as SupplierStats).customers && (
                    <motion.div 
                      className="flex items-center gap-1 text-xs"
                      {...(!prefersReducedMotion && {
                        whileHover: { scale: 1.1 }
                      })}
                    >
                      <Users className="h-3 w-3 text-primary" />
                      {(supplier.stats as SupplierStats).customers}+ klanten
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            
            <MotionButton
              size="sm"
              variant="outline"
              onClick={() => navigate(`/aanbod/${supplier.profiles.username}`)}
              {...(!prefersReducedMotion && {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 }
              })}
            >
              Bekijk
            </MotionButton>
          </MotionDiv>
        ))}
      </CardContent>
    </MotionCard>
  );
};
