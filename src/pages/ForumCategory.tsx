import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, MessageSquare, Eye, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import { BadgedText } from '@/lib/badgeParser';
import { SEOHead } from '@/components/seo/SEOHead';
import { createBreadcrumbSchema } from '@/components/seo/SchemaMarkup';

export default function ForumCategory() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();

        if (categoryError) throw categoryError;
        setCategory(categoryData);

        const { data: topicsData, error: topicsError } = await supabase
          .from('topics')
          .select(`
            *,
            profiles!topics_author_id_fkey (username, display_name)
          `)
          .eq('category_id', categoryData.id)
          .order('created_at', { ascending: false });

        if (topicsError) throw topicsError;
        setTopics(topicsData || []);
      } catch (error: any) {
        toast({
          title: "Fout bij laden",
          description: "Kon de categorie niet laden.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Categorie niet gevonden</h3>
            <Link to="/forums"><Button>Terug naar forums</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      <SEOHead 
        title={category.name}
        description={`Discussies over ${category.name} op Wiet Forum België.`}
        canonical={`${window.location.origin}/forums/${slug}`}
        structuredData={{
          "@context": "https://schema.org",
          ...createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Forums', url: '/forums' },
            { name: category.name, url: `/forums/${slug}` }
          ]).data,
          "@type": "BreadcrumbList"
        }}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
          <Link to="/forums">
            <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 h-9 px-2 sm:px-3">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Terug</span>
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold truncate">{category.name}</h1>
        </div>
        {user && (
          <Link to="/create-topic" className="w-full sm:w-auto">
            <Button className="gap-1 sm:gap-2 w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Nieuw Topic</span>
              <span className="sm:hidden">Nieuw</span>
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {topics.length === 0 ? (
          <Card>
            <CardContent className="pt-4 sm:pt-6 text-center px-3 sm:px-6">
              <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">Geen topics gevonden</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Er zijn nog geen topics in deze categorie.
              </p>
              {user && (
                <Link to="/create-topic">
                  <Button className="text-sm">Eerste Topic Maken</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          topics.map((topic) => (
            <Card key={topic.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 w-full min-w-0">
                    <Link to={`/forums/${slug}/topic/${topic.id}`}>
                      <CardTitle className="hover:text-primary transition-colors text-sm sm:text-base md:text-lg line-clamp-2">
                        <BadgedText text={topic.title} />
                      </CardTitle>
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-[120px] sm:max-w-none">{topic.profiles?.display_name || topic.profiles?.username}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(topic.created_at), {
                            addSuffix: true,
                            locale: nl,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 self-start">
                    <Badge variant="secondary" className="gap-1 text-xs px-2 py-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{topic.reply_count}</span>
                    </Badge>
                    <Badge variant="outline" className="gap-1 text-xs px-2 py-1">
                      <Eye className="h-3 w-3" />
                      <span>{topic.view_count}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}