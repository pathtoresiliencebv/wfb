import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface ForumIntegrationLinksProps {
  location?: string; // e.g., "Gent", "Antwerpen"
}

export function ForumIntegrationLinks({ location }: ForumIntegrationLinksProps) {
  const { data: topTopics } = useQuery({
    queryKey: ["forum-integration", location],
    queryFn: async () => {
      let query = supabase
        .from("topics")
        .select(`
          id,
          title,
          view_count,
          reply_count,
          categories!inner(slug, name)
        `)
        .order("view_count", { ascending: false })
        .limit(3);

      // If location provided, try to find topics mentioning that location
      if (location) {
        query = query.or(`title.ilike.%${location}%,content.ilike.%${location}%`);
      }

      const { data } = await query;
      return data || [];
    },
  });

  if (!topTopics || topTopics.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8 border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Forum Discussies {location && `over ${location}`}
        </CardTitle>
        <CardDescription>
          Praat mee in onze community over dit onderwerp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topTopics.map((topic: any) => (
            <Link
              key={topic.id}
              to={`/topic/${topic.id}`}
              className="block p-4 rounded-lg border hover:border-primary hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-medium text-primary hover:underline line-clamp-2">
                    {topic.title}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {topic.view_count || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {topic.reply_count || 0} replies
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  in {topic.categories?.name || "Forum"}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Link
            to="/forums"
            className="text-sm text-primary hover:underline font-medium"
          >
            Bekijk alle forum discussies →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
