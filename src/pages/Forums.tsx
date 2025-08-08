import React from 'react';
import { Plus, Users, MessageSquare, Pin, Heart, Scale, Star, TrendingUp, Image as ImageIcon } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Forums</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Forum Categorieën</h1>
          <p className="text-muted-foreground">
            Ontdek onze verschillende communities en join de discussie
          </p>
        </div>
        {user && (
          <Button className="gap-2" asChild>
            <Link to="/create-topic">
              <Plus className="h-4 w-4" />
              Nieuw Topic
            </Link>
          </Button>
        )}
      </div>

      {/* Categories Tabs */}
      <Tabs defaultValue={slug ? categories.find(cat => cat.slug === slug)?.id : categories[0]?.id} className="w-full">
        <TabsList className="grid w-full h-auto p-2 gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 4)}, 1fr)` }}>
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || MessageSquare;
            
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex flex-col items-center gap-3 p-4 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.image_url ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                     <LazyImage
                       src={category.image_url}
                       alt={category.name}
                       className="w-full h-full object-cover"
                     />
                  </div>
                ) : (
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <IconComponent 
                      className="h-8 w-8" 
                      style={{ color: category.color }}
                    />
                  </div>
                )}
                <div className="text-center">
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs opacity-70">
                    {category.topic_count || 0} topics
                  </div>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{category.name}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{category.topic_count || 0} topics</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{category.reply_count || 0} replies</span>
                </div>
              </div>
            </div>

            <CategoryTopics categoryId={category.id} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}