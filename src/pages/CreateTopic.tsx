import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/rich-text/RichTextEditor';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Loader2, Palette } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const topicSchema = z.object({
  title: z.string().min(5, 'Titel moet minimaal 5 karakters bevatten').max(100, 'Titel mag maximaal 100 karakters bevatten'),
  content: z.string().min(10, 'Inhoud moet minimaal 10 karakters bevatten'),
  category_id: z.string().min(1, 'Selecteer een categorie'),
  image_url: z.string().optional(),
  color: z.string().optional(),
});

type TopicFormData = z.infer<typeof topicSchema>;

export default function CreateTopic() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: '',
      content: '',
      category_id: '',
      image_url: '',
      color: '#10b981',
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      return data || [];
    }
  });

  const onSubmit = async (data: TopicFormData) => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data: topicData, error } = await supabase
        .from('topics')
        .insert({
          title: data.title,
          content: data.content,
          category_id: data.category_id,
          author_id: user.id,
          image_url: data.image_url || null,
          color: data.color || '#10b981',
        })
        .select('id, categories(slug)')
        .single();

      if (error) throw error;

      toast({ title: "Topic aangemaakt!" });
      
      const categorySlug = (topicData as any).categories?.slug;
      navigate(`/forums/${categorySlug}/topic/${topicData.id}`);
    } catch (error: any) {
      toast({
        title: "Fout bij aanmaken topic",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Inloggen vereist</h3>
            <Link to="/login"><Button>Inloggen</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Link to="/forums">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Terug naar forums
          </Button>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold">Nieuw Topic</h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Topic aanmaken</CardTitle>
          <CardDescription className="text-sm sm:text-base">Start een nieuwe discussie</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorie</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer categorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titel</FormLabel>
                    <FormControl>
                      <Input placeholder="Topic titel..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Afbeelding (optioneel)</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onImageUploaded={(url) => {
                            field.onChange(url);
                            setSelectedImage(url);
                          }}
                          onImageRemoved={() => {
                            field.onChange('');
                            setSelectedImage('');
                          }}
                          showPreview={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Kleur accent (optioneel)
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={field.value || '#10b981'}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-12 h-10 rounded border cursor-pointer"
                          />
                          <Input
                            value={field.value || '#10b981'}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="#10b981"
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inhoud</FormLabel>
                    <FormControl>
                      <RichTextEditor 
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Beschrijf je topic in detail..."
                        minHeight={300}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button type="submit" disabled={isLoading} className="h-11 sm:h-10">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Topic aanmaken
                </Button>
                <Link to="/forums" className="w-full sm:w-auto">
                  <Button type="button" variant="outline" className="w-full h-11 sm:h-10">Annuleren</Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}