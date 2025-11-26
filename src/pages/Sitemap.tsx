import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, CheckCircle2, FileText, Globe, MapPin, Layout } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

export default function Sitemap() {
  const baseUrl = "https://wietforumbelgique.com";
  const sitemapBaseUrl = `${baseUrl}`;

  const { data: seoPages, isLoading } = useQuery({
    queryKey: ['seo-pages-sitemap'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_content_pages')
        .select('title, slug, page_type')
        .eq('is_published', true)
        .order('title');
      
      if (error) throw error;
      return data;
    }
  });

  // Group pages
  const generalPages = seoPages?.filter(p => p.page_type === 'general' || p.page_type === 'pillar') || [];
  const locationPages = seoPages?.filter(p => p.page_type === 'city' || p.page_type === 'province') || [];

  const sitemaps = [
    { name: "Sitemap Index", type: "index", description: "Hoofdindex van alle sitemaps", icon: Globe },
    { name: "Statische Pagina's", type: "pages", description: "Forums, leaderboard, etc.", icon: FileText },
    { name: "Cannabis Content", type: "cannabis", description: "SEO content pages (provincies & steden)", icon: CheckCircle2 },
    { name: "Forum Categorieën", type: "forums", description: "Alle forum categorieën", icon: FileText },
    { name: "Forum Topics", type: "topics", description: "Recente forum topics (top 1000)", icon: FileText },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">XML Sitemaps</h1>
        <p className="text-muted-foreground mb-8">
          Overzicht van alle XML sitemaps voor zoekmachines zoals Google
        </p>

        {/* Google Search Console Instructions */}
        <Alert className="mb-8 border-primary">
          <Globe className="h-4 w-4" />
          <AlertTitle>📊 Google Search Console Setup</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>
              <strong>Hoofdsitemap indienen bij Google:</strong>
            </p>
            <code className="block bg-muted p-2 rounded text-sm my-2">
              {baseUrl}/sitemap.xml
            </code>
            <p className="text-sm">
              Deze hoofdsitemap verwijst automatisch naar alle sub-sitemaps hieronder.
              <br />
              📚 <a 
                href="/masterplan/google-search-console-setup.md" 
                className="text-primary hover:underline"
                target="_blank"
              >
                Bekijk de volledige Google Search Console setup guide
              </a>
            </p>
          </AlertDescription>
        </Alert>

        {/* Primary Sitemap */}
        <Card className="mb-6 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Hoofdsitemap (Indienen bij Google)
              </span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
            <CardDescription>
              Deze sitemap index bevat links naar alle sub-sitemaps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href={`${sitemapBaseUrl}/sitemap.xml`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-mono text-sm break-all block"
              >
                {baseUrl}/sitemap.xml
              </a>
              <p className="text-xs text-muted-foreground">
                ✅ Dit is de enige URL die je bij Google Search Console hoeft in te dienen
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sub-sitemaps */}
        <div className="space-y-4 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sub-sitemaps</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sitemaps.map((sitemap) => {
              const Icon = sitemap.icon;
              return (
                <Card key={sitemap.type}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {sitemap.name}
                      </span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription>{sitemap.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={`${sitemapBaseUrl}/sitemap-${sitemap.type}.xml`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline break-all block font-mono"
                    >
                      {baseUrl}/sitemap-{sitemap.type}.xml
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* SEO Content Links */}
        <h2 className="text-2xl font-semibold mb-4">Overzicht SEO Pagina's</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" />
                  Algemene Informatie
                </CardTitle>
                <CardDescription>
                  Algemene informatie over cannabis in België
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <ul className="space-y-2">
                    {generalPages.map((page) => (
                      <li key={page.slug}>
                        <Link 
                          to={`/${page.slug}`} 
                          className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors flex items-center gap-2"
                        >
                          <FileText className="h-3 w-3" />
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Location Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Lokale Gidsen
                </CardTitle>
                <CardDescription>
                  Informatie per regio en provincie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <ul className="space-y-2">
                    {locationPages.map((page) => (
                      <li key={page.slug}>
                        <Link 
                          to={`/${page.slug}`} 
                          className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors flex items-center gap-2"
                        >
                          <MapPin className="h-3 w-3" />
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Technical Info */}
        <Card className="mt-8 border-muted">
          <CardHeader>
            <CardTitle className="text-base">⚙️ Technische Informatie</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-muted-foreground">
            <p>
              <strong>Sitemap Protocol:</strong> XML Sitemap Protocol 0.9
            </p>
            <p>
              <strong>Update Frequentie:</strong> Dynamisch (real-time bij nieuwe content)
            </p>
            <p>
              <strong>Cache:</strong> 1 uur (sitemaps worden gecached voor betere performance)
            </p>
            <p>
              <strong>Max URL's per sitemap:</strong> 50,000 (volgens Google richtlijnen)
            </p>
            <p>
              <strong>Validatie:</strong> Alle sitemaps zijn gevalideerd volgens{" "}
              <a 
                href="https://www.sitemaps.org/protocol.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                sitemaps.org protocol
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
