import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Map, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export function AllLocationsGrid() {
  const { data: allPages } = useQuery({
    queryKey: ["all-seo-locations"],
    queryFn: async () => {
      const { data } = await supabase
        .from("seo_content_pages")
        .select("slug, title, page_type, parent_slug")
        .eq("is_published", true)
        .order("page_type", { ascending: false })
        .order("title");
      return data || [];
    },
  });

  if (!allPages || allPages.length === 0) {
    return null;
  }

  const pillarPages = allPages.filter(p => p.page_type === "pillar");
  const provincePages = allPages.filter(p => p.page_type === "province");
  const cityPages = allPages.filter(p => p.page_type === "city");

  // Group cities by province
  const citiesByProvince = cityPages.reduce((acc, city) => {
    const provinceSlug = city.parent_slug || city.slug.split('/').slice(0, 2).join('/');
    if (!acc[provinceSlug]) {
      acc[provinceSlug] = [];
    }
    acc[provinceSlug].push(city);
    return acc;
  }, {} as Record<string, typeof cityPages>);

  return (
    <div className="mt-16 border-t pt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Globe className="h-8 w-8 text-primary" />
          Cannabis Informatie per Locatie
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Ontdek gedetailleerde informatie over cannabis wetgeving, cultuur en community in alle Belgische provincies en steden
        </p>
      </div>

      <div className="grid gap-6">
        {/* Pillar Page */}
        {pillarPages.length > 0 && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Algemene Gids
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {pillarPages.map((page) => (
                  <Link
                    key={page.slug}
                    to={`/${page.slug}`}
                    className="block p-3 rounded-lg hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/30"
                  >
                    <div className="font-medium text-primary text-lg">
                      🌿 {page.title}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Provinces */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Provincies ({provincePages.length})
            </CardTitle>
            <CardDescription>
              Bekijk informatie per provincie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {provincePages.map((page) => (
                <Link
                  key={page.slug}
                  to={`/${page.slug}`}
                  className="block p-3 rounded-lg hover:bg-muted transition-colors border border-border hover:border-primary/50"
                >
                  <div className="font-medium text-foreground flex items-center gap-2">
                    <Map className="h-4 w-4 text-primary" />
                    {page.title.replace('Cannabis in ', '')}
                  </div>
                  {citiesByProvince[page.slug] && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {citiesByProvince[page.slug].length} steden
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cities grouped by province */}
        {provincePages.map((province) => {
          const cities = citiesByProvince[province.slug] || [];
          if (cities.length === 0) return null;

          return (
            <Card key={province.slug}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Steden in {province.title.replace('Cannabis in ', '')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {cities.map((city) => (
                    <Link
                      key={city.slug}
                      to={`/${city.slug}`}
                      className="block p-2 rounded-lg hover:bg-muted transition-colors text-sm border border-transparent hover:border-primary/30"
                    >
                      <div className="font-medium text-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" />
                        {city.title.split(' - ')[0].replace('Cannabis ', '')}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* SEO Footer Links */}
      <div className="mt-8 pt-8 border-t">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            💡 <strong>Tip:</strong> Elke locatiepagina bevat specifieke informatie over cannabis wetgeving, lokale community, en waar je veilig kunt kopen in die regio.
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-xs">
            <Link to="/forums" className="text-primary hover:underline">
              Forums
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/leaderboard" className="text-primary hover:underline">
              Leaderboard
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/sitemap" className="text-primary hover:underline">
              Sitemap
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/cannabis-belgie" className="text-primary hover:underline font-semibold">
              🌿 Complete Cannabis Gids
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
