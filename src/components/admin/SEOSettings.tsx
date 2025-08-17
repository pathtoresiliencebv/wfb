import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, Globe, Share2, Code, Settings, Save, Eye, ExternalLink,
  CheckCircle, AlertCircle, Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SEOSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description: string | null;
  is_active: boolean;
}

export function SEOSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const queryClient = useQueryClient();

  // Fetch SEO settings
  const { data: seoSettings, isLoading } = useQuery({
    queryKey: ['admin-seo-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('setting_type', { ascending: true });
      
      if (error) throw error;
      return data as SEOSetting[];
    }
  });

  // Update SEO setting mutation
  const updateSEOSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from('seo_settings')
        .update({ 
          setting_value: value,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-seo-settings'] });
      toast.success('SEO instelling bijgewerkt');
    },
    onError: (error) => {
      toast.error('Fout bij bijwerken SEO instelling');
      console.error('Error updating SEO setting:', error);
    }
  });

  const handleUpdateSetting = (key: string, value: string) => {
    updateSEOSettingMutation.mutate({
      key,
      value: { value }
    });
  };

  const getSettingsByType = (type: string) => {
    return seoSettings?.filter(setting => setting.setting_type === type) || [];
  };

  const getSetting = (key: string) => {
    const setting = seoSettings?.find(s => s.setting_key === key);
    return setting?.setting_value?.value || '';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Search className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">SEO Beheer</h2>
          <p className="text-muted-foreground">
            Beheer meta tags, Open Graph en Schema markup voor betere zoekmachine optimalisatie
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Algemeen
          </TabsTrigger>
          <TabsTrigger value="meta" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Meta Tags
          </TabsTrigger>
          <TabsTrigger value="opengraph" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Open Graph
          </TabsTrigger>
          <TabsTrigger value="schema" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Schema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Algemene SEO Instellingen
              </CardTitle>
              <CardDescription>
                Basis SEO instellingen voor de gehele website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-title">Website Titel</Label>
                <Input
                  id="site-title"
                  defaultValue={getSetting('site_title')}
                  placeholder="WietForum België"
                  onBlur={(e) => handleUpdateSetting('site_title', e.target.value)}
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  Maximaal 60 karakters. Dit wordt getoond in browser tabs en zoekmachine resultaten.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Website Beschrijving</Label>
                <Textarea
                  id="site-description"
                  defaultValue={getSetting('site_description')}
                  placeholder="Het grootste cannabis forum van België..."
                  onBlur={(e) => handleUpdateSetting('site_description', e.target.value)}
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Maximaal 160 karakters. Dit wordt getoond in zoekmachine resultaten.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonical-domain">Hoofddomein</Label>
                <Input
                  id="canonical-domain"
                  defaultValue={getSetting('canonical_domain')}
                  placeholder="wietforumbelgie.com"
                  onBlur={(e) => handleUpdateSetting('canonical_domain', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Het hoofddomein voor canonical URLs (zonder https://).
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="robots-txt">Robots.txt</Label>
                <Textarea
                  id="robots-txt"
                  defaultValue={getSetting('robots_txt')}
                  placeholder="User-agent: *..."
                  onBlur={(e) => handleUpdateSetting('robots_txt', e.target.value)}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Robots.txt instructies voor zoekmachine crawlers.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Meta Tags Beheer
              </CardTitle>
              <CardDescription>
                Beheer meta tags voor categorieën en topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Automatische Meta Tags</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Meta tags worden automatisch gegenereerd voor categorieën en topics. 
                        Je kunt deze aanpassen in de specifieke categorie of topic beheer secties.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Categorieën</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Meta tags worden automatisch aangemaakt op basis van:
                      </p>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Categorie naam als titel
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Categorie beschrijving
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Aangepaste meta velden
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Meta tags worden automatisch aangemaakt op basis van:
                      </p>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Topic titel als meta titel
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Eerste 160 karakters van content
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Aangepaste meta velden
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opengraph" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Open Graph Instellingen
              </CardTitle>
              <CardDescription>
                Beheer hoe je content wordt weergegeven op sociale media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="default-og-image">Standaard Open Graph Afbeelding</Label>
                <Input
                  id="default-og-image"
                  defaultValue={getSetting('default_og_image')}
                  placeholder="/wietforum-logo.png"
                  onBlur={(e) => handleUpdateSetting('default_og_image', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  URL naar de standaard afbeelding voor sociale media (1200x630px aanbevolen).
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Open Graph Preview</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Zo ziet je content eruit wanneer gedeeld op sociale media:
                    </p>
                    <div className="mt-3 p-3 border rounded bg-background">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                          <Globe className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{getSetting('site_title') || 'WietForum België'}</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            {getSetting('site_description') || 'Het grootste cannabis forum van België...'}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            {getSetting('canonical_domain') || 'wietforumbelgie.com'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Schema.org Markup
              </CardTitle>
              <CardDescription>
                Gestructureerde data voor betere zoekmachine begrip
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="schema-org">Organisatie Schema</Label>
                <Textarea
                  id="schema-org"
                  defaultValue={JSON.stringify(getSetting('schema_organization') || {}, null, 2)}
                  placeholder='{"name": "WietForum België", "type": "Organization"}'
                  onBlur={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      handleUpdateSetting('schema_organization', parsed);
                    } catch (error) {
                      toast.error('Ongeldige JSON syntax');
                    }
                  }}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  JSON-LD schema voor organisatie informatie. Moet geldige JSON zijn.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Actieve Schema Types
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Organization</li>
                    <li>• WebSite</li>
                    <li>• BreadcrumbList</li>
                    <li>• Article (voor topics)</li>
                    <li>• DiscussionForumPosting</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                    Schema Validatie
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Test je schema markup met:
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href="https://search.google.com/test/rich-results" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Google Rich Results Test
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            SEO Tips & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Meta Titles</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Maximaal 60 karakters</li>
                <li>• Uniek voor elke pagina</li>
                <li>• Bevat hoofdkeyword</li>
                <li>• Beschrijft pagina-inhoud</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Meta Descriptions</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Maximaal 160 karakters</li>
                <li>• Actionable en aantrekkelijk</li>
                <li>• Bevat relevante keywords</li>
                <li>• Uniek voor elke pagina</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Open Graph</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Afbeeldingen 1200x630px</li>
                <li>• Titles max 60 karakters</li>
                <li>• Descriptions max 200 karakters</li>
                <li>• Test op sociale media</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Schema Markup</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Gebruik JSON-LD format</li>
                <li>• Valideer met Google tools</li>
                <li>• Focus op relevante types</li>
                <li>• Houd data up-to-date</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}