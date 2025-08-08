import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Eye, PlusCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface Topic {
  id: string;
  title: string;
  view_count: number;
  reply_count: number;
  is_pinned: boolean;
  created_at: string;
  author_id: string;
  profiles: {
    username: string;
    display_name: string;
  };
}

interface CategoryTopicsProps {
  categoryId: string;
}

export function CategoryTopics({ categoryId }: CategoryTopicsProps) {
  const { data: topics, isLoading } = useQuery({
    queryKey: ["category-topics", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topics")
        .select(`
          id,
          title,
          view_count,
          reply_count,
          is_pinned,
          created_at,
          author_id,
          profiles!topics_author_id_fkey (
            username,
            display_name
          )
        `)
        .eq("category_id", categoryId)
        .order("last_activity_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Topic[];
    },
    enabled: !!categoryId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nog geen topics</h3>
          <p className="text-muted-foreground mb-4">
            Wees de eerste om een topic te starten in deze categorie!
          </p>
          <Button asChild>
            <Link to="/create-topic">
              <PlusCircle className="mr-2 h-4 w-4" />
              Start een discussie
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {topics.map((topic) => (
        <Card key={topic.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Link 
                    to={`/topic/${topic.id}`}
                    className="font-medium hover:underline text-lg"
                  >
                    {topic.title}
                  </Link>
                  {topic.is_pinned && (
                    <Badge variant="secondary" className="text-xs">
                      Vastgezet
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>Door</span>
                    <span className="font-medium">
                      {topic.profiles?.display_name || topic.profiles?.username || 'Onbekend'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(topic.created_at), 'dd MMM yyyy', { locale: nl })}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground ml-4">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{topic.reply_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{topic.view_count}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}