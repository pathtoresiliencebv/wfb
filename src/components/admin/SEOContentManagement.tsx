import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, ExternalLink, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function SEOContentManagement() {
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all SEO content pages
  const { data: pages, isLoading } = useQuery({
    queryKey: ["seo-content-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_content_pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (page: any) => {
      const { id, ...pageData } = page;

      if (id) {
        const { error } = await supabase
          .from("seo_content_pages")
          .update(pageData)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("seo_content_pages").insert([pageData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-content-pages"] });
      toast.success("Pagina succesvol opgeslagen");
      setIsDialogOpen(false);
      setSelectedPage(null);
    },
    onError: (error: any) => {
      toast.error(`Fout bij opslaan: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("seo_content_pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-content-pages"] });
      toast.success("Pagina succesvol verwijderd");
    },
    onError: (error: any) => {
      toast.error(`Fout bij verwijderen: ${error.message}`);
    },
  });

  const handleEdit = (page: any) => {
    setSelectedPage(page);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setSelectedPage({
      slug: "",
      title: "",
      meta_description: "",
      meta_keywords: [],
      h1_title: "",
      content: { sections: [], faq: [] },
      page_type: "general",
      parent_slug: "",
      canonical_url: "",
      schema_markup: {},
      is_published: false,
      seo_score: 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Weet je zeker dat je deze pagina wilt verwijderen?")) {
      deleteMutation.mutate(id);
    }
  };

  const pagesByType = pages?.reduce((acc: any, page: any) => {
    const type = page.page_type || "general";
    if (!acc[type]) acc[type] = [];
    acc[type].push(page);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">SEO Content Management</h2>
          <p className="text-muted-foreground mt-1">
            Beheer alle SEO-geoptimaliseerde content pagina's
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe Pagina
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPage?.id ? "Bewerk Pagina" : "Nieuwe Pagina"}
              </DialogTitle>
              <DialogDescription>
                Maak of bewerk een SEO-geoptimaliseerde content pagina
              </DialogDescription>
            </DialogHeader>
            {selectedPage && (
              <SEOPageForm
                page={selectedPage}
                onSave={(data) => saveMutation.mutate(data)}
                onCancel={() => setIsDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            Alle ({pages?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="pillar">
            Pijler ({pagesByType?.pillar?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="province">
            Provincies ({pagesByType?.province?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="city">
            Steden ({pagesByType?.city?.length || 0})
          </TabsTrigger>
        </TabsList>

        {["all", "pillar", "province", "city"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  SEO Pagina's
                </CardTitle>
                <CardDescription>
                  Overzicht van alle SEO content pagina's
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titel</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>SEO Score</TableHead>
                      <TableHead>Acties</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tabValue === "all"
                      ? pages
                      : pagesByType?.[tabValue]
                    )?.map((page: any) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell className="font-mono text-sm">/{page.slug}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{page.page_type}</Badge>
                        </TableCell>
                        <TableCell>
                          {page.is_published ? (
                            <Badge variant="default">Gepubliceerd</Badge>
                          ) : (
                            <Badge variant="secondary">Concept</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                            {page.view_count || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              page.seo_score >= 80
                                ? "default"
                                : page.seo_score >= 60
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {page.seo_score || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(page)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(`/${page.slug}`, "_blank")
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(page.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// SEO Page Form Component
function SEOPageForm({ page, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(page);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titel *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
            }
            required
            placeholder="cannabis-belgie"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="h1_title">H1 Titel *</Label>
        <Input
          id="h1_title"
          value={formData.h1_title}
          onChange={(e) => setFormData({ ...formData, h1_title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_description">Meta Beschrijving</Label>
        <Textarea
          id="meta_description"
          value={formData.meta_description || ""}
          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
          rows={3}
          maxLength={160}
          placeholder="150-160 karakters voor optimale weergave"
        />
        <p className="text-xs text-muted-foreground">
          {formData.meta_description?.length || 0}/160 karakters
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="page_type">Pagina Type *</Label>
          <Select
            value={formData.page_type}
            onValueChange={(value) => setFormData({ ...formData, page_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pillar">Pijler</SelectItem>
              <SelectItem value="province">Provincie</SelectItem>
              <SelectItem value="city">Stad</SelectItem>
              <SelectItem value="general">Algemeen</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="parent_slug">Parent Slug</Label>
          <Input
            id="parent_slug"
            value={formData.parent_slug || ""}
            onChange={(e) => setFormData({ ...formData, parent_slug: e.target.value })}
            placeholder="cannabis-belgie/oost-vlaanderen"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_published"
          checked={formData.is_published}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_published: checked })
          }
        />
        <Label htmlFor="is_published">Gepubliceerd</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit">Opslaan</Button>
      </div>
    </form>
  );
}
