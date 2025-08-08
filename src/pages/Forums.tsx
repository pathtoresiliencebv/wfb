import React from 'react';
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
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary font-medium">Forums</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Community Forums
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ontdek onze verschillende communities, deel kennis en join de discussie met cannabis liefhebbers
          </p>
          {user && (
            <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
              <Link to="/create-topic">
                <Plus className="h-5 w-5" />
                Start Nieuwe Discussie
              </Link>
            </Button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || MessageSquare;
            
            return (
              <Card 
                key={category.id} 
                className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border-0 bg-card/50 backdrop-blur-sm"
              >
                <div className="relative">
                  {/* Background Image or Gradient */}
                  {category.image_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <LazyImage
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div 
                      className="h-48 relative"
                      style={{ 
                        background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10" />
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className="absolute top-4 left-4">
                    <div 
                      className="p-3 rounded-xl backdrop-blur-sm border border-white/20"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <IconComponent 
                        className="h-8 w-8" 
                        style={{ color: category.color }}
                      />
                    </div>
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="backdrop-blur-sm bg-white/90 text-foreground">
                      {category.topic_count || 0} topics
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-heading text-xl font-bold group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{category.topic_count || 0} topics</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{category.reply_count || 0} replies</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                      variant="outline"
                      asChild
                    >
                      <Link to={`/forums/${category.slug}`}>
                        Bekijk Topics
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
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold mb-2">🔥 Trending Discussies</h2>
              <p className="text-muted-foreground">De meest bekeken topics van deze week</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularTopics.map((topic, index) => (
                <Card 
                  key={topic.id} 
                  className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-accent/5"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/forums/${topic.categories.slug}/topic/${topic.id}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-2 block mb-2"
                        >
                          {topic.title}
                        </Link>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{topic.view_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{topic.reply_count}</span>
                          </div>
                          {topic.is_pinned && (
                            <Badge variant="secondary" className="text-xs">
                              <Pin className="h-3 w-3 mr-1" />
                              Pinned
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