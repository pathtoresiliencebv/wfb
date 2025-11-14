import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface RelatedSEOPagesProps {
  currentSlug: string;
  pageType: string;
  parentSlug?: string | null;
}

export function RelatedSEOPages({ currentSlug, pageType, parentSlug }: RelatedSEOPagesProps) {
  const { data: relatedPages } = useQuery({
    queryKey: ["related-seo-pages", currentSlug, pageType],
    queryFn: async () => {
      // For pillar page: show all provinces
      if (pageType === "pillar") {
        const { data } = await supabase
          .from("seo_content_pages")
          .select("slug, title, meta_description, page_type")
          .eq("page_type", "province")
          .eq("is_published", true)
          .order("title");
        return data || [];
      }

      // For province page: show cities in that province + link back to pillar
      if (pageType === "province") {
        const { data } = await supabase
          .from("seo_content_pages")
          .select("slug, title, meta_description, page_type")
          .or(`page_type.eq.city,page_type.eq.pillar`)
          .eq("is_published", true)
          .order("page_type", { ascending: false })
          .order("title");
        
        // Filter cities that belong to this province
        const filtered = (data || []).filter(page => {
          if (page.page_type === "pillar") return true;
          if (page.page_type === "city") {
            // Check if city slug starts with current province slug
            return page.slug.startsWith(currentSlug.split('/').slice(0, 2).join('/'));
          }
          return false;
        });
        
        return filtered;
      }

      // For city page: show sibling cities + parent province + pillar
      if (pageType === "city") {
        const { data } = await supabase
          .from("seo_content_pages")
          .select("slug, title, meta_description, page_type")
          .or(`page_type.eq.city,page_type.eq.province,page_type.eq.pillar`)
          .eq("is_published", true)
          .order("page_type", { ascending: false })
          .order("title");
        
        return (data || []).filter(page => page.slug !== currentSlug);
      }

      return [];
    },
  });

  if (!relatedPages || relatedPages.length === 0) {
    return null;
  }

  const pillarPages = relatedPages.filter(p => p.page_type === "pillar");
  const provincePages = relatedPages.filter(p => p.page_type === "province");
  const cityPages = relatedPages.filter(p => p.page_type === "city");

  return (
    <div className="space-y-6 mt-12">
      {/* Parent/Pillar Link */}
      {(pageType === "province" || pageType === "city") && pillarPages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Hoofdgids
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pillarPages.map((page) => (
              <Link
                key={page.slug}
                to={`/${page.slug}`}
                className="block p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="font-medium text-primary hover:underline">
                  {page.title}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {page.meta_description}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Province Links */}
      {provincePages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {pageType === "pillar" ? "Bekijk per Provincie" : "Andere Provincies"}
            </CardTitle>
            <CardDescription>
              {pageType === "pillar" 
                ? "Ontdek de specifieke situatie in elke provincie" 
                : "Bekijk de situatie in andere Belgische provincies"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {provincePages.map((page) => (
                <Link
                  key={page.slug}
                  to={`/${page.slug}`}
                  className="block p-3 rounded-lg border hover:border-primary hover:bg-muted transition-colors"
                >
                  <div className="font-medium text-primary hover:underline">
                    {page.title}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {page.meta_description}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* City Links */}
      {cityPages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {pageType === "province" ? "Steden in deze Provincie" : "Andere Steden"}
            </CardTitle>
            <CardDescription>
              {pageType === "province"
                ? "Bekijk de lokale situatie per stad"
                : "Ontdek de situatie in andere Belgische steden"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {cityPages.slice(0, 6).map((page) => (
                <Link
                  key={page.slug}
                  to={`/${page.slug}`}
                  className="block p-3 rounded-lg border hover:border-primary hover:bg-muted transition-colors"
                >
                  <div className="font-medium text-primary hover:underline">
                    {page.title}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {page.meta_description}
                  </p>
                </Link>
              ))}
            </div>
            {cityPages.length > 6 && (
              <p className="text-sm text-muted-foreground mt-3 text-center">
                En {cityPages.length - 6} andere steden...
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
