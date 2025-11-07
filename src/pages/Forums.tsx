import React, { useState } from 'react';
import { Plus, Users, MessageSquare, Pin, Heart, Scale, Star, TrendingUp, Eye, Image as ImageIcon } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LazyImage } from '@/components/ui/lazy-image';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ForumsLoadingSkeleton } from '@/components/loading/OptimizedLoadingStates';
import { CategoryTopics } from '@/components/forums/CategoryTopics';
import { getFallbackImage } from '@/lib/fallbackImages';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  image_url?: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  topic_count?: number;
  reply_count?: number;
}

interface TopicWithCategory {
  id: string;
  title: string;
  reply_count: number;
  view_count: number;
  is_pinned: boolean;
  categories: {
    name: string;
    slug: string;
  };
}

const iconMap = {
  'MessageSquare': MessageSquare,
  'TrendingUp': TrendingUp,
  'Users': Users,
  'Heart': Heart,
  'Scale': Scale,
  'Star': Star,
};

export default function Forums() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { slug } = useParams();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Fetch categories with React Query
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data || [];
    },
    staleTime: 300000, // 5 minutes
  });

  // Fetch popular topics with React Query
  const { data: popularTopics = [], isLoading: topicsLoading } = useQuery({
    queryKey: ['popularTopics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select(`
          id,
          title,
          reply_count,
          view_count,
          is_pinned,
          categories (
            name,
            slug
          )
        `)
        .order('view_count', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    staleTime: 60000, // 1 minute
  });

  const loading = categoriesLoading || topicsLoading;

  if (loading) {
    return <ForumsLoadingSkeleton />;
  }

  // If there's a slug param but it doesn't match any category, redirect
  if (slug) {
    const categoryExists = categories.find(cat => cat.slug === slug);
    if (!categoryExists) {
      return <Navigate to="/forums" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/20">
      <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8 space-y-6 md:space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4 md:mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="hover:text-primary transition-colors text-sm">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary font-medium text-sm">Forums</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Header */}
        <div className="text-center space-y-2 sm:space-y-3 md:space-y-4 mb-6 sm:mb-8 md:mb-12">
          <h1 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-2">
            Community Forums
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Ontdek onze verschillende communities, deel kennis en join de discussie
          </p>
          {user && (
            <Button size="default" className="gap-1 sm:gap-2 shadow-lg hover:shadow-xl transition-all duration-300 h-9 sm:h-10 md:h-11 px-4 sm:px-5 md:px-6 text-xs sm:text-sm" asChild>
              <Link to="/create-topic">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Start Nieuwe Discussie</span>
                <span className="sm:hidden">Nieuw</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || MessageSquare;
            const imageUrl = imageErrors[category.id] 
              ? getFallbackImage(category.slug)
              : (category.image_url || getFallbackImage(category.slug));
            
            return (
              <Card 
                key={category.id} 
                className="group hover:shadow-lg md:hover:shadow-2xl hover:scale-[1.01] md:hover:scale-[1.02] transition-all duration-300 overflow-hidden border-0 bg-card/50 backdrop-blur-sm"
              >
                <div className="relative">
                  {/* Background Image with Fallback */}
                  <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
                    <LazyImage
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={() => {
                        if (!imageErrors[category.id]) {
                          setImageErrors(prev => ({ ...prev, [category.id]: true }));
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  
                  {/* Icon */}
                  <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <div 
                      className="p-2 md:p-3 rounded-lg md:rounded-xl backdrop-blur-sm border border-white/20"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <IconComponent 
                        className="h-6 w-6 md:h-8 md:w-8" 
                        style={{ color: category.color }}
                      />
                    </div>
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute top-3 right-3 md:top-4 md:right-4">
                    <Badge variant="secondary" className="backdrop-blur-sm bg-white/90 text-foreground text-xs">
                      {category.topic_count || 0} topics
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <h3 className="font-heading text-base sm:text-lg md:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mt-1">
                        {category.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span className="truncate">{category.topic_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="truncate">{category.reply_count || 0}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-2 sm:mt-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors h-8 sm:h-9 text-xs sm:text-sm" 
                      variant="outline"
                      asChild
                    >
                      <Link to={`/forums/${category.slug}`}>
                        <span className="hidden sm:inline">Bekijk Topics</span>
                        <span className="sm:hidden">Bekijk</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Popular Topics Section */}
        {popularTopics.length > 0 && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="text-center px-2">
              <h2 className="font-heading text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">🔥 Trending</h2>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">De meest bekeken topics</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {popularTopics.map((topic, index) => (
                <Card 
                  key={topic.id} 
                  className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-accent/5"
                >
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-xs">#{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/forums/${topic.categories.slug}/topic/${topic.id}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-2 block mb-1 sm:mb-2 text-xs sm:text-sm md:text-base"
                        >
                          {topic.title}
                        </Link>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{topic.view_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{topic.reply_count}</span>
                          </div>
                          {topic.is_pinned && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              <Pin className="h-3 w-3 mr-0.5" />
                              <span className="hidden sm:inline">Pinned</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* If viewing specific category */}
        {slug && categories.find(cat => cat.slug === slug) && (
          <div className="mt-12">
            <CategoryTopics categoryId={categories.find(cat => cat.slug === slug)!.id} />
          </div>
        )}
      </div>
    </div>
  );
}