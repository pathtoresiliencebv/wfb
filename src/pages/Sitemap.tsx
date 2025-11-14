import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function Sitemap() {
  const baseUrl = window.location.origin;
  const sitemapUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sitemap`;

  const sitemaps = [
    { name: "Sitemap Index", type: "index", description: "Hoofdindex van alle sitemaps" },
    { name: "Statische Pagina's", type: "pages", description: "Forums, leaderboard, etc." },
    { name: "Cannabis Content", type: "cannabis", description: "SEO content pages (provincies & steden)" },
    { name: "Forum Categorieën", type: "forums", description: "Alle forum categorieën" },
    { name: "Forum Topics", type: "topics", description: "Recente forum topics (top 1000)" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Sitemap</h1>
        <p className="text-muted-foreground mb-8">
          Overzicht van alle XML sitemaps voor zoekmachines
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {sitemaps.map((sitemap) => (
            <Card key={sitemap.type}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {sitemap.name}
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>{sitemap.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={`${sitemapUrl}?type=${sitemap.type}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  /sitemap-{sitemap.type}.xml
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>SEO Content Pagina's</CardTitle>
            <CardDescription>
              Directe links naar onze SEO-geoptimaliseerde content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Pijler Pagina:</strong>
                <br />
                <a href="/cannabis-belgie" className="text-primary hover:underline">
                  /cannabis-belgie - De Complete Gids
                </a>
              </div>
              <div className="mt-4">
                <strong>Provincie Pagina's:</strong>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>
                    <a href="/cannabis-belgie/antwerpen" className="text-primary hover:underline">
                      /cannabis-belgie/antwerpen
                    </a>
                  </li>
                  <li>
                    <a href="/cannabis-belgie/oost-vlaanderen" className="text-primary hover:underline">
                      /cannabis-belgie/oost-vlaanderen
                    </a>
                  </li>
                  <li>
                    <a href="/cannabis-belgie/west-vlaanderen" className="text-primary hover:underline">
                      /cannabis-belgie/west-vlaanderen
                    </a>
                  </li>
                  <li>
                    <a href="/cannabis-belgie/vlaams-brabant" className="text-primary hover:underline">
                      /cannabis-belgie/vlaams-brabant
                    </a>
                  </li>
                  <li>
                    <a href="/cannabis-belgie/limburg" className="text-primary hover:underline">
                      /cannabis-belgie/limburg
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
