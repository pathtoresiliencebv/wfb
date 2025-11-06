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
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Verken Onze Communities</h2>
        <p className="text-muted-foreground">
          Duik in discussies over jouw favoriete cannabis topics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} to={`/forums/${category.slug}`}>
            <Card className="group relative h-[280px] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary/50">
              {/* Background Image with Gradient Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ 
                  backgroundImage: category.image_url ? `url(${category.image_url})` : 'none',
                  backgroundColor: category.color || 'hsl(var(--muted))'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6">
                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ 
                    backgroundColor: `${category.color}20`,
                    color: category.color 
                  }}
                >
                  {category.icon || '📁'}
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {category.topic_count} topics
                    </Badge>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Link to="/forums">
          <Button size="lg" variant="outline">
            Bekijk Alle Categorieën
          </Button>
        </Link>
      </div>
    </div>
  );
}
