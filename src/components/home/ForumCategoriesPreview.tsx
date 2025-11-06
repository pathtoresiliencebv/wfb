import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

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
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold font-heading">
          Verken Onze <span className="text-primary">Forum Categorieën</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Van kweektips tot wetgeving - vind antwoorden op al je vragen
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} to={`/forums/${category.slug}`}>
            <Card className="group relative h-[300px] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-2 hover:border-primary/50">
              {/* Enhanced Background with Better Gradient */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ 
                  backgroundImage: category.image_url ? `url(${category.image_url})` : 'none',
                  backgroundColor: category.color || 'hsl(var(--muted))'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/20" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6">
                {/* Enhanced Icon with Glow Effect */}
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110 shadow-lg"
                  style={{ 
                    backgroundColor: `${category.color}30`,
                    color: category.color,
                    boxShadow: `0 4px 14px ${category.color}40`
                  }}
                >
                  {category.icon || '📁'}
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
                    <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link to="/forums">
          <Button size="lg" variant="outline" className="group">
            Bekijk Alle Categorieën
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
