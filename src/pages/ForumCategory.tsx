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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/forums">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Terug
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>
        {user && (
          <Link to="/create-topic">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nieuw Topic
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {topics.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Geen topics gevonden</h3>
              <p className="text-muted-foreground mb-4">
                Er zijn nog geen topics in deze categorie.
              </p>
              {user && (
                <Link to="/create-topic">
                  <Button>Eerste Topic Maken</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          topics.map((topic) => (
            <Card key={topic.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link to={`/forums/${slug}/topic/${topic.id}`}>
                      <CardTitle className="hover:text-primary transition-colors">
                        {topic.title}
                      </CardTitle>
                    </Link>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{topic.profiles?.display_name || topic.profiles?.username}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(topic.created_at), {
                            addSuffix: true,
                            locale: nl,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {topic.reply_count}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Eye className="h-3 w-3" />
                      {topic.view_count}
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