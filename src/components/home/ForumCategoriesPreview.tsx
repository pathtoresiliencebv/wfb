import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MessageSquare, Sprout, Stethoscope, Scale, Leaf, Coffee, Newspaper, MessageCircle, Folder, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { getFallbackImage } from '@/lib/fallbackImages';

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

// Icon mapping voor categorieën
const categoryIcons: Record<string, LucideIcon> = {
  'algemeen': MessageSquare,
  'groei': Sprout,
  'medical': Stethoscope,
  'wetgeving': Scale,
  'strains': Leaf,
  'consumptie': Coffee,
  'nieuws': Newspaper,
  'offtopic': MessageCircle,
};

export function ForumCategoriesPreview() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Helper functie om het juiste icoon te krijgen
  const getCategoryIcon = (slug: string): LucideIcon => {
    return categoryIcons[slug] || Folder;
  };

  const { data: categories = [] } = useQuery({
    queryKey: ['categories-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('topic_count', { ascending: false })
        .limit(4);
      
      if (error) {
        console.warn('Categories fetch failed:', error);
        return [];
      }
      return data as Category[] || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Geen categorieën beschikbaar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-safe">
      <div className="text-center space-y-3 sm:space-y-4 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading">
          Verken Onze <span className="text-primary">Forum Categorieën</span>
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Van kweektips tot wetgeving - vind antwoorden op al je vragen
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category) => {
          const CategoryIcon = getCategoryIcon(category.slug);
          const imageUrl = imageErrors[category.id] 
            ? getFallbackImage(category.slug)
            : (category.image_url || getFallbackImage(category.slug));
          
          return (
            <Link key={category.id} to={`/forums/${category.slug}`}>
              <Card className="group relative min-h-[280px] md:h-[300px] overflow-hidden transition-all duration-300 border-2 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                {/* Enhanced Background with Better Gradient */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url(${imageUrl})`,
                    backgroundColor: category.color || 'hsl(var(--muted))'
                  }}
                >
                  <img 
                    src={imageUrl}
                    alt={category.name}
                    className="hidden"
                    onError={() => {
                      if (!imageErrors[category.id]) {
                        setImageErrors(prev => ({ ...prev, [category.id]: true }));
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/40 backdrop-blur-[2px]" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-4 sm:p-6">
                  {/* Enhanced Icon with Lucide Icon & Glow Effect */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{ 
                      backgroundColor: `${category.color}20`,
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: `${category.color}40`,
                      boxShadow: `0 8px 20px ${category.color}30`
                    }}
                  >
                    <CategoryIcon className="w-8 h-8" style={{ color: category.color }} />
                  </div>

                  {/* Enhanced Text Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
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
                      <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Link to="/forums">
          <Button 
            size="lg" 
            variant="outline" 
            className="group"
          >
            Bekijk Alle Categorieën
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
