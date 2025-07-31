import React from 'react';
import { Plus, Users, MessageSquare, Pin, Heart, Scale, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ForumsLoadingSkeleton } from '@/components/loading/OptimizedLoadingStates';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
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

      {/* Forum Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} to={`/forums/${category.slug}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-white"
                    style={{ backgroundColor: category.color || '#3b82f6' }}
                  >
                    {React.createElement(iconMap[category.icon as keyof typeof iconMap] || MessageSquare, {
                      className: "h-6 w-6"
                    })}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Publiek
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {category.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{category.topic_count || 0} topics</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{category.reply_count || 0} reacties</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Popular Topics */}
      {popularTopics.length > 0 && (
        <div className="mt-12">
          <h2 className="font-heading text-2xl font-semibold mb-6">Populaire Topics</h2>
          <div className="space-y-4">
            {popularTopics.map((topic) => (
              <Card key={topic.id} className="p-4">
                <div className="flex items-center gap-4">
                  {topic.is_pinned && <Pin className="h-4 w-4 text-primary flex-shrink-0" />}
                  <div className="flex-1">
                    <Link 
                      to={`/forums/${topic.categories?.slug}/topic/${topic.id}`}
                      className="font-medium hover:text-primary cursor-pointer"
                    >
                      {topic.title}
                    </Link>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {topic.categories?.name}
                      </Badge>
                      <span>{topic.reply_count} reacties</span>
                      <span>{topic.view_count} views</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}