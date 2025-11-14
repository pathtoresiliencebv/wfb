import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface InternalLinkSuggestionsProps {
  currentPageId: string;
  keywords: string[];
}

export function InternalLinkSuggestions({ currentPageId, keywords }: InternalLinkSuggestionsProps) {
  const { data: suggestions } = useQuery({
    queryKey: ["internal-link-suggestions", currentPageId, keywords],
    queryFn: async () => {
      if (!keywords || keywords.length === 0) return [];

      // Find pages that match keywords
      const { data } = await supabase
        .from("seo_content_pages")
        .select("id, slug, title, meta_description, meta_keywords")
        .eq("is_published", true)
        .neq("id", currentPageId)
        .limit(5);

      if (!data) return [];

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

      // Return top 3 most relevant pages
      return scored
        .filter(p => p.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 3);
    },
  });

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <LinkIcon className="h-4 w-4" />
          Gerelateerde Artikelen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((page) => (
            <Link
              key={page.id}
              to={`/${page.slug}`}
              className="block p-3 rounded-lg border hover:border-primary hover:bg-muted transition-colors"
            >
              <div className="font-medium text-primary hover:underline">
                {page.title}
              </div>
              {page.meta_description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {page.meta_description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
