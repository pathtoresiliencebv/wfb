import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface InternalLinkSuggestionsProps {
  currentPageId: string;
  keywords: string[];
}

export function InternalLinkSuggestions({ currentPageId, keywords }: InternalLinkSuggestionsProps) {
  const { data: suggestions } = useQuery({
    queryKey: ["internal-link-suggestions", currentPageId, keywords],
    queryFn: async () => {
      // Always fetch some suggestions even if keywords are empty
      const { data } = await supabase
        .from("seo_content_pages")
        .select("id, slug, title, meta_description, meta_keywords")
        .eq("is_published", true)
        .neq("id", currentPageId)
        .limit(10);

      if (!data) return [];

      if (!keywords || keywords.length === 0) {
        // If no keywords, return random 3 pages
        return data.sort(() => 0.5 - Math.random()).slice(0, 3);
      }

      // Score each page based on keyword overlap
      const scored = data.map((page) => {
        const pageKeywords = page.meta_keywords || [];
        const overlap = keywords.filter(kw => 
          pageKeywords.some((pk: string) => pk.toLowerCase().includes(kw.toLowerCase()))
        ).length;
        
        return {
          ...page,
          relevanceScore: overlap,
        };
      });

      // Return top 3 most relevant pages, fallback to random if no relevance
      const relevant = scored.filter(p => p.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);
        
      if (relevant.length > 0) {
        return relevant.slice(0, 3);
      }
      
      return scored.slice(0, 3);
    },
  });

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <LinkIcon className="h-4 w-4" />
          Lees ook deze artikelen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3">
          {suggestions.map((page) => (
            <Link
              key={page.id}
              to={`/${page.slug}`}
              className="group flex flex-col h-full p-4 rounded-lg border bg-card hover:border-primary hover:shadow-md transition-all"
            >
              <div className="font-medium text-foreground group-hover:text-primary transition-colors mb-2">
                {page.title}
              </div>
              {page.meta_description && (
                <p className="text-xs text-muted-foreground line-clamp-3 mb-3 flex-grow">
                  {page.meta_description}
                </p>
              )}
              <div className="flex items-center text-xs text-primary font-medium mt-auto">
                Lees artikel <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
